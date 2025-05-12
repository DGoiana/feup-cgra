import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyTriangle } from "../common/MyTriangle.js";

export class MyFire extends CGFobject {
  constructor(scene,scale) {
    super(scene)

    this.triangle = new MyTriangle(scene)
    this.scale = scale

    const [r,g,b] = [217, 37, 61]
    this.colorMaterial = new CGFappearance(this.scene);
    this.colorMaterial.setAmbient(r/255 * 0.5,g/255 * 0.5,b/255 * 0.5, 1);
    this.colorMaterial.setDiffuse(r/255 * 0.5,g/255 * 0.5,b/255 * 0.5, 1);
    this.colorMaterial.setDiffuse(r/255 * 0.5,g/255 * 0.5,b/255 * 0.5, 1);
    this.colorMaterial.setShininess(20.0);

    this.smallerFireScale = 0.6
  }

  display() {
    this.scene.pushMatrix();
    this.colorMaterial.apply();
    this.scene.scale(this.scale, 2 * this.scale,this.scale)
    this.scene.rotate(- 3 * Math.PI / 4, 0, 0, 1);
    this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.colorMaterial.apply();
    this.scene.scale(this.scale * this.smallerFireScale, 2 * this.smallerFireScale * this.scale,this.scale * this.smallerFireScale)
    this.scene.translate(this.scale * 0.15,0,0)
    this.scene.rotate(- 3 * Math.PI / 4, 0, 0, 1);
    this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.colorMaterial.apply();
    this.scene.scale(this.scale * this.smallerFireScale, 2 * this.smallerFireScale * this.scale,this.scale * this.smallerFireScale)
    this.scene.translate(-this.scale * 0.15,0,0)
    this.scene.rotate(- 3 * Math.PI / 4, 0, 0, 1);
    this.triangle.display();
    this.scene.popMatrix();
  }

}