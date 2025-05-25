import { EditorView } from "codemirror";
import { Shader } from "./Shader";

export class Editor {
	constructor() {
		/** @type {Shader} this.shader */
		this._shader = null;

		/** @type {EditorView} this.view */
		this.view = null;

		/** @type {"frag" | "vert" | null} this.state;*/
		this.state = null;
	}

	/** @param {Shader} shader */
	set shader(shader) {
		switch (this.state) {
			case "frag": {
				this._shader.fragState = this.view.state;
				this._shader = shader;
				this.view.setState(this._shader.fragState);
				break;
			}
			case "vert": {
				this._shader.vertState = this.view.state;
				this._shader = shader;
				this.view.setState(this._shader.vertState);
				break;
			}
			default: {
				this._shader = shader;
				this.state = "frag";
				this.view = new EditorView({
					state: this._shader.fragState,
					parent: document.querySelector("#editor")
				})
				document.querySelector("#vert-btn").addEventListener("click", () => { this.changeVertFrag("vert") }, { once: true });
				break;
			}
		}

	}

	/** @param {"frag" | "vert"} type*/
	changeVertFrag(type) {
		switch (type) {
			case "vert": {
				this._shader.fragState = this.view.state;
				this.view.setState(this._shader.vertState);
				this.state = "vert";
				document.querySelector("#frag-btn").addEventListener("click", () => { this.changeVertFrag("frag") }, { once: true });
				break;
			}
			case "frag": {
				this._shader.vertState = this.view.state;
				this.view.setState(this._shader.fragState);
				this.state = "frag";
				document.querySelector("#vert-btn").addEventListener("click", () => { this.changeVertFrag("vert") }, { once: true })
				break;
			}
		}
	}


}
