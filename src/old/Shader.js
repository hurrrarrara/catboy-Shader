import { EditorState } from "@codemirror/state";
import { defaultFragment, defaultVertex } from "./defaultShader";
import { Editor, EditorC } from "./Editor";
import { Engine } from "./Engine";
import { EditorView } from "codemirror";

export class Shader {
	/** @type {Shader[]} shaderlist*/
	static shadersList = [];

	constructor(name, vert = null, frag = null) {
		this.name = name;
		this.vert = (vert ? vert : defaultVertex);
		this.frag = (frag ? frag : defaultFragment);
		this.enable = true;
		this.samplers = [];
		this.dirty = true;
		this.focus = false;

		this.updateListener = EditorView.updateListener.of((u) => {
			this.dirty = this.dirty || u.docChanged;
		});


		this.createDiv();
		const extension = [...EditorC.extensions, this.updateListener];
		console.log(extension);

		/** @type {EditorState}*/
		this.vertState = EditorState.create({
			doc: this.vert,
			extensions: extension
		})

		/** @type {EditorState}*/
		this.fragState = EditorState.create({
			doc: this.frag,
			extensions: extension
		});

		this.id = Shader.shadersList.push(this) - 1;
		console.log(Shader.shadersList);
	}

	compile() {
		if (!this.dirty) { return; }
		this.dirty = false;

		this.vert = this.vertState.toJSON().doc;
		this.frag = this.fragState.toJSON().doc;
		let vert;
		try { vert = Engine.createShader(Engine.gl.VERTEX_SHADER, this.vert); }
		catch (err) { this.error = err; return false; }

		let frag;
		try { frag = Engine.createShader(Engine.gl.FRAGMENT_SHADER, this.frag) }
		catch (err) { this.error = err; Engine.gl.deleteShader(vert); return false; };

		let program;
		try { program = Engine.createProgram(vert, frag) }
		catch (err) {
			this.error = err;
			Engine.gl.deleteShader(vert); Engine.gl.deleteShader(frag);
			return false;
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
		this.mouseDownLocation = Engine.gl.getUniformLocation(this.program, "mouseDown");

		this.error = '';
		this.dirty = false;
		console.log("compiled", this.name);
		return true;
	}

	setForRender() {
		Engine.gl.uniform1f(this.timeLocation, Engine.time);
		Engine.gl.uniform2f(this.resolutionLocation, Engine.gl.canvas.width, Engine.gl.canvas.height);
		Engine.gl.uniform4f(this.mousePosLocation, Engine.mouse.x, Engine.mouse.y, Engine.mouse.vx, Engine.mouse.vy);
		Engine.gl.uniform1f(this.mouseDownLocation, Engine.mouseDown);
	}

	toogle() {
		this.enable = !this.enable;
	}

	dispose() {
		Shader.shadersList.splice(this.id, 1);
		this.div.cont.remove();
		if (this.program) {
			Engine.gl.deleteProgram(this.program)
		}
		if (this.focus) {
			Editor.shader = Shader.shadersList[Shader.shadersList.length];
		}
	}

	createDiv() {
		/**
		 *	@typedef {Object} div
		 *	@property {HTMLDivElement} cont
		 *	@property {HTMLSpanElement} name
		 *	@property {HTMLInputElement} check
		 *	@property {HTMLInputElement} close
		*/

		/** @type {div} */
		this.div = {
			cont: document.createElement("div"),
			name: document.createElement("span"),
			check: document.createElement("input"),
			close: document.createElement("button")
		};

		this.div.cont.classList.add("shader-cont");
		this.div.name.className = "shader-name";
		this.div.check.className = "shader-check";
		this.div.close.className = "shader-close";

		this.div.check.type = "checkbox";
		this.div.check.checked = true;
		this.div.name.innerText = this.name;
		this.div.close.innerText = 'x';

		this.div.cont.addEventListener("click", () => { Editor.shader = this; this.focus = true; });
		this.div.check.addEventListener("click", () => { this.toogle(); console.log("check") });
		// this.div.close.addEventListener("click", () => { this.dispose() });

		this.div.cont.appendChild(this.div.check);
		this.div.cont.appendChild(this.div.name);
		this.div.cont.appendChild(this.div.close);

		document.querySelector("#shader-list").appendChild(this.div.cont);
	}
}
