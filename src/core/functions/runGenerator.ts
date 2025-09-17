import type { NodeGenerator } from "@jsynple/core"

// Constructor of an asynchronous function used to instanciate the code with an await
const AsyncFunction = (async () => { }).constructor

export function runGeneratorTemplate(start: (_: AudioScheduledSourceNode) => void) {
  return async (generator: NodeGenerator, ctx: AudioContext): Promise<AudioNode> => {
    let audioNode: AudioNode
    try {
      audioNode = await AsyncFunction("context", "payload", generator.code)(ctx, {}) as AudioNode
      if (audioNode instanceof AudioScheduledSourceNode) {
        console.log("Starting a source", audioNode)
        start(audioNode)
      }
      else {
        console.log("Not starting", audioNode)
      }
    }
    catch (_) {
      audioNode = new GainNode(ctx, { gain: 1 });
    }
    return audioNode
  }
}

/**
 * Runs the inner code of a generator to try to get an audio node from it. If it fails at it, it just
 * returns a gain node with a gain set to 1 so that it acts like a passive node, not modifying the signal.
 * 
 * @param generator the generator object holding the instanciated logic. 
 * @param ctx the audio context in which the node will be instanciated. It is recommended to always pass the same.
 * 
 * @returns the instanciated audio node, or a gain node with gain at 1 if something has failed along the way.
 */
export const runGenerator = runGeneratorTemplate(n => n.start())