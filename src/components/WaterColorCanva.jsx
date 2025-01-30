// // By Steve's Makerspace
// // https://youtu.be/UpYfjZgxwP0
// // Pick your color, slider for brush size, "s" to save a jpg, and you can change variables in lines 5 - 8 below.

// let defaultTime = 0.034; // large = quick dry
// let runnyColors = false;
// let backgrd = 0; // 255 white; 0 black
// let smallCanvas = false;
// let state;
// let brushSize = 8; 
// dryTime = defaultTime;
// let prevMouseX, prevMouseY;
// let sliderDrops, buttonDry, buttonWet, buttonDefault;
// let colorPicker;
// let colorPicked;
// let paint = [];
// let tempPaint1 = [];
// let tempPaint2 = [];

// function setup() {
//   pixelDensity(1);
//   if (smallCanvas == true) {
//     createCanvas(630,450)
//   }
//   else {
//   createCanvas(round(windowWidth * 0.98), round(windowHeight * 0.93));
//   }
//   background(255);
//   colorPicker = createColorPicker("#ed225d");
//   colorPicker.position(0, height + 5);
//   sliderDrops = createSlider(5, 100, 20);
//   sliderDrops.position(70, height + 5);
//   buttonDry = createButton("Dry All");
//   buttonDry.position(210, height + 5);
//   buttonWet = createButton("Keep Wet");
//   buttonWet.position(270, height + 5);
//   buttonDefault = createButton("Default Dry");
//   buttonDefault.position(350, height + 5);
//   state = createElement("state", "Default");
//   state.position(450, height + 5);

//   // fill the arrays with white color
//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       paint.push(backgrd, backgrd, backgrd, 0);
//     }
//   }
//   tempPaint1 = paint; 
//   tempPaint2 = paint;
// }

// function draw() {
//   buttonDry.mousePressed(dry);
//   buttonWet.mousePressed(wet);
//   buttonDefault.mousePressed(defaultDry);
//   paintDrop = sliderDrops.value();
//   colorPicked = colorPicker.color();
//   addPaint();
//   update();
//   render();
// }

// function dry() {
//   dryTime = 1000;
//   state.html("Dry");
// }
// function wet() {
//   dryTime = 0.0001;
//   state.html("Wet");
// }
// function defaultDry() {
//   dryTime = defaultTime;
//   state.html("Default");
// }

// // add paint when clicking - start with dragging
// function addPaint() {
//   if (
//     mouseIsPressed &&
//     mouseX >= 0 &&
//     mouseX <= width &&
//     mouseY >= 0 &&
//     mouseY <= height
//   ) {
//     let distance = dist(prevMouseX, prevMouseY, mouseX, mouseY);
//     let numPoints = floor(distance / 1); // larger number = more gaps and fewer points; these two lines from George Profenza, noted below.
//     drawLinePoints(prevMouseX, prevMouseY, mouseX, mouseY, numPoints);

//     // add paint when clicking in one place
//     if (mouseX == prevMouseX && mouseY == prevMouseY) {
//       renderPoints(mouseX, mouseY);
//     }
//   }
//   prevMouseX = mouseX;
//   prevMouseY = mouseY;
//   // preventing a wrap around error when dragging off canvas and back on
//   if (mouseIsPressed && mouseX < 0) {
//     prevMouseX = 0;
//   }
//   if (mouseIsPressed && mouseX > width - 1) {
//     prevMouseX = width - 1;
//   }
//   if (mouseIsPressed && mouseY < 0) {
//     prevMouseY = 0;
//   }
//   if (mouseIsPressed && mouseY > height - 1) {
//     prevMouseY = height - 1;
//   }
// }

// // calculate points when dragging
// // This function from George Profenza on stackoverflow https://stackoverflow.com/questions/63959181/how-do-you-draw-a-line-in-a-pixel-array
// function drawLinePoints(x1, y1, x2, y2, points) {
//   for (let i = 0; i < points; i++) {
//     let t = map(i, 0, points, 0.0, 1.0);
//     let x = round(lerp(x1, x2, t));
//     let y = round(lerp(y1, y2, t));
//     renderPoints(x, y);
//   }
// }

// // replace array points when drawing
// function renderPoints(x, y) {
//   // 計算筆刷影響範圍
//   for (let dx = -brushSize; dx <= brushSize; dx++) {
//     for (let dy = -brushSize; dy <= brushSize; dy++) {
//       // 計算實際位置
//       let px = x + dx;
//       let py = y + dy;
      
//       // 邊界檢查
//       if (px < 0 || px >= width || py < 0 || py >= height) continue;
      
//       // 計算與中心的距離
//       let distance = dist(x, y, px, py);
      
//       // 圓形筆刷判斷
//       if (distance <= brushSize) {
//         let arrayPos = (px + py * width) * 4;
        
//         // 原始顏色混合邏輯
//         let newR = (paint[arrayPos + 0] + colorPicked.levels[0]) / 2;
//         let newG = (paint[arrayPos + 1] + colorPicked.levels[1]) / 2;
//         let newB = (paint[arrayPos + 2] + colorPicked.levels[2]) / 2;
        
//         // 根據距離衰減濕度值
//         let falloff = map(distance, 0, brushSize, 1, 0.2); // 衰減係數
//         let newN = paint[arrayPos + 3] + paintDrop * falloff;
        
//         paint.splice(arrayPos, 4, newR, newG, newB, newN);
//       }
//     }
//   }
// }

// // if there's a lot of color in one place, spread it around

// function update() {
//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       let arrayPos = (x + y * width) * 4;
//       if (paint[arrayPos + 3] > 4) {
//         tempPaint1[arrayPos + 3] = paint[arrayPos + 3] - 4;

//         // mix pixel to right
//         if (x < width - 1) {
//           tempPaint1[arrayPos + 4] =
//             (paint[arrayPos + 4] + paint[arrayPos]) / 2;
//           tempPaint1[arrayPos + 5] =
//             (paint[arrayPos + 5] + paint[arrayPos + 1]) / 2;
//           tempPaint1[arrayPos + 6] =
//             (paint[arrayPos + 6] + paint[arrayPos + 2]) / 2;
//           tempPaint1[arrayPos + 7] = paint[arrayPos + 7] + 1;
//         }

//         // mix pixel to left
//         if (x > 0) {
//           tempPaint1[arrayPos - 4] =
//             (paint[arrayPos - 4] + paint[arrayPos]) / 2;
//           tempPaint1[arrayPos - 3] =
//             (paint[arrayPos - 3] + paint[arrayPos + 1]) / 2;
//           tempPaint1[arrayPos - 2] =
//             (paint[arrayPos - 2] + paint[arrayPos + 2]) / 2;
//           tempPaint1[arrayPos - 1] = paint[arrayPos - 1] + 1;
//         }

//         // mix pixel below
//         tempPaint1[arrayPos + width * 4] =
//           (paint[arrayPos + width * 4] + paint[arrayPos]) / 2;
//         tempPaint1[arrayPos + width * 4 + 1] =
//           (paint[arrayPos + width * 4 + 1] + paint[arrayPos + 1]) / 2;
//         tempPaint1[arrayPos + width * 4 + 2] =
//           (paint[arrayPos + width * 4 + 2] + paint[arrayPos + 2]) / 2;
//         tempPaint1[arrayPos + width * 4 + 3] =
//           paint[arrayPos + width * 4 + 3] + 1;

//         // mix pixel above
//         tempPaint1[arrayPos - width * 4] =
//           (paint[arrayPos - width * 4] + paint[arrayPos]) / 2;
//         tempPaint1[arrayPos - width * 4 + 1] =
//           (paint[arrayPos - width * 4 + 1] + paint[arrayPos + 1]) / 2;
//         tempPaint1[arrayPos - width * 4 + 2] =
//           (paint[arrayPos - width * 4 + 2] + paint[arrayPos + 2]) / 2;
//         tempPaint1[arrayPos - width * 4 + 3] =
//           paint[arrayPos - width * 4 + 3] + 1;
//       }

//       // gradually dry paint
//       tempPaint1[arrayPos + 3] = paint[arrayPos + 3] - dryTime;
//       if (tempPaint1[arrayPos + 3] < 0) {
//         tempPaint1[arrayPos + 3] = 0;
//       }
//     }
//   }
  
//   if (runnyColors == true){
//     paint = tempPaint1;
//   }
//     else {
//   for (let x = width; x > 0; x--) {
//     for (let y = height; y > 0; y--) {
//       let arrayPos = (x + y * width) * 4;
//       if (paint[arrayPos + 3] > 4) {
//         tempPaint2[arrayPos + 3] = paint[arrayPos + 3] - 4;

//         // mix pixel to right
//         if (x < width - 1) {
//           tempPaint2[arrayPos + 4] =
//             (paint[arrayPos + 4] + paint[arrayPos]) / 2;
//           tempPaint2[arrayPos + 5] =
//             (paint[arrayPos + 5] + paint[arrayPos + 1]) / 2;
//           tempPaint2[arrayPos + 6] =
//             (paint[arrayPos + 6] + paint[arrayPos + 2]) / 2;
//           tempPaint2[arrayPos + 7] = paint[arrayPos + 7] + 1;
//         }

//         // mix pixel to left
//         if (x > 0) {
//           tempPaint2[arrayPos - 4] =
//             (paint[arrayPos - 4] + paint[arrayPos]) / 2;
//           tempPaint2[arrayPos - 3] =
//             (paint[arrayPos - 3] + paint[arrayPos + 1]) / 2;
//           tempPaint2[arrayPos - 2] =
//             (paint[arrayPos - 2] + paint[arrayPos + 2]) / 2;
//           tempPaint2[arrayPos - 1] = paint[arrayPos - 1] + 1;
//         }

//         // mix pixel below
//         tempPaint2[arrayPos + width * 4] =
//           (paint[arrayPos + width * 4] + paint[arrayPos]) / 2;
//         tempPaint2[arrayPos + width * 4 + 1] =
//           (paint[arrayPos + width * 4 + 1] + paint[arrayPos + 1]) / 2;
//         tempPaint2[arrayPos + width * 4 + 2] =
//           (paint[arrayPos + width * 4 + 2] + paint[arrayPos + 2]) / 2;
//         tempPaint2[arrayPos + width * 4 + 3] =
//           paint[arrayPos + width * 4 + 3] + 1;

//         // mix pixel above
//         tempPaint2[arrayPos - width * 4] =
//           (paint[arrayPos - width * 4] + paint[arrayPos]) / 2;
//         tempPaint2[arrayPos - width * 4 + 1] =
//           (paint[arrayPos - width * 4 + 1] + paint[arrayPos + 1]) / 2;
//         tempPaint2[arrayPos - width * 4 + 2] =
//           (paint[arrayPos - width * 4 + 2] + paint[arrayPos + 2]) / 2;
//         tempPaint2[arrayPos - width * 4 + 3] =
//           paint[arrayPos - width * 4 + 3] + 1;
//       }

//       // gradually dry paint
//       tempPaint2[arrayPos + 3] = paint[arrayPos + 3] - dryTime;
//       if (tempPaint2[arrayPos + 3] < 0) {
//         tempPaint2[arrayPos + 3] = 0;
//       }
//     }
//   }
//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       let arrayPos = (x + y * width) * 4;
//       paint[arrayPos] = (tempPaint1[arrayPos] + tempPaint2[arrayPos]) / 2;
//     }
//   }
// }
// }

// // render all pixels
// function render() {
//   loadPixels();
//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       let pix = (x + y * width) * 4;
//       let arrayPos = (x + y * width) * 4;
//       pixels[pix] = paint[arrayPos];
//       pixels[pix + 1] = paint[arrayPos + 1];
//       pixels[pix + 2] = paint[arrayPos + 2];
//     }
//   }
//   updatePixels();
// }

// // Save art as jpg.
// function keyTyped() {
//   if (key === "s") {
//     save("myCanvas.jpg");
//   }
// }
