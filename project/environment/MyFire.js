import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";
import { MyFlame } from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene, scale, fireAppearance) {
    super(scene)

    this.scale = scale
    this.flame = new MyFlame(this.scene,this.scale)
    this.rotatedFlame = new MyFlame(this.scene,this.scale)

    this.fireAppearance = fireAppearance
  }

  /**
   * Updates the flames position
   * @param {number} t - Time elapsed in milliseconds
   */
  update(t) {
    this.flame.update(t)
    this.rotatedFlame.update(t + 0.3)
  }

  /**
   * Displays the fire in the scene
   */
  display() {
    this.scene.pushMatrix()
      this.fireAppearance.apply()
      this.flame.display()
    this.scene.popMatrix()

    this.scene.pushMatrix()
      this.fireAppearance.apply()
      this.scene.rotate(Math.PI / 2,0,1,0)
      this.rotatedFlame.display()
    this.scene.popMatrix()
  }

}
