import { CGFobject } from "../lib/CGF.js";

/**
 * MySmallTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyBigTriangle extends CGFobject {
  constructor(scene, flag) {
    super(scene);
    this.flag = flag;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -2, 0, 0, // 0
      2, 0, 0,  // 1
      0, 2, 0,  // 2
    ]

    this.texCoords = this.flag == "orange" ? [
      0.5, 0.5,
      1, 1,
      1, 0
    ] : [
      0.5, 0.5,
      1, 0,
      0, 0
    ]

    //Counter-clockwise reference of vertices
    this.indices = [
      0, 1, 2
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
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