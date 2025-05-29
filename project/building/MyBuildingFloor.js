import { CGFobject } from '../../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyQuad } from '../common/MyQuad.js';
import { MyLight } from './MyLight.js';

export class MyBuildingFloor extends CGFobject {
	constructor(scene, numWindow, baseFloor = false, topFloor = false, ) {
    super(scene);
    //this.initBuffers();
    this.quad = new MyQuad(scene);
    this.numWindow = numWindow;
    this.windows = []
    this.topFloor = topFloor
    this.baseFloor = baseFloor

    for(let i = 0; i < numWindow; i++) {
      this.windows.push(new MyWindow(scene))
    }

    this.heliport = new MyWindow(scene);
    this.entrance = new MyWindow(scene);

    this.lights = [
      new MyLight(scene), // corner 1 
      new MyLight(scene), // corner 2
      new MyLight(scene), // corner 3
      new MyLight(scene)  // corner 4
    ]
  }

  initMaterials(textureManager) {
    this.windows.forEach((w) => w.initMaterials(textureManager))
    
    this.heliport.initMaterials(textureManager, 'images/heliport.jpg');
    this.entrance.initMaterials(textureManager, 'images/entrance.jpg');
    
    this.lights.forEach((l) => l.initMaterials(textureManager))
  }

  update(t) {
    this.lights.forEach((l) => l.update(t))
  }

	display() {
    // back
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.scene.pushMatrix()
    this.scene.translate(0,0,0);
    this.quad.display();
    this.scene.popMatrix();

    // front
    this.scene.pushMatrix()
    this.scene.translate(0,0,1);
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,0,1,0)
    this.scene.translate(.5,0,.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,1,0,0)
    this.scene.translate(0,-0.5,0.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,0,1,0)
    this.scene.translate(0.5,0,-0.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    this.scene.pushMatrix()
    this.scene.rotate(-90 * (Math.PI / 180) ,1,0,0)
    this.scene.translate(0, -0.5, -.5)
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix()

    if(this.baseFloor) {
      this.scene.pushMatrix();
      const windowZOffset = 1.005 // .01 to avoid flickering
      this.scene.translate(0,0,windowZOffset);
      this.entrance.display();
      this.scene.popMatrix();
    } else {
      for(let i = 0; i < this.numWindow; i++ ) {
        const window = this.windows.at(i)
        const windowZOffset = 1.005 // .005 to avoid flickering
        const windowXOffset = -.5 * (1 + 1/this.numWindow)
        this.scene.pushMatrix();
        this.scene.translate(windowXOffset + (1 / ( this.numWindow) * (i+1)),0,windowZOffset);
        this.scene.scale(1/this.numWindow,1,1);
        window.display();
        this.scene.popMatrix();
      }
    }

    if(this.topFloor) {
      const angle = -90 * (Math.PI / 180)
      const yOffset = .505 // .01 to avoid flickering
      this.scene.pushMatrix();
        this.scene.translate(0,yOffset,.5);
        this.scene.rotate(angle,1,0,0);
        this.heliport.display();
        
        const cornerOffset = .4;
        
        const cornerPositions = [
          [-cornerOffset, 0.01, -cornerOffset], // top-left
          [cornerOffset, 0.01, -cornerOffset],  // top-right
          [-cornerOffset, 0.01, cornerOffset],  // bottom-left
          [cornerOffset, 0.01, cornerOffset]    // bottom-right
        ];
        
        this.scene.rotate(-angle,1,0,0);

        for (let i = 0; i < this.lights.length; i++) {
          this.scene.pushMatrix();
          this.scene.translate(cornerPositions[i][0], cornerPositions[i][1], cornerPositions[i][2]);
          this.lights[i].display();
          this.scene.popMatrix();
        }
      this.scene.popMatrix();
    }
  }
}
