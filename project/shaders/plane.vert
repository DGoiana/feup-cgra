attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform float timeFactor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler;

varying vec2 vWaterCoord;
varying vec2 vVertexCoord;

void main() {
	float animationT = sin(0.02 * 7.0 * timeFactor);
	float animationS = cos(0.02 * 19.0 * timeFactor);
	float animationY = sin(23.0 * timeFactor * (aVertexPosition.x + aVertexPosition.y * aVertexPosition.x * sin(50.0 * aVertexPosition.y))) * cos(0.02 * 13.0 * timeFactor) - 0.5;

  vVertexCoord = aTextureCoord;
  vWaterCoord = vVertexCoord + 0.01 * vec2(animationS, animationT);

	vec4 mapColor = texture2D(uSampler, vVertexCoord);
	float elevationMultiplier = 1.0 - mapColor.g;

	vec3 yOffset = animationY * elevationMultiplier  * aVertexNormal;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + yOffset, 1.0);
}

