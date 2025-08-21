uniform float uTime;
uniform samplerCube uEnvMap;
uniform vec3 uColor;
uniform float uRefractPower;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    // view direction
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // reflection
    vec3 reflection = reflect(viewDirection, normal);
    vec3 reflectColor = textureCube(uEnvMap, reflection).rgb;

    // refraction
    vec3 refraction = refract(viewDirection, normal, 1.0 / uRefractPower);
    vec3 refractColor = textureCube(uEnvMap, refraction).rgb;

    // Mix
    vec3 finalColor = mix(reflectColor, refractColor, 0.5);
    finalColor = mix(uColor, finalColor, 0.5);

    gl_FragColor = vec4(finalColor, uOpacity);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}
