import "./interfaces.ts";

const imageURI = [
  { imgBack: "../img/img_1_back.jpg", imgFront: "../img/img_1_front.png" },
  { imgBack: "../img/img_2_back.jpg", imgFront: "../img/img_2_front.png" },
  { imgBack: "../img/img_3_back.jpg", imgFront: "../img/img_3_front.png" },
  { imgBack: "../img/img_4_back.jpg", imgFront: "../img/img_4_front.png" },
  { imgBack: "../img/img_5_back.png", imgFront: "../img/img_5_front.png" },
];

const postData: mockData[] = [
  { title: "header_1", text: "text_1", imgBack: null, imgFront: null },
  { title: "header_2", text: "text_2", imgBack: null, imgFront: null },
  { title: "header_3", text: "text_3", imgBack: null, imgFront: null },
  { title: "header_4", text: "text_4", imgBack: null, imgFront: null },
  { title: "header_5", text: "text_5", imgBack: null, imgFront: null },
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
let currentFrontImage = new Image();
let currentTitle: string = "Title";
let currText: string = "string";
let counter: number = 0;

setTimeout(changeContent, 0);
let intervalGenerator = setInterval(changeContent, 4000);

function changeContent() {
  let currentElement: number = counter % 5;

  currentBackImage = postData[currentElement].imgBack;
  currentFrontImage = postData[currentElement].imgFront;
  currentTitle = postData[currentElement].title;
  currText = postData[currentElement].text;
  counter++;
  applyContent();
}

function applyContent() {
  canvas.width = currentBackImage.width;
  canvas.height = currentBackImage.height;

  let elem_header: HTMLElement = document.getElementById("newsBlock_post_textHeader");
  let elem_text: HTMLElement = document.getElementById("newsBlock_post_text");
  let str: string = `M 0 100 h ${canvas.width - 120} v ${canvas.height - 240} L ${canvas.width - 160} ${canvas.height - 90} H -${canvas.width - 40} Z`;
  let clipPath = new Path2D(str);

  elem_header.innerText = currentTitle;
  elem_text.innerText = currText;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.clip(clipPath);
  ctx.drawImage(currentBackImage, 0, 0, canvas.width, canvas.height);
  let gradient = ctx.createRadialGradient(canvas.width, canvas.height / 2, canvas.width * 0.5, canvas.width, canvas.height / 2, canvas.width * 0.8);
  gradient.addColorStop(0, "#FFFFFF00");
  gradient.addColorStop(1, "#000000FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.restore();
  ctx.drawImage(currentFrontImage, 0, 0);
}

function changeSlide(e: Event) {
  let number: number = parseInt(e.target.innerText);
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
