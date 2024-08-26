import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { ChatList } from "./chat-list"
import { ChatScrollAnchor } from "./chat-scroll-anchor"
import { EmptyScreen } from "./empty-screen"
import { ChatPanel } from "./chat-panel"
import performStreamedRequest from "@/lib/streamingService"

const ChatPane = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [answeringContent, setAnsweringContent] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const handleSendMessage = async (index) => {
    
    let header = {
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTA0MTI3MjksInVzZXJJZCI6Im1heWFua0BpbmZpbml0ZXBvc3NpYmlsaXRpZXMuYWkifQ.RBRir178ZBoU6o6JJefsrMk5B8gJG2H1t_VCPO0XCVA`,
      'Content-Type': 'application/json',

    }
    let body = {  user_query: index.content }

    setMessages([
      ...messages,
      index,
      {
        content: "",
        answering: true,
        role: "assistant",
      },
    ])

    setInput("")

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chat/qna`,
        {
          method: "POST",
          headers: header,
          body: JSON.stringify(body),
        }
      )
      if (!response.ok) {
        throw new Error("Please Try Again Later")
        return
      }
      if (response.status === 400) {
        const errorResponse = await response.json()
        const { errorCode, errorMessage } = errorResponse

        throw new Error(errorMessage || "Bad Request")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let chunk = ""
      let contents = ""
      let sourceData
      let showErrorObject = false

      let isConversationFinished = false // Flag variable
      let shouldStoreNextDataObject = false // Flag to indicate whether to store the next data object
      let newTitleStore = false

      reader.read().then(function processResult(result) {
        chunk += decoder.decode(result.value, { stream: true })

        // Split chunk into individual data objects
        const dataObjects = chunk.split("\n").filter(Boolean)

        // Reset contents before processing new data objects
        contents = ""

        // Process each data object
        dataObjects.forEach((dataObject, index) => {
          if (shouldStoreNextDataObject) {
            // Store the next data object
            // Modify this code to handle the storage as per your requirements
            const data = dataObject.replace(/^data: /, "")
            sourceData = data
            shouldStoreNextDataObject = false // Reset the flag
            return
          }
          if (showErrorObject) {
            const data = dataObject.replace(/^data: /, "")
            const newError = JSON.parse(data)

            showErrorObject = false
            isConversationFinished = true // Set the flag to true
            setAnsweringContent("")
            setMessages((prev) =>
              prev.map((i) => {
                const { answering, ...rest } = i
                if (answering) {
                  return {
                    ...rest,
                    content: newError.error,
                    chunk: sourceData,
                  }
                }
                return i
              })
            )
            return
          }
          if (newTitleStore) {
            // Store the next data object
            // Modify this code to handle the storage as per your requirements
            const data = dataObject.replace(/^data: /, "")
            newTitleStore = false // Reset the flag
            return
          }
          // Process each data object except for the last one if it's incomplete
          if (!(index === dataObjects.length - 1 && !result.done)) {
            const data = dataObject.replace(/^data: /, "")
            if (data === "[DONE]") {
              isConversationFinished = true // Set the flag to true
              setAnsweringContent("")

              setMessages((prev) =>
                prev.map((i) => {
                  const { answering, ...rest } = i
                  if (answering) {
                    return {
                      ...rest,
                      content: contents,
                      chunk: sourceData,
                    }
                  }
                  return i
                })
              )

              reader.cancel()
            } else if (data === "[ERROR]") {
              showErrorObject = true
              return
            } else if (data === "[METADATA]") {
              shouldStoreNextDataObject = true
            } else if (data === "[TITLE]") {
              newTitleStore = true
            } else {
              try {
                const jsonData = JSON.parse(data)
                if (jsonData) {
                  // Get content of Dave's response
                  let newResponse = jsonData.content

                  if (jsonData?.replace) {
                    contents = jsonData.content
                  } else {
                    contents += newResponse
                  }
                  setAnsweringContent(contents)
                }
              } catch (error) {
                console.error("Invalid JSON:", error)
              }
            }
          }
        })

        // Set the updated contents

        // Continue streaming responses
        if (!isConversationFinished) {
          reader.read().then(processResult)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10 h-[80vh] overflow-scroll")}>
        {messages.length ? (
          <>
            <ChatList messages={messages} answeringContent={answeringContent} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        isLoading={isLoading}
        append={handleSendMessage}
        input={input}
        setInput={setInput}
      />
    </>
  )
}

export default ChatPane
