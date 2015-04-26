"use strict";

// Custom constants
var MOVE_SPEED = 100;
var LOOK_SPEED = 0.075;
var POINTS = { x: 64, y: 64 };
var BLUR_TIME = 0.2;
var BLUR_AMOUNT = 1.0 / 512.0;
var WAVE_HEIGHT = 40;
var BOB_HEIGHT = 20;
var MAX_DISTANCE = 100;
var MOUSE_AOE = 50;

var COLOURS = {
    clear: 0x202020,
    wire: 0x666666,
    plane: 0x5691B4,
    light: 0x5691B4,
    hemi1: 0x000000,
    hemi2: 0xDC5024,
    node: 0xFFFFFF
};

// Constants
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT = WIDTH / HEIGHT;

// Global variables

// THREE.js
var clock, scene,
    camera, projector,
    renderer, composer;
    
// Scene pieces
var wireframe, plane,
    hitplane;
    
var horizontalBlur,
    verticalBlur;
    
var content, popup,
    pbox = {w: 400, h: 175};

var controls;
var nodes = [];
var frame, time = 0, avFPS;
var minFPS = 30;
var currentBlur = 0;

var m3d = {x: 0, y: 0, z: 0};
var mouse = {x: 0, y: 0};
var lockedPos = {x: 0, y: 0};
var bounds = {x: -281, z:1, mx: 7, mz: 335};

// States
var hasShownSlow = false,
    isShowingSlow = false;
var isBlurring = false, 
    isBlurred = false;
var isOverHTML = false;
var isLocked = false;

var selectedBox;

/* Utility functions */

function dist(x1, y1, z1, x2, y2, z2) {
    
    return Math.sqrt(
        (x1 - x2) * (x1 - x2) +
        (y1 - y2) * (y1 - y2) +
        (z1 - z2) * (z1 - z2)
    );
    
}

function wikiLink(text, optional) {
    
    return '<a href="http://en.wikipedia.org/wiki/' + text + optional + '">' + text + '</a>';
    
}

/* Init functions */

function initThreeJS() {
    
    /* Basic THREE.js components */
    
    scene = new THREE.Scene();
    projector = new THREE.Projector();
    
    camera = new THREE.PerspectiveCamera(30, ASPECT, 0.1, 10000);
    camera.position.set(-243, 600, 182);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    controls = new THREE.OrbitControls(camera);
    controls.keyPanSpeed = 70;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(COLOURS.clear);
    document.body.appendChild(renderer.domElement);
    
}

function initShaders() {
    
    /* Shader pass components */
    
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    
    horizontalBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    verticalBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    var rgbShader = new THREE.ShaderPass(THREE.RGBShiftShader);
    verticalBlur.renderToScreen = true;
    
    horizontalBlur.uniforms.h.value = 0;
    verticalBlur.uniforms.v.value = 0;
    
    rgbShader.uniforms.amount.value = 0.0004;
    
    composer.addPass(rgbShader);
    composer.addPass(horizontalBlur);
    composer.addPass(verticalBlur);
    
}

function initScene() {
    
    createNodes();
    
    /* Create meshes and lights */
    
    var geometry = new THREE.PlaneGeometry(1000, 1000, POINTS.x, POINTS.y),
        light = new THREE.DirectionalLight(COLOURS.light, 0.7),
        hemi = new THREE.HemisphereLight(COLOURS.hemi1, COLOURS.hemi2, 1);

    // Meshes
    
    wireframe = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial(
            {color: COLOURS.wire, wireframe: true}
        )
    );
    
    plane = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial(
            {color: COLOURS.plane, shading: THREE.FlatShading}
        )
    );
    
    hitplane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 1, 1),
        new THREE.MeshBasicMaterial(
            {transparent: true, opacity: 0}
        ) 
    );
    
    wireframe.rotation.x = -Math.PI / 2;
    wireframe.geometry.dynamic = true;
    
    plane.rotation.x = -Math.PI / 2;
    plane.geometry.dynamic = true;
    
    hitplane.rotation.x = -Math.PI / 2;
    
    scene.add(plane);
    scene.add(hitplane);
    
    // Lights
    
    light.position.set(500, 1000, 500);
    scene.add(light);
    
    hemi.position.set(0, 500, 0);
    scene.add(hemi);
    
}

function createNodes() {
    
          // nodes[n] = new Node( x, y, nodeTitle, aoe, nodeSize, htmlTitle, imgURL, htmlText, htmlwidth, htmlheight )

      nodes[ 0 ] = new Node( 50, 80, "_experiments", 800, 15, "experiments", "experiments.png", 
            'To the left of this node lay my entire portfolio of creations in programming. So far.', 400, 260 );    
}

/* Update functions */

function updatePlanes() {
    
    var v = wireframe.geometry.vertices,
        u = plane.geometry.vertices,
        i, j, d, k, x, dm;
        
    for (i = 0; i < v.length; i++) {
        
        v[i].z = 0;
        
        for (j = 0; j < nodes.length; j++) {
            
            d = dist(v[i].x, v[i].y, 0, nodes[j].box.position.x, -nodes[j].box.position.z, 0);
            k = nodes[j].aoe;
                
            if (d < k) {

                x = d / (Math.PI * 4) - (time / 2);
                dm = (k - d) / (2 * k);
                v[i].z += WAVE_HEIGHT * Math.sin(x) * dm;

            }
            
        }
        
        d = dist(v[i].x, v[i].y, 0, m3d.x, m3d.y, m3d.z);
        
        if (d < MOUSE_AOE) {
            
            v[i].z -= MOUSE_AOE - d;
            
        }
        
        u[i].z = v[i].z - 2;
        
    }
    
    plane.geometry.computeFaceNormals();
    plane.geometry.normalsNeedUpdate = true;
    plane.geometry.verticesNeedUpdate = true;
    
    wireframe.geometry.verticesNeedUpdate = true;
    
}

function updateNodes(delta) {
    
    var i;
    
    for (i = 0; i < nodes.length; i++) {
        
        if (nodes[i].box != selectedBox) {
            
            nodes[i].incrementTime(delta);
            nodes[i].box.position.y = 
                80 + BOB_HEIGHT * Math.sin((nodes[i].time + 4 * i) / 2);
            nodes[i].updateText();
            
        }
        
        nodes[i].box.rotation.y += delta;
        
    }
    
}

function updateBlur(delta) {
    
    if (!isBlurred) {
        
        // Increase blur amount
        
        currentBlur += delta * BLUR_AMOUNT / BLUR_TIME;
        
        if (currentBlur >= BLUR_AMOUNT) {
            
            currentBlur = BLUR_AMOUNT;
            isBlurred = true;
            isBlurring = false;
            
        }
        
    } else {
        
        // Decrease blur amount
        
        currentBlur -= delta * BLUR_AMOUNT / BLUR_TIME;
        
        if (currentBlur <= 0) {
            
            currentBlur = 0;
            isBlurred = false;
            isBlurring = false;
            
        }
        
    }
    
    horizontalBlur.uniforms.h.value = currentBlur;
    verticalBlur.uniforms.v.value = currentBlur;
    
}

/* HTML content functions */

function showSlowMessage() {
    
    isOverHTML = true;
    
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
        popup.innerHTML = '<h2>Oh no!</h2><hr>'
            + '<p>Your device seems to be struggling to show the animation.</p>'
            + '<p>Click inside this box to go to a less intensive page, or click outside to stay here.</p>';
    }, 500 );

    hasShownSlow = true;
    isShowingSlow = true;
    
}

function drawContent() {
    
    var i, xp, yp, w, h, my, mx;
    
    for (i = 0; i < nodes.length; i++) {
        
        xp = mouse.x * WIDTH / 2 + WIDTH / 2;
        yp = mouse.y * -HEIGHT / 2 + HEIGHT / 2;
        
        lockedPos.x = xp;
        lockedPos.y = yp;
        
        w = nodes[i].width;
        
        if (yp > HEIGHT / 2) {
            
            h = Math.min(nodes[i].height, Math.max(yp, HEIGHT - yp)) - 10;
            yp -= h;
            
        } else {
            
            h = Math.max(0, nodes[i].height - (HEIGHT - yp));
            yp -= h;
            
        }
        
        if (xp > WIDTH / 2) {
            
            xp -= w;
            
        }
        
        my = yp + "px";
        mx = xp + "px";
        
        content.style.width = w + "px";
        content.style.height = h + "px";
        
        content.style.position = "fixed";
        content.style.left = mx;
        content.style.right = my;
        
        content.innerHTML = nodes[i].getHTML();
        
    }
    
}

/* Cursor positioning functions */

function cursorIsInSlowMessage() {
    
    var xp = mouse.x * WIDTH / 2 + WIDTH / 2,
        yp = mouse.y * -HEIGHT / 2 + HEIGHT / 2;
        
    return xp < WIDTH / 2 + pbox.w / 2
        && xp > WIDTH / 2 - pbox.w / 2
        && yp < HEIGHT / 2 + pbox.h / 2
        && yp > HEIGHT / 2 - pbox.h / 2;
    
}

function cursorIsOutsideContent() {
    
    var xp = mouse.x * WIDTH / 2 + WIDTH / 2,
        yp = mouse.y * -HEIGHT / 2 + HEIGHT / 2,
        i;
        
    for (i = 0; i < nodes.length; i++) {
        
        if (nodes[i].box == selectedBox) {
            
            if (lockedPos.y > HEIGHT / 2) {
                
                if (yp < lockedPos.y - nodes[i].height || yp > lockedPos.y) {
                    
                    return true;
                    
                }
                
            } else {
                
                if (yp > lockedPos.y + nodes[i].height || yp < lockedPos.y) {
                    
                    return true;
                    
                }
                
            }
            
            if (lockedPos.x > WIDTH / 2) {
                
                if (xp < lockedPos.x - nodes[i].width || xp > lockedPos.x) {
                    
                    return true;
                    
                }
                
            } else {
                
                if (xp > lockedPos.x + nodes[i].width || xp < lockedPos.x) {
                    
                    return true;
                    
                }
                
            }
            
        }
        
    }
    
    return false;
    
}

/* Box intersection functions */

function boxIsIntersected() {
    
    return selectedBox === Node;
    
}

function findIntersect() {

    if (isLocked) {
        return;
    }

    var vector, ray, intersects, i;
    
    vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    projector.unprojectVector(vector, camera);
    ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    intersects = ray.intersectObjects(scene.children);

    for (i = 0; i < intersects.length; i++) {   

        if (intersects[i].object == hitplane) {

            m3d.x = intersects[i].point.x;
            m3d.y = -intersects[i].point.z;
            m3d.z = intersects[i].point.y;
            
            //console.log(m3d.x + " " + m3d.y + " " + m3d.z);

        }

    }

    if (intersects.length > 0) {

        if (intersects[0].object != selectedBox && intersects[0].object != wireframe) {

            if (selectedBox !== undefined) {

                selectedBox.material.color.setHex(selectedBox.currentHex);
                content.innerHTML = '';
            }

            selectedBox = intersects[0].object;
            selectedBox.currentHex = selectedBox.material.color.getHex();

        }

        if (intersects[0].object == wireframe || intersects[0].object == hitplane) {

            if (selectedBox !== undefined) {

                selectedBox.material.color.setHex(selectedBox.currentHex);
                content.innerHTML = '';

            }

            selectedBox = undefined;
        }

    } else {

        if (selectedBox !== undefined) {

            selectedBox.material.color.setHex(selectedBox.currentHex);
            content.innerHTML = '';

        }
        
    }

    if (selectedBox !== undefined) {

        drawContent();

    }

}

/* Event functions */

function onResize(event) {
    
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ASPECT = WIDTH / HEIGHT;
    
    renderer.setSize(WIDTH, HEIGHT);
    composer.setSize(WIDTH, HEIGHT);
    
    camera.aspect = ASPECT;
    camera.updateProjectionMatrix();
    
}

function onMouseMove(event) {
    
    mouse.x = event.clientX / WIDTH * 2 - 1;
    mouse.y = event.clientY / -HEIGHT * 2 + 1;
    
}

function onKeyPress(event) {
    
    if (event.keyCode == 13 /* RETURN */) {
        
        isLocked = !isLocked;
        
    }
    
}

function onMouseDown(event) {
    
    if (event.button == 0 && selectedBox !== undefined 
            && (!isLocked || cursorIsOutsideContent())) {
        
        isLocked = !isLocked;
        
    }
    
    if (hasShownSlow && isShowingSlow) {
        
        if (cursorIsInSlowMessage()) {
            
            window.location = "less_fancy.html";
            
        } else {
            
            // Disable slow message
            
            popup.innerHTML = '';
            isOverHTML = false;

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

/* Core functions */

function update() {
    
    frame++;
    
    updatePlanes();
    
    var delta = clock.getDelta();
    controls.update(delta);
    updateNodes(delta);
    time += delta;
    
    avFPS = frame / clock.elapsedTime;
    
    // Initial pan to the right
    if (clock.elapsedTime >= 2 && clock.elapsedTime < 7) {
        
        controls.panLeft(
            delta * -72 * Math.sin((clock.elapsedTime - 2) * Math.PI / 5)
        );
        
    }
    
    // Show slow message for struggling devices
    if (avFPS < minFPS && clock.elapsedTime > 10 && !hasShownSlow) {
        
        showSlowMessage();
        
    }
    
    
      // Manage blurring
    if (((boxIsIntersected() || isOverHTML) && !isBlurred)
            || ((!boxIsIntersected() && !isOverHTML) && isBlurred)) {

        isBlurring = true;

    }

    if (isBlurring) {

        updateBlur( delta );

    }
    
    findIntersect();
    
}

function init() {
    
    /* Event listeners */
    
    window.addEventListener('resize', onResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('keypress', onKeyPress, false);
    window.addEventListener('mousedown', onMouseDown, false);
    
    /* HTML elements */
    
    content = document.createElement("content");
    document.body.appendChild(content);
    
    popup = document.createElement("popup");
    popup.style.width = "10px";
    popup.style.height = "10px";
    document.body.appendChild(popup);
    
    /* Create scene */
    
    clock = new THREE.Clock();
    frame = 0;
    
    initThreeJS();    
    initShaders();
    initScene();
    
}

function anim() {
    
    requestAnimationFrame(anim);
    update();
    composer.render();
    
}

/* Node class */

Node = function (x, y, title, aoe, size, htmlTitle, 
        imgURL, htmlText, htmlWidth, htmlHeight) {
   
    this.box = null;
    this.text = null;
    this.x = x;
    this.y = y;
    this.size = size;
    this.aoe = aoe;
    this.width = htmlWidth;
    this.height = htmlHeight;
    this.time = 0;
    
    this.createBox = function () {
        
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(this.size, this.size, this.size),
            new THREE.MeshBasicMaterial({color: COLOURS.node})
        );
        
        this.box.position.set(x, 50, y);
        scene.add(this.box);
        
    };
    
    this.createText = function () {
        
        this.text = new THREE.Mesh(
            new THREE.TextGeometry('   ' + title, 
                {size: this.size, height: this.size / 5.0, curveSegments: 2}),
            new THREE.MeshBasicMaterial({color: COLOURS.node})
        );
        
        this.text.position.set(x, 0, y);
        scene.add(this.text);
        
    };
    
    this.updateText = function () {
        
        this.text.position.y = this.box.position.y;
        this.text.rotation.set(camera.rotation.x, 
            camera.rotation.y, camera.rotation.z + 0.1);
        
    };
    
    this.incrementTime = function (delta) {
        
        this.time += delta;
        
    };
    
    this.getHTML = function () {
        
        return '<div class="content">'
            + '<h2>' + htmlTitle + '</h2>'
            + '<hr>' + '<img src="img/' + imgURL + '" alt="' 
            + htmlTitle + '" class="cimg">'
            + '<p>' + htmlText + '</p></div>';
        
    };
    
    this.createBox();
    this.createText();
    
    this.updateText();
    
};

/* Execute */

init();
anim();