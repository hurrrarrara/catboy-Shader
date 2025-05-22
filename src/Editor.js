import { glsl } from "codemirror-lang-glsl"
import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";
import { drawSelection, keymap } from "@codemirror/view";
import { indentWithTab, insertTab } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state";
import { glslCompletion } from "./glslCompletion/glslCompletion";
import { vim } from "@replit/codemirror-vim";
import { dracula } from "thememirror";
import { abyss, gruvboxDark, nord, tokyoNightDay } from "@fsegurai/codemirror-theme-bundle";



const defaultVertex = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

uniform float  time;

// all shaders have a main function
void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}`;

const defaultFragment = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// we need to declare an output for the fragment shader
out vec4 outColor;

uniform float	time;
uniform vec2	resolution;

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution;
    
    // Calculate the to center distance
    float d = length(uv - 0.5) * 2.0;
    
    // Calculate the ripple time
    float t = d * d * 25.0 - time * 10.0;
    
    // Calculate the ripple thickness
    d = (cos(t) * 0.5 + 0.5) * (1.0 - d);
    
    // Time varying pixel color
    vec3 col = 0.5 + 0.5 * cos(t / 20.0 + uv.xyx + vec3(0.0,2.0,4.0));

    // Set the output color to rgb channels and the thickness to alpha channel
    // AO is automatically calculated
    outColor = vec4(col, d);
}`;

const overrideTheme = EditorView.theme({
	"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": { backgroundColor: "#44475a" },
	".cm-completionInfo": { fontSize: "0.8em", color: "#b5b6b7" }
})


export class EditorC {
	static extensions = [
		keymap.of([{ key: "Tab", run: acceptCompletion }, { key: "Tab", run: insertTab, preventDefault: true }]),
		glsl(),
		drawSelection(),
		basicSetup,
		autocompletion({ override: [glslCompletion] }),
		//gruvboxDark,
		dracula,
		overrideTheme
	]

	#shader = null;

	constructor(shader = null) {
		this.#shader = shader;

		document.querySelector("#frag-btn").setAttribute("on", "");

		if (shader) {
			this.view = new EditorView({
				state: this.#shader.fragState,
				parent: document.querySelector("#glsl-editor"),
			})
		} else {
			this.view = null
		}
		// (document.querySelector("#vert-btn")).onclick = (ev) => {
		// 	if (ev.target.hasAttribute("on")) { return; }
		// 	ev.target.setAttribute("on", "");
		// 	document.querySelector("#frag-btn").removeAttribute("on");
		// 	this.#shader.fragState = this.view.state;
		// 	this.view.setState(this.#shader.vertState);
		// }

		// document.querySelector("#vert-btn").addEventListener("click", (ev) => {
		// 	if (ev.target.hasAttribute("on")) { return; }
		// 	ev.target.setAttribute("on", "");
		// 	document.querySelector("#frag-btn").removeAttribute("on");
		// 	this.#shader.fragState = this.view.state;
		// 	this.view.setState(this.#shader.vertState);
		// });
		// (document.querySelector("#frag-btn")).onclick = (ev) => {
		// 	if (ev.target.hasAttribute("on")) { return; }
		// 	ev.target.setAttribute("on", "");
		// 	document.querySelector("#vert-btn").removeAttribute("on");
		// 	this.#shader.vertState = this.view.state;
		// 	this.view.setState(this.#shader.fragState);
		// }
		// document.querySelector("#frag-btn").addEventListener("click", (ev) => {
		// 	if (ev.target.hasAttribute("on")) { return; }
		// 	ev.target.setAttribute("on", "");
		// 	document.querySelector("#vert-btn").removeAttribute("on");
		// 	this.#shader.vertState = this.view.state;
		// 	this.view.setState(this.#shader.fragState);
		// })

	}

	save() {
		if (!this.#shader) { return }
		if (document.querySelector("#vert-btn").hasAttribute("on")) {
			this.#shader.vertState = this.view.state;
		} else {
			this.#shader.fragState = this.view.state;
		}
	}

	set shader(shader) {
		if (this.view !== null) {
			this.save();
			this.#shader = shader;
			this.view.setState(this.#shader.fragState);
		}
		else {
			this.#shader = shader;
			this.view = new EditorView({
				state: this.#shader.fragState,
				parent: document.querySelector("#glsl-editor"),
			})
		}
		(document.querySelector("#frag-btn")).onclick = (ev) => {
			if (ev.target.hasAttribute("on")) { return; }
			ev.target.setAttribute("on", "");
			document.querySelector("#vert-btn").removeAttribute("on");
			this.#shader.vertState = this.view.state;
			this.view.setState(this.#shader.fragState);
		}
		(document.querySelector("#vert-btn")).onclick = (ev) => {
			if (ev.target.hasAttribute("on")) { return; }
			ev.target.setAttribute("on", "");
			document.querySelector("#frag-btn").removeAttribute("on");
			this.#shader.fragState = this.view.state;
			this.view.setState(this.#shader.vertState);
		}


	}
}

export const Editor = new EditorC(null);
