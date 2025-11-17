import { Synthesizer } from "@jsynple/core"

export type BootedSynthesizer = Synthesizer & { context: AudioContext }