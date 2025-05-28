#ifdef GL_ES
precision highp float;
#endif

varying vec2 vVertexCoord;
varying vec2 vWaterCoord;

uniform sampler2D uSampler;
uniform sampler2D uWaterSampler;
uniform sampler2D uTerrainSampler;

void main() {
	vec4 mapColor = texture2D(uSampler, vVertexCoord);
	float terrainInterpolation = mapColor.r;

	vec4 terrainColor = texture2D(uTerrainSampler, vVertexCoord);

  gl_FragColor = (1.0 - terrainInterpolation) * texture2D(uWaterSampler, vWaterCoord) + terrainInterpolation * terrainColor;
}