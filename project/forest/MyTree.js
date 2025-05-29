import { CGFobject } from '../../lib/CGF.js'
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
	constructor(scene, rotation, baseRadius, height, color, stemAppearance, leafAppearance) { 
		super(scene)
		this.angle = rotation[0]
		this.axis = rotation[1]
		this.baseRadius = baseRadius
		this.height = height
		this.color = color

		this.stemAppearance = stemAppearance
		this.leafAppearance = leafAppearance

		this.leaf = new MyPyramid(scene, 8, 2)
		this.stem = new MyCone(scene, 8 , 1, this.height, this.baseRadius)
	}

	display() {
		this.scene.rotate(this.angle, this.axis ? 1 : 0, 0, this.axis ? 0 : 1)

		if (this.stemAppearance) {
			this.stemAppearance.apply()
		}
		this.stem.display();

		let baseLeafScale = this.baseRadius * 4;

		for(let i = 1; i < this.height; i += 0.5) {
			this.scene.pushMatrix();

			this.scene.translate(0, i, 0);
			
			let leafScale = baseLeafScale * Math.pow(1 - (i / (this.height + 1)), 1.5);
			this.scene.scale(leafScale, 1, leafScale);
			
			if (this.leafAppearance) {
				this.leafAppearance.apply();
			}
			this.leaf.display();
			
			this.scene.popMatrix();
		}
	}
}