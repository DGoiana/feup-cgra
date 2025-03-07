import {CGFobject} from '../lib/CGF.js';
/**
 * MyCube
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

	getNormalAlgorand(ang, alphaAng) {
		const sa = Math.sin(ang);
		const ca = Math.cos(ang);
		const saa = Math.sin(ang+alphaAng);
		const caa = Math.cos(ang+alphaAng);
		const saaa = Math.sin(Math.min(ang-alphaAng,2*Math.PI))
		const caaa = Math.cos(Math.max(ang-alphaAng,0))

/* 		const normal = [
			(caa+ca),
			-(sa+saa),
			0
		] */
		const normal = [
			(caaa+caa),
			-(saa+saaa),
			0
		]

		const nsize = Math.sqrt(
			normal[0]*normal[0]+
			normal[1]*normal[1]+
			normal[2]*normal[2]
		);
		normal[0]/=nsize;
		normal[1]/=nsize;
		normal[2]/=nsize;

		return normal
	}

	getNormal(ang, alphaAng) {
		const sa = Math.sin(ang);
		const ca = Math.cos(ang);
		const saa = Math.sin(ang+alphaAng);
		const caa = Math.cos(ang+alphaAng);
		const saaa = Math.sin(Math.min(ang-alphaAng,2*Math.PI))
		const caaa = Math.cos(Math.max(ang-alphaAng,0))

/* 		const normal = [
			caaa+ca,
			-(sa+saaa),
			0
		] */
		const normal = [
			caa+ca,
			-(sa+saa),
			0
		]

		const nsize = Math.sqrt(
			normal[0]*normal[0]+
			normal[1]*normal[1]+
			normal[2]*normal[2]
		);
		normal[0]/=nsize;
		normal[1]/=nsize;
		normal[2]/=nsize;

		return normal
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];

		var ang = 0;
		var alphaAng = 2*Math.PI/this.slices;

		for(var i = 0; i < this.slices; i++){
			this.vertices.push(Math.cos(ang), -Math.sin(ang),0);
			this.indices.push(i,this.slices,(i+1) % this.slices);
			this.indices.push((i+1) % this.slices,this.slices,i);


			//this.normals.push(Math.cos(ang),-Math.sin(ang),0);
			const normal = this.getNormal(ang,alphaAng).slice(0,3);
			this.normals.push(...normal);
			// this.normals.push(...normal1);
			ang+=alphaAng;
		}
		this.vertices.push(0,0,0);
		this.normals.push(0,0,-1);

/* 		ang = 0;
		for(var i = this.slices; i < 2*this.slices; i++){
			this.vertices.push(Math.cos(ang), -Math.sin(ang),1);
			this.indices.push(i+1,2*this.slices,(i+2) % (2*this.slices+1) );
			this.indices.push((i+2) % (2*this.slices+1), 2*this.slices,i+1);
			
			const normal = this.getNormal(ang,alphaAng);
			this.normals.push(...normal);
			ang+=alphaAng;
		}
		this.vertices.push(0,0,0);
		this.normals.push(0,0,1);

		for(let i = 0; i < this.slices; i++) {
			const a = i;
			const b1 = i == 0 ? 2 * this.slices : i+this.slices;
			const b2 = (i+1) % this.slices;
			const c = i+this.slices+1;

			this.indices.push(a, b1, c)
			this.indices.push(c, b2, a)
		} */

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
    updateBuffers(complexity){
        // this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12
				this.slices = complexity

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}