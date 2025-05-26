import { CGFobject } from "../../lib/CGF.js";
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCilinder extends CGFobject {
  constructor(scene, slices, stacks, radius = 1, height = 1, withBase = false, withTopBase = false) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;
    this.height = height;
    this.withBase = withBase;
    this.withTopBase = withTopBase;
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
        this.vertices.push(this.radius * Math.cos(angle), this.radius * Math.sin(angle), j / this.stacks * this.height);
        this.vertices.push(this.radius * Math.cos(nextAngle), this.radius * Math.sin(nextAngle), j / this.stacks * this.height);

        this.normals.push(Math.cos(angle) , Math.sin(angle), 0);
        this.normals.push(Math.cos(nextAngle) , Math.sin(nextAngle) , 0);
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
    
    if(this.withBase) {
      this.vertices.push(0, 0, 0)
      this.normals.push(0, 0, -1);

      const wallVertexCount = this.vertices.length / 3;
      const bottomCenterIndex = wallVertexCount - 1;

      for(let i = 0; i < this.slices; i++) {
        const angle = i * alpha;
        this.vertices.push(this.radius * Math.cos(angle), this.radius * Math.sin(angle), 0);
        this.normals.push(0, 0, -1);
      }

      for (let i = 0; i < this.slices; i++) {
        const nextIndex = (i + 1) % this.slices;
        this.indices.push(
          bottomCenterIndex,
          bottomCenterIndex + 1 + nextIndex,
          bottomCenterIndex + 1 + i
        );
      }

      for (let i = 0; i < this.slices; i++) {
        const nextIndex = (i + 1) % this.slices;
        this.indices.push(
          bottomCenterIndex,
          bottomCenterIndex + 1 + i,
          bottomCenterIndex + 1 + nextIndex
        );
      }
    }

    if(this.withTopBase) {
      this.vertices.push(0, 0, this.height)
      this.normals.push(0, 0, 1);

      const wallVertexCount = this.vertices.length / 3;
      const topCenterIndex = wallVertexCount - 1;

      for(let i = 0; i < this.slices; i++) {
        const angle = i * alpha;
        this.vertices.push(this.radius * Math.cos(angle), this.radius * Math.sin(angle), this.height);
        this.normals.push(0, 0, 1);
      }

      for (let i = 0; i < this.slices; i++) {
        const nextIndex = (i + 1) % this.slices;
        this.indices.push(
          topCenterIndex,
          topCenterIndex + 1 + i,
          topCenterIndex + 1 + nextIndex
        );
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
