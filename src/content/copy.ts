export type InvitationCopy = {
  readonly documentTitle: string
  readonly introPrompt: string
  readonly beginLabel: string
  readonly question: string
  readonly yesLabel: string
  readonly noLabel: string
  readonly refusalLines: readonly string[]
  readonly successCaption: string
  readonly successSmirk: string
  readonly videoLabel: string
  readonly videoUnavailable: string
}

export const invitationCopy = {
  documentTitle: 'Are you in love with Yashasvi?',
  introPrompt: 'Check if you are in love with Yashasvi?',
  beginLabel: 'Begin',
  question: 'Do you like Yashasvi?',
  yesLabel: 'Yes',
  noLabel: 'No',
  refusalLines: [
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
  ],
  successCaption: 'He knows.',
  successSmirk: ';)',
  videoLabel: 'Pokko Baby Boo dancing',
  videoUnavailable: 'The dance could not be played.',
} as const satisfies InvitationCopy

// Used from the 11th No press onward. The original ten lines above stay first.
export const continuedRefusalLines = [
  'Not even a little?',
  'Are you sure?',
  'Come on, you must like me a little!',
  'Think about it again!',
  'I have my good qualities, you know!',
  'Surely you like me at least 1%?',
  'What if I promise to be nice?',
  "You smiled, didn't you?",
  "Don't tell me you don't like me!",
  'Give me one chance!',
  'I know you like me secretly!',
  'Okay, but why not?',
] as const satisfies readonly string[]

// Kept for a later pass. Not part of the refusal sequence.
// "I will die" is a different phrase from "I am going to die".
export const reservedPersonalPhrases = [
  'My PUCHKUU',
  'My alooo',
  'Babuuu',
  'My WIFEYYY',
  'I will die',
] as const satisfies readonly string[]
