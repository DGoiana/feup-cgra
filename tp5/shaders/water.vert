attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform float timeFactor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec2 timeVec;

uniform sampler2D uSampler2;

void main() {

	

  timeVec = aTextureCoord + vec2(timeFactor * 0.01, timeFactor * 0.01);

	vec4 t = texture2D(uSampler2, timeVec);
	vec3 a = aVertexPosition.xyz + (t.b * 0.05);

	gl_Position = uPMatrix * uMVMatrix * vec4(a, 1.0);
	
	vTextureCoord = aTextureCoord;
}

