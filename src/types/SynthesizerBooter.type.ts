import type { Eventual } from "@jsynple/core"
import type { BootedSynthesizer } from "./BootedSynthesizer.type.js"

export type SynthesizerBooter = (id: string, processorsUrl: string, auth_token: string) => Eventual<BootedSynthesizer>