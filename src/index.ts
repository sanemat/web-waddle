(() => {
  window.addEventListener("load", () => {
    const button = document.body.querySelector("#buttonStart");
    button.addEventListener("click", () => {
      console.log("clicked!");
    });
  });
})();
