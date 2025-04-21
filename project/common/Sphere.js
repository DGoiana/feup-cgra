import { CGFobject } from "../../lib/CGF.js"

/**
* MySphere
* @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} slices
 * @param {number} stacks
 * @param {number} radius
*/
export class Sphere extends CGFobject {
  constructor(scene, slices, stacks, radius) {
    super(scene)

    this.slices = slices
    this.stacks = stacks
    this.radius = radius

    this.initBuffers()
  }

  initBuffers() {
    this.vertices = []
    this.indices = []
    this.normals = []
    this.texCoords = []

    const stack = Math.PI / 2 / this.stacks
    const slice = Math.PI * 2 / this.slices
  
    for (let i = 0; i <= this.stacks * 2; i++) {
      const stackAngle = Math.PI / 2 - i * stack;
      
      const xy = Math.cos(stackAngle)
      const z = this.radius * Math.sin(stackAngle)

      for (let j = 0; j <= this.slices; j++) {
        const sliceAngle = j * slice
        const x = this.radius * xy * Math.cos(sliceAngle)
        const y = this.radius * xy * Math.sin(sliceAngle)

        this.vertices.push(x, z, y)
        this.normals.push(-x, -y, -x)
        this.texCoords.push(1 - j / this.slices, i / (this.stacks * 2))
      }

      for (let i = 0; i < this.stacks * 2; i++) {
        let vI = i * (this.slices + 1)
        let vII = vI + this.slices + 1
        
        for (let j = 0; j < this.slices; j++, vI++, vII++) {
          if (i != 0) {
            this.indices.push(vI, vII, vI + 1)
            this.indices.push(vI + 1, vII, vI)
          }
          if (i != (this.stacks * 2 - 1)) {
            this.indices.push(vI + 1, vII, vII + 1)
            this.indices.push(vII + 1, vII, vI + 1)
          }
        }
      }
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers()
  }
}
