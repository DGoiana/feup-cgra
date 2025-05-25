import { CGFobject } from "../../lib/CGF.js";

export class MyDisk extends CGFobject {
  constructor(scene, radius, slices) {
    super(scene);
    this.radius = radius;
    this.slices = slices;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    const angleIncrement = (2 * Math.PI) / this.slices;

    for (let i = 0; i <= this.slices; i++) {
      const angle = i * angleIncrement;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);

      this.texCoords.push(0.5 + x / (2 * this.radius), 0.5 - y / (2 * this.radius));

      if (i > 0) {
        this.indices.push(0, i, i + 1);
      }
    }
    this.indices.push(0, this.slices, 1);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}