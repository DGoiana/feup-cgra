import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./environment/MyPlane.js";
import { MyPanorama } from "./environment/MyPanorama.js";
import { MyForest } from "./forest/MyForest.js"
import { MyBuilding } from './building/MyBuilding.js'
import { MyHeli } from "./helicopter/MyHeli.js";

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
    
    console.log(this.gl);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.speedFactor = 0.1

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.appStartTime = Date.now();    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.building = new MyBuilding(this, 10, 5, 3, 'images/window.png', [255,255,255]);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "images/sky.png"));      
    this.forest = new MyForest(this, 20, 20);
    this.heli = new MyHeli(this);

    this.shader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.shader.setUniformsValues({ timeFactor: 0, uWaterSampler: 1, uTerrainSampler: 2 });

    this.planeMap = new CGFtexture(this, "textures/planeMap.png");
    this.waterTex = new CGFtexture(this, "textures/waterTex.jpg");
    this.terrainTex = new CGFtexture(this, "images/grass.jpg");

    this.grassAppearance = new CGFappearance(this);
    this.grassAppearance.setDiffuse(1, 1, 1, 1);
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
      10000,
      vec3.fromValues(1, 80, 1),
      vec3.fromValues(0, 0, 0)
    );
  }

  update(t) {
    let appStartTime = (t - this.appStartTime) / 1000.0

    this.shader.setUniformsValues({timeFactor: appStartTime % 100})

    if (this.heli) {
      this.heli.update(appStartTime);
    }    
    
    if (this.forest) {
      // this.forest.update(appStartTime)
    }

    if (this.building) {
      this.building.update(appStartTime);
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
    this.axis.display();
    // this.setDefaultAppearance();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.panorama.display();    
    const distance = 20

    this.pushMatrix();
      this.setActiveShader(this.shader);
        this.planeMap.bind(0);
        this.waterTex.bind(1);
        this.terrainTex.bind(2);
        this.scale(400, 1, 400);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.plane.display();    
      this.setActiveShader(this.defaultShader);
    this.popMatrix();

    this.pushMatrix();
      this.forest.display();
    this.popMatrix();

    this.pushMatrix();
      this.heli.display();
    this.popMatrix();

    this.pushMatrix();
      this.translate(-110, 0, -40);
      this.building.display();
    this.popMatrix();
  }
}
