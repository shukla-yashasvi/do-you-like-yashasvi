import { useEffect, useRef } from 'react'

type IntroViewProps = {
  readonly prompt: string
  readonly beginLabel: string
  readonly onBegin: () => void
}

export function IntroView({ prompt, beginLabel, onBegin }: IntroViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <main className="intro-screen">
      <h1 ref={headingRef} className="intro-screen__prompt" tabIndex={-1}>
        {prompt}
      </h1>
      <button className="intro-screen__begin" type="button" onClick={onBegin}>
        {beginLabel}
      </button>
    </main>
  )
}
