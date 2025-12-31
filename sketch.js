// =========================================
// LABORATORIO VIRTUAL - CULTIVO FED-BATCH
// SIMULADOR REALISTA E INTERACTIVO (Processing)
// =========================================

// ---------- VARIABLES DEL PROCESO ----------
float X, S, P;
float muMax = 0.4;
float Ks = 0.5;
float Yxs = 0.5;
float Ypx = 0.2;

float X0 = 0.1;
float S0 = 20;

float F = 0.05;   // Caudal de alimentación (L/h)
float Sf = 50;    // Sustrato alimentado (g/L)
float V = 1.0;    // Volumen constante (L)

float dt = 0.03;
boolean running = false;
float angle = 0;

// ---------- SLIDERS ----------
Slider sliderX0, sliderS0, sliderMu, sliderF, sliderSf;

// ---------- BOTONES ----------
Button btnStart, btnReset;

// ---------- DATOS PARA GRAFICAS ----------
ArrayList<Float> Xv = new ArrayList<Float>();
ArrayList<Float> Sv = new ArrayList<Float>();
ArrayList<Float> Pv = new ArrayList<Float>();

void setup() {
  size(1100, 600);
  resetSimulation();

  sliderX0 = new Slider(40, 140, 220, 0.05, 1.0, X0, "Biomasa inicial (X₀)", "g/L");
  sliderS0 = new Slider(40, 210, 220, 5, 40, S0, "Sustrato inicial (S₀)", "g/L");
  sliderMu = new Slider(40, 280, 220, 0.1, 0.8, muMax, "μ máx", "h⁻¹");
  sliderF  = new Slider(40, 350, 220, 0.0, 0.2, F, "Caudal F", "L/h");
  sliderSf = new Slider(40, 420, 220, 10, 80, Sf, "Sustrato Sf", "g/L");

  btnStart = new Button(40, 480, 100, 35, "START");
  btnReset = new Button(160, 480, 100, 35, "RESET");
}

void draw() {
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
void updateModel() {

  float mu = muMax * S / (Ks + S);

  X += mu * X * dt;
  S += (-(1 / Yxs) * mu * X + (F / V) * (Sf - S)) * dt;
  P += Ypx * mu * X * dt;

  if (S < 0) S = 0;

  Xv.add(X);
  Sv.add(S);
  Pv.add(P);

  angle += 0.1;
}

// ---------- REACTOR ----------
void drawReactor() {
  pushMatrix();
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

  fill(70, 160, 220);
  rect(15, 120, 230, 240, 35);

  // Flecha de alimentación
  stroke(0, 120, 0);
  strokeWeight(3);
  line(130, -60, 130, -5);
  triangle(130, -5, 120, -20, 140, -20);

  stroke(70);
  strokeWeight(4);
  line(130, 10, 130, 350);

  pushMatrix();
  translate(130, 250);
  rotate(angle);
  stroke(40);
  strokeWeight(4);
  line(-55, 0, 55, 0);
  line(0, -45, 0, 45);
  line(-40, -25, 40, 25);
  popMatrix();

  popMatrix();

  fill(0);
  textAlign(CENTER);
  textSize(14);
  text("BIORREACTOR FED-BATCH", 780, 47);
}

// ---------- PANEL ----------
void drawPanel() {
  fill(40);
  textSize(15);
  textAlign(LEFT);
  text("PANEL DE CONTROL", 110, 100);

  fill(0);
  textSize(13);
  text("Biomasa (X):  " + nf(X, 1, 2) + " g/L", 40, 560);
  text("Sustrato (S): " + nf(S, 1, 2) + " g/L", 40, 585);

  fill(90);
  text("Sistema FED-BATCH – alimentación sin salida", 650, 550);
}

// ---------- GRAFICAS ----------
void drawGraphs() {
  int gx = 310, gy = 430, gw = 740, gh = 150;

  fill(255);
  stroke(0);
  rect(gx, gy, gw, gh);

  line(gx, gy, gx, gy + gh);
  line(gx, gy + gh, gx + gw, gy + gh);

  fill(0);
  textAlign(CENTER);
  text("Tiempo (h)", gx + gw / 2, gy + gh + 15);

  drawCurve(Xv, gx, gy, gh, color(0, 160, 0), 4);
  drawCurve(Sv, gx, gy, gh, color(200, 40, 40), 4);
  drawCurve(Pv, gx, gy, gh, color(40, 40, 200), 4);
}

void drawCurve(ArrayList<Float> data, int x, int y, int h, color c, float scale) {
  stroke(c);
  noFill();
  beginShape();
  for (int i = 0; i < data.size(); i++) {
    vertex(x + i, y + h - data.get(i) * scale);
  }
  endShape();
}

// ---------- RESET ----------
void resetSimulation() {
  X = sliderX0 != null ? sliderX0.value : X0;
  S = sliderS0 != null ? sliderS0.value : S0;
  P = 0;

  muMax = sliderMu != null ? sliderMu.value : muMax;
  F = sliderF != null ? sliderF.value : F;
  Sf = sliderSf != null ? sliderSf.value : Sf;

  Xv.clear();
  Sv.clear();
  Pv.clear();

  running = false;
}

// ---------- MOUSE ----------
void mousePressed() {
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

void mouseDragged() {
  sliderX0.update();
  sliderS0.update();
  sliderMu.update();
  sliderF.update();
  sliderSf.update();
}

void mouseReleased() {
  sliderX0.release();
  sliderS0.release();
  sliderMu.release();
  sliderF.release();
  sliderSf.release();
}

// ---------- CLASES ----------
class Slider {
  float x, y, w, minV, maxV, value;
  String label, unit;
  boolean drag = false;

  Slider(float x, float y, float w, float minV, float maxV, float v, String label, String unit) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.minV = minV;
    this.maxV = maxV;
    this.value = v;
    this.label = label;
    this.unit = unit;
  }

  void display() {
    fill(40);
    textAlign(LEFT);
    text(label, x, y - 15);

    stroke(0);
    line(x, y, x + w, y);

    float px = map(value, minV, maxV, x, x + w);
    fill(80);
    ellipse(px, y, 14, 14);

    fill(40);
    text(nf(value, 1, 2) + " " + unit, x + w + 15, y + 5);
  }

  void check() {
    float px = map(value, minV, maxV, x, x + w);
    if (dist(mouseX, mouseY, px, y) < 10) drag = true;
  }

  void update() {
    if (drag) {
      float nx = constrain(mouseX, x, x + w);
      value = map(nx, x, x + w, minV, maxV);
    }
  }

  void release() {
    drag = false;
  }
}

class Button {
  float x, y, w, h;
  String label;

  Button(float x, float y, float w, float h, String label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
  }

  void display() {
    fill(180);
    rect(x, y, w, h, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(label, x + w/2, y + h/2);
  }

  boolean over() {
    return mouseX > x && mouseX < x + w &&
           mouseY > y && mouseY < y + h;
  }
}
