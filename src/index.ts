import { AudioContext } from "standardized-audio-context";

(() => {
  let context = new AudioContext();
  let source: AudioBuffer = null;
  window.addEventListener("load", () => {
    const button = document.body.querySelector("#buttonStart");
    button.addEventListener("click", () => {
      // safari AudioContext requires resume
      context.resume();
      fetch("7sxtEOR7zhrd-60sec-fade-out.128.mp3")
        .then(response => {
          return response.arrayBuffer();
        })
        .then(buffer => {
          return context.decodeAudioData(buffer);
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
    // safari does not have AudioBufferSourceNode() constructor
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/AudioBufferSourceNode
    let node = context.createBufferSource();
    node.buffer = source;
    node.connect(context.destination);
    node.addEventListener("ended", () => {
      node.stop();
      node.disconnect();
      node.buffer = null;
      node = null;
    });
    node.start();
  }
})();
