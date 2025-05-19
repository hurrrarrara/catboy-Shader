import { glsl } from "codemirror-lang-glsl"
import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";
import { drawSelection, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state";
import { glslCompletion } from "./glslCompletion/glslCompletion";
import { vim } from "@replit/codemirror-vim";
import { dracula } from "thememirror";


/** @type {EditorView}*/
const defaultExtensions = [keymap.of([{ key: "Tab", run: acceptCompletion }, indentWithTab]),
glsl(),
drawSelection(),
vim(),
	basicSetup,
autocompletion({ override: [glslCompletion] }),
	dracula,
]

const view = new EditorView({
	doc: "Start document",
	parent: document.getElementById("glsl_editor"),
	extensions: defaultExtensions
})

const s = view.state;

const state = EditorState.create({
	doc: "OUAI",
	extensions: defaultExtensions
})

let b = false;

document.querySelector("#ouai").addEventListener("click", () => {
	if (!b) {
		view.setState(state);
		b = true;
	}
	else {
		console.log(view.state.doc.toString());
		b = false;
	}
});

class RenderTarget {
	resolution;
	format;
	clear;
	clearColor;
	dirty;
}

class Shader {
	vert;
	frag;
	program;
	sampler;
	dirty;
}

class Pass {
	shader;
	rt;
	id;
	enabled;
	dirty;
}

const vertexShaderSource = `#version 300 es
     
    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;
     
    // all shaders have a main function
    void main() {
     
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
    `;

const fragmentShaderSource = `#version 300 es
     
    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;
     
    // we need to declare an output for the fragment shader
    out vec4 outColor;
     
    void main() {
      // Just set the output to a constant reddish-purple
      outColor = vec4(1, 0, 0.5, 1);
    }
    `;

function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const succes = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (succes) { return shader };

	console.warn(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
	return null;
}

function createProgram(gl, vert, frag) {
	const program = gl.createProgram();
	gl.attachShader(program, vert);
	gl.attachShader(program, frag);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) { return program };

	console.warn(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
	return null;
}


function main() {
	/** @type {HTMLCanvasElement}*/
	const canvas = document.querySelector("#gl-canvas");

	/** @type {WebGLRenderingContext}*/
	const gl = canvas.getContext("webgl2");

	if (gl === null) {
		console.warn("Unable to initialize WebGL2. Your browser or machine may not support it.");
		return;
	}

	gl.clearColor(.0, 0., 0., 1.);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const vert = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const frag = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	const program = createProgram(gl, vert, frag);

	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = [
		0, 0,
		0, 0.5,
		0.7, 0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(positionAttributeLocation);

	const size = 2;          // 2 components per iteration
	const type = gl.FLOAT;   // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	const offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(
		positionAttributeLocation, size, type, normalize, stride, offset)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.useProgram(program);
	gl.bindVertexArray(vao);

	const primitiveType = gl.TRIANGLES;
	const offset2 = 0;
	const count = 3;
	gl.drawArrays(primitiveType, offset2, count);
}

main();
