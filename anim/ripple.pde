/**
  * Generation settings
  */

boolean gridPoints = false; // OR random
boolean topView = true; // OR side view
boolean randomColours = true; // OR white
float rate = -0.05; // Negative resonates outwards
int numPointsX = 1000;
int numPointsY = 10;
float zHeight = 20;
float maxZHeight = 20000; // Set super big for no max height
float distanceDilate = 40; // Determines max height too, inverse relationship, do not make 0
float spreadDilate = 10;
float whitespaceX = 400;
float whitespaceY = 400;
float antiSpike = 0.1; // Higher number reduces the huge spike in the centre, but makes all waves smaller
int alphaFade = 0; // Set to 255 to disable fading
int heightDilate = 5;
int fadeType = 1; // 0: Height-based, 1: Distance-based, 2: Random

void updatebool (int var, boolean val) {
  switch(var) {
    case 0:
      gridPoints = val;
      break;
    case 1:
      topView = val;
      break;
    case 2:
      randomColours = val;
      break;
  }
}

void updatefloat (int var, float val) {
}

void updateint (int var, int val) {
  
}

void setup () {
  begin();
}

void begin () {
  size(1080, 720, P3D);
  points = new Point[numPointsX * numPointsY];
  float maxDistance = distanceBetween(new float[]{(width-whitespaceX)/2,(height-whitespaceY)/2,0}, new float[]{whitespaceX/2, whitespaceY/2, 0});
  background(0);
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
  fill(255, 0, 255);
  stroke(255, 0, 255);
}

void draw () {
  //translate(width/2, height/2);
  translate(whitespaceX/2, whitespaceY/2);
  background(0);
  for (int j = 0; j < numPointsY; j++) {
    beginShape(POINTS);
    for (int i = 0; i < numPointsX; i++) {
      points[j*numPointsX + i].update();
      points[j*numPointsX + i].display();
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
  float x;
  float y;
  float z;
  float t;
  float d;
  float o;
  float a;
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
      print(a + ", ");
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
