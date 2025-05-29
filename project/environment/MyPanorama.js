import { CGFappearance, CGFobject, CGFscene, CGFtexture } from "../../lib/CGF.js";
import { Sphere } from "../common/Sphere.js";

/**
* MyPanorama
* @constructor
 * @param {CGFscene} scene
 * @param {CGFtexture} texture
*/
export class MyPanorama extends CGFobject {
  constructor(scene) {
    super(scene)
    
    this.sphere = new Sphere(scene, 50, 50, 1000)
    this.appearance = null
  }

  initMaterials(textureManager) {
    const texture = textureManager.getTexture("images/sky.png");
    this.appearance = new CGFappearance(this.scene)
    this.appearance.setAmbient(0, 0, 0, 0)
    this.appearance.setDiffuse(0, 0, 0, 0)
    this.appearance.setSpecular(0, 0, 0, 0)
    this.appearance.setEmission(1, 1, 1, 1)
    this.appearance.setTexture(texture)
  }

  display() {
    this.appearance.apply()
      
    this.scene.pushMatrix()
      const cameraPos = this.scene.camera.position
      this.scene.translate(cameraPos[0], cameraPos[1], cameraPos[2])
      this.sphere.display()
    this.scene.popMatrix()
  }
}