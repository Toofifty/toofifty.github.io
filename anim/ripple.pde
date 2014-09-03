/**
  * Generation settings
  */

boolean gridPoints = false; // OR random
boolean topView = true; // OR side view
boolean randomColours = true; // OR white
float rate = -0.05; // Negative resonates outwards
int numPointsX = 1000;
int numPointsY = 10;
float zHeight = 20; // General height multiplier
float maxZHeight = 20000; // Set super big for no max height
float distanceDilate = 40; // Determines max height too, inverse relationship, do not make 0
float spreadDilate = 10; // Amount that spread affects height
float whitespaceX = 400;
float whitespaceY = 400;
float antiSpike = 0.1; // Higher number reduces the huge spike in the centre, but makes all waves smaller
int alphaFade = 0; // Set to 255 to disable fading
int heightDilate = 5; // Exponent dilating height by distance
int fadeType = 1; // 0: Height-based, 1: Distance-based, 2: Random

Point[] points;
float maxDistance;
int nY;
int nX;
boolean uiActive = false;
Button uiToggle = new Button(5f, 5f, 100f, 25f, new int[]{40, 84, 108}, "Toggle UI", new int[]{255, 255, 255}, uiActive);
Button animRefresh = new Button(110f, 5f, 100f, 25f, new int[]{3, 36, 54}, "Refresh", new int[]{111, 144, 162}, false);
Button[] boolOptions = new Button[3];
Button[] floatLabels = new Button[8];
FloatSlider[] floatSliders = new FloatSlider[8];
Button[] intLabels = new Button[5];
IntSlider[] intSliders = new IntSlider[5];

void setup () {
  begin();
}

void drawui () {
  uiToggle.draw();
  if (!uiActive) return;
  animRefresh.draw();
  for (int i = 0; i < boolOptions.length; i++) {
    boolOptions[i].draw();
  }
  for (int i = 0; i < floatLabels.length; i++) {
    floatLabels[i].draw();
  }
  for (int i = 0; i < floatSliders.length; i++) {
    floatSliders[i].draw();
  }
  for (int i = 0; i < intLabels.length; i++) {
    intLabels[i].draw();
  }
  for (int i = 0; i < intSliders.length; i++) {
    intSliders[i].draw();
  }
}

void mouseClicked () {
  // UI Toggle
  if (uiToggle.inbounds(mouseX, mouseY)) {
    uiActive = !uiActive;
    uiToggle.setactive(uiActive);
  } 
  if (!uiActive) return;
  if (boolOptions[0].inbounds(mouseX, mouseY)) {
    gridPoints = !gridPoints;
    boolOptions[0].setactive(gridPoints);
  }
  else if (boolOptions[1].inbounds(mouseX, mouseY)) {
    topView = !topView;
    boolOptions[1].setactive(topView);
  }
  else if (boolOptions[2].inbounds(mouseX, mouseY)) {
    randomColours = !randomColours;
    boolOptions[2].setactive(randomColours);
  }
  else if (animRefresh.inbounds(mouseX, mouseY)) {
    begin();
  }  
}

void mouseDragged () {
  if (floatSliders[0].inbounds(mouseX, mouseY)) {
    floatSliders[0].update(mouseX - pmouseX);
    rate = floatSliders[0].getvalue();
  }
  else if (floatSliders[1].inbounds(mouseX, mouseY)) {
    floatSliders[1].update(mouseX - pmouseX);
    zHeight = floatSliders[1].getvalue();
  }
  else if (floatSliders[2].inbounds(mouseX, mouseY)) {
    floatSliders[2].update(mouseX - pmouseX);
    maxZHeight = floatSliders[2].getvalue();
  }
  else if (floatSliders[3].inbounds(mouseX, mouseY)) {
    floatSliders[3].update(mouseX - pmouseX);
    distanceDilate = floatSliders[3].getvalue();
  }
  else if (floatSliders[4].inbounds(mouseX, mouseY)) {
    floatSliders[4].update(mouseX - pmouseX);
    spreadDilate = floatSliders[4].getvalue();
  }
  else if (floatSliders[5].inbounds(mouseX, mouseY)) {
    floatSliders[5].update(mouseX - pmouseX);
    whitespaceX = floatSliders[5].getvalue();
  }
  else if (floatSliders[6].inbounds(mouseX, mouseY)) {
    floatSliders[6].update(mouseX - pmouseX);
    whitespaceY = floatSliders[6].getvalue();
  }
  else if (floatSliders[7].inbounds(mouseX, mouseY)) {
    floatSliders[7].update(mouseX - pmouseX);
    antiSpike = floatSliders[7].getvalue();
  }
  else if (intSliders[0].inbounds(mouseX, mouseY)) {
    intSliders[0].update(mouseX - pmouseX);
    numPointsX = intSliders[0].getintvalue();
  }
  else if (intSliders[1].inbounds(mouseX, mouseY)) {
    intSliders[1].update(mouseX - pmouseX);
    numPointsY = intSliders[1].getintvalue();
  }
  else if (intSliders[2].inbounds(mouseX, mouseY)) {
    intSliders[2].update(mouseX - pmouseX);
    alphaFade = intSliders[2].getintvalue();
  }
  else if (intSliders[3].inbounds(mouseX, mouseY)) {
    intSliders[3].update(mouseX - pmouseX);
    heightDilate = intSliders[3].getintvalue();
  }
  else if (intSliders[4].inbounds(mouseX, mouseY)) {
    intSliders[4].update(mouseX - pmouseX);
    fadeType = intSliders[4].getintvalue();
  }
}

void begin () {
  // Setup
  size(1080, 720, P3D);
  background(0);
  
  // Initial variable setting
  points = new Point[numPointsX * numPointsY];
  maxDistance = distanceBetween(new float[]{(width-whitespaceX)/2,(height-whitespaceY)/2,0}, new float[]{whitespaceX/2, whitespaceY/2, 0});
  
  // Create buttons  
  
  /// Booleans
  boolOptions[0] = new Button(5f, 35f, 205f, 25f, new int[]{3, 36, 54}, "Point grid", new int[]{111, 144, 162}, gridPoints);
  boolOptions[1] = new Button(5f, 65f, 205f, 25f, new int[]{3, 36, 54}, "Top-down view", new int[]{111, 144, 162}, topView);
  boolOptions[2] = new Button(5f, 95f, 205f, 25f, new int[]{3, 36, 54}, "Colours", new int[]{111, 144, 162}, randomColours);
  
  /// Float labels
  floatLabels[0] = new Button(5f, 125f, 100f, 25f, new int[]{3, 36, 54}, "Wave rate", new int[]{111, 144, 162}, false);
  floatLabels[1] = new Button(5f, 155f, 100f, 25f, new int[]{3, 36, 54}, "Height mult", new int[]{111, 144, 162}, false);
  floatLabels[2] = new Button(5f, 185f, 100f, 25f, new int[]{3, 36, 54}, "Max height", new int[]{111, 144, 162}, false);
  floatLabels[3] = new Button(5f, 215f, 100f, 25f, new int[]{3, 36, 54}, "Distance coeff.", new int[]{111, 144, 162}, false);
  floatLabels[4] = new Button(5f, 245f, 100f, 25f, new int[]{3, 36, 54}, "Spread coeff.", new int[]{111, 144, 162}, false);
  floatLabels[5] = new Button(5f, 275f, 100f, 25f, new int[]{3, 36, 54}, "X white space", new int[]{111, 144, 162}, false);
  floatLabels[6] = new Button(5f, 305f, 100f, 25f, new int[]{3, 36, 54}, "Y white space", new int[]{111, 144, 162}, false);
  floatLabels[7] = new Button(5f, 335f, 100f, 25f, new int[]{3, 36, 54}, "Anti-spike", new int[]{111, 144, 162}, false);
  
  /// Float sliders
  floatSliders[0] = new FloatSlider(110f, 125f, 100f, 25f, rate, -3f, 3f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[1] = new FloatSlider(110f, 155f, 100f, 25f, zHeight, -100f, 100f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[2] = new FloatSlider(110f, 185f, 100f, 25f, maxZHeight, 0f, 20000f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[3] = new FloatSlider(110f, 215f, 100f, 25f, distanceDilate, -100f, 100f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[4] = new FloatSlider(110f, 245f, 100f, 25f, spreadDilate, -100f, 100f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[5] = new FloatSlider(110f, 275f, 100f, 25f, whitespaceX, 0f, 1000f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[6] = new FloatSlider(110f, 305f, 100f, 25f, whitespaceY, 0f, 1000f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  floatSliders[7] = new FloatSlider(110f, 335f, 100f, 25f, antiSpike, 0f, 10f, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  
  /// Int labels
  intLabels[0] = new Button(5f, 365f, 100f, 25f, new int[]{3, 36, 54}, "# X points", new int[]{111, 144, 162}, false);
  intLabels[1] = new Button(5f, 395f, 100f, 25f, new int[]{3, 36, 54}, "# Y points", new int[]{111, 144, 162}, false);
  intLabels[2] = new Button(5f, 425f, 100f, 25f, new int[]{3, 36, 54}, "Alpha fade", new int[]{111, 144, 162}, false);
  intLabels[3] = new Button(5f, 455f, 100f, 25f, new int[]{3, 36, 54}, "Height exp.", new int[]{111, 144, 162}, false);
  intLabels[4] = new Button(5f, 485f, 100f, 25f, new int[]{3, 36, 54}, "Fade type", new int[]{111, 144, 162}, false);
  
  /// Int sliders
  intSliders[0] = new IntSlider(110f, 365f, 100f, 25f, numPointsX, 0, 2000, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  intSliders[1] = new IntSlider(110f, 395f, 100f, 25f, numPointsY, 0, 2000, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  intSliders[2] = new IntSlider(110f, 425f, 100f, 25f, alphaFade, 0, 255, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  intSliders[3] = new IntSlider(110f, 455f, 100f, 25f, heightDilate, 0, 8, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  intSliders[4] = new IntSlider(110f, 485f, 100f, 25f, fadeType, 0, 3, new int[]{3, 36, 54}, new int[]{111, 144, 162});
  
  // Create points
  if (gridPoints) {
    for (int j = 0; j < numPointsY; j++) {
      for (int i = 0; i < numPointsX; i++) {
        points[j*numPointsX + i] = new Point(i*(width-whitespaceX)/numPointsX, j*(height-whitespaceY)/numPointsY, 0);
      }
    }
  } else {
    for (int j = 0; j < numPointsY * numPointsX; j++) {
      points[j] = new Point(random(width-whitespaceX), random(height-whitespaceY), 0);
    }
  }
  nY = numPointsY;
  nX = numPointsX;
}

void draw () {
  background(0);
  drawui();
  translate(whitespaceX/2, whitespaceY/2);
  for (int j = 0; j < nY; j++) {
    beginShape(POINTS);
    for (int i = 0; i < nX; i++) {
      points[j*nX + i].update();
      points[j*nX + i].display();
    }
    endShape();
  }
}

float distanceBetween(float[] v1, float[] v2) {
  return sqrt((v1[0]-v2[0])*(v1[0]-v2[0]) + (v1[1]-v2[1])*(v1[1]-v2[1]) + (v1[2]-v2[2])*(v1[2]-v2[2]));
}

float pow(float num, int exp) {
  for (int i = 2; i < exp; i++) {
    num *= num;
  }
  return num;
}

class Point {
  float x, y, z;
  float t, d, o, a;
  int[] c;
  
  Point (float xi, float yi, float zi) {
    x = xi;
    y = yi;
    z = zi;
    t = distanceBetween(new float[]{x,y,z}, new float[]{(width-whitespaceX)/2,(height-whitespaceY)/2,0})/spreadDilate;
    d = t/distanceDilate;
    o = topView ? zi : yi;
    if (randomColours) {
      c = new int[]{ int(random(255)),
            int(random(255)),
            int(random(255)) };
    } else {
      c = new int[] {255, 255, 255};
    }
    if (fadeType == 1) {
      a = 255 - int(spreadDilate*t*255 / maxDistance);
    } else {
      a = 0;
    }
  }
  
  void update () {
    t += rate;
    if (!topView) {
      y = o + sin(t) * zHeight / (pow(d, heightDilate) + antiSpike);
      if (y > maxZHeight) y = maxZHeight;
      if (y < -maxZHeight) y = -maxZHeight;
    } else {
      z = o + sin(t) * zHeight / (pow(d, heightDilate) + antiSpike);
      if (z > maxZHeight) z = maxZHeight;
      if (z < -maxZHeight) z = -maxZHeight;
    }
    
    if (fadeType == 0) {
      // Height-based fade
      a = 255 - int(((z - o) * 255) / (zHeight/pow(d, heightDilate)));
      if (a < 0) a *= -1;
      a += alphaFade;
    }
  }
  
  void display () {
    stroke(c[0], c[1], c[2], a);
    vertex(x, y, z);
  }
}

class Button {
  
  float x, y, w, h;
  int[] c, tc;
  String t;
  boolean active = false;
  
  Button (float xi, float yi, float wi, float hi, int[] ci, String ti, int[] tci, boolean a) {
    x = xi;
    y = yi;
    w = wi;
    h = hi;
    c = ci;
    t = ti;
    tc = tci;
    active = a;
  }
  
  void setactive (boolean a) {
    active = a;
  }
  
  boolean inbounds (float mx, float my) {
    if (mx < x || my < y) return false;
    if (mx > x + w || my > y + h) return false;
    return true;
  }
  
  void draw() {
    fill(c[0], c[1], c[2], 100);
    textSize(14);
    if (active) {
      stroke(255, 100);
    } else {
      stroke(0, 100);
    }
    rect(x, y, w, h);
    fill(tc[0], tc[1], tc[2], 100);
    text(t, x+5, y+17);
  }
}

class IntSlider extends FloatSlider {
  
  IntSlider(float xi, float yi, float wi, float hi, int vi, int mini, int maxi, int[] ci, int[] c2i) {
    super(xi, yi, wi, hi, float(vi), float(mini), float(maxi), ci, c2i);
  }
  
  int getintvalue () {
    return int(value);
  }
  
}

class FloatSlider {
  
  float x, y, w, h;
  float cx;
  float value;
  float minValue, maxValue;
  int[] c, c2;
  
  FloatSlider(float xi, float yi, float wi, float hi, float vi, float mini, float maxi, int[] ci, int[] c2i) {
    x = xi;
    y = yi;
    w = wi;
    h = hi;
    c = ci;
    c2 = c2i;
    value = vi;
    minValue = mini;
    maxValue = maxi;
    cx = w/10 + (w * value / (maxValue-minValue)*4/5);
  }
  
  float getvalue () {
    return value;
  }
  
  void update (float dx) {
    cx += dx;
    value = (cx - w/10) * ((maxValue - minValue) * 4/5) / w;
    if (cx > 9*w/10 || value > maxValue) {
      value = maxValue;
      cx = 9*w/10;
    } else if (cx < 0 || value < minValue) {
      value = minValue;
      cx = 0;
    }
  }
  
  boolean inbounds(float mx, float my) {
    return distanceBetween(new float[]{mx, my, 0}, new float[]{x + w/10 + (w * value / (maxValue-minValue)*4/5), y + h/2, 0}) < h;
  }
  
  void draw() {
    fill(c[0], c[1], c[2], 100);
    rect(x + w/10, y + h/3, 4*w/5, h/3);
    fill(c2[0], c2[1], c2[2], 100);
    ellipse(x + cx + w/10, y + h/2, h/2, h/2);
    text(value, x+w+5, y+17);
  }
}
