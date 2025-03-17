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
    this.purpleSmallTriangle = new MySmallTriangle(scene, "purple");
    this.redSmallTriangle = new MySmallTriangle(scene, "red");
    this.orangeBigTriangle = new MyBigTriangle(scene, "orange");
    this.blueBigTriangle = new MyBigTriangle(scene, "blue");

    this.initMaterials();
  }

  initMaterials() {
    // creating texture from tangram.png
    this.tangramTextureMaterial = new CGFappearance(this.scene);
    this.tangramTextureMaterial.loadTexture('images/tangram.png');
    this.tangramTextureMaterial.setTextureWrap('REPEAT', 'REPEAT');
  }

  display() {
    // Center Square
    this.scene.pushMatrix();
    this.scene.translate(-0.3, -0.5, 0);
    const squareRadians = 70 * (Math.PI / 180);
    this.scene.rotate(squareRadians, 0, 0, 1);
    this.tangramTextureMaterial.apply();  
    this.diamond.display();
    this.scene.popMatrix();

    // Lower Triangle
    this.scene.pushMatrix();
    this.scene.translate(0.33, -3, 0);
    this.tangramTextureMaterial.apply();
    this.orangeBigTriangle.display();
    this.scene.popMatrix();

    // Rightmost Triangle
    this.scene.pushMatrix();
    const triangleRadians = 90 * (Math.PI / 180);
    this.scene.translate(2.5, -1.2, 0);
    this.scene.rotate(triangleRadians, 0, 0, 1);
    this.tangramTextureMaterial.apply();
    this.blueBigTriangle.display();
    this.scene.popMatrix();

    // Right Upper Triangle
    this.scene.pushMatrix();
    const ruAngle = 135 * (Math.PI / 180);
    this.scene.translate(1.1, 0.8, 0);
    this.scene.rotate(ruAngle, 0, 0, 1);
    this.tangramTextureMaterial.apply();
    this.triangle.display();
    this.scene.popMatrix();

    // Upmost Triangle
    this.scene.pushMatrix();
    const upAngle = 90 * (Math.PI / 180);
    this.scene.translate(1.1, 3.2, 0);
    this.scene.rotate(upAngle, 0, 0, 1);
    this.tangramTextureMaterial.apply();
    this.redSmallTriangle.display();
    this.scene.popMatrix();

    // Weird Upper Triangle
    this.scene.pushMatrix();
    const weirdAngle = 145 * (Math.PI / 180);
    this.scene.translate(0.32, 2.4, 0);
    this.scene.rotate(weirdAngle, 0, 0, 1);
    this.tangramTextureMaterial.apply();
    this.purpleSmallTriangle.display();
    this.scene.popMatrix();

    // Lower Parallelogram
    this.scene.pushMatrix();
    this.scene.translate(0, -5.1, 0);
    const parallelogramRotate = (-315 * Math.PI / 180);
    
    this.scene.rotate(parallelogramRotate, 0, 0, 1);
    this.tangramTextureMaterial.apply();
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
