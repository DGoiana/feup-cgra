import { CGFobject, CGFappearance } from '../../lib/CGF.js'
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
		this.baseRadius = baseRadius > 0.9 ? 0.9 : baseRadius // cap radius to 0.9
		this.height = height > 3.5 ? height : 3.5 // cap lower bound of height to 3.5
		this.color = color

		this.leaf = new MyPyramid(scene, 8, 8)
		this.stem = new MyCone(scene, 30, 30, this.height, this.baseRadius)
	
		this.initMaterials()
	}

	initMaterials() {
		this.stemAppearance = new CGFappearance(this.scene)
		this.stemAppearance.setAmbient(139 / 255 * 0.8, 69 / 255 * 0.8, 19 / 255 * 0.8, 1);
		this.stemAppearance.setDiffuse(139 / 255 * 0.6, 69 / 255 * 0.6, 19 / 255 * 0.6, 1);
		this.stemAppearance.setSpecular(139 / 255 * 0.1, 69 / 255 * 0.1, 19 / 255 * 0.1 , 1);
		this.stemAppearance.setShininess(5);

		this.leafAppearance = new CGFappearance(this.scene);
	    let [r, g, b] = this.color;
	    this.leafAppearance.setAmbient(r * 0.8, g * 0.8, b * 0.8, 1);
	    this.leafAppearance.setDiffuse(r * 0.6, g * 0.6, b * 0.6, 1);
	    this.leafAppearance.setSpecular(r * 0.1, g * 0.1, b * 0.1, 1);
	    this.leafAppearance.setShininess(5.0);
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