/**
  * Generation settings
  */

boolean gridPoints = true;
boolean topView = true;
boolean randomColours = false;
float rate = -0.05; // Negative resonates outwards
int numPointsX = 1000;
int numPointsY = 20;
float zHeight = 20;
float maxZHeight = 20000; // Set super big for no max height
float distanceDilate = 80; // Determines max height too, inverse relationship, do not make 0
float whitespaceX = 200;
float whitespaceY = 200;
float antiSpike = 0; // Higher number reduces the huge spike in the centre, but makes all waves smaller
int alphaFade = 0; // Set to 255 to disable fading

Point[] points = new Point[numPointsX * numPointsY];

void setup () {
  size(1920, 1080, P3D);
  background(0);
  if (gridPoints) {
    for (int j = 0; j < numPointsY; j++) {
      for (int i = 0; i < numPointsX; i++) {
        if (topView) {
          points[j*numPointsX + i] = new Point(i*(width-whitespaceX)/numPointsX, j*(height-whitespaceY)/numPointsY, 0);
        } else {
          points[j*numPointsX + i] = new Point(i*(width-whitespaceX)/numPointsX, height/2, j*(height-whitespaceY)/numPointsY);
        }
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
    t = distanceBetween(new float[]{x,y,z}, new float[]{(width-whitespaceX)/2,(height-whitespaceY)/2,0})/20;
    d = t/distanceDilate;
    o = topView ? zi : yi;
    if (randomColours) {
      c = new int[]{ int(random(255)),
            int(random(255)),
            int(random(255)) };
    } else {
      c = new int[] {255, 255, 255};
    }
    a = 0;
  }
  
  void update () {
    t += rate;
    if (!topView) {
      y = o + sin(t) * zHeight / (d*d + antiSpike);
      if (y > maxZHeight) y = maxZHeight;
      if (y < -maxZHeight) y = -maxZHeight;
    } else {
      z = o + sin(t) * zHeight / (d*d + antiSpike);
      if (z > maxZHeight) z = maxZHeight;
      if (z < -maxZHeight) z = -maxZHeight;
    }
    
    a = int(((z - o) * 255) / (zHeight/d*d));
    if (a < 0) a *= -1;
    a += alphaFade;
  }
  
  void display () {
    stroke(c[0], c[1], c[2], a);
    vertex(x, y, z);
  }
}
