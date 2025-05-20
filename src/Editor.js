import { glsl } from "codemirror-lang-glsl"
import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";
import { drawSelection, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state";
import { glslCompletion } from "./glslCompletion/glslCompletion";
import { vim } from "@replit/codemirror-vim";
import { dracula } from "thememirror";



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


export class Editor {
	constructor() {
		this.extensions = [
			keymap.of([{ key: "Tab", run: acceptCompletion }, indentWithTab]),
			glsl(),
			drawSelection(),
			vim(),
			basicSetup,
			autocompletion({ override: [glslCompletion] }),
			dracula,
		]

		this.vertState = EditorState.create({
			doc: defaultVertex,
			extensions: this.extensions
		})

		this.fragState = EditorState.create({
			doc: defaultFragment,
			extensions: this.extensions
		});

		document.querySelector("#frag-btn").setAttribute("on", "");
		this.view = new EditorView({
			state: this.fragState,
			parent: document.querySelector("#glsl-editor"),
		})

		document.querySelector("#vert-btn").addEventListener("click", (ev) => {
			if (ev.target.hasAttribute("on")) { return; }
			ev.target.setAttribute("on", "");
			document.querySelector("#frag-btn").removeAttribute("on");
			this.fragState = this.view.state;
			this.view.setState(this.vertState);
		});
		document.querySelector("#frag-btn").addEventListener("click", (ev) => {
			if (ev.target.hasAttribute("on")) { return; }
			ev.target.setAttribute("on", "");
			document.querySelector("#vert-btn").removeAttribute("on");
			this.vertState = this.view.state;
			this.view.setState(this.fragState);
		})

	}

	get vert() {
		if (document.querySelector("#vert-btn").hasAttribute("on")) {
			return this.view.state.toJSON().doc;;
		}
		return this.vertState.toJSON().doc;;
	}

	get frag() {
		if (document.querySelector("#frag-btn").hasAttribute("on")) {
			return this.view.state.toJSON().doc;;
		}
		return this.fragState.toJSON().doc;;
	}
}

