import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./environment/MyPlane.js";
import { MyPanorama } from "./environment/MyPanorama.js";
import { MyForest } from "./forest/MyForest.js"
import { MyBuilding } from './building/MyBuilding.js'
import { MyHeli } from "./helicopter/MyHeli.js";
import { TextureManager } from "./common/TextureManager.js";

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
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    
    this.textureManager = new TextureManager(this);

    this.speedFactor = 0.85;
    this.fireAnimation = false;
    this.treesOffset = 5
    this.forestRows = 20
    this.forestCols = 20

    this.buildingFloors = 5
    this.buildingWindows = 3

    this.cameraMode = 'Free View';
    this.lastCameraMode = 'Free View';

    this.enableTextures(true);    
    this.setUpdatePeriod(50);
    
    this.appStartTime = Date.now();    
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);    
    this.building = new MyBuilding(this, 10, this.buildingFloors, this.buildingWindows, [255,255,255]);
    this.panorama = new MyPanorama(this);      
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.treesOffset);
    this.heli = new MyHeli(this);
    
    this.shader = new CGFshader(this.gl, "shaders/plane.vert", "shaders/plane.frag");    
    this.shader.setUniformsValues({ timeFactor: 0, uWaterSampler: 1, uTerrainSampler: 2 });

    this.initMaterials();
  }

  initMaterials() {
    this.planeMap = this.textureManager.getTexture("textures/planeMap.png");
    this.waterTex = this.textureManager.getTexture("textures/waterTex2.jpg");
    this.terrainTex = this.textureManager.getTexture("images/grass.jpg");
    
    this.building.initMaterials(this.textureManager);
    this.panorama.initMaterials(this.textureManager);
    this.forest.initMaterials(this.textureManager);
    this.heli.initMaterials(this.textureManager);
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
    
    this.freeViewCamera = {
      position: vec3.fromValues(1, 80, 1),
      target: vec3.fromValues(0, 0, 0)
    };
  }  
  
  update(t) {
    let appStartTime = (t - this.appStartTime) / 1000.0

    this.shader.setUniformsValues({timeFactor: appStartTime % 100})

    if (this.heli) {
      this.heli.update(appStartTime, this.speedFactor);

      
      if (this.cameraMode !== this.lastCameraMode) {
        if (this.cameraMode === 'Free View') {
          this.camera.setPosition([
            this.freeViewCamera.position[0], 
            this.freeViewCamera.position[1], 
            this.freeViewCamera.position[2]
          ]);
          this.camera.setTarget([
            this.freeViewCamera.target[0], 
            this.freeViewCamera.target[1], 
            this.freeViewCamera.target[2]
          ]);
        }
        this.lastCameraMode = this.cameraMode;
      }
      
      if (this.cameraMode === 'Helicopter View') {
        const heliPos = this.heli.position;
        const cameraOffset = { x: 80, y: 35, z: 70 };
        
        this.camera.setPosition([
          heliPos.x + cameraOffset.x, 
          heliPos.y + cameraOffset.y, 
          heliPos.z + cameraOffset.z
        ]);
        this.camera.setTarget([heliPos.x, heliPos.y, heliPos.z]);
      }
    }    
      if (this.forest) {
      if (this.fireAnimation) this.forest.update(appStartTime)

      if(this.forest.offset != this.treesOffset || this.forest.rows != this.forestRows || this.forest.columns != this.forestCols) {
        this.forest.regenerateForest(this.treesOffset, this.forestRows, this.forestCols)
      }
    }    
    
    if (this.building) {
      this.building.update(appStartTime);
      
      if(this.building.numFloor != this.buildingFloors || 
         this.building.buildingFloor.numWindow != this.buildingWindows) {
        
        const idleHeli = this.heli && this.heli.state === 0;
        
        this.building.regenerateBuilding(this.buildingFloors, this.buildingWindows);    
        
        if (idleHeli) {
          const newHeight = this.building.getHeight();
          this.heli.position.y = newHeight;
        }
      }
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
    // this.setDefaultAppearance();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.panorama.display();    

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
