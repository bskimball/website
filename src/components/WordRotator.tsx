import { useState, useLayoutEffect, useCallback, type HTMLAttributes } from 'react'
import { getRandomNumber, cn } from '@/lib/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  words: string[]
}

export default function WordRotator({ words, className }: Props) {
  const [word, setWord] = useState<string[]>(['website'])

  const changeWord = useCallback(() => {
    const timeoutId = setTimeout(
      () => {
        setWord((prevWord) => {
          const newWord = words[Math.floor(Math.random() * words.length)]
          if (prevWord[0] === newWord) {
            return [...prevWord]
          } else {
            return [newWord, prevWord[0]]
          }
        })
      },
      getRandomNumber(4000, 10000),
    )
    return () => clearTimeout(timeoutId)
  }, [words])

  useLayoutEffect(() => {
    const cleanup = changeWord()
    return cleanup
  }, [changeWord])

  useLayoutEffect(() => {
    const cleanup = changeWord()
    return cleanup
  }, [word, changeWord])

  return (
    <div className="relative h-24">
      {word.map((w, index) => (
        <div
          key={w}
          className={cn([
            `absolute top-0 left-0 duration-1000 fill-mode-both`,
            index === 0 ? 'animate-in fade-in' : 'animate-out fade-out',
            className,
          ])}
        >
          {w}
        </div>
      ))}
    </div>
  )
}
