import { Engine } from "./Engine";
import { Editor } from "./Editor";
import { Shader } from "./Shader";


// class RenderTarget {
// 	resolution;
// 	format;
// 	clear;
// 	clearColor;
// 	dirty;
// }
//
// class Shader {
// 	vert;
// 	frag;
// 	program;
// 	sampler;
// 	dirty;
// }
//
// class Pass {
// 	shader;
// 	rt;
// 	id;
// 	enabled;
// 	dirty;
// }
//


const shaders = [];
let compiledShaders = [];

shaders.push(new Shader());

const editor = new Editor(shaders[0]);



function main() {
	compile();

	document.querySelector("#gl-compile").addEventListener("click", () => {
		editor.save();
		compile();
	})

	document.querySelectorAll(".move").forEach((elem) => {
		draggable(elem);
	})

	render();
}


function draggable(el) {
	el.addEventListener('mousedown', function(e) {
		var offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
		var offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

		function mouseMoveHandler(e) {
			el.style.top = (e.clientY - offsetY) + 'px';
			el.style.left = (e.clientX - offsetX) + 'px';
		}



		function reset() {
			window.removeEventListener('mousemove', mouseMoveHandler);
			window.removeEventListener('mouseup', reset);
		}

		window.addEventListener('mousemove', mouseMoveHandler);
		window.addEventListener('mouseup', reset);
	});
}


function render() {
	Engine.draw(compiledShaders);

	window.requestAnimationFrame(() => {
		render();
	})
}

function compile() {
	compiledShaders = [];
	for (let i = 0; i < shaders.length; i++) {
		try {
			shaders[i].compile();
			compiledShaders.push(shaders[i]);
		} catch (err) { }
	}
}

main();
