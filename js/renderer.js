const ColorThief = require('colorthief');
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

el.ondrop = async (e) => {

  e.preventDefault();
  el.ondragleave();

  // Loader Show
  await (document.querySelector(".loader").classList.add("show"));

  // Image Path
  let image;
  for (const f of e.dataTransfer.files) {
    image = f.path;
  }

  // Image Load
  await (document.getElementById("imgLoad").src = `file://${image}`);
  

  // Convert rgb to hex
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

 // Loader Remove
await (document.querySelector(".loader").classList.remove("show"));
  let start = Date.now();
  await ColorThief.getColor(image)
 .then(color => {
   let elapsedTime = Date.now() - start;
   document.getElementById('color').innerHTML = `
   <div class="swatch" style="background-color: rgb(${color})">
   <span class="tooltiptext">RGB: (${color})</span>
   </div>
   <div class="timeColor">${elapsedTime} ms
   </div>
   `;
   document.getElementById("codeRgb").innerHTML = `<span style="background-color: rgb(${color})">rgb(${color});</span>\r\n`;
   document.getElementById("codeHex").innerHTML = `<span style="background-color: rgb(${color})">${rgbToHex(color[0],color[1],color[2])};\r\n</span>`;
 })
 .catch(err => {
   console.log(err);
 })

 await ColorThief.getPalette(image, 10)
  .then(palette => {
    let elapsedTime = Date.now() - start;
    document.getElementById('palette').innerHTML = "";
   for (let i = 0; i < palette.length; i++) {

     const result = `
    <div class="swatch" style="background-color: rgb(${palette[i]})">
    <span class="tooltiptext">RGB: (${palette[i]})</span>
    </div>
    `;
    document.getElementById('palette').innerHTML += result;
    const resultRgb = `<span style="background-color: rgb(${palette[i]})">rgb(${palette[i]});</span>\r\n`;
    const resultHex = `<span style="background-color: rgb(${palette[i]})">${rgbToHex(palette[i][0], palette[i][1], palette[i][2])};</span>\r\n`;
     document.getElementById("codeRgb").innerHTML += resultRgb;
    document.getElementById("codeHex").innerHTML += resultHex;
   }
   const time = document.getElementById('palette');
   time.innerHTML += `<div class="timePalette">${elapsedTime} ms</div>`
  })
  .catch(err => {
    console.log(err);
  })

};