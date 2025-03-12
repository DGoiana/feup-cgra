import { CGFobject } from "../lib/CGF.js";

/**
 * MySmallTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyBigTriangle extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -2, 0, 0, // 0
      2, 0, 0,  // 1
      0, 2, 0,  // 2

      -2, 0, 0, // 0a
      2, 0, 0,  // 1a
      0, 2, 0,  // 2a
    ]

    //Counter-clockwise reference of vertices
    this.indices = [
      0, 1, 2,
      2, 1, 0
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1
    ]

    this.colors = [
      0,1,0,
      1,0,0,
      0,1,0
    ]

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}