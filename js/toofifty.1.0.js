// CONSTANTS
var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight,
      ASPECT = WIDTH / HEIGHT,
      MOVESPEED = 100,
      LOOKSPEED = 0.075,
      POINTSX = 64,
      POINTSY = 64,
      BLUR_TIME = 0.2,
      BLUR_MAX = 1.0 / 512.0,
	  WAVE_HEIGHT = 40,
	  BOB_HEIGHT = 20,
      MAXDIST = 100;
// GLOBALS
var t = THREE, 
      scene, cam, renderer, 
      controls, clock, container, 
      wireframe, solidPlane, node, info, 
      composer, hblur, vblur, hitPlane,
      projector, content, selected, rgbShader,
      time = 0,
      mouse = { x: 0, y: 0 },
      locked = false,
      blurred = false,
      blurring = false,
      currentBlur = 0,
      overHTML = false,
      nodes = [],
      lockedpos = { x: 0, y: 0 },
      mouse3dpos = { x: 0, y: 0, z: 0 },
      bounds = { x: -281, z: 1, mx: 7, mz: 335 },
      shownSlow = false, isShowingSlow = false,
      popup, pbox = { w: 400, h: 175 };

var frameCount = 0,
      averageFPS = 0,
      thresholdFPS = 25;

function createNodes () {

      // nodes[n] = new Node( x, y, nodeTitle, aoe, nodeSize, color, htmlTitle, imgURL, htmlText, htmlwidth, htmlheight )

      nodes[ 0 ] = new Node( 50, 80, "_experiments", 800, 15, 0xFFFFFF, "experiments", "experiments.png", 
            'To the left of this node lay my entire portfolio of creations in programming. So far.', 400, 260 );

      nodes[ 1 ] = new Node( 200, 250, "_about", 200, 15, 0xFFFFFF, "about", "toofifty_large.png",
            'My name is Alex Matheson, and I\'m a student from Victoria, Australia that is obsessed with computers and programming. Recently enrolled in RMIT University, I\'m studying Software Engineering and still making apps, websites and scripts in my spare time.</p> \
            <p>You can find my portfolio of work to the left, all created through my skills in the following:</p> \
            <ul> \
                  <li>Extensive knowledge of application development languages <a href="http://en.wikipedia.org/wiki/Python_(programming_language)" target="_blank">Python</a>, <a href="http://en.wikipedia.org/wiki/Java_(programming_language)">Java</a>, <a href="http://en.wikipedia.org/wiki/C_Sharp_(programming_language)">C#</a>, ' + wikiLink("JavaScript") + ' and ' + wikiLink("Lua", "_(programming_language)") + '.</li> \
                  <li>Skills in web development; ' + wikiLink("HTML5") + ', ' + wikiLink("CSS3") + ', and ' + wikiLink("PHP") + '.</li> \
                  <img src="img/htmlcss.png" alt="HTML5; CSS3" style="float: right; border: 4px solid transparent" height=74 width=124> \
                  <li>Skills in ' + wikiLink("Git", "_(software)") + ' and it\'s usage.</li> \
            <li>Image manipulation skills in tools such as: <a href="http://www.getpaint.net/">Paint.NET</a>, <a href="http://www.photoshop.com/">Adobe Photoshop</a>, <a href="http://www.adobe.com/au/products/flash.html">Adobe Flash</a> and <a href="http://www.adobe.com/au/products/illustrator.html">Adobe Illustrator</a>.</li> \
            </ul> \
            <p>Now\'s your chance to check my portfolio! Just pan left :)', 450, 510 );

      nodes[ 2 ] = new Node( 50, 250, "_contact", 150, 15, 0xFFFFFF, "contact", "contact.png",
            'poo', 400, 240 );

      nodes[ 3 ] = new Node( -25, 130, ".nodefield", 100, 5, 0xFFFFFF, "node field", "node_field.png",
            'Made with ' + wikiLink("JavaScript") + ' through the ' + wikiLink("Three.js") + ' framework, the interactive animation shown on this page is a presentable and fun alternative to a regular website. Though if it is a regular website you\'d like to see, <a href="less_fancy.html">click here</a> for my regular website.', 400, 290 );
    
    
}

function wikiLink (text, optional) {
    return "<a href=\"http://en.wikipedia.org/wiki/" + text + optional + "\">" + text + "</a>"
}

function init () {

      clock = new t.Clock();

      content = document.createElement( "content" );
      document.body.appendChild( content );

      // Setup debugging
      info = document.createElement( "debug" );
      info.style.position = "absolute";
      info.style.top = "0px";
      info.style.right = "0px";
      info.style.width = "35%";
      info.style.textAlign = "center";
      info.style.background = "#ffffff";
      info.style.color = "#000000";
      //info.innerHTML = "TODO: Fix bounds at different aspects &middot; Fix form &middot; Play around options";
      info.innerHTML = "NB: This is a work in progress website, expect features to be missing/unavailable.";
      document.body.appendChild( info );

      popup = document.createElement("popup");
      popup.style.width = "10px";
      popup.style.height = "10px";
      document.body.appendChild( popup );

      scene = new t.Scene();
      projector = new t.Projector();

      cam = new t.PerspectiveCamera( 30, ASPECT, 0.1, 10000 );
      cam.position.x = -243;
      cam.position.y = 600;
      cam.position.z = 182;
      cam.lookAt( new t.Vector3( 0, 0, 0 ) );

      controls = new t.OrbitControls( cam );
      controls.keyPanSpeed = 70;
      controls.minDistance = 200;
      controls.maxDistance = 500;

      renderer = new t.WebGLRenderer( { antialias: true } );
      renderer.setSize( WIDTH, HEIGHT );
      document.body.appendChild( renderer.domElement );

      composer = new t.EffectComposer( renderer );
      composer.addPass( new t.RenderPass( scene, cam ) );

      hblur = new t.ShaderPass( t.HorizontalBlurShader );
      vblur = new t.ShaderPass( t.VerticalBlurShader );
      vblur.renderToScreen = true;

      hblur.uniforms[ 'h' ].value = 0;
      vblur.uniforms[ 'v' ].value = 0;

      rgbShader = new t.ShaderPass( t.RGBShiftShader );
      rgbShader.uniforms[ 'amount' ].value = 0.0004;

      composer.addPass( rgbShader );
      composer.addPass( hblur );
      composer.addPass( vblur );

      window.addEventListener( 'resize', onResize, false );

      window.addEventListener( 'mousemove', onMouseMove, false );

      window.addEventListener( 'keypress', onKeyPress, false );

      window.addEventListener( 'mousedown', onMouseDown, false );

      renderer.setClearColor( 0x202020, 1 );

      setupScene();

}

function setupScene () {

      createNodes();

      // Floor
      wireframe = new t.Mesh(
            new t.PlaneGeometry( 1000, 1000, POINTSX, POINTSY ), 
            new t.MeshBasicMaterial( { color: 0x666666, wireframe: true} ) 
            );

      solidPlane = new t.Mesh(
            new t.PlaneGeometry( 1000, 1000, POINTSX, POINTSY ), 
            new t.MeshLambertMaterial( { color: 0x5691B4, wireframe: false, shading: t.FlatShading } ) 
            );

      hitPlane = new t.Mesh(
            new t.PlaneGeometry( 1000, 1000, 1, 1 ),
            new t.MeshLambertMaterial( { transparent: true, opacity: 0 } )
            );

      wireframe.rotation.x = -Math.PI / 2;
      wireframe.geometry.dynamic = true;
      solidPlane.rotation.x = -Math.PI / 2;
      solidPlane.geometry.dynamic = true;
      hitPlane.rotation.x = -Math.PI / 2;

      //scene.add( wireframe );
      scene.add( solidPlane );
      scene.add( hitPlane );
      
      // Lights
      var light = new t.DirectionalLight( 0x5691B4, 0.7 );
      light.position.set( 500, 1000, 500 );
      light.target = nodes[ 0 ].box;
      scene.add( light );


      var hemiLight = new THREE.HemisphereLight( 0x000000, 0xDC5024, 1 );
      /*
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      */
      hemiLight.position.set( 0, 500, 0 );
      scene.add( hemiLight )
}

function determineHeights () {
      var v = wireframe.geometry.vertices;
      var u = solidPlane.geometry.vertices;

      for ( i = 0; i < v.length; i++ ) {

            v[ i ].z = 0;

            for ( j = 0; j < nodes.length; j++ ) {

                  var d = dist( v[ i ].x, v[ i ].y, 0, nodes[ j ].box.position.x, -nodes[ j ].box.position.z, 0 );
                  var k = nodes[ j ].aoe;

                  if ( d < k ) {

                        var sinTerm = d / ( Math.PI * 4 ) - ( time / 2 );
                        var distMult = ( k - d ) / ( 2 * k );
                        v[ i ].z += WAVE_HEIGHT * Math.sin( sinTerm ) * distMult;

                  }
            }

            if ( true ) {
                  var d2 = dist( v[ i ].x, v[ i ].y, 0, mouse3dpos.x, mouse3dpos.y, mouse3dpos.z);
                  if ( d2 < 50 )
                  v[ i ].z -= 50 - d2;
            }

            u[ i ].z = v[ i ].z - 2;

      }

      solidPlane.geometry.computeFaceNormals();
      solidPlane.geometry.normalsNeedUpdate = true;
      solidPlane.geometry.verticesNeedUpdate = true;

      wireframe.geometry.verticesNeedUpdate = true;
}

function dist ( x1, y1, z1, x2, y2, z2 ) {
      return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) +
            ( y1 - y2 ) * ( y1 - y2 ) + ( z1 - z2 ) * ( z1 - z2) );
}

function updateNodes ( delta ) {
      for ( i = 0; i < nodes.length; i++ ) {

            if ( nodes[ i ].box != selected ) {

                  nodes[ i ].incrementTime( delta );
                  nodes[ i ].box.position.y = 80 + BOB_HEIGHT * Math.sin( ( nodes[ i ].time + 4 * i ) / 2 );
                  nodes[ i ].updateText();

            }

            nodes[i].box.rotation.y += delta;
      }
}

function boxIsIntersected () {

      for ( i = 0; i < nodes.length; i++ ) {
            if ( nodes[ i ].box == selected ) return true;
      }

      return false;
}

function updateBlur ( delta ) {

      if ( !blurred ) {

            currentBlur += delta * BLUR_MAX / BLUR_TIME;

            if ( currentBlur >= BLUR_MAX ) {

                  currentBlur = BLUR_MAX;
                  blurred = true;
                  blurring = false;

            }

      } else {

            currentBlur -= delta * BLUR_MAX / BLUR_TIME;

            if ( currentBlur <= 0 ) {

                  currentBlur = 0;
                  blurred = false;
                  blurring = false;

            }
      }

      hblur.uniforms[ 'h' ].value = currentBlur;
      vblur.uniforms[ 'v' ].value = currentBlur;

}

function findIntersect () {

      if ( locked ) return;

      var vector = new t.Vector3( mouse.x, mouse.y, 1 );

      projector.unprojectVector( vector, cam );

      var ray = new t.Raycaster( cam.position, vector.sub( cam.position ).normalize() );

      var intersects = ray.intersectObjects( scene.children );

      for (i = 0; i < intersects.length; i++) {

            if ( intersects[ i ].object == hitPlane ) {

                  mouse3dpos.x = intersects[ i ].point.x;
                  mouse3dpos.y = -intersects[ i ].point.z;
                  mouse3dpos.z = intersects[ i ].point.y;

            }

      }

      if ( intersects.length > 0 ) {

            if ( intersects[ 0 ].object != selected && intersects[ 0 ].object != wireframe ) {

                  if ( selected != null ) {

                        selected.material.color.setHex( selected.currentHex );
                        content.innerHTML = '';
                  }

                  selected = intersects[ 0 ].object;
                  selected.currentHex = selected.material.color.getHex();

            }

            if ( intersects[ 0 ].object == wireframe || intersects[ 0 ].object == hitPlane ) {

                  if ( selected != null ) {

                        selected.material.color.setHex( selected.currentHex );
                        content.innerHTML = '';

                  }

                  selected = null;
            }

      } else {

            if ( selected != null ) {

                  selected.material.color.setHex( selected.currentHex );
                  content.innerHTML = '';

            }
      }

      if ( selected != null ) {

            drawInfo();

      }
}

function onSlowAnimation () {

      overHTML = true;

      popup.className = "popup";
      popup.style.position = "absolute";
      popup.style.textAlign = "center";
      popup.style.left = (WIDTH / 2 - pbox.w / 2) + "px";
      popup.style.top = (HEIGHT / 2 - pbox.h / 2) + "px";
      popup.style.width = pbox.w + "px";
      popup.style.height = pbox.h + "px";
      popup.style.zIndex = "10";
      popup.style.webkitTransition = '0.5s';
      popup.style.MozTransition = '0.5s';
      popup.style.msTransition = '0.5s';
      popup.style.OTransition = '0.5s';
      popup.style.transition = '0.5s';

      setTimeout( function () {
            popup.innerHTML = '<h2>Oh no!</h2><hr> \
                  <p>I\'ve detected that your computer may not be handling my website so well. \
                  Click inside this box to go to a less intensive website, or click outside to stay here.</p>'
      }, 500 );

      shownSlow = true;
      isShowingSlow = true;
}

function animate () {

      requestAnimationFrame( animate );
      update();
      render();

}

function render () {

      composer.render();
      //renderer.render(scene, cam);

}

function update () {

      frameCount++;

      determineHeights();

      var delta = clock.getDelta();
      controls.update( delta );
      updateNodes( delta );
      time += delta;

      averageFPS = frameCount / clock.elapsedTime;

      if ( clock.elapsedTime >= 2 && clock.elapsedTime < 7 ) {
            controls.panLeft( delta * -72 * Math.sin( ( clock.elapsedTime - 2 ) * Math.PI / 5 ) );
      }

      if ( averageFPS < thresholdFPS && clock.elapsedTime > 10 && !shownSlow ) {
            onSlowAnimation();
      }

      // Manage blurring
      if ( ( boxIsIntersected() || overHTML ) && !blurred ) {

            blurring = true;

      }

      if ( ( !boxIsIntersected() && !overHTML ) && blurred ) {

            blurring = true;

      }

      if ( blurring ) {

            updateBlur( delta );

      }

      findIntersect();

}

function determineRedirect () {

      var yp = ( mouse.y * -HEIGHT / 2 + HEIGHT / 2);
      var xp = ( mouse.x * WIDTH / 2 + WIDTH / 2);

      // false stays on the page, true redirects

      if ( yp < ( HEIGHT / 2 - pbox.h / 2 ) ) {
            return false;
      }

      if ( yp > ( HEIGHT / 2 + pbox.h / 2 ) ) {
            return false;
      }

      if ( xp < ( WIDTH / 2 - pbox.w / 2 ) ) {
            return false;
      }

      if ( xp > ( WIDTH / 2 + pbox.w / 2 ) ) {
            return false;
      }

      return true;

}

function drawInfo () {

      for ( i = 0; i < nodes.length; i++ ) {

            if ( nodes[ i ].box != selected ) continue;

            var yp = ( mouse.y * -HEIGHT / 2 + HEIGHT / 2);
            var xp = ( mouse.x * WIDTH / 2 + WIDTH / 2);

            lockedpos.x = xp;
            lockedpos.y = yp;

            var w = nodes[ i ].width;
            var h;

            if ( yp > HEIGHT / 2 ) {

                  h = Math.min( nodes[ i ].height, Math.max( yp, HEIGHT - yp ) ) - 10;
                  yp -= h;

            } else {

                  h = Math.max( 0, nodes[ i ].height - ( HEIGHT - yp ) );
                  yp -= h;

            }

            if ( xp > WIDTH / 2 ) {

                  xp -= w;

            }

            var my = yp + "px";
            var mx = xp + "px";

            content.style.width = w + "px";
            content.style.height = h + "px";

            var c = content.style;

            c.position = "fixed";
            c.left = mx;
            c.top = my;

            content.innerHTML = nodes[ i ].getHTML();

      }
}

function cursorIsOutsideContent () {

      var yp = ( mouse.y * -HEIGHT / 2 + HEIGHT / 2);
      var xp = ( mouse.x * WIDTH / 2 + WIDTH / 2);

      for ( i = 0; i < nodes.length; i++ ) {

            if ( nodes[ i ].box != selected ) continue;

            if ( lockedpos.y > HEIGHT / 2 ) {

                  if ( yp < ( lockedpos.y - nodes[ i ].height ) || yp > lockedpos.y ) {
                        return true;
                  }

            } else {

                  if ( yp > ( lockedpos.y + nodes[ i ].height ) || yp < lockedpos.y ) {
                        return true;
                  }

            }

            if ( lockedpos.x > WIDTH / 2 ) {

                  if ( xp < ( lockedpos.x - nodes[ i ].width ) || xp > lockedpos.x ) {
                        return true;
                  }

            } else {

                  if ( xp > ( lockedpos.x + nodes[ i ].width ) || xp < lockedpos.x ) {
                        return true;
                  }

            }

      }

}

function onKeyPress ( event ) {

      if ( event.keyCode == 13 /* RETURN */ ) {
            locked = !locked;
      }

}

function onResize ( event ) {

      WIDTH = window.innerWidth;
      HEIGHT = window.innerHeight;
      ASPECT = WIDTH / HEIGHT;

      renderer.setSize( WIDTH, HEIGHT );
      composer.setSize( WIDTH, HEIGHT );

      cam.aspect = ASPECT;
      cam.updateProjectionMatrix();

}

function onMouseDown ( event ) {

      if ( event.button == 0 && selected != null && cursorIsOutsideContent()) {

            locked = !locked;

      } else if ( event.button == 0 && !locked && selected != null ) {

            locked = !locked;

      }

      if ( shownSlow && isShowingSlow ) {

            if ( determineRedirect() ) {

                  window.location = "less_fancy.html";

            } else {

                  popup.innerHTML = '';
                  overHTML = false;

                  popup.className -= "popup";
                  popup.style.webkitTransition = '0.5s';
                  popup.style.MozTransition = '0.5s';
                  popup.style.msTransition = '0.5s';
                  popup.style.OTransition = '0.5s';
                  popup.style.transition = '0.5s';

                  popup.style.width = "10px";
                  popup.style.height = "10px";

                  isShowingSlow = false;

            }
      }
}

function onMouseMove ( event ) {

      mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
      mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;

}

Node = function ( x, y, nodeTitle, aoe, nodeSize, color, htmlTitle, imgURL, htmlText, htmlwidth, htmlheight ) {

      this.box = null;
      this.text = null;
      this.x = x;
      this.y = y;
      this.nodeSize = nodeSize;
      this.aoe = aoe;
      this.width = htmlwidth;
      this.height = htmlheight;
      this.time = 0;

      this.createBox = function () {

            this.box = new t.Mesh(
                  new t.BoxGeometry( this.nodeSize, this.nodeSize, this.nodeSize ),
                  new t.MeshBasicMaterial( { color: this.color } ) );
            this.box.position.x = x;
            this.box.position.y = 50;
            this.box.position.z = y;
            scene.add( this.box );

      }

      this.createText = function () {

            this.text = new t.Mesh(
                  new t.TextGeometry( '   ' + nodeTitle, { size: this.nodeSize, height: this.nodeSize / 5.0, curveSegments: 2} ),
                  new t.MeshBasicMaterial( { color: this.color } ) );
            this.text.position.x = x;
            this.text.position.z = y;
            scene.add( this.text );

      }

      this.updateText = function () {

            this.text.position.y = this.box.position.y;
            this.text.rotation.x = cam.rotation.x;
            this.text.rotation.y = cam.rotation.y;
            this.text.rotation.z = cam.rotation.z + 0.1;

      }

      this.incrementTime = function ( delta ) {

            this.time += delta;

      }

      this.getHTML = function () {

            return '<div class="content">' +
                  '<h2>' + htmlTitle + '</h2>' +
                  '<hr>' + '<img src="img/' + imgURL + '" alt="' + htmlTitle + '" class="cimg">' +
                  '<p>' + htmlText + '</p></div>';

      }

      this.createBox();
      this.createText();

      this.updateText();
}

// Run the animation.
init();
animate();