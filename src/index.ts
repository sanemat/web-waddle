import {
  AudioContext,
  AudioBufferSourceNode,
  IAudioBufferSourceNode,
  IAudioContext
} from "standardized-audio-context";

(() => {
  let audioCtx = new AudioContext();
  let source: AudioBuffer = null;
  let loading = false;
  let bgmNode: IAudioBufferSourceNode<IAudioContext> = null;
  window.addEventListener("load", () => {
    const button = document.body.querySelector("#buttonToggleBgm");
    button.addEventListener("click", () => {
      // autoplay policy
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(error => {
          console.error(error);
        });
      }
      if (loading) {
        return;
      }
      if (source) {
        toggleBgm();
      } else {
        loading = true;
        fetch("7sxtEOR7zhrd-60sec-fade-out.128.mp3")
          .then(response => {
            return response.arrayBuffer();
          })
          .then(buffer => {
            return audioCtx.decodeAudioData(buffer);
          })
          .then(decodeAudio => {
            loading = false;
            source = decodeAudio;
            toggleBgm();
          })
          .catch(error => {
            loading = false;
            console.error(error);
          });
      }
    });
  });

  function toggleBgm() {
    if (bgmNode) {
      bgmNode.stop();
      bgmNode.disconnect();
      bgmNode = null;
    } else {
      bgmNode = new AudioBufferSourceNode(audioCtx, { buffer: source });
      bgmNode.connect(audioCtx.destination);
      bgmNode.addEventListener("ended", () => {
        bgmNode.stop();
        bgmNode.disconnect();
        bgmNode = null;
      });
      bgmNode.start();
    }
  }
})();
