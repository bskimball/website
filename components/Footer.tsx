import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import SectionContainer from '@/components/SectionContainer'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 mt-8 py-4">
      <SectionContainer>
        <div className="flex items-center justify-between">
          <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div>{siteMetadata.author}</div>
            <div>{` • `}</div>
            <div>{`© ${new Date().getFullYear()}`}</div>
            <div>{` • `}</div>
            <Link href="/">{siteMetadata.title}</Link>
          </div>
          <div className="mb-3 flex space-x-4">
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
            <SocialIcon kind="github" href={siteMetadata.github} size={6} />
            <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
            <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          </div>
        </div>
      </SectionContainer>
    </footer>
  )
}
