uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform sampler2D uPerlinTexture;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vElevation;

void main() {

    vec2 perlin = vec2(texture2D(uPerlinTexture, vec2(0.25, uTime)).r - 0.5, texture2D(uPerlinTexture, vec2(0.25, uTime)).r - 0.5);

    // Model Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Big waves
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + perlin.x + uTime * uBigWavesSpeed) * sin(modelPosition.z * uBigWavesFrequency.y + perlin.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

    modelPosition.y += elevation + perlin.x;

    // Projection
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Vertex Normal
    vec4 normal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vPosition = position.xyz;
    vNormal = normal.xyz;
    vElevation = elevation;
}