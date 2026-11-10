import { useEffect, useRef, useState } from 'react'
import pokkoDanceUrl from '../../assets/PokkoBabyBooDancememe(GreenScreen).mp4'
import { invitationCopy } from '../content/copy.ts'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SuccessView() {
  const mainRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion] = useState(prefersReducedMotion)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.focus()

    const video = videoRef.current
    if (!video || reducedMotion) {
      return
    }

    video.muted = true
    video.play()?.catch(() => undefined)
  }, [reducedMotion])

  return (
    <main ref={mainRef} className="success-screen" tabIndex={-1}>
      <div className="success-screen__stage">
        {videoFailed ? (
          <p className="success-screen__fallback">{invitationCopy.videoUnavailable}</p>
        ) : (
          <video
            ref={videoRef}
            className="success-screen__video"
            src={pokkoDanceUrl}
            autoPlay={!reducedMotion}
            muted
            playsInline
            loop
            controls={false}
            preload="auto"
            aria-label={invitationCopy.videoLabel}
            onError={() => {
              setVideoFailed(true)
            }}
          />
        )}
      </div>
      <p className="success-screen__caption">
        {invitationCopy.successCaption}{' '}
        <span className="success-screen__smirk">{invitationCopy.successSmirk}</span>
      </p>
    </main>
  )
}
