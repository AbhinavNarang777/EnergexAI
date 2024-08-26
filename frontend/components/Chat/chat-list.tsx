import { Separator } from "@/components/ui/separator"
import React from "react"
import { ChatMessage } from "./chat-message"

export function ChatList({ messages, answeringContent }) {
  console.log(answeringContent, messages)
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={{
              ...message,
              content: message?.answering ? answeringContent : message.content,
            }}
          />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
