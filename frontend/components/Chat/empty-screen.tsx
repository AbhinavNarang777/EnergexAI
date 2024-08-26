
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import React from 'react'

const exampleMessages = [
  {
    heading: 'Want to know about solar conversion from weather forecast?',
    message: `What is the average solar conversion from 1-04-2017 to 4-04-2017`
  },
  {
    heading: 'How much energy I outsourced?',
    message: 'How much Energy did i outsourced form 1-04-2017 to 4-04-2017'
  }
]

export function EmptyScreen({ setInput }) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to EnergeX AI  Chatbot!
        </h1>
    
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
