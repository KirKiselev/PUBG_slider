import "./interfaces.ts";

const imageURI = [
  { imgBack: "../img/img_1_back.jpg", imgFront: "../img/img_1_front.png" },
  { imgBack: "../img/img_2_back.jpg", imgFront: "../img/img_2_front.png" },
  { imgBack: "../img/img_3_back.jpg", imgFront: "../img/img_3_front.png" },
  { imgBack: "../img/img_4_back.jpg", imgFront: "../img/img_4_front.png" },
  { imgBack: "../img/img_5_back.png", imgFront: "../img/img_5_front.png" },
];

const postData: mockData[] = [
  { title: "header_1", text: "text_1", imgBack: null, imgBackStartPosition: { x: 0, y: 0 }, imgFront: null, imgFrontStartPosition: { x: 0, y: 0 }, imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -967 Z" },
  { title: "header_2", text: "text_2", imgBack: null, imgBackStartPosition: { x: 0, y: 0 }, imgFront: null, imgFrontStartPosition: { x: 0, y: 0 }, imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -967 Z" },
  { title: "header_3", text: "text_3", imgBack: null, imgBackStartPosition: { x: 0, y: 0 }, imgFront: null, imgFrontStartPosition: { x: 0, y: 0 }, imgFrontClipPath: "M 0 50 h 920 v 621  L 807 621 h -967 Z" },
  { title: "header_4", text: "text_4", imgBack: null, imgBackStartPosition: { x: 0, y: 0 }, imgFront: null, imgFrontStartPosition: { x: 0, y: 0 }, imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -967 Z" },
  { title: "header_5", text: "text_5", imgBack: null, imgBackStartPosition: { x: 0, y: 0 }, imgFront: null, imgFrontStartPosition: { x: 0, y: 0 }, imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -120 v 20 h -910 Z" },
];

function getImages(): void {
  for (let i = 0; i < imageURI.length; i++) {
    postData[i].imgBack = new Image();
    postData[i].imgBack.src = imageURI[i].imgBack;

    postData[i].imgFront = new Image();
    postData[i].imgFront.src = imageURI[i].imgFront;
  }
}

getImages();

const canvas: HTMLCanvasElement = document.getElementById("newsBlockCanvas") as HTMLCanvasElement;
canvas.width = 600;
canvas.height = 300;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

let currentBackImage = new Image();
let currentBackImageStartPosition: Object;
let currentFrontImage = new Image();
let currentFrontImageStartPosition: Object;
let currentFrontImageClipPath: string;
let currentTitle: string = "Title";
let currText: string = "string";

let counter: number = 0;
let currentPointerX: number;
let previousPointerX: number | null = null;
let firstDrawAlphaChannel = 0;
let firstDrawPositionCorrection = -50;

function getPointerPosition(e: PointerEvent): void {
  currentPointerX = e.clientX;
}

window.addEventListener("mousemove", getPointerPosition);

setTimeout(changeContent, 25);

let intervalGenerator = setInterval(changeContent, 4000);

function changeContent() {
  window.removeEventListener("mousemove", getPointerPosition);
  window.removeEventListener("mousemove", drawParallax);
  let currentElement: number = counter % 5;

  currentBackImage = postData[currentElement].imgBack;
  currentBackImageStartPosition = postData[currentElement].imgBackStartPosition;
  currentFrontImage = postData[currentElement].imgFront;
  currentFrontImageStartPosition = postData[currentElement].imgFrontStartPosition;
  currentFrontImageClipPath = postData[currentElement].imgFrontClipPath;
  currentTitle = postData[currentElement].title;
  currText = postData[currentElement].text;
  counter++;
  applyContent();
}

function applyContent() {
  canvas.width = currentBackImage.width;
  canvas.height = currentBackImage.height;

  let elem_header: HTMLElement = document.getElementById("newsBlock_post_textHeader")!;
  let elem_text: HTMLElement = document.getElementById("newsBlock_post_text")!;
  
  

  elem_header.innerText = currentTitle;
  elem_text.innerText = currText;
  firstDrawAlphaChannel =0

  drawFirst();
}

function drawFirst() {
  
  let str: string = `M 0 100 h ${canvas.width - 120} v ${canvas.height - 240} L ${canvas.width - 160} ${canvas.height - 90} H -${canvas.width - 40} Z`;
  let clipPath = new Path2D(str);

  if(firstDrawAlphaChannel <= 1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = firstDrawAlphaChannel;
  ctx.save();
  ctx.clip(clipPath);
  let gradient = ctx.createRadialGradient(canvas.width - (firstDrawPositionCorrection - firstDrawPositionCorrection*firstDrawAlphaChannel), canvas.height / 2, 0, canvas.width - (firstDrawPositionCorrection - firstDrawPositionCorrection*firstDrawAlphaChannel), canvas.height / 2, canvas.width * 0.8);
  gradient.addColorStop(0, "#FFFFFFFF");
  gradient.addColorStop(1, "#00000000");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(currentBackImage, currentBackImageStartPosition.x + getImagePositionCorrection() - (firstDrawPositionCorrection - firstDrawPositionCorrection*firstDrawAlphaChannel), currentBackImageStartPosition.y);
  ctx.restore();

  ctx.globalCompositeOperation = "source-over";
  clipPath = new Path2D(currentFrontImageClipPath);
  ctx.clip(clipPath);
  ctx.drawImage(currentFrontImage, currentFrontImageStartPosition.x + getImagePositionCorrection() * 2 - (firstDrawPositionCorrection - firstDrawPositionCorrection*firstDrawAlphaChannel), currentFrontImageStartPosition.y);

  firstDrawAlphaChannel+= 0.025;
  window.requestAnimationFrame(drawFirst)
  }
  else {
    window.addEventListener("mousemove", getPointerPosition);
    window.addEventListener("mousemove", drawParallax);
  }
}

function changeSlide(e: Event) {
  let number: number = parseInt(e.target.innerText) - 1;
  counter = number;
  changeContent();
  clearInterval(intervalGenerator);
  intervalGenerator = setInterval(changeContent, 4000);
}

(function () {
  let buttonsCollection: HTMLCollectionOf<Element> = document.getElementsByClassName("newsBlock_nav_button");

  for (let elem of buttonsCollection) {
    elem.addEventListener("click", changeSlide);
  }
})();

function drawParallax(): void {

    if (currentPointerX != previousPointerX) {
      let str: string = `M 0 100 h ${canvas.width - 120} v ${canvas.height - 240} L ${canvas.width - 160} ${canvas.height - 90} H -${canvas.width - 40} Z`;
      let clipPath = new Path2D(str);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.clip(clipPath);
      let gradient = ctx.createRadialGradient(canvas.width, canvas.height / 2, 0, canvas.width, canvas.height / 2, canvas.width * 0.8);
      gradient.addColorStop(0, "#FFFFFFFF");
      gradient.addColorStop(1, "#00000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(currentBackImage, currentBackImageStartPosition.x + getImagePositionCorrection(), currentBackImageStartPosition.y);
      ctx.restore();

      ctx.globalCompositeOperation = "source-over";
      clipPath = new Path2D(currentFrontImageClipPath);
      ctx.clip(clipPath);
      ctx.drawImage(currentFrontImage, currentFrontImageStartPosition.x + getImagePositionCorrection() * 2, currentFrontImageStartPosition.y);
      previousPointerX = currentPointerX;
    }

    
  }


function getImagePositionCorrection(): number {
  let result: number;
  result = (window.innerWidth / 2 - currentPointerX) / 100;
  return result;
}