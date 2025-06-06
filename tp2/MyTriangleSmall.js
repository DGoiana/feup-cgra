import { CGFobject } from "../lib/CGF.js";

/**
 * MySmallTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MySmallTriangle extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -1, 0, 0, //0
      1, 0, 0,  //1
      0, 1, 0,  //2
    ]

    //Counter-clockwise reference of vertices
    this.indices = [
      0, 1, 2,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}