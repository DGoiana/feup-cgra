import { MyQuad } from "./MyQuad.js";
import {CGFobject, CGFtexture} from '../lib/CGF.js';

export class MyUnitCube extends CGFobject {
  constructor(scene, top, side, bottom, quadMaterial) {
    super(scene);
    // this.initBuffers();

    //Initialize scene objects
    this.quad = new MyQuad(scene);
    this.topTex = new CGFtexture(scene, top);
    this.rightTex = new CGFtexture(scene, side);
    this.leftTex = new CGFtexture(scene, side);
    this.backTex = new CGFtexture(scene, side);
    this.frontTex = new CGFtexture(scene, side);
    this.bottomTex = new CGFtexture(scene, bottom);
    this.quadMaterial = quadMaterial
  }
  display() {
    this.quadMaterial.setTexture(this.backTex);
    this.quadMaterial.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display()

    this.quadMaterial.setTexture(this.frontTex);
    this.quadMaterial.apply();
    this.scene.pushMatrix()
    this.scene.translate(0,0,1);
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.quadMaterial.setTexture(this.leftTex);
    this.quadMaterial.apply();
    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,0,1,0)
    this.scene.translate(.5,0,.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.quadMaterial.setTexture(this.topTex);
    this.quadMaterial.apply();
    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,1,0,0)
    this.scene.translate(0,-.5,.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.quadMaterial.setTexture(this.rightTex);
    this.quadMaterial.apply();
    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,0,1,0)
    this.scene.translate(0.5,0,-0.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.quadMaterial.setTexture(this.bottomTex);
    this.quadMaterial.apply();
    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,1,0,0)
    this.scene.translate(0, -0.5, -.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()
  }
}