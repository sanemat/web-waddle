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
  let analyser = audioCtx.createAnalyser();
  let canvasElement: HTMLCanvasElement = null;
  let canvasCtx: CanvasRenderingContext2D = null;
  window.addEventListener("load", () => {
    const button = document.body.querySelector("#buttonToggleBgm");
    canvasElement = document.body.querySelector("#visualizer");
    canvasCtx = canvasElement.getContext("2d");
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
          .then(arrayBuffer => {
            return audioCtx.decodeAudioData(arrayBuffer);
          })
          .then(audioBuffer => {
            loading = false;
            source = audioBuffer;
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
      bgmNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      visualize();
      bgmNode.addEventListener("ended", () => {
        bgmNode.stop();
        bgmNode.disconnect();
        bgmNode = null;
      });
      bgmNode.start();
    }
  }

  function visualize() {
    const WIDTH = canvasElement.width;
    const HEIGHT = canvasElement.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    function draw() {
      // drawVisual
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
    }
    draw();
  }
})();
