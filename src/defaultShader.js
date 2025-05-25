export const defaultVertex = `#version 300 es // we must specify the version of glsl we wish to use
// it must be on the first line of the shader code

// vertex position passed to the program
in vec4 position;

// Uniforms available in every shaders
uniform float	time; // time in ms
uniform vec2	resolution; // resolution of FrameBuffer
uniform vec4	mouse; // normalized mouse position and mouvement over canvas

out vec2 uv;

// all shaders have a main function
void main() {
    uv = position.xy * 0.5 + 0.5;
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = position;
}`;

export const defaultFragment = `#version 300 es // we must specify the version of glsl we wish to use
// it must be on the first line of the shader code

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
precision highp sampler2D;

// we need to declare an output for the fragment shader
out vec4 outColor;

// Uniforms available in every shaders
uniform float	time; // time in ms
uniform vec2	resolution; // viewport resolution in px
uniform vec4	mouse; // normalized mouse position and mouvement over canvas: [posX, posY, moveX, moveY]
uniform mat4	cam; //	TODO cam, rotate around 0,0,0 when mouseLeft
uniform vec3    viewPos; // TODO 
uniform vec3    viewDir; // TODO
uniform int     frame; // frame number, usefull for rendering only once e.g if(frame > 0) {discard;}

// Equivalent to (gl_FragCoord.xy / resolution.xy)
// but computation is done between vertex and fragment shader
// Usefull to know the position of the fragment inside the viewport
in vec2 uv;

// all shaders have a main function
void main() {
    outColor = vec4(mouse.xy, 0., 1.);
    //outColor = vec4(uv, 0., 1.);
}`;

