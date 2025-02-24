import {CGFobject} from '../lib/CGF.js';
/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			  .5, -.5, -.5,  // 0
       -.5, -.5,  .5,  // 1
			  .5, -.5,  .5,	 // 2
       -.5, -.5, -.5,  // 3
			  .5,  .5, -.5,  // 4
       -.5,  .5,  .5,  // 5
			  .5,  .5,  .5,	 // 6
       -.5,  .5, -.5,  // 7

		];

		//Counter-clockwise reference of vertices
		this.indices = [
			2,1,0,
      1,3,0,

      4,5,6,
      4,7,5,

      2,5,1,
      5,2,6,

      6,2,0,
      6,0,4,

      0,3,7,
      0,7,4,

      3,1,5,
      3,5,7,
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}