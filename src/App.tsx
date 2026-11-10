import { useState, type MouseEvent } from 'react'
import { IntroView } from './components/IntroView.tsx'
import { QuestionView } from './components/QuestionView.tsx'
import { SuccessView } from './components/SuccessView.tsx'
import { invitationCopy } from './content/copy.ts'
import { resolveRefusal } from './interaction/refusal.ts'

type Screen = 'intro' | 'question' | 'ending'

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [refusalCount, setRefusalCount] = useState(0)
  const refusal = resolveRefusal(refusalCount)

  function handleNoClick() {
    setRefusalCount((count) =>
      resolveRefusal(count).reachedMaximum ? count : count + 1,
    )
  }

  function handleYesClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setScreen('ending')
  }

  if (screen === 'intro') {
    return (
      <IntroView
        prompt={invitationCopy.introPrompt}
        beginLabel={invitationCopy.beginLabel}
        onBegin={() => {
          setScreen('question')
        }}
      />
    )
  }

  if (screen === 'ending') {
    return <SuccessView />
  }

  return (
    <QuestionView
      question={invitationCopy.question}
      yesLabel={invitationCopy.yesLabel}
      noLabel={refusal.noLabel}
      yesEmphasis={refusal.yesEmphasis}
      noWidthScale={refusal.noWidthScale}
      refusalAnnouncement={refusalCount === 0 ? '' : refusal.noLabel}
      onYes={handleYesClick}
      onNo={handleNoClick}
    />
  )
}

export default App
