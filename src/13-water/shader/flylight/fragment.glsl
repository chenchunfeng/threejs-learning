precision lowp float;

uniform vec3 uHighColor;
uniform vec3 uLowColor;
varying float vElevation;
uniform float uOpacity;

void main(){
    float value = (vElevation + 1.0) / 2.0;
    vec3 color = mix(uLowColor, uHighColor, value);
    gl_FragColor = vec4(color, uOpacity);
}