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
		const saa = Math.sin(ang+alphaAng);
		const caa = Math.cos(ang+alphaAng);
		const saaa = Math.sin(Math.min(ang-alphaAng,ang))
		const caaa = Math.cos(Math.max(ang-alphaAng,ang))

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

	getNormalNext(ang, alphaAng) {
		const sa = Math.sin(ang);
		const ca = Math.cos(ang);
		const saa = Math.sin(ang+alphaAng);
		const caa = Math.cos(ang+alphaAng);

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

	getNormalPrevious(ang, alphaAng) {
		const sa = Math.sin(ang);
		const ca = Math.cos(ang);
		const saaa = Math.sin(Math.min(ang-alphaAng,ang))
		const caaa = Math.cos(Math.max(ang-alphaAng,ang))

		const normal = [
			caaa+ca,
			-(sa+saaa),
			0,
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

		for(let j = 0; j < this.stacks; j++) {
			const start     = j == 0 ? 0 : 2*j + 4* j* this.slices
			const firstEnd  = start + this.slices
			const secondEnd = start + (2 * this.slices)
			const thirdEnd  = start + (3 * this.slices)
			const fourthEnd = start + (4 * this.slices)

			for(var i = start; i < firstEnd; i++){
				const mod = (i+1) % firstEnd == 0 ? start : (i+1) % firstEnd
				this.vertices.push(Math.cos(ang), -Math.sin(ang),j/this.stacks);
				const normal = this.getNormalNext(ang,alphaAng);
				this.normals.push(...normal);

				this.indices.push(i,firstEnd,mod);
				this.indices.push(mod,firstEnd,i);
				ang+=alphaAng;
			}
			this.vertices.push(0,0,j/this.stacks);
			this.normals.push(0,0,-1);

			for(var i = firstEnd; i < secondEnd; i++){
				this.vertices.push(Math.cos(ang), -Math.sin(ang),j/this.stacks);
				const normal = this.getNormalPrevious(ang,alphaAng);
				this.normals.push(...normal);
				ang+=alphaAng;
			}

			ang = 0;
			for(var i = secondEnd; i < thirdEnd; i++){
				const mod = (i+2) % (thirdEnd) == 0 ? secondEnd+1 : (i+2) % (thirdEnd);
				this.vertices.push(Math.cos(ang), -Math.sin(ang),j/this.stacks + 1/this.stacks);
				const normal = this.getNormalNext(ang,alphaAng);
				this.normals.push(...normal);

				this.indices.push(i+1,thirdEnd,mod);
				this.indices.push(mod,thirdEnd,i+1);
				
				ang+=alphaAng;
			}
			this.vertices.push(0,0,j/this.stacks);
			this.normals.push(0,0,1);
			ang = 0;

			for(var i = thirdEnd; i < fourthEnd; i++){
				this.vertices.push(Math.cos(ang), -Math.sin(ang),j/this.stacks + 1/this.stacks);
				const normal = this.getNormalPrevious(ang,alphaAng);
				this.normals.push(...normal);
				ang+=alphaAng;
			}

			for(let i = start; i < firstEnd; i++) {
				const offset = i-start
				this.indices.push(i,thirdEnd+offset+2,(i + 1) % firstEnd  == 0 ? start : (i + 1) % firstEnd)// sE + i)
				this.indices.push(thirdEnd+offset+2,i,offset == 0 ? thirdEnd : thirdEnd + offset + 1 )
			}
		}

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