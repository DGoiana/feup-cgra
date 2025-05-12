import { MyDisk } from "../common/MyDisk.js";
import { CGFobject,CGFappearance,CGFtexture } from "../../lib/CGF.js";

export class MyWater extends CGFobject {
  constructor(scene, radius, slices) {
    super(scene);
    this.disk = new MyDisk(scene, radius, slices);

    this.waterAppearance = new CGFappearance(scene);

    this.waterTexture = new CGFtexture(scene, "images/water.jpg");
    this.waterAppearance.setTexture(this.waterTexture);
    this.waterAppearance.setTextureWrap('REPEAT', 'REPEAT');
  }

  display() {
    const angle = -90 * (Math.PI / 180)

    this.scene.pushMatrix();
    this.waterAppearance.apply()
    this.scene.translate(0, .05, 0)
    this.scene.rotate(angle, 1, 0, 0)
    this.disk.display();
    this.scene.popMatrix();
  }
}