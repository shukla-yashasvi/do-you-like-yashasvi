import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'

type QuestionViewProps = {
  readonly question: string
  readonly yesLabel: string
  readonly noLabel: string
  readonly yesEmphasis: number
  readonly noWidthScale: number
  readonly refusalAnnouncement: string
  readonly onYes: (event: MouseEvent<HTMLButtonElement>) => void
  readonly onNo: () => void
}

export function QuestionView({
  question,
  yesLabel,
  noLabel,
  yesEmphasis,
  noWidthScale,
  refusalAnnouncement,
  onYes,
  onNo,
}: QuestionViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const yesBeyond = Math.max(0, yesEmphasis - 1)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])
  const layoutStyle = {
    '--yes-fit': Math.min(1, yesEmphasis),
    '--yes-beyond': yesBeyond,
    '--yes-clear': Math.min(1, yesBeyond * 2.5),
    '--no-width-scale': noWidthScale,
  } as CSSProperties

  return (
    <main className="question-screen" style={layoutStyle}>
      <h1 ref={headingRef} className="question-screen__question" tabIndex={-1}>
        {question}
      </h1>
      <div className="question-screen__choices">
        <button className="choice choice--yes" type="button" onClick={onYes}>
          {yesLabel}
        </button>
        <button className="choice choice--no" type="button" onClick={onNo}>
          {noLabel}
        </button>
      </div>
      <p className="refusal-announcement" aria-live="polite">
        {refusalAnnouncement}
      </p>
    </main>
  )
}
