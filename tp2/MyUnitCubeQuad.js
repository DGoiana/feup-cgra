import { MyQuad } from "./MyQuad.js";
import {CGFobject} from '../lib/CGF.js';

export class MyUnitCube extends CGFobject {
  constructor(scene) {
    super(scene);
    // this.initBuffers();

    //Initialize scene objects
    this.quad = new MyQuad(scene);
  }
  display() {
    this.quad.display()

    this.scene.pushMatrix()
    this.scene.translate(0,1,0)
    this.quad.display();
    this.scene.popMatrix()

    const angle = 90 * (Math.PI / 180)
    this.scene.pushMatrix()
    this.scene.translate(0,.5,-.5)
    this.scene.rotate(angle ,1,0,0)
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.translate(0,.5,.5)
    this.scene.rotate(angle ,1,0,0)
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.translate(-.5,.5,0)
    this.scene.rotate(angle,0,0,1)
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.translate(0.5,.5,0)
    this.scene.rotate(angle ,0,0,1)
    this.quad.display();
    this.scene.popMatrix()
  }
}