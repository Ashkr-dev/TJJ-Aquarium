uniform vec3 uBaseColor;
uniform vec3 uFresnelGlow;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vElevation;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(cameraPosition - vPosition);

    // Fresnel calculation (inverted for strength at edges)
    float fresnel = 1.0 - dot(viewDirection, normal);
    fresnel = clamp(fresnel, 0.0, 1.0);   // Ensure it's in [0, 1]
    fresnel = pow(fresnel, 2.0);          // Control falloff

    // Mix color and fresnel glow
    vec3 color = mix(uBaseColor, uFresnelGlow, fresnel);

    // Alpha controlled: always visible, more at edges
    float alpha = mix(0.4, 1.0, fresnel);  // 0.4 = minimum visibility from top

    // Color based on elevation
    // float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    float mixStrength = smoothstep(0.0, 1.0, (vElevation + uColorOffset) * uColorMultiplier);

    vec3 depthColor = mix(uDepthColor, uSurfaceColor, mixStrength);

    vec3 fresnelColor = mix(uBaseColor, uFresnelGlow, fresnel);
    vec3 finalColor = mix(fresnelColor, depthColor, 0.5); // or adjust ratio

    gl_FragColor = vec4(finalColor, alpha);
    // gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
