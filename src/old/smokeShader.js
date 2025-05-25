export const defaultVertex = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 position;

uniform float  time;

out vec2 uv;

// all shaders have a main function
void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  uv = position.xy;
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
uniform vec2	mouse; // cursor position over canvas [0,0]:[left,top]

in vec2 uv;

/*
 From https://www.shadertoy.com/view/3fGGzw
*/

vec3 HSL2RGB_CubicSmooth(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
    rgb = rgb*rgb*(3.0-2.0*rgb); // iq's cubic smoothing.
    return c.z+ c.y*(rgb-0.5)*(1.-abs(2.*c.z-1.));
}

void main() {
    float i,d,s,t=time * 0.1;
    vec3  p = vec3(resolution, 0.);
  	vec2 u = uv;
  	vec4 o = vec4(0.);
    
    for(o*=i;
        i++<1e2;
        d += s = .03 + abs(.4-abs(p.x))*.3,
        o += 1. /  s)
        
        for (s = .05, p = vec3(u* d,d+t);
             s < .1;
             p.yz *= mat2(cos(.01*t+vec4(0,33,11,0))),
             p += cos(t+p.yzx*2.)*.1,
             p += abs(dot(sin(6.*t+p.z+p * s * 32.), vec3(.006))) / s,
             s += s);
             
    o.rgb *= 1.4 - HSL2RGB_CubicSmooth(vec3( 3. + sin(p.x*1.2 + u.y + t*6.5) *3.,
                                             sin(p.z) /4. + sin(u.y*2.+t) *.1, 
                                            .3 - abs(sin(u.y+t))*.15
                                      )    );
         
    o = tanh(o*o / 1e7);
  	outColor = o;
  	outColor.a = 1.;
}`;

