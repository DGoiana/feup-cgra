import { CGFobject } from "../lib/CGF.js";

/**
 * MySmallTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MySmallTriangle extends CGFobject {
  constructor(scene, flag) {
    super(scene);
    this.flag = flag;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -1, 0, 0, // 0
      1, 0, 0,  // 1
      0, 1, 0,  // 2
    ]

    //Counter-clockwise reference of vertices
    this.indices = [
      0, 1, 2
    ];

    console.log(this.flag)

    this.texCoords = this.flag == "purple" ? [
      0, 0,
      0, 0.5,
      0.25, 0.25
    ] : [
      0.25, 0.75,
      0.75, 0.75,
      0.5, 0.5
    ]

    this.normals = [
			0, 0, 1, 
			0, 0, 1,
			0, 0, 1
		]

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}