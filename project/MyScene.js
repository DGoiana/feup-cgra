import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./environment/MyPlane.js";
import { MyPanorama } from "./environment/MyPanorama.js";
import { MyForest } from "./forest/MyForest.js"
import { MyWater } from "./environment/MyWater.js";
import { MyBuilding } from './building/MyBuilding.js'
import { MyHeli } from "./helicopter/MyHeli.js";
import { MyFire } from "./environment/MyFire.js";

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

    this.gl.clearColor(0, 0, 0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.speedFactor = 0.1

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.appStartTime = Date.now();

    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.building = new MyBuilding(this, 10, 5, 3, 'images/window.png', [255,255,255]);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "images/sky.png"));
    this.forest = new MyForest(this, 10, 10);
    this.heli = new MyHeli(this);
    this.water = new MyWater(this, 20, 20)

    this.grassAppearance = new CGFappearance(this);
    this.grassAppearance.setDiffuse(1, 1, 1, 1);
    this.grassAppearance.setTexture(new CGFtexture(this, "images/grass.jpg"));
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
    
  }
  update(t) {
    let appStartTime = (t - this.appStartTime) / 1000.0
    
    if (this.heli) {
      this.heli.update(appStartTime);
    }
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

    this.lights[0].update()

    // Draw axis
    // this.axis.display();

    this.setDefaultAppearance();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    // this.building.display();
    this.panorama.display();

    const distance = 20

    this.pushMatrix()    
      this.translate(-2*distance,0,2*distance);
      this.water.display();
    this.popMatrix();

    this.pushMatrix();
      this.grassAppearance.apply();
      this.scale(500, 1, 500);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.plane.display();
    this.popMatrix();

    this.pushMatrix();
      this.translate(distance, 0, distance);
      this.forest.display();
    this.popMatrix();   
    
    this.pushMatrix();
      this.heli.display();
    this.popMatrix();

    this.pushMatrix();
      this.translate(0, 0, -20);
      this.building.display();
    this.popMatrix();
  }
}
