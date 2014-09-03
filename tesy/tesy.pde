float framerate = 24; // our "sketch" will have a framerate of 24 frames per second.
 
   int ball_x;           // ball administration: x coordinate
   int ball_y;           // ball administration: y coordinate
   int ball_radius = 20; // ball administration: ball radius
 
   void setup() {
     size(200,200);        // set draw area size
     frameRate(framerate); // set animation framerate
     ball_x = width/2;     // set the initial ball coordinates
     ball_y = ball_radius; // set the initial ball coordinates
     stroke(#003300);      // set the default shape outline colour
     fill(#0000FF);        // set the default shape fill colour
   }
 
   void draw() {
     // compute the ball height for this frame
     float bounce_height = height/2 * abs(sin(PI*frameCount/framerate));
     // because the top of the screen is 0, and the bottom is "height",
     float ball_height = height - (bounce_height+ball_radius);
     // clear the drawing area
     background(#FFFFEE);
     // set the new ball y position
     ball_y = (int) (ball_height);
   // draw the ball
   ellipse(ball_x,ball_y,ball_radius,ball_radius);
}
