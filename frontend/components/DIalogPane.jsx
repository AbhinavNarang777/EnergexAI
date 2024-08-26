import { Button } from "@/components/ui/button"
import { ChatBubbleIcon } from "@radix-ui/react-icons"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import ChatPane from "./Chat/ChatPane"

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-2 bg-black text-white right-0" variant="outline"><ChatBubbleIcon/></Button>
      </DialogTrigger>
      <DialogContent className="">
       <ChatPane/>
      </DialogContent>
    </Dialog>
  )
}
