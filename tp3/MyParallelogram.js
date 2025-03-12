import { CGFobject } from "../lib/CGF.js";

/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      0, 0, 0, // 0 
      1, 1, 0, // 1
      2, 0, 0, // 2
      3, 1, 0, // 3

      0, 0, 0, // 0a
      1, 1, 0, // 1a
      2, 0, 0, // 2a
      3, 1, 0, // 3a
    ]

    //Counter-clockwise reference of vertices
    this.indices = [
      0, 2, 1,
      1, 2, 0,
      1, 2, 3,
      3, 2, 1,
      1, 2, 0,
      0, 2, 1,
      3, 2, 1,
      1, 2, 3
    ];

    this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1, 
			0, 0, 1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1
		]

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}