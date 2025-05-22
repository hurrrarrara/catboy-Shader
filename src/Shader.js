import { EditorState } from "@codemirror/state";
import { defaultFragment, defaultVertex } from "./defaultShader";
import { Editor, EditorC } from "./Editor";
import { Engine } from "./Engine";
// const uniforms = [
// 	"float time",
// 	"vec2 resolution",
// 	"vec2 mousePos",
// ]

export class Shader {
	constructor(name, vert = null, frag = null) {
		this.name = name;
		this.vert = (vert ? vert : defaultVertex);
		this.frag = (frag ? frag : defaultFragment);

		this.elem = document.createElement("li");
		this.elem.classList.add("shader-pass")
		this.elem.innerText = this.name;
		this.elem.addEventListener("click", () => {
			Editor.shader = this;
		})
		document.querySelector("#shader-list").appendChild(this.elem)

		/** @type {EditorState}*/
		this.vertState = EditorState.create({
			doc: this.vert,
			extensions: EditorC.extensions
		})

		/** @type {EditorState}*/
		this.fragState = EditorState.create({
			doc: this.frag,
			extensions: EditorC.extensions
		});

		this.samplers = [];
	}

	compile() {
		this.vert = this.vertState.toJSON().doc;
		this.frag = this.fragState.toJSON().doc;
		let vert;
		try { vert = Engine.createShader(Engine.gl.VERTEX_SHADER, this.vert); }
		catch (err) { this.error = err; throw "ouai"; }

		let frag;
		try { frag = Engine.createShader(Engine.gl.FRAGMENT_SHADER, this.frag) }
		catch (err) { this.error = err; Engine.gl.deleteShader(vert); throw "ouai"; };

		let program;
		try { program = Engine.createProgram(vert, frag) }
		catch (err) {
			this.error = err;
			Engine.gl.deleteShader(vert); Engine.gl.deleteShader(frag);
			throw "oaui";
		}
		this.program = program;
		this.samplers = [];

		const numUniforms = Engine.gl.getProgramParameter(this.program, Engine.gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < numUniforms; ++i) {
			const info = Engine.gl.getActiveUniform(this.program, i);
			if (info.type == Engine.gl.SAMPLER_2D) { this.samplers.push(info.name) }
		}

		const positionAttributeLocation = Engine.gl.getAttribLocation(this.program, "position");
		Engine.gl.vertexAttribPointer(positionAttributeLocation, 2, Engine.gl.FLOAT, false, 0, 0);
		Engine.gl.enableVertexAttribArray(positionAttributeLocation);

		this.timeLocation = Engine.gl.getUniformLocation(this.program, "time");
		this.resolutionLocation = Engine.gl.getUniformLocation(this.program, "resolution");
		this.mousePosLocation = Engine.gl.getUniformLocation(this.program, "mouse");

		Engine.gl.useProgram(this.program);
		this.error = '';
	}

	setForRender() {
		Engine.gl.uniform1f(this.timeLocation, Engine.time);
		Engine.gl.uniform2f(this.resolutionLocation, Engine.gl.canvas.width, Engine.gl.canvas.height);
		Engine.gl.uniform2f(this.mousePosLocation, Engine.mousePos.x, Engine.mousePos.y);
	}

	focus() {
	}

}
