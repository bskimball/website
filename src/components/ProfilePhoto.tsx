import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import meImg from '../assets/me_website_2026.png'

export default function () {
  return (
    <div className="border-2 border-primary p-2 bg-secondary rounded-full w-fit">
      <Avatar className="w-32 h-32 rounded-full">
        <AvatarImage src={meImg.src} alt="Brian Kimball" />
        <AvatarFallback>Brian Kimball</AvatarFallback>
      </Avatar>
    </div>
  )
}
