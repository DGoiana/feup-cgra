import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";
import { MyFlame } from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene,scale) {
    super(scene)

    this.scale = scale
    this.flame = new MyFlame(this.scene,this.scale)
    this.rotatedFlame = new MyFlame(this.scene,this.scale)

    this.fireAppearance = new CGFappearance(scene);

    this.fireTexture = new CGFtexture(scene, "images/fire.png");
    this.fireAppearance.setTexture(this.fireTexture);
    this.fireAppearance.setTextureWrap('REPEAT', 'REPEAT');
  }

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