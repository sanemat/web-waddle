import { AudioContext } from "standardized-audio-context";

(() => {
  let audioCtx = new AudioContext();
  window.addEventListener("load", () => {
    const button = document.body.querySelector("#buttonStart");
    button.addEventListener("click", () => {
      // autoplay policy
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const audioElement = document.querySelector("audio");
      const track = audioCtx.createMediaElementSource(audioElement);
      track.connect(audioCtx.destination);
      audioElement.play().catch(error => {
        console.error(error);
      });
    });
  });
})();
