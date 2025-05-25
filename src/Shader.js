import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";
import { insertTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { drawSelection, keymap } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { glsl } from "codemirror-lang-glsl";
import { dracula, noctisLilac } from "thememirror";
import { glslCompletion } from "./glslCompletion/glslCompletion";
import { defaultFragment, defaultVertex } from "./defaultShader";
import { gruvboxDark } from "@fsegurai/codemirror-theme-bundle";


const extensions = [
	keymap.of([{ key: "Tab", run: acceptCompletion }, { key: "Tab", run: insertTab, preventDefault: true }]),
	glsl(),
	drawSelection(),
	basicSetup,
	autocompletion({ override: [glslCompletion] }),
	noctisLilac,
	// dracula,
	EditorView.theme({
		"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": { backgroundColor: "#44475a" },
		".cm-completionInfo": { fontSize: "0.8em", color: "#b5b6b7" },
		".cm-activeLine": { backgroundColor: "rgba(80, 80, 80, 0.2) !important" }
	})
];

export class Shader {

	/**
	 * @typedef {Object} options
	 * @property {string} vert
	 * @property {string} frag
	 */
	/**
	 *  @param {string} name
	 *  @param {number} id
	 *  @param {options | null} options
	 *  @param {string} frag
	*/
	constructor(name, id, options = null) {
		this.name = name;
		this.id = id;

		this.vert = options?.vert ? options.vert : defaultVertex;
		this.frag = options?.frag ? options.frag : defaultFragment;

		/** @type {boolean} this.dirty */
		this.dirty = true;
		/** @type {boolean} this.enable */
		this.enabled = true;


		const updateListener = EditorView.updateListener.of((u) => {
			this.dirty = this.dirty || u.docChanged;
		});

		const extension = [...extensions, updateListener];
		/**	@type {EditorState} this.vertState */
		this.vertState = EditorState.create({
			doc: this.vert,
			extensions: [...extensions, updateListener]
		});
		/** @type {EditorState} this.fragState */
		this.fragState = EditorState.create({
			doc: this.frag,
			extensions: [...extensions, updateListener]
		});

		/** @type {WebGLProgram | null} this.program */
		this.program = null;
		/** @type {WebGLUniformLocation | null} this.timeLocation*/
		this.timeLocation = null;
		/** @type {WebGLUniformLocation | null} this.resolutionLocation */
		this.resolutionLocation = null;
		/** @type {WebGLUniformLocation | null} this.mouseLocation */
		this.mouseLocation = null;
		/** @type {WebGLUniformLocation | null} this.frameLocation */
		this.frameLocation = null;
		/** @type {WebGLUniformLocation | null} this.viewPosLocation */
		this.viewPosLocation = null;
		/** @type {WebGLUniformLocation | null} this.viewDirLocation */
		this.viewDirLocation = null;
		/** @type {WebGLUniformLocation | null} this.viewLocation */
		this.viewLocation = null;
	}
}
