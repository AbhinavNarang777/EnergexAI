"use client"
import ChatPane from "@/components/Chat/ChatPane"
import DialogDemo from "@/components/DIalogPane"
import Dashboard from "@/components/Dashboard/Dashboard"
import { ActiveAuthProvider } from "@/components/DataProvider"
import CardDemo from "@/components/KPIDetails"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Home() {
  return (
    <ActiveAuthProvider>
    <ResizablePanelGroup
      direction="horizontal"
      className=" rounded-lg border bg-background text-foreground"
    >
      <ResizablePanel defaultSize={70}>
        <Dashboard/>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="relative bg-background text-foreground" defaultSize={30}>
     {/* <ChatPane/> */}
     <CardDemo/>
     <DialogDemo/>
      </ResizablePanel>
    </ResizablePanelGroup>
    </ActiveAuthProvider>
  )
}
