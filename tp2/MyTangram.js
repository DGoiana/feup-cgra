import { CGFobject } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MySmallTriangle } from "./MyTriangleSmall.js";
import { MyBigTriangle } from "./MyBigTriangle.js";

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTrangam extends CGFobject {
  constructor(scene) {
    super(scene);
    // this.initBuffers();

    //Initialize scene objects
    this.diamond = new MyDiamond(scene);
    this.triangle = new MyTriangle(scene);
    this.parallelogram = new MyParallelogram(scene);
    this.smallTriangle = new MySmallTriangle(scene);
    this.bigTriangle = new MyBigTriangle(scene);
  }

  display() {
    // Center Square
    this.scene.pushMatrix()
    this.scene.translate(-0.3,-0.5,0)
    const squareRadians = 70 * (Math.PI/180)
    this.scene.rotate(squareRadians,0,0,1)
    this.scene.setDiffuse(1, 0, 0)
    this.diamond.display();
    this.scene.popMatrix()

    // Lower Triangle
    this.scene.pushMatrix()
    this.scene.translate(0.33,-3,0)
    this.scene.setDiffuse(0, 0, 1)
    this.bigTriangle.display();
    this.scene.popMatrix()

    // Rightmost Triangle
    this.scene.pushMatrix()
    const triangleRadians = 90 * (Math.PI / 180)
    this.scene.translate(2.5,-1.2,0)
    this.scene.rotate(triangleRadians,0,0,1)
    this.scene.setDiffuse(0, 1, 1)
    this.bigTriangle.display();
    this.scene.popMatrix()

    // Right Upper Triangle
    this.scene.pushMatrix()
    const ruAngle = 135 * (Math.PI / 180)
    this.scene.translate(1.1,0.8,0)
    this.scene.rotate(ruAngle,0,0,1)
    this.scene.setDiffuse(1, 1, 1)
    this.triangle.display();
    this.scene.popMatrix()

    // Upmost Triangle
    this.scene.pushMatrix()
    const upAngle = 90 * (Math.PI / 180)
    this.scene.translate(1.1,3.2,0)
    this.scene.rotate(upAngle,0,0,1)
    this.scene.setDiffuse(.5, 0.3, .5)
    this.smallTriangle.display();
    this.scene.popMatrix()

    // Weird Upper Triangle
    this.scene.pushMatrix()
    const weirdAngle = 145 * (Math.PI / 180)
    this.scene.translate(0.32,2.4,0)
    this.scene.rotate(weirdAngle,0,0,1)
    this.scene.setDiffuse(.3, 0.8, .2)
    this.smallTriangle.display();
    this.scene.popMatrix()

    // Lower Parallelogram
    this.scene.pushMatrix()
    const parallelogramRotate = -180 * (Math.PI / 180)
    const parallelogramRotate2 = -45 * (Math.PI / 180)
    this.scene.translate(-1,-4.4,0)
    this.scene.rotate(parallelogramRotate,1,0,0)
    this.scene.rotate(parallelogramRotate2,0,0,1)
    this.scene.setDiffuse(.9, 0.2, .1)
    this.parallelogram.display();
    this.scene.popMatrix()
  }
}