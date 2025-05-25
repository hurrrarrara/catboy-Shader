import { Shader } from "./Shader";

export class Project {
	/** @param {string} name*/
	constructor(name) {

		this.name = name;

		/** @type {Shader[]} this.shaders */
		this.shaders = [];

		/** @type {Map<string,Texture>} this.textures*/
		this.textures = new Map();
	}

	/**
	 * @param {string} name
	 * @returns {Shader}
	*/
	newShader(name) {
		const shader = new Shader(name, this.shaders.length);
		this.shaders.push(shader);
		return shader;
	}
}
