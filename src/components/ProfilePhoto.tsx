import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'

export default function ProfilePhoto() {
  return (
    <Avatar className="w-32 h-32">
      <AvatarImage
        src="/static/images/me_website_2025.png"
        alt="Brian Kimball"
      />
      <AvatarFallback>Brian Kimball</AvatarFallback>
    </Avatar>
  )
}
