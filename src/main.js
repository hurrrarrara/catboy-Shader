import { Editor } from "./Editor";


// class RenderTarget {
// 	resolution;
// 	format;
// 	clear;
// 	clearColor;
// 	dirty;
// }
//
// class Shader {
// 	vert;
// 	frag;
// 	program;
// 	sampler;
// 	dirty;
// }
//
// class Pass {
// 	shader;
// 	rt;
// 	id;
// 	enabled;
// 	dirty;
// }

const editor = new Editor();

class Render {
	constructor() {
		/** @type {HTMLCanvasElement}*/
		this.canvas = document.querySelector("#gl-canvas");

		/** @type {WebGLRenderingContext}*/
		this.gl = this.canvas.getContext("webgl2");

		if (this.gl === null) {
			console.warn("Unable to initialize WebGL2. Your browser or machine may not support it.");
			return;
		}

		this.gl.clearColor(0., 0., 0., 1.);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		document.querySelector("#gl-compile").addEventListener("click", () => {
			this.compile();
			this.draw();
		})

	}

	createShader(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		const succes = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
		if (succes) { return shader };

		console.warn(this.gl.getShaderInfoLog(shader));
		this.error(this.gl.getShaderInfoLog(shader));
		this.gl.deleteShader(shader);
		return null;
	}

	createProgram() {
		if (this.program) { this.gl.deleteProgram(this.program) }
		const program = this.gl.createProgram();
		this.gl.attachShader(program, this.vert);
		this.gl.attachShader(program, this.frag);
		this.gl.linkProgram(program);
		const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) { return program };

		console.warn(this.gl.getProgramInfoLog(program));
		this.error(this.gl.getProgramInfoLog(program));
		this.gl.deleteProgram(program);
		return null;
	}

	compile() {
		if (this.vert) { this.gl.deleteShader(this.vert) };
		this.vert = this.createShader(this.gl.VERTEX_SHADER, editor.vert);
		if (this.frag) { this.gl.deleteShader(this.frag) };
		this.frag = this.createShader(this.gl.FRAGMENT_SHADER, editor.frag);
		if (!this.vert || !this.frag) {
			if (this.vert) { this.gl.deleteShader(this.vert) };
			if (this.frag) { this.gl.deleteShader(this.frag) };
			return;
		}

		this.program = this.createProgram();
		if (!this.program) {
			this.gl.deleteShader(this.vert);
			this.gl.deleteShader(this.frag);
			return;
		}

		if (this.screenQuadVBO == null) {
			var verts = [
				// First triangle:
				1.0, 1.0,
				-1.0, 1.0,
				-1.0, -1.0,
				// Second triangle:
				-1.0, -1.0,
				1.0, -1.0,
				1.0, 1.0
			];
			this.screenQuadVBO = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.screenQuadVBO);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);
		}

		const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
		this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(positionAttributeLocation);

		this.timeLocation = this.gl.getUniformLocation(this.program, "time");
		this.resolutionLocation = this.gl.getUniformLocation(this.program, "resolution");
		this.gl.useProgram(this.program);
		this.error('')
	}

	draw() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		try {
			this.gl.uniform1f(this.timeLocation, Date.now() * 0.001 - start);
			this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
		} catch (err) { console.warn(err) };
		// this.gl.useProgram(this.program);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
		window.requestAnimationFrame(() => {
			this.draw();
		})

	}

	error(error) {
		document.querySelector('#gl-console').innerHTML = error;
	}
}


const start = Date.now() * 0.001;

function main() {
	const render = new Render();

	render.compile();

	window.requestAnimationFrame(() => {
		render.draw();
	})
}

main();
