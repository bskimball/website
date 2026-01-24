import { useState, useEffect, useCallback } from 'react'
import {
  FaMagnifyingGlass,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa6'

export interface SlideImage {
  src: string
  alt?: string
  width?: number
  height?: number
  [key: string]: any
}

interface Props {
  slides: SlideImage[]
}

function Gallery({ slides }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  const goToPrevious = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
      )
    },
    [slides.length],
  )

  const goToNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
      )
    },
    [slides.length],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') goToPrevious()
      if (event.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToNext, goToPrevious])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!slides || slides.length === 0) return null

  return (
    <div className="w-full">
      <div
        className={`flex flex-col flex-wrap gap-8 mx-2 h-full md:grid md:mx-0 ${
          slides.length % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-3'
        }`}
      >
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className="relative h-screen md:h-[50vh]"
          >
            <div className="group relative h-full w-full overflow-hidden border border-border/10 bg-muted/20">
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${slide.src}")` }}
              >
                {/* Visual spacer similar to original logic if needed, but flex/grid handles layout */}
              </div>
              <button
                type="button"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={() => openLightbox(index)}
              >
                <div className="flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm">
                  <FaMagnifyingGlass className="h-6 w-6" />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 z-50 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <FaXmark className="h-8 w-8" />
          </button>

          {/* Desktop Navigation */}
          <button
            className="absolute left-4 top-1/2 z-50 hidden -translate-y-1/2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:block"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <FaChevronLeft className="h-8 w-8" />
          </button>

          <button
            className="absolute right-4 top-1/2 z-50 hidden -translate-y-1/2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:block"
            onClick={goToNext}
            aria-label="Next image"
          >
            <FaChevronRight className="h-8 w-8" />
          </button>

          {/* Image Container */}
          <div
            className="relative flex h-full w-full max-w-[90vw] max-h-[90vh] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={slides[currentIndex].src}
              alt={slides[currentIndex].alt || ''}
              className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
            />
          </div>

          {/* Mobile Navigation */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-6 md:hidden z-50">
            <button
              onClick={goToPrevious}
              className="rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
