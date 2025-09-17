import type { ModuleNode, NodeGenerator, Synthesizer } from "@jsynple/core";
import { findGenerator } from "./findGenerator.js";
import { runGenerator } from "./runGenerator.js";

/**
 * Initializes the audio nodes underlying this module node. It searches in the list of generators to get the correct one,
 * then instanciates it by running its code. If the node is polyphonic, the operation is repeated for the number of voices.
 * 
 * @param node The node to initialize the audio in, can be monophonic or polyphonic.
 * @param generators The list of generators to get the node's one from.
 * @param synthesizer The synthesizer in which the node is initialized, used to get the number of polyphony voices.
 * @param ctx The audio context in which the nodes are created.
 */
export async function initAudioNodes(node: ModuleNode, generators: NodeGenerator[], synthesizer: Synthesizer, ctx: AudioContext): Promise<void> {
  try {
    const generator = findGenerator(generators, node)
    if (node.polyphonic) {
      const promises: Promise<AudioNode>[] = Array.from(Array(synthesizer.voices)).map(() => runGenerator(generator, ctx))
      node.audioNodes = await Promise.all(promises)
    }
    else {
      node.audioNode = await runGenerator(generator, ctx)
    }
  }
  catch (_) { }
  finally { }
}