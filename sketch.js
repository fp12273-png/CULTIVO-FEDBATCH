// =========================================
// LABORATORIO VIRTUAL - CULTIVO FED-BATCH
// p5.js – listo para web
// =========================================

// ---------- VARIABLES DEL PROCESO ----------
let X, S, P;
let muMax = 0.4;
let Ks = 0.5;
let Yxs = 0.5;
let Ypx = 0.2;

let X0 = 0.1;
let S0 = 20;

// FED-BATCH
let F = 0.05;     // Caudal de alimentación (L/h)
let Sf = 30;      // Sustrato en la alimentación (g/L)
let V = 1.0;      // Volumen inicial (L)

let dt = 0.03;
let running = false;
let angle = 0;

// ---------- SLIDERS ----------
let sliderX0, sliderS0, sliderMu, sliderF, sliderSf;

// ---------- BOTONES ----------
let btnStart, btnReset;

// ---------- DATOS PARA GRAFICAS ----------
let Xv = [], Sv = [], Pv = [];

function setup() {
  createCanvas(1100, 600);
  resetSimulation();

  sliderX0 = new Slider(40, 150, 220, 0.05, 1.0, X0, "Biomasa inicial (X₀)", "g/L");
  sliderS0 = new Slider(40, 220, 220, 5, 40, S0, "Sustrato inicial (S₀)", "g/L");
  sliderMu = new Slider(40, 290, 220, 0.1, 0.8, muMax, "μ máx", "h⁻¹");
  sliderF  = new Slider(40, 360, 220, 0.0, 0.2, F, "Caudal F", "L/h");
  sliderSf = new Slider(40, 430, 220, 10, 60, Sf, "Sustrato Sf", "g/L");

  btnStart = new Button(40, 500, 100, 35, "START");
  btnReset = new Button(160, 500, 100, 35, "RESET");
}

function draw() {
  background(230);

  drawPanel();
  drawReactor();
  drawGraphs();

  sliderX0.display();
  sliderS0.display();
  sliderMu.display();
  sliderF.display();
  sliderSf.display();

  btnStart.display();
  btnReset.display();

  if (running) updateModel();
}

// ---------- MODELO FED-BATCH ----------
function updateModel() {

  let mu = muMax * S / (Ks + S);

  // Crecimiento
  X += mu * X * dt;
  P += Ypx * mu * X * dt;

  // Consumo + alimentación de sustrato
  S += (F / V) * (Sf - S) * dt;
  S -= (1 / Yxs) * mu * X * dt;

  // Aumento de volumen (fed-batch)
  V += F * dt;

  Xv.push(X);
  Sv.push(S);
  Pv.push(P);

  angle += 0.1;
}

// ---------- REACTOR ----------
function drawReactor() {
  push();
  translate(650, 50);

  noStroke();
  fill(140, 140, 140, 60);
  rect(8, 8, 260, 370, 45);

  stroke(0);
  strokeWeight(2);
  fill(200);
  rect(0, 0, 260, 370, 45);

  fill(170);
  rect(20, -25, 220, 35, 20);

  // Flecha de alimentación
  stroke(0, 150, 0);
  strokeWeight(4);
  line(130, -25, 130, 0);
  triangle(125, -5, 135, -5, 130, 5);

  fill(70, 160, 220);
  rect(15, 120, 230, 240, 35);

  stroke(70);
  strokeWeight(4);
  line(130, 10, 130, 350);

  push();
  translate(130, 250);
  rotate(angle);
  stroke(40);
  strokeWeight(4);
  line(-55, 0, 55, 0);
  line(0, -45, 0, 45);
  pop();

  pop();

  fill(0);
  textAlign(CENTER);
  textSize(14);
  text("BIORREACTOR FED-BATCH", 780, 47);
}

// ---------- PANEL ----------
function drawPanel() {
  fill(40);
  textSize(15);
  text("PANEL DE CONTROL", 110, 100);

  fill(0);
  textSize(13);
  text("Biomasa (X): " + nf(X,1,2) + " g/L", 40, 560);
  text("Sustrato (S): " + nf(S,1,2) + " g/L", 40, 580);
  text("Volumen (V): " + nf(V,1,2) + " L", 40, 600);
}

// ---------- GRAFICAS ----------
function drawGraphs() {
  let gx = 310, gy = 430, gw = 740, gh = 150;

  fill(255);
  stroke(0);
  rect(gx, gy, gw, gh);

  drawCurve(Xv, gx, gy, gh, color(0,160,0), 4);
  drawCurve(Sv, gx, gy, gh, color(200,40,40), 4);
  drawCurve(Pv, gx, gy, gh, color(40,40,200), 4);
}

function drawCurve(data, x, y, h, c, scale) {
  stroke(c);
  noFill();
  beginShape();
  for (let i = 0; i < data.length; i++) {
    vertex(x + i, y + h - data[i] * scale);
  }
  endShape();
}

// ---------- RESET ----------
function resetSimulation() {
  X0 = sliderX0 ? sliderX0.value : X0;
  S0 = sliderS0 ? sliderS0.value : S0;
  muMax = sliderMu ? sliderMu.value : muMax;
  F = sliderF ? sliderF.value : F;
  Sf = sliderSf ? sliderSf.value : Sf;

  X = X0;
  S = S0;
  P = 0;
  V = 1.0;

  Xv = [];
  Sv = [];
  Pv = [];

  running = false;
}

// ---------- MOUSE ----------
function mousePressed() {
  sliderX0.check();
  sliderS0.check();
  sliderMu.check();
  sliderF.check();
  sliderSf.check();

  if (btnStart.over()) {
    resetSimulation();
    running = true;
  }
  if (btnReset.over()) resetSimulation();
}

function mouseDragged() {
  sliderX0.update();
  sliderS0.update();
  sliderMu.update();
  sliderF.update();
  sliderSf.update();
}

function mouseReleased() {
  sliderX0.release();
  sliderS0.release();
  sliderMu.release();
  sliderF.release();
  sliderSf.release();
}

// ---------- CLASES ----------
class Slider {
  constructor(x,y,w,minV,maxV,v,label,unit){
    this.x=x; this.y=y; this.w=w;
    this.minV=minV; this.maxV=maxV;
    this.value=v; this.label=label; this.unit=unit;
    this.drag=false;
  }
  display(){
    fill(0); text(this.label,this.x,this.y-15);
    line(this.x,this.y,this.x+this.w,this.y);
    let px=map(this.value,this.minV,this.maxV,this.x,this.x+this.w);
    ellipse(px,this.y,14);
    text(nf(this.value,1,2)+" "+this.unit,this.x+this.w+10,this.y+5);
  }
  check(){
    let px=map(this.value,this.minV,this.maxV,this.x,this.x+this.w);
    if(dist(mouseX,mouseY,px,this.y)<10) this.drag=true;
  }
  update(){
    if(this.drag){
      let nx=constrain(mouseX,this.x,this.x+this.w);
      this.value=map(nx,this.x,this.x+this.w,this.minV,this.maxV);
    }
  }
  release(){ this.drag=false; }
}

class Button {
  constructor(x,y,w,h,label){
    this.x=x; this.y=y; this.w=w; this.h=h; this.label=label;
  }
  display(){
    fill(180);
    rect(this.x,this.y,this.w,this.h,8);
    fill(0);
    textAlign(CENTER,CENTER);
    text(this.label,this.x+this.w/2,this.y+this.h/2);
  }
  over(){
    return mouseX>this.x && mouseX<this.x+this.w &&
           mouseY>this.y && mouseY<this.y+this.h;
  }
}
