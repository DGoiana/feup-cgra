import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";
import { MyTriangle } from "../common/MyTriangle.js";

const UPDATE_INTERVAL = 1 / 30
export class MyFlame extends CGFobject {
  constructor(scene,scale) {
    super(scene)

    this.triangle = new MyTriangle(scene)
    this.scale = scale

    this.smallerFireScale = 0.6
    
    this.lastUpdateTime = 0;
  }

  update(t) {
    if (t - this.lastUpdateTime >= UPDATE_INTERVAL) {
      this.triangle.update(t)
      this.lastUpdateTime = t;
    }
  }

  display() {
    this.scene.pushMatrix();
      this.scene.scale(this.scale, 2 * this.scale,this.scale)
      this.scene.rotate(- 3 * Math.PI / 4, 0, 0, 1);
      this.triangle.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
      this.scene.scale(this.scale * this.smallerFireScale, 2 * this.smallerFireScale * this.scale,this.scale * this.smallerFireScale)
      this.scene.translate(this.scale * .7,0,0)
      this.scene.rotate(- 3 * Math.PI / 4, 0, 0, 1);
      this.triangle.display();
    this.scene.popMatrix();
  }

}
