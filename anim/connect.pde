/*
 * Cursor controlled background
*/

int vertCount = 40;
float vertSize = 20;
float edgeSize = 2;
float moveFactor = 20f;
float maxDistance = 150f;
float speed = 0.5f;

float maxWidth;
float maxHeight;
float minWidth;
float minHeight;

float[] bg = new float[]{4, 29, 55};
float[] fg = new float[]{115, 140, 166};

Vertex[] vertices = new Vertex[vertCount];

void setup () {
  // Screen setup
  size(1920, 1080);
  
  minWidth = -width / moveFactor;
  minHeight = -height / moveFactor;
  maxWidth = width - minWidth;
  maxHeight = height - minHeight;
  // Vertex setup
  for (int i = 0; i < vertCount; i++) {
    vertices[i] = new Vertex();
  }
  
  strokeWeight(edgeSize);
}

void draw () {
  fill(bg[0], bg[1], bg[2], 100);
  rect(0, 0, width, height);
  for (int i = 0; i < vertCount; i++) {
    vertices[i].move();
    vertices[i].movespace();
    vertices[i].drawlines(i);
    vertices[i].draw();
  }
}

float dis(float x1, float y1, float x2, float y2) {
  return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
} 

class Vertex {
  float _x;
  float _y;
  float _dir;
  int _m = 1;
  
  public Vertex (float x, float y) {
    _x = x;
    _y = y;
    _dir = random(0, 360);
  }
  
  public Vertex () {
    _x = random(0, maxWidth);
    _y = random(0, maxHeight);
    _dir = random(0, 360);
  }
  
  public void move () {
    float _mdir = atan((mouseY - _y) / (mouseX - _x));
    
    _x += speed * cos(_dir);
    _y += speed * sin(_dir);
    
    _x += speed * cos(_mdir);
    _y += speed * sin(_mdir);
    
    _dir += _m * speed / 50f;
    
    if (random(0, 100) > 98) {
      _m *= -1;
    }
    
    while (_dir > 360) {
      _dir -= 360;
    }
    while (_dir < 0) {
      _dir += 360;
    }
    
    while (_x > maxWidth) {
      _x -= maxWidth;
    } 
    while (_x < minWidth) {
      _x += maxWidth;
    } 
    while (_y > maxHeight) {
      _y -= maxHeight;
    } 
    while (_y < minHeight) {
      _y += maxHeight;
    }
  }
  
  public void movespace () {
    float dx = mouseX - pmouseX;
    float dy = mouseY - pmouseY;
    
    _x -= dx/moveFactor;
    _y -= dy/moveFactor;
  }
  
  public void drawlines (int start) {
    for (int i = start; i < vertCount; i++) {
      float distance = dis(_x, _y, vertices[i]._x, vertices[i]._y);
      if (distance < maxDistance) {
        stroke(fg[0], fg[1], fg[2], 255 - (255 * distance / maxDistance));
        line(_x, _y, vertices[i]._x, vertices[i]._y);
      }
    }
  }
  
  public void draw () {
    float _mdis = dis(_x, _y, mouseX, mouseY);
    stroke(fg[0], fg[1], fg[2], 255 - _mdis * 255 / width);
    fill(fg[0], fg[1], fg[2], 255 - _mdis * 255 / 500);
    ellipse(_x, _y, vertSize, vertSize);
  }
}
