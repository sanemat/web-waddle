import {
  AudioContext,
  AudioBufferSourceNode
} from "standardized-audio-context";

(() => {
  let audioCtx = new AudioContext();
  let source: AudioBuffer = null;
  let node: any = null;
  window.addEventListener("load", () => {
    const button: HTMLElement = document.body.querySelector("#buttonStart");
    button.addEventListener("click", () => {
      // autoplay policy
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      if (source) {
        if (button.dataset.playing === "false") {
          if (node) {
            node.start(0, 10);
          } else {
            node = new AudioBufferSourceNode(audioCtx, { buffer: source });
            node.connect(audioCtx.destination);
            node.addEventListener("ended", () => {
              node.stop();
              node.disconnect();
              node = null;
              button.dataset.playing = "false";
            });
            node.start(0, 12);
          }
          button.dataset.playing = "true";
        } else if (button.dataset.playing === "true") {
          node.stop();
          button.dataset.playing = "false";
        }
      } else {
        // NOTE: need loading flag
        fetch("7sxtEOR7zhrd-60sec-fade-out.128.mp3")
          .then(response => {
            return response.arrayBuffer();
          })
          .then(buffer => {
            return audioCtx.decodeAudioData(buffer);
          })
          .then(decodeAudio => {
            source = decodeAudio;
            if (button.dataset.playing === "false") {
              if (node) {
                node.start(0, 15);
              } else {
                node = new AudioBufferSourceNode(audioCtx, { buffer: source });
                node.connect(audioCtx.destination);
                node.addEventListener("ended", () => {
                  node.stop();
                  node.disconnect();
                  node = null;
                  button.dataset.playing = "false";
                });
                node.start(0, 19);
              }
              button.dataset.playing = "true";
            } else if (button.dataset.playing === "true") {
              node.stop();
              button.dataset.playing = "false";
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  });
})();
