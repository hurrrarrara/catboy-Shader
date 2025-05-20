export const defaultVertex = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 position;

uniform float  time;

// all shaders have a main function
void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = position;
}`;

export const defaultFragment = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// we need to declare an output for the fragment shader
out vec4 outColor;

//Default Uniforms availabled in every shaders
uniform float	time; //time in ms
uniform vec2	resolution; //resolution of FrameBuffer
uniform vec2	mousePos; // cursor position over canvas x: [-1, 1], y: [-1, 1]

#define FALLING_SPEED  1.
#define STRIPES_FACTOR 10.0

//get sphere
float sphere(vec2 coord, vec2 pos, float r) {
    vec2 d = pos - coord; 
    return smoothstep(60.0, 0.0, dot(d, d) - r * r);
}

//main
void main()
{
    float fallingSpeed = FALLING_SPEED * (mousePos.y * 0.5 + 0.5);
    float stripesFactor = STRIPES_FACTOR * (mousePos.x * 0.5 + 0.5);
    //normalize pixel coordinates
    vec2 uv         =  gl_FragCoord.xy / resolution;
    //pixellize uv
    vec2 clamped_uv = (round(gl_FragCoord.xy / stripesFactor) * stripesFactor) / resolution;
    //get pseudo-random value for stripe height
    float value		= fract(sin(clamped_uv.x) * 43758.5453123);
    //create stripes
    vec3 col        = vec3(1.0 - mod(uv.y * 0.5 + (time * (fallingSpeed + value / 5.0)) + value, 0.5));
    //add color
         col       *= clamp(cos(time * 2.0 + uv.xyx + vec3(0, 2, 4)), 0.0, 1.0);
    //add glowing ends
    	 col 	   += vec3(sphere(gl_FragCoord.xy, 
                                  vec2(clamped_uv.x, (1.0 - 2.0 * mod((time * (fallingSpeed+ value / 5.0)) + value, 0.5))) * resolution, 
                                  0.9)) / 2.0; 
    //add screen fade
         col       *= vec3(exp(-pow(abs(uv.y - 0.5), 6.0) / pow(2.0 * 0.05, 2.0)));
    // Output to screen
    outColor       = vec4(col,1.0);
}`;

