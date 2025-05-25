import { glsl } from "codemirror-lang-glsl"
import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";
import { drawSelection, keymap, ViewUpdate } from "@codemirror/view";
import { indentWithTab, insertTab } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state";
import { glslCompletion } from "./glslCompletion/glslCompletion";
import { vim } from "@replit/codemirror-vim";
import { dracula } from "thememirror";
import { abyss, gruvboxDark, nord, tokyoNightDay } from "@fsegurai/codemirror-theme-bundle";



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
		overrideTheme,
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
		document.querySelector("#frag-btn").style.display = "none";
		document.querySelector("#vert-btn").style.display = "none";
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
			this.#shader.div.cont.removeAttribute("on");
			this.#shader = shader;
			this.#shader.div.cont.setAttribute("on", "")
			this.view.setState(this.#shader.fragState);

		}
		else {
			this.#shader = shader;
			this.#shader.div.cont.setAttribute("on", "")
			this.view = new EditorView({
				state: this.#shader.fragState,
				parent: document.querySelector("#glsl-editor"),
			})

		}
		document.querySelector("#frag-btn").style.display = "inline";
		document.querySelector("#frag-btn").onclick = (ev) => {
			if (ev.target.hasAttribute("on")) { return; }
			ev.target.setAttribute("on", "");
			document.querySelector("#vert-btn").removeAttribute("on");
			this.#shader.vertState = this.view.state;
			this.view.setState(this.#shader.fragState);
		}
		document.querySelector("#vert-btn").style.display = "inline";
		document.querySelector("#vert-btn").onclick = (ev) => {
			if (ev.target.hasAttribute("on")) { return; }
			ev.target.setAttribute("on", "");
			document.querySelector("#frag-btn").removeAttribute("on");
			this.#shader.fragState = this.view.state;
			this.view.setState(this.#shader.vertState);
		}


	}
}

export const Editor = new EditorC(null);
