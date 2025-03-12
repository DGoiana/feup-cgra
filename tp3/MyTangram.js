import { CGFobject, CGFappearance } from "../lib/CGF.js";
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
export class MyTangram extends CGFobject {
  constructor(scene) {
    super(scene);
    this.diamond = new MyDiamond(scene);
    this.triangle = new MyTriangle(scene);
    this.parallelogram = new MyParallelogram(scene);
    this.smallTriangle = new MySmallTriangle(scene);
    this.bigTriangle = new MyBigTriangle(scene);

    this.initMaterials();
  }

  initMaterials() {
    this.diamondMaterial = new CGFappearance(this.scene);
    this.diamondMaterial.setAmbient(0, .2, 0, 1);
    this.diamondMaterial.setDiffuse(0, .1, 0, 1);
    this.diamondMaterial.setSpecular(0, .7, 0, 1);
    this.diamondMaterial.setShininess(10);

    this.redTriangleMaterial = new CGFappearance(this.scene);
    this.redTriangleMaterial.setAmbient(.2, 0, 0, 1);
    this.redTriangleMaterial.setDiffuse(.1, 0, 0, 1);
    this.redTriangleMaterial.setSpecular(.7, 0, 0, 1);
    this.redTriangleMaterial.setShininess(10);

    this.parallelogramMaterial = new CGFappearance(this.scene);
    this.parallelogramMaterial.setAmbient(.2, .2, 0, 1);
    this.parallelogramMaterial.setDiffuse(.1, .1, 0, 1);
    this.parallelogramMaterial.setSpecular(.7, .7, 0, 1);
    this.parallelogramMaterial.setShininess(10.0);

    // rgb(147,112,219)
    this.purpleTriangleMaterial = new CGFappearance(this.scene);
    this.purpleTriangleMaterial.setAmbient(147/255 * .2, 112/255 * .2, 219/255 * .2, 1);
    this.purpleTriangleMaterial.setDiffuse(147/255 * .1, 112/255 * .1, 219/255 * .1, 1);
    this.purpleTriangleMaterial.setSpecular(147/255 * .7, 112/255 * .7, 219/255 * .7, 1);
    this.purpleTriangleMaterial.setShininess(10.0);

    // rgb(238,130,238)
    this.pinkTriangleMaterial = new CGFappearance(this.scene);
    this.pinkTriangleMaterial.setAmbient(238/255 * .2, 130/255 * .2, 238/255 * .2, 1);
    this.pinkTriangleMaterial.setDiffuse(238/255 * .1, 130/255 * .1, 238/255 * .1, 1);
    this.pinkTriangleMaterial.setSpecular(238/255 * .7, 130/255 * .7, 238/255 * .7, 1);
    this.pinkTriangleMaterial.setShininess(10.0);

    this.blueTriangleMaterial = new CGFappearance(this.scene);
    this.blueTriangleMaterial.setAmbient(0, 0, .2, 1);
    this.blueTriangleMaterial.setDiffuse(0, 0, .1, 1);
    this.blueTriangleMaterial.setSpecular(0, 0, .7, 1);
    this.blueTriangleMaterial.setShininess(10.0);

    // rgb(255,165,0)
    this.orangeTriangleMaterial = new CGFappearance(this.scene);
    this.orangeTriangleMaterial.setAmbient(.2, 165/255 * .2, 0, 1);
    this.orangeTriangleMaterial.setDiffuse(.1, 165/255 * .1, 0, 1);
    this.orangeTriangleMaterial.setSpecular(.7, 165/255 * .7, 0, 1);
    this.orangeTriangleMaterial.setShininess(10.0);
  }

  display() {
    // Center Square
    this.scene.pushMatrix();
    this.scene.translate(-0.3, -0.5, 0);
    const squareRadians = 70 * (Math.PI / 180);
    this.scene.rotate(squareRadians, 0, 0, 1);
    this.scene.customMaterial.apply();  
    this.diamond.display();
    this.scene.popMatrix();

    // Lower Triangle
    this.scene.pushMatrix();
    this.scene.translate(0.33, -3, 0);
    this.blueTriangleMaterial.apply();
    this.bigTriangle.display();
    this.scene.popMatrix();

    // Rightmost Triangle
    this.scene.pushMatrix();
    const triangleRadians = 90 * (Math.PI / 180);
    this.scene.translate(2.5, -1.2, 0);
    this.scene.rotate(triangleRadians, 0, 0, 1);
    this.orangeTriangleMaterial.apply();
    this.bigTriangle.display();
    this.scene.popMatrix();

    // Right Upper Triangle
    this.scene.pushMatrix();
    const ruAngle = 135 * (Math.PI / 180);
    this.scene.translate(1.1, 0.8, 0);
    this.scene.rotate(ruAngle, 0, 0, 1);
    this.pinkTriangleMaterial.apply();
    this.triangle.display();
    this.scene.popMatrix();

    // Upmost Triangle
    this.scene.pushMatrix();
    const upAngle = 90 * (Math.PI / 180);
    this.scene.translate(1.1, 3.2, 0);
    this.scene.rotate(upAngle, 0, 0, 1);
    this.redTriangleMaterial.apply();
    this.smallTriangle.display();
    this.scene.popMatrix();

    // Weird Upper Triangle
    this.scene.pushMatrix();
    const weirdAngle = 145 * (Math.PI / 180);
    this.scene.translate(0.32, 2.4, 0);
    this.scene.rotate(weirdAngle, 0, 0, 1);
    this.purpleTriangleMaterial.apply();
    this.smallTriangle.display();
    this.scene.popMatrix();

    // Lower Parallelogram
    this.scene.pushMatrix();
    const parallelogramRotate = -180 * (Math.PI / 180);
    const parallelogramRotate2 = -45 * (Math.PI / 180);
    this.scene.translate(-1, -4.4, 0);
    this.scene.rotate(parallelogramRotate, 1, 0, 0);
    this.scene.rotate(parallelogramRotate2, 0, 0, 1);
    this.parallelogramMaterial.apply();
    this.parallelogram.display();
    this.scene.popMatrix();
  }

  

  enableNormalViz(){
    this.diamond.enableNormalViz()
    this.triangle.enableNormalViz()
    this.bigTriangle.enableNormalViz()
    this.smallTriangle.enableNormalViz()
    this.parallelogram.enableNormalViz()
  };

  disableNormalViz(){
      this.diamond.disableNormalViz()
      this.triangle.disableNormalViz()
      this.bigTriangle.disableNormalViz()
      this.smallTriangle.disableNormalViz()
      this.parallelogram.disableNormalViz()
  };
}
