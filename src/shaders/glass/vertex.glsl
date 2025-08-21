varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    
    // Normal
    // vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vNormal = normalize(normalMatrix * normal);
    vPosition = modelPosition.xyz;

}