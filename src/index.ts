import {
  AudioContext,
  AudioBufferSourceNode,
  IAudioBufferSourceNode,
  IAudioContext,
} from 'standardized-audio-context';

(() => {
  const audioCtx = new AudioContext();
  let source: AudioBuffer = null;
  let loading = false;
  let bgmNode: IAudioBufferSourceNode<IAudioContext> = null;
  const analyser = audioCtx.createAnalyser();
  let canvasElement: HTMLCanvasElement = null;
  let canvasCtx: CanvasRenderingContext2D = null;

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
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i += 1) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvasElement.width, canvasElement.height / 2);
      canvasCtx.stroke();
    }
    draw();
  }

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
      bgmNode.addEventListener('ended', () => {
        if (bgmNode) {
          bgmNode.stop();
          bgmNode.disconnect();
          bgmNode = null;
        }
      });
      bgmNode.start();
    }
  }

  function resizeCanvas() {
    canvasElement.width = window.innerWidth - 20; // magic number
  }

  window.addEventListener('load', () => {
    const button = document.body.querySelector('#buttonToggleBgm');
    canvasElement = document.body.querySelector('#visualizer');
    resizeCanvas();
    canvasCtx = canvasElement.getContext('2d');
    button.addEventListener('click', () => {
      // autoplay policy
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch((error) => {
          console.error(error); // eslint-disable-line no-console
        });
      }
      if (loading) {
        return;
      }
      if (source) {
        toggleBgm();
      } else {
        loading = true;
        fetch('7sxtEOR7zhrd-60sec-fade-out.128.mp3')
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
          .then((audioBuffer) => {
            loading = false;
            source = audioBuffer;
            toggleBgm();
          })
          .catch((error) => {
            loading = false;
            console.error(error); // eslint-disable-line no-console
          });
      }
    });
  });

  window.addEventListener('resize', resizeCanvas);
})();
