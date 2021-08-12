const ColorThief = require('colorthief');
const { ipcRenderer, app } = require("electron");
const ipc = ipcRenderer;
const clipboard = new ClipboardJS('.swatch, #codeRgb, #codeHex');
const version = process.env.npm_package_version;

// Version app
const elVersion = document.getElementById("version");
elVersion.innerHTML = `V${version}`;

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

function rangeSlide(value) {
   document.getElementById('rangeValue').innerHTML = value;
}

el.ondrop = async (e) => {
  e.preventDefault();
  el.ondragleave();

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

  // Color
  let start = Date.now();
  await ColorThief.getColor(image)
 .then(color => {
   let elapsedTime = Date.now() - start;
   document.getElementById('color').innerHTML = `
   <div class="swatch" data-clipboard-text="rgb(${color})" style="background-color: rgb(${color})">
   <span class="tooltiptext">RGB: (${color})</span>
   <span class="tooltipClick">Copié !</span>
   </div>
   <div class="timeColor">${elapsedTime} ms
   </div>
   `;
   document.getElementById("codeRgb").innerHTML = `rgb(${color})\r\n`;
   document.getElementById("codeHex").innerHTML = `${rgbToHex(color[0],color[1],color[2])}\r\n`;

 })
 .catch(err => {
   console.log(err);
 })

 // Color Palette
const value = document.getElementById("rangeValue").innerHTML;
 await ColorThief.getPalette(image, parseInt(value))
  .then(palette => {
    let elapsedTime = Date.now() - start;
    document.getElementById('palette').innerHTML = "";
   for (let i = 0; i < palette.length; i++) {
     const result = `
    <div class="swatch" data-clipboard-text="rgb(${palette[i]})" style="background-color: rgb(${palette[i]})">
    <span class="tooltiptext">RGB: (${palette[i]})</span>
    <span class="tooltipClick">Copié !</span>
    </div>
    `;
    document.getElementById('palette').innerHTML += result;
    const resultRgb = `rgb(${palette[i]})\r\n`;
    const resultHex = `${rgbToHex(palette[i][0], palette[i][1], palette[i][2])}\r\n`;
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

// Copy Clipboard Log
clipboard.on('success', function(e) {
    console.log('Action:', e.action);
    console.log('Text:', e.text);
    console.log('Trigger:', e.trigger);

    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});

