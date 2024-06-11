import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from '../seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        Projects
      </h1>
      <div className="h-1 bg-primary w-[4rem] mt-8"></div>
      <p className="text-lg leading-7 text-gray-500 dark:text-gray-400 prose">
        Below are projects I have built. Some I have done for work and some have been done in fun.
        All of them I learned something.
      </p>
      <div className="py-12">
        <div className="-m-4 flex flex-wrap">
          {projectsData.map((d) => (
            <Card
              key={d.title}
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
