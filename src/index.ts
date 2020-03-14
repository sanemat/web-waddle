import {
  AudioContext,
  AudioBufferSourceNode
} from "standardized-audio-context";

(() => {
  let audioCtx = new AudioContext();
  let source: AudioBuffer = null;
  window.addEventListener("load", () => {
    const button = document.body.querySelector("#buttonStart");
    button.addEventListener("click", () => {
      // autoplay policy
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(error => {
          console.error(error);
        });
      }
      fetch("7sxtEOR7zhrd-60sec-fade-out.128.mp3")
        .then(response => {
          return response.arrayBuffer();
        })
        .then(buffer => {
          return audioCtx.decodeAudioData(buffer);
        })
        .then(decodeAudio => {
          source = decodeAudio;
          play();
        })
        .catch(error => {
          console.error(error);
        });
    });
  });

  function play() {
    let node = new AudioBufferSourceNode(audioCtx, { buffer: source });
    node.connect(audioCtx.destination);
    node.addEventListener("ended", () => {
      node.stop();
      node.disconnect();
      node = null;
    });
    node.start();
  }
})();
