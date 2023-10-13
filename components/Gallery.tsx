'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import type { SlideImage } from 'yet-another-react-lightbox/dist/types'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import 'yet-another-react-lightbox/styles.css'

interface Props {
  slides: SlideImage[]
}

function Gallery(props: Props) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(0)

  return (
    <div className="w-full">
      <div
        className={`flex flex-col md:grid ${
          props.slides.length % 2 == 0 ? 'md:grid-cols-2' : 'md:grid-cols-3'
        } h-full gap-8 flex-wrap mx-2 md:mx-0`}
      >
        {props.slides.map((slide, index) => (
          <div key={index} className="md:h-[50vh] h-screen relative">
            <div className="group h-full">
              <div
                className="bg-cover bg-center h-full w-full bg-no-repeat"
                style={{ backgroundImage: `url("${slide.src}")` }}
              >
                <div className="text-3xl text-white absolute bottom-0 left-2 z-10">
                  <span>&nbsp;</span>
                </div>
              </div>
              <button
                className="bg-black opacity-0 group-hover:opacity-75 absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
                onClick={() => {
                  setOpen(true)
                  setImage(index)
                }}
              >
                <div className="text-white">
                  <FaMagnifyingGlass />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={props.slides}
        plugins={[Zoom]}
        index={image}
      />
    </div>
  )
}

export default Gallery
