import * as React from 'react'
import Link from 'next/link'
import { DragHandleDots2Icon,LightningBoltIcon } from "@radix-ui/react-icons"

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'



export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b bg-background text-foreground from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
    
      <div className="flex items-center justify-end space-x-2 font-semibold tex-lg">
     <LightningBoltIcon className='fill-[#000]'/> <span className='ml-1'>EnergeX AI :</span> <span className='font-medium ml-1'> Powering the Future with Precision Predictions</span>
      </div>
    </header>
  )
}
