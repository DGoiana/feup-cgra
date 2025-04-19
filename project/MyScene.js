import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./panorama/MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    // Applied Material
    this.planeMaterial = new CGFappearance(this);
    this.planeMaterial.setAmbient(0.5, 0.5, 0.5, 1);
    this.planeMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.planeMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.planeMaterial.setShininess(10.0);
    this.planeMaterial.loadTexture('images/default.png');
    this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.planeTexture = new CGFtexture(this,'images/grass.jpg');
    this.planeMaterial.setTexture(this.planeTexture);

    // Arguments
    const totalLength = 10;
    const numFloor = 5;
    const numWindow = 3;
    const windowTexture = 'images/window.jpg';
    const buildingColor = [255,255,255];

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.building = new MyBuilding(this,totalLength,numFloor,numWindow,windowTexture,buildingColor);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "images/sky.png"))

    this.grass = new CGFappearance(this);
    this.grass.setDiffuse(1, 1, 1, 1)
    this.grass.setTexture(new CGFtexture(this, "images/grass.jpg"))
  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      1,
      0.1,
      1000,
      vec3.fromValues(25, 50, 25),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    // this.axis.display();

    this.setDefaultAppearance();


    this.pushMatrix()

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.building.display();
    this.panorama.display()
    this.grass.apply()
    this.scale(500, 1, 500);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();


    this.popMatrix();

  }
}
