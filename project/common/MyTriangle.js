import { CGFobject } from "../../lib/CGF.js";

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangle extends CGFobject {
  constructor(scene) {
    super(scene);

    this.originalVertices = [
      -1, -1, 0, //0
      1, -1, 0, //1
      -1, 1, 0, //2
    ]

    this.oscillation = 0.1
    this.oscillationFrequency = 5

    this.vertexOffsets = []

    for (let i = 0; i < 3; i++) {
      this.vertexOffsets.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        phase: Math.random() * Math.PI * 2
      })
    }

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [...this.originalVertices]

    this.indices = [
      0, 1, 2,
      2, 1, 0,
    ];

    this.normals = [
      0,0,1,
      0,0,1,
      0,0,1,
    ]

    this.texCoords = [
     	0, 0,
     	1, 0,
     	0, 0.5,

     	0, 0,
     	1, 0,
     	0, 0.5,
	]

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	update(t) {
  	  for(let i = 0; i < 3; i++) {
        const vertexIndex = i * 3;
        const offset = this.vertexOffsets[i];

        const oscillationX = Math.sin(t * this.oscillationFrequency + offset.phase) * Math.sin(this.oscillation) * offset.x;
        const oscillationY = Math.sin(t * this.oscillationFrequency * 1.3 + offset.phase + 1) * Math.sin(this.oscillation) * offset.y;

        this.vertices[vertexIndex] = this.originalVertices[vertexIndex] + oscillationX;
        this.vertices[vertexIndex + 1] = this.originalVertices[vertexIndex + 1] + oscillationY;
        this.vertices[vertexIndex + 2] = this.originalVertices[vertexIndex + 2];
      }

      this.initGLBuffers()
    }
}
