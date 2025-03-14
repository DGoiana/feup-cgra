import { CGFobject } from "../lib/CGF.js";
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
  constructor(scene, slices, stacks) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = []
    this.indices = []
    this.normals = []

    let alpha = 2 * Math.PI / this.slices

    for (let i = 0; i < this.slices; i++) {
      const angle = i * alpha;
      const nextAngle = (i + 1) * alpha;

      for (let j = 0; j <= this.stacks; j++) {
        this.vertices.push(Math.cos(angle), Math.sin(angle), j / this.stacks);
        this.vertices.push(Math.cos(nextAngle), Math.sin(nextAngle), j / this.stacks);

        this.normals.push(Math.cos(angle + alpha / 2), Math.sin(angle + alpha / 2), 0);
        this.normals.push(Math.cos(angle + alpha / 2), Math.sin(angle + alpha / 2), 0);
      }
    }

    for (let i = 0; i < this.slices; i++) {
      for (let j = 0; j < this.stacks; j++) {
        const baseIndex = i * (this.stacks + 1) * 2;

        const a = baseIndex + j * 2;
        const b = baseIndex + j * 2 + 1;
        const c = baseIndex + (j + 1) * 2;
        const d = baseIndex + (j + 1) * 2 + 1;

        this.indices.push(a, b, c);
        this.indices.push(b, d, c);

        this.indices.push(c, b, a);
        this.indices.push(c, d, b); 
      }
    }

    //The defined indices (and corresponding vertices)
    //will be read in groups of three to draw triangles
    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }

  updateBuffers(){
    // reinitialize buffers
    this.initBuffers();
    this.initNormalVizBuffers();
}
}
