import { CGFobject } from "../lib/CGF.js";
/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCube extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      0.5, -0.5, -0.5, // 0
      -0.5, -0.5, 0.5, // 1
      0.5, -0.5, 0.5, // 2
      -0.5, -0.5, -0.5, // 3
      0.5, 0.5, -0.5, // 4
      -0.5, 0.5, 0.5, // 5
      0.5, 0.5, 0.5, // 6
      -0.5, 0.5, -0.5, // 7

      0.5, -0.5, -0.5, // 0a
      -0.5, -0.5, 0.5, // 1a
      0.5, -0.5, 0.5, // 2a
      -0.5, -0.5, -0.5, // 3a
      0.5, 0.5, -0.5, // 4a
      -0.5, 0.5, 0.5, // 5a
      0.5, 0.5, 0.5, // 6a
      -0.5, 0.5, -0.5, // 7a
      
      0.5, -0.5, -0.5, // 0b
      -0.5, -0.5, 0.5, // 1b
      0.5, -0.5, 0.5, // 2b
      -0.5, -0.5, -0.5, // 3b
      0.5, 0.5, -0.5, // 4b
      -0.5, 0.5, 0.5, // 5b
      0.5, 0.5, 0.5, // 6b
      -0.5, 0.5, -0.5, // 7b
    ];

    // Counter-clockwise reference of vertices
    this.indices = [
      2, 1, 0, 
      1, 3, 0,

      4, 5, 6, 
      4, 7, 5,

      2, 5, 1, 
      5, 2, 6,

      6, 2, 0, 
      6, 0, 4,

      0, 3, 7, 
      0, 7, 4,

      3, 1, 5, 
      3, 5, 7,
    ];

    this.normals = [
      0, -1, 0, // 0
      0, -1, 0, // 1
      0, -1, 0, // 2
      0, -1, 0, // 3
      0, 1, 0, // 4
      0, 1, 0, // 5
      0, 1, 0, // 6
      0, 1, 0, // 7

      1, 0, 0, // 0a
      -1, 0, 0, // 1a
      0, 0, 1, // 2a
      0, 0, -1, // 3a
      1, 0, 0, // 4a
      -1, 0, 0, // 5a
      0, 0, 1, // 6a
      0, 0, -1, // 7a

      0, 0, -1, // 0b
      0, 0, 1, // 1b
      1, 0, 0, // 2b
      -1, 0, 0, // 3b
      0, 0, -1, // 4b
      0, 0, 1, // 5b
      1, 0, 0, // 6b
      -1, 0, 0, // 7b
    ];

    //The defined indices (and corresponding vertices)
    //will be read in groups of three to draw triangles
    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}
