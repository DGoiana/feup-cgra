import { CGFobject } from '../../lib/CGF.js'
import { MyTree } from './MyTree.js'
import { MyFire} from '../environment/MyFire.js'


export class MyForest extends CGFobject {
	constructor(scene, rows, columns) {
		super(scene)
		this.rows = rows
		this.columns = columns

		this.trees = []
		this.fires = []

		this.generateForest()
		this.generateFire()
	}

	generateForest() {
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.columns; col++) {

				let offset = Math.random() * 5

				let height = Math.random() * (7.5 - 3.5) + 3.5;
				let radius = Math.random() * (0.9 - 0.3) + 0.3;
				let color = [
				    Math.random() * 0.2,           
				    0.5 + Math.random() * 0.5,    
				    Math.random() * 0.2                
				];
				let rotation = [Math.random() * (Math.PI / 10), Math.random() < 0.5 ? 0 : 1]

				let tree = new MyTree(this.scene, rotation, radius, height, color)

				this.trees.push([tree, row * 5 + offset, col * 5 + offset])
			}
		}
	}

	generateFire() {
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.columns; col++) {
				if(Math.random() < .8) {
					let offset = Math.random() * 5
					let scale = Math.random() * 2.0
					let fire = new MyFire(this.scene,scale)
					this.fires.push([fire,row * 5 + offset, col * 5 + offset])
				}
			}
		}

	}

	display() {
		for(let tree of this.trees) {
			this.scene.pushMatrix()
			this.scene.translate(tree[1], 0, tree[2])
			tree[0].display()
			this.scene.popMatrix()
		}

		for(let fire of this.fires) {
			this.scene.pushMatrix()
			this.scene.translate(fire[1],0,fire[2])
			fire[0].display()
			this.scene.popMatrix()
		}
	}
}