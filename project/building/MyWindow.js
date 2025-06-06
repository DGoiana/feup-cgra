import {CGFappearance, CGFobject, CGFtexture} from '../../lib/CGF.js';
import { MyQuad } from '../common/MyQuad.js';

export class MyWindow extends CGFobject {
  constructor(scene) {
    super(scene);
    this.quad = new MyQuad(scene);

    this.windowMaterial = null;
    this.windowTexture = null;
  }

  initMaterials(textureManager, texturePath = 'images/window.png') {
    this.windowMaterial = new CGFappearance(this.scene);
    this.windowMaterial.setAmbient(0.5, 0.5, 0.5, 1);
    this.windowMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.windowMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.windowMaterial.setShininess(10.0);
    this.windowMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.windowTexture = textureManager.getTexture(texturePath);
    this.windowMaterial.setTexture(this.windowTexture);
  }

  updateTexture(textureManager, texturePath) {
    this.windowTexture = textureManager.getTexture(texturePath);
    if(this.windowMaterial) {
      this.windowMaterial.setTexture(this.windowTexture);
    }
  }

  display() {    
    this.scene.pushMatrix();
      this.windowMaterial.apply();
      this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
      this.quad.display();
    this.scene.popMatrix();
  }
}
