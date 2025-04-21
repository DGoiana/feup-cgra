import {CGFappearance, CGFobject, CGFtexture} from '../../lib/CGF.js';
import { MyQuad } from '../common/MyQuad.js';

export class MyWindow extends CGFobject {
  constructor(scene, windowTexture) {
    super(scene);
    this.texture = windowTexture;
    this.quad = new MyQuad(scene);


    this.windowMaterial = new CGFappearance(this.scene);
    this.windowMaterial.setAmbient(0.5, 0.5, 0.5, 1);
    this.windowMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.windowMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.windowMaterial.setShininess(10.0);
    this.windowMaterial.loadTexture('images/default.png');
    this.windowMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.windowTexture = new CGFtexture(this.scene,this.texture);
    this.windowMaterial.setTexture(this.windowTexture);
  }

  setDefaultAppearance() {
    this.defaultMaterial = new CGFappearance(this.scene);
    this.defaultMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.defaultMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.defaultMaterial.setShininess(10.0);
    this.defaultMaterial.apply();
  }

  display() {
    this.scene.pushMatrix();
    this.windowMaterial.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();
    this.setDefaultAppearance();
  }
}