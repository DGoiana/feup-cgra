import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js'
import { MyPyramid } from '../common/MyPyramid.js'
import { MyCone } from '../common/MyCone.js'

/**
* MyTree
* @constructor
 * @param {CGFscene} scene
 * @param {Array} array with a possible rotation angle and axis
 * @param {Number} radius of the tree's stem
 * @param {Number} height of the tree
 * @param {Array} array with the RGB components of the leafs' color 
*/
export class MyTree extends CGFobject {
	constructor(scene, rotation, baseRadius, height, color) { 
		super(scene)
		this.angle = rotation[0]
		this.axis = rotation[1]
		this.baseRadius = baseRadius
		this.height = height
		this.color = color

		this.leaf = new MyPyramid(scene, 8, 2)
		this.stem = new MyCone(scene, 8, 1, this.height, this.baseRadius)
	
		this.initMaterials()
	}

	initMaterials() {
		this.stemTexture = new CGFtexture(this.scene, "textures/wood.jpg");
		this.stemAppearance = new CGFappearance(this.scene);
		this.stemAppearance.setTexture(this.stemTexture);
		this.stemAppearance.setTextureWrap('REPEAT', 'REPEAT');


		this.leafTexture = new CGFtexture(this.scene, "textures/leaf.jpg");
		this.leafAppearance = new CGFappearance(this.scene);
		this.leafAppearance.setTexture(this.leafTexture);
		this.leafAppearance.setTextureWrap('REPEAT', 'REPEAT');
	  
	}

	display() {
		this.scene.rotate(this.angle, this.axis ? 1 : 0, 0, this.axis ? 0 : 1)

		this.stemAppearance.apply()
		this.stem.display();

		let baseLeafScale = this.baseRadius * 4;

		for(let i = 1; i < this.height; i += 0.5) {
			this.scene.pushMatrix();

			this.scene.translate(0, i, 0);
			
			let leafScale = baseLeafScale * Math.pow(1 - (i / (this.height + 1)), 1.5);
			this.scene.scale(leafScale, 1, leafScale);
			
			this.leafAppearance.apply();
			this.leaf.display();
			
			this.scene.popMatrix();
		}
	}
}