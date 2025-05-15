import { glsl } from "codemirror-lang-glsl"
import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror"
import { glslCompletion } from "./glslCompletion/glslCompletion";
import { vim } from "@replit/codemirror-vim"

const view = new EditorView({
	doc: "Start document",
	parent: document.getElementById("glsl_editor"),
	extensions: [
		basicSetup,
		vim(),
		keymap.of([{ key: "Tab", run: acceptCompletion }, indentWithTab]),
		glsl(),
		autocompletion({ override: [glslCompletion] })
	]
})

