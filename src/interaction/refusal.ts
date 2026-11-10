import { continuedRefusalLines, invitationCopy } from '../content/copy.ts'

export const maximumRefusalCount = 100
export const yesFitAtCount = 30
export const noMinimumWidthScale = 0.22

export type RefusalState = {
  readonly noLabel: string
  readonly yesEmphasis: number
  readonly noWidthScale: number
  readonly originalSequenceComplete: boolean
  readonly reachedMaximum: boolean
}

export function resolveRefusal(refusalCount: number): RefusalState {
  const count = clampRefusalCount(refusalCount)
  const originalCount = invitationCopy.refusalLines.length

  return {
    noLabel: labelForCount(count, originalCount),
    yesEmphasis: yesEmphasisFor(count),
    noWidthScale: noWidthScaleFor(count),
    originalSequenceComplete: count >= originalCount,
    reachedMaximum: count === maximumRefusalCount,
  }
}

function labelForCount(count: number, originalCount: number): string {
  if (count <= 0) {
    return invitationCopy.noLabel
  }

  if (count <= originalCount) {
    return invitationCopy.refusalLines[count - 1] ?? invitationCopy.noLabel
  }

  const continuedCount: number = continuedRefusalLines.length
  if (continuedCount === 0) {
    return invitationCopy.refusalLines[originalCount - 1] ?? invitationCopy.noLabel
  }

  const continuedIndex = (count - originalCount - 1) % continuedCount
  return continuedRefusalLines[continuedIndex] ?? invitationCopy.noLabel
}

function yesEmphasisFor(count: number): number {
  if (count <= 0) {
    return 0
  }

  if (count <= yesFitAtCount) {
    const progress = count / yesFitAtCount
    const emphasis = 1 - (1 - progress) ** 2
    return Math.round(emphasis * 10000) / 10000
  }

  const span = maximumRefusalCount - yesFitAtCount
  const progress = (count - yesFitAtCount) / span
  const emphasis = 1 + progress ** 2
  return Math.round(emphasis * 1000000) / 1000000
}

function noWidthScaleFor(count: number): number {
  if (count <= yesFitAtCount) {
    return 1
  }

  const span = maximumRefusalCount - yesFitAtCount
  const progress = (count - yesFitAtCount) / span
  const scale = 1 - progress * (1 - noMinimumWidthScale)
  return Math.round(scale * 10000) / 10000
}

function clampRefusalCount(refusalCount: number): number {
  if (!Number.isFinite(refusalCount) || refusalCount <= 0) {
    return 0
  }

  return Math.min(Math.floor(refusalCount), maximumRefusalCount)
}
