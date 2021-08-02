const ColorThief = require("colorthief");
const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

// Close Windows App
closeBtn.addEventListener("click", () => {
  ipc.send("closeApp");
});

// Minimize Windows App
minimizeBtn.addEventListener("click", () => {
  ipc.send("minimizeApp");
});

// Maximize Windows App
maximizeBtn.addEventListener("click", () => {
  ipc.send("maximizeApp");
});

window.ondragover = window.ondrop = function (e) {
  e.preventDefault();
  return false;
};

const el = document.querySelector("#drop");

el.ondragover = function () {
  this.className = "hover";
  this.innerHTML = "";
  return false;
};

el.ondragleave = function () {
  this.className = "";
  this.innerHTML = "";
  return false;
};

el.ondrop = (e) => {
  e.preventDefault();
  el.ondragleave();
  let imgPath;
  for (const f of e.dataTransfer.files) {
    imgPath = f.path;
  }

  document.getElementById("img").src = `file://${imgPath}`;

  ColorThief.getColor(imgPath)
    .then((color) => {
      console.log(color);
      // document.getElementById("swatches").style.backgroundColor = `rgb(${color})`;
      document.getElementById("swatches").innerHTML = `<div class="swatch" style="background-color: rgb(${color}"></div>`;
    })
    .catch((err) => {
      console.log(err);
    });

  ColorThief.getPalette(imgPath, 5)
    .then((palette) => {
      console.log(palette);
    })
    .catch((err) => {
      console.log(err);
    });
};
