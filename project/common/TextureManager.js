import { CGFtexture } from '../../lib/CGF.js';

export class TextureManager {
  constructor(scene) {
    this.scene = scene;
    this.loadedTextures = new Map();
  }

  getTexture(texturePath) {
    if (this.loadedTextures.has(texturePath)) {
      return this.loadedTextures.get(texturePath);
    }

    const texture = new CGFtexture(this.scene, texturePath);
    this.loadedTextures.set(texturePath, texture);
    
    return texture;
  }
}
