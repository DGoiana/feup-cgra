import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from '../tp4/MyQuad.js';
import { MyWindow } from './MyWindow.js';

export class MyBuildingFloor extends CGFobject {
	constructor(scene,numWindow,windowTexture, baseFloor = false, topFloor = false) {
    super(scene);
    //this.initBuffers();
    this.quad = new MyQuad(scene);
    this.numWindow = numWindow;
    this.windows = []
    this.topFloor = topFloor
    this.baseFloor = baseFloor
    for(let i = 0; i < numWindow; i++) {
      this.windows.push(new MyWindow(scene,windowTexture))
    }
    this.heliport = new MyWindow(scene,'images/heliport.jpg');
    this.entrance = new MyWindow(scene,'images/entrance.jpg');
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
        const windowZOffset = 1.005 // .01 to avoid flickering
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
      this.scene.popMatrix();
    }
  }
}