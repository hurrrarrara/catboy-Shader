class EngineC {
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
		//Only one bind since we use the screen quad for all programs

		this.startTime = Date.now();
		this.mousePos = { x: 0, y: 0 };

		this.rect = this.canvas.getBoundingClientRect();

		this.canvas.addEventListener("mousemove", (e) => {
			this.mousePos.x = ((e.clientX - this.rect.left) / (this.rect.width));
			this.mousePos.y = ((e.clientY - this.rect.top) / (this.rect.height));
		})

		this.canvas.addEventListener("mouseleave", () => {
			this.mousePos.x = 0;
			this.mousePos.y = 0;
		})

		this.canvas.addEventListener("resize", () => {
			this.rect = this.canvas.getBoundingClientRect();
		})
	}

	draw(shaders = null) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		if (!shaders) { return; }

		this.time = (Date.now() - this.startTime) * 0.001;
		for (let i = 0; i < shaders.length; i++) {
			// console.log(shaders[i])
			shaders[i].setForRender();
			this.gl.useProgram(shaders[i].program);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
		}
	}

	createShader(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		const succes = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
		if (succes) { return shader };

		console.warn(this.gl.getShaderInfoLog(shader));
		this.gl.deleteShader(shader);
		throw this.gl.getShaderInfoLog(shader);
	}

	createProgram(vert, frag) {
		const program = this.gl.createProgram();
		this.gl.attachShader(program, vert);
		this.gl.attachShader(program, frag);
		this.gl.linkProgram(program);
		const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) { return program };

		console.warn(this.gl.getProgramInfoLog(program));
		this.gl.deleteProgram(program);
		throw this.gl.getProgramInfoLog(program);
	}

}

export const Engine = new EngineC();
