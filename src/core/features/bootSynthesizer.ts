import { type Synthesizer, fetchSynthesizer, getAllGenerators } from "@jsynple/core";
import { initSynthesizer } from "../functions/initSynthesizer.js";
import { Eventual } from "@jsynple/core/dist/types/utils/Async.js";

type SynthesizerBooter = (id: string, auth_token: string, context: AudioContext) => Eventual<Synthesizer>

export const bootSynthesizerTemplate = (
  fetchSynthesizerFct: typeof fetchSynthesizer,
  getAllGeneratorsFct: typeof getAllGenerators,
  init: typeof initSynthesizer
): SynthesizerBooter => {
  return async (id, auth_token, context) => {
    const [synthesizer, gens] = await Promise.all([
      await fetchSynthesizerFct(id, auth_token),
      getAllGeneratorsFct(auth_token)
    ])
    if (synthesizer) await init(synthesizer, gens.ok ? gens.data : [], context)
    return synthesizer
  }
}

/**
 * Fetches a synthesizer and starts its sound engine by instanciating all its sound nodes from the provided
 * generators API. First it fetches all data, then tries to instanciate the sound engine, and returns the
 * result.
 * 
 * @param {string} id the unique UUID of the synthesizer to fetch and instanciate.
 * @param {string} auth_token the authentication token to be identified on the API.
 * @param {AudioContext} context the audio context in which all audio nodes will be created.
 * 
 * @returns {Promise<Synthesizer|undefined>} a promise to be resolved with the fully loaded synthesizer, or
 *   with undefined if the synthesizer is not found.
 * 
 * @throws {UnauthenticatedSessionError} an error if the token you provided is expired.
 */
export const bootSynthesizer = bootSynthesizerTemplate(
  fetchSynthesizer,
  getAllGenerators,
  initSynthesizer
)