import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import meImg from '../assets/me_website_2026.png'

export default function () {
  return (
    <Avatar className="w-32 h-32">
      <AvatarImage src={meImg.src} alt="Brian Kimball" />
      <AvatarFallback>Brian Kimball</AvatarFallback>
    </Avatar>
  )
}
