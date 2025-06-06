import { CGFobject, CGFtexture, CGFappearance } from '../../lib/CGF.js'
import { MyTree } from './MyTree.js'
import { MyFire} from '../environment/MyFire.js'

export const FOREST_CORNER = {
	x: -160,
	z: 25
}

export class MyForest extends CGFobject {
	constructor(scene, rows, columns, offset, treeHeight, firePercentage) {
		super(scene)
		this.rows = rows
		this.columns = columns

		this.trees = []
		this.fires = []

		this.offset = offset
		this.treeHeight = treeHeight
		this.firePercentage = firePercentage

		this.stemAppearance = null
		this.leafAppearance = null
		this.fireAppearance = null
	}

	initMaterials(textureManager) {
		this.stemTexture = textureManager.getTexture("textures/wood.jpg");
		this.stemAppearance = new CGFappearance(this.scene);
		this.stemAppearance.setTexture(this.stemTexture);
		this.stemAppearance.setTextureWrap('REPEAT', 'REPEAT');

		this.leafTexture = textureManager.getTexture("textures/leaf.jpg");
		this.leafAppearance = new CGFappearance(this.scene);
		this.leafAppearance.setTexture(this.leafTexture);
		this.leafAppearance.setTextureWrap('REPEAT', 'REPEAT');

		this.fireAppearance = new CGFappearance(this.scene);
    this.fireTexture = textureManager.getTexture("images/fire.png");
    this.fireAppearance.setTexture(this.fireTexture);
    this.fireAppearance.setTextureWrap('REPEAT', 'REPEAT');

		this.generateForest(this.rows, this.columns)
		this.generateFire(this.rows, this.columns)
	}

	/**
	 * Determines if the position is over the forest instance (for helicopter) 
	 * @param {number} x 
	 * @param {number} z 
	 * @returns if the position is over the forest
	 */
	isOverForest(x, z) {
		const minX = FOREST_CORNER.x;
    const maxX = FOREST_CORNER.x + (this.columns * 5);
    const minZ = FOREST_CORNER.z;
    const maxZ = FOREST_CORNER.z + (this.rows * 5);

    return x >= minX && x <= maxX && z >= minZ && z <= maxZ;
	}

	/**
	 * Determines if the position is over the lake (for helicopter) 
	 * @param {number} x 
	 * @param {number} z 
	 * @returns if the position is over the forest
	 */
	isOverLake(x, z) {
		const lakeCenter = { x: -105, z: 60 };
		const lakeRadius = 50;
		
		const dx = x - lakeCenter.x;
		const dz = z - lakeCenter.z;
		
		const distance = Math.hypot(dx, dz);
		
		return distance <= lakeRadius;
	}

	/**
	 * Regenerates forest with changed arguments
	 * @param {number} newOffset - new value for offset
	 * @param {number} rows - new value for rows
	 * @param {number} cols - new value for cols
	 */
	regenerateForest(newOffset, rows, cols, treeHeight, firePercentage) {
		this.offset = newOffset
		this.rows = rows
		this.columns = cols
		this.treeHeight = treeHeight
		this.firePercentage = firePercentage

		this.trees = []
		this.fires = []
		this.generateForest(rows, cols)
		this.generateFire(rows, cols)
	}

	/**
	 * Generates a random forest in a matrix of RowsxCols
	 * @param {number} rows - number of rows
	 * @param {number} cols - number of columns
	 */
	generateForest(rows, cols) {
		for(let row = 0; row < rows; row++) {
			for(let col = 0; col < cols; col++) {

				let offset = Math.random() * this.offset

				let treeX = FOREST_CORNER.x + row * 5 + offset
				let treeZ = FOREST_CORNER.z + col * 5 + offset

				if (this.isOverLake(treeX, treeZ) || treeZ <= 40) {
					continue
				}

				let heightVariation = this.treeHeight * 0.3;
				let height = this.treeHeight + (Math.random() - 0.5) * heightVariation;
				let radius = Math.random() * (0.9 - 0.3) + 0.3;

				let color = [
				    Math.random() * 0.2,
				    0.5 + Math.random() * 0.5,
				    Math.random() * 0.2
				];

				let rotation = [Math.random() * (Math.PI / 10), Math.random() < 0.5 ? 0 : 1]

				let tree = new MyTree(this.scene, rotation, radius, height, color, this.stemAppearance, this.leafAppearance)

				this.trees.push([tree, treeX, treeZ])
			}
		}
	}

	/**
	 * Generates random fires instances in a matrix of RowsxCols
	 * @param {number} rows - number of rows
	 * @param {number} cols - number of columns
	 */
	generateFire(rows, cols) {
		for(let row = 0; row < rows; row++) {
			for(let col = 0; col < cols; col++) {
				if(Math.random() < this.firePercentage) {
					let offset = Math.random() * this.offset

					let fireX = FOREST_CORNER.x + row * 5 + offset
					let fireZ = FOREST_CORNER.z + col * 5 + offset

					if (this.isOverLake(fireX, fireZ) || fireZ <= 55) {
						continue
					}

					let scale = Math.random() * 2.0
					let fire = new MyFire(this.scene, scale, this.fireAppearance)
					this.fires.push([fire, fireX, fireZ])
				}
			}
		}

	}

	/**
	 * Updates the fires
	 * @param {number} t - Time Elapsed in milliseconds
	 */
	update(t) {
		for (let fire of this.fires) {
		  fire[0].update(t)
		}
	}

	/**
	 * Displays the forest in the scene
	 */
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
