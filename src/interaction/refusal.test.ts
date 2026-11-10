import assert from 'node:assert/strict'
import { test } from 'node:test'
import { continuedRefusalLines, invitationCopy } from '../content/copy.ts'
import { maximumRefusalCount, noMinimumWidthScale, resolveRefusal, yesFitAtCount } from './refusal.ts'

const originalCount = invitationCopy.refusalLines.length

function continuedLabel(count: number): string {
  const index = (count - originalCount - 1) % continuedRefusalLines.length
  return continuedRefusalLines[index] ?? ''
}

test('count zero uses the original No label and no Yes emphasis', () => {
  assert.deepEqual(resolveRefusal(0), {
    noLabel: 'No',
    yesEmphasis: 0,
    noWidthScale: 1,
    originalSequenceComplete: false,
    reachedMaximum: false,
  })
})

test('count one shows the first original refusal line', () => {
  const state = resolveRefusal(1)

  assert.equal(state.noLabel, 'Think again gawaar')
  assert.equal(state.noLabel, invitationCopy.refusalLines[0])
  assert.equal(state.originalSequenceComplete, false)
  assert.equal(state.reachedMaximum, false)
  assert.equal(state.yesEmphasis, 0.0656)
})

test('the original ten lines stay in their existing order', () => {
  const expected = [
    'Think again gawaar',
    'If I offer chocolate ice cream',
    'How about momos',
    'PLEA*E POOKIE',
    'But :*(',
    'I am going to die',
    'Yep im dead',
    "ok ur talking to yashasvi's ghost",
    ':((((',
    'My kuchu puchu',
  ]

  assert.deepEqual(invitationCopy.refusalLines, expected)

  for (const [index, line] of expected.entries()) {
    const state = resolveRefusal(index + 1)
    assert.equal(state.noLabel, line)
    assert.equal(state.reachedMaximum, false)
  }

  assert.equal(resolveRefusal(10).originalSequenceComplete, true)
  assert.equal(resolveRefusal(9).originalSequenceComplete, false)
})

test('count eleven starts the continued messages', () => {
  const state = resolveRefusal(11)

  assert.equal(state.noLabel, 'Not even a little?')
  assert.equal(state.noLabel, continuedRefusalLines[0])
  assert.equal(state.originalSequenceComplete, true)
  assert.equal(state.reachedMaximum, false)
})

test('continued messages cycle in order until count 100', () => {
  assert.equal(resolveRefusal(12).noLabel, 'Are you sure?')
  assert.equal(resolveRefusal(13).noLabel, 'Come on, you must like me a little!')
  assert.equal(resolveRefusal(22).noLabel, 'Okay, but why not?')
  assert.equal(resolveRefusal(23).noLabel, 'Not even a little?')
  assert.equal(resolveRefusal(99).noLabel, continuedLabel(99))
  assert.equal(resolveRefusal(99).noLabel, 'I have my good qualities, you know!')
  assert.equal(resolveRefusal(99).reachedMaximum, false)
})

test('count 100 freezes the cycled message and stops the count', () => {
  const finalPress = resolveRefusal(100)
  const extraPress = resolveRefusal(101)
  const farPress = resolveRefusal(250)

  assert.equal(maximumRefusalCount, 100)
  assert.equal(finalPress.noLabel, continuedLabel(100))
  assert.equal(finalPress.noLabel, 'Surely you like me at least 1%?')
  assert.equal(finalPress.yesEmphasis, 2)
  assert.equal(finalPress.originalSequenceComplete, true)
  assert.equal(finalPress.reachedMaximum, true)
  assert.ok(finalPress.noLabel.length > 0)
  assert.ok(finalPress.noWidthScale > 0)
  assert.deepEqual(extraPress, finalPress)
  assert.deepEqual(farPress, finalPress)
})

test('Yes keeps growing through press 100', () => {
  assert.equal(yesFitAtCount, 30)
  assert.equal(resolveRefusal(5).yesEmphasis, 0.3056)
  assert.equal(resolveRefusal(10).yesEmphasis, 0.5556)
  assert.equal(resolveRefusal(15).yesEmphasis, 0.75)
  assert.equal(resolveRefusal(20).yesEmphasis, 0.8889)
  assert.equal(resolveRefusal(25).yesEmphasis, 0.9722)
  assert.equal(resolveRefusal(30).yesEmphasis, 1)
  assert.equal(resolveRefusal(50).yesEmphasis, 1.081633)
  assert.equal(resolveRefusal(75).yesEmphasis, 1.413265)
  assert.equal(resolveRefusal(100).yesEmphasis, 2)

  assert.ok(resolveRefusal(30).yesEmphasis < resolveRefusal(100).yesEmphasis)
  assert.ok(resolveRefusal(50).yesEmphasis > resolveRefusal(30).yesEmphasis)
  assert.ok(resolveRefusal(75).yesEmphasis > resolveRefusal(50).yesEmphasis)
  assert.ok(resolveRefusal(100).yesEmphasis > resolveRefusal(75).yesEmphasis)

  let previous = 0
  for (let count = 1; count <= maximumRefusalCount; count += 1) {
    const emphasis = resolveRefusal(count).yesEmphasis
    assert.ok(emphasis > previous)
    previous = emphasis
  }
})

test('invalid counts collapse to the initial state', () => {
  const initial = resolveRefusal(0)

  assert.deepEqual(resolveRefusal(-4), initial)
  assert.deepEqual(resolveRefusal(Number.NaN), initial)
  assert.deepEqual(resolveRefusal(Number.POSITIVE_INFINITY), initial)
  assert.deepEqual(resolveRefusal(Number.NEGATIVE_INFINITY), initial)
})

test('a fractional count uses the whole presses already completed', () => {
  assert.deepEqual(resolveRefusal(1.9), resolveRefusal(1))
  assert.deepEqual(resolveRefusal(100.8), resolveRefusal(100))
})

test('No keeps its full width through the first 30 presses', () => {
  assert.equal(resolveRefusal(0).noWidthScale, 1)
  assert.equal(resolveRefusal(10).noWidthScale, 1)
  assert.equal(resolveRefusal(30).noWidthScale, 1)
  assert.equal(resolveRefusal(30).yesEmphasis, 1)
})

test('No narrows after press 30 and reaches its minimum at press 100', () => {
  assert.ok(resolveRefusal(31).noWidthScale < 1)
  assert.equal(resolveRefusal(100).noWidthScale, noMinimumWidthScale)
  assert.ok(resolveRefusal(100).yesEmphasis > resolveRefusal(30).yesEmphasis)

  let previous = resolveRefusal(30).noWidthScale
  for (let count = 31; count <= maximumRefusalCount; count += 1) {
    const scale = resolveRefusal(count).noWidthScale
    assert.ok(scale < previous)
    assert.ok(scale >= noMinimumWidthScale)
    previous = scale
  }
})
