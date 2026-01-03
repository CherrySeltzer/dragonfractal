// Create canvas to draw on
const canvas = document.createElement("canvas");
canvas.id = "turtlecanvas";

// Grab reference for canvas, draw button, and clear button
const ctx = canvas.getContext("2d");
const btn = document.getElementById("drawbutton");
const clear = document.getElementById("clear");

// Set canvas width and height (not dynamic, but sized initially, on draw, and on clear)
function set_canvas_width_height() {
  canvas.width = window.innerWidth - 20; //dimensions to fit screen, but not dynamic
  canvas.height = window.innerHeight + 5 * window.innerHeight;
}

set_canvas_width_height();
document.body.appendChild(canvas);

// Inputs from sliders
//Thickness
let thickslider = document.getElementById("thickness");
let thickvalue = document.querySelector("#thickvalue");
thickslider.addEventListener("input", function () {
  thickvalue.textContent = this.value;
});

//Replications (not recursions aah)
let repslider = document.getElementById("reps");
let repvalue = document.querySelector("#repvalue");
repslider.addEventListener("input", function () {
  repvalue.textContent = this.value;
});

//Angle (degrees)
let angslider = document.getElementById("ang");
let angvalue = document.querySelector("#angvalue");
angslider.addEventListener("input", function () {
  angvalue.textContent = this.value;
});

//Length
let lenslider = document.getElementById("len");
let lenvalue = document.querySelector("#lenvalue");
lenslider.addEventListener("input", function () {
  lenvalue.textContent = this.value;
});

//x
function getx() {
  const x_input = document.getElementById("x");
  globalThis.x_val = x_input.valueAsNumber;
}

//y
function gety() {
  const y_input = document.getElementById("y");
  globalThis.y_val = y_input.valueAsNumber;
}

//theta
let thetaslider = document.getElementById("theta");
let thetavalue = document.querySelector("#thetavalue");
thetaslider.addEventListener("input", function () {
  thetavalue.textContent = this.value;
});

// let n_recursions = 19;
// let angle = (90 * Math.PI) / 180;
// let l = 3;
// let state = { x: x_val, y: y_val, theta: theta_val };
// let thickness = thickvalue.textContent;

// Color patterns :D
const rainbow = [
  "Crimson",
  "Coral",
  "Gold",
  "LightGreen",
  "LightSeaGreen",
  "LightSkyBlue",
  "SlateBlue",
];
const oldrainbow = [
  "LightCoral",
  "LightSalmon",
  "Yellow",
  "DarkGreen",
  "Blue",
  "Orchid",
  "PaleVioletRed",
];
const easy_rainbow = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
];

// Functions to turn and move
function right() {
  state.theta -= angle;
  // console.log(state.x, state.y, state.theta);
}
function left() {
  state.theta += angle;
  // console.log(state.x, state.y, state.theta);
}
function forward() {
  state.x += Math.cos(state.theta) * l;
  state.y += Math.sin(state.theta) * l;
  ctx.lineTo(state.x, state.y);
  // console.log(state.x, state.y, state.theta);
}

// Initiate!
let memoize_dir = [right];

// Run step 1
function prev_iter(dirs) {
  for (let step of dirs) {
    step();
    forward();
    memoize_dir.push(step);
  }
}

// Output list to check if correct (yay we did it)
function make_dirlist_english(direction_list) {
  let english = [];
  for (const direct of direction_list) {
    if (direct == right) {
      english.push("R");
    } else if (direct == left) {
      english.push("L");
    } else {
      english.push(direct);
    }
  }
  return english;
}

// Do it!!
function draw() {
  // Reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Set all variables
  ctx.lineWidth = thickslider.value; //in thickness slider
  let n_recursions = repslider.value;
  globalThis.angle = (angslider.value * Math.PI) / 180;
  globalThis.l = lenslider.value;

  memoize_dir = [right];
  console.log(state.x, state.y, state.theta);

  //1. Initiate Pattern
  // move forward
  ctx.beginPath();
  ctx.moveTo(state.x, state.y);
  forward();

  for (let i = 0; i <= n_recursions; i++) {
    //Start new line, move
    ctx.beginPath();
    ctx.moveTo(state.x, state.y);

    //Color!
    let rainbow_ix = i % rainbow.length;
    ctx.strokeStyle = rainbow[rainbow_ix];

    //Set deepcopy of the initial step before adding R (init + R + flipped reverse)
    const to_flip_deepmemo = [...memoize_dir].reverse();

    // 2. add R
    right();
    forward();
    memoize_dir.push(right);

    // 3. Use flipped deepcopy of previous iter to build list with L and R swapped
    //3.0 swap direction in deep_memoize
    let flipped_memo = [];
    for (let step of to_flip_deepmemo) {
      if (step == left) {
        flipped_memo.push(right);
      } else {
        flipped_memo.push(left);
      }
    }
    // console.log("flipped memo", flipped_memo);
    //3.1 run swapped iteration
    prev_iter(flipped_memo);
    // console.log(make_dirlist_english(memoize_dir));

    ctx.stroke();
  }
}

btn.addEventListener("click", () => {
  console.log("It works!!");
  set_canvas_width_height();
  getx();
  gety();
  globalThis.state = { x: x_val, y: y_val, theta:  (thetaslider.value * Math.PI) / 180 };
  draw();
});

clear.addEventListener("click", () => {
  console.log("Abort!!");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  set_canvas_width_height();
});
