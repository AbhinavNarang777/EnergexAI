// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { DragHandleDots2Icon,LightningBoltIcon } from "@radix-ui/react-icons"

import { cn } from '@/lib/utils'
import ReactMarkdown, { Options } from 'react-markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import React from 'react'
import MessageLoading from './MessageLoading'



export function ChatMessage({ message, ...props }) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start ')}
      {...props}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <LightningBoltIcon />}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <ReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            
          }}
        >
          {message.content}
        </ReactMarkdown>
        {message.content=="" && <MessageLoading/>}

      </div>
    </div>
  )
}
