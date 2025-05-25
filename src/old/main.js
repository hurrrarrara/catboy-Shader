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


function main() {

	new Shader("default");
	compile();

	document.querySelector("#gl-compile").addEventListener("click", () => {
		Editor.save();
		compile();
	})


	const name = document.createElement("div");
	name.className = "popup";
	const a = document.createElement("div");
	a.className = "blocker";
	a.addEventListener("click", () => {
		name.remove();
		a.value = "";
	})
	const b = document.createElement("input");
	b.className = "popup-text";
	b.type = "text";
	b.placeholder = "Shader name";
	b.addEventListener("keypress", (e) => {
		if (e.key == "Enter" && b.value.length > 0) {
			name.remove();
			let s = new Shader(b.value);
			Editor.shader = s;
			b.value = "";
		}
	})
	b.addEventListener("keydown", (e) => {
		if (e.key == "Escape") {
			name.remove();
			b.value = "";
		}
	})
	name.appendChild(a);
	name.appendChild(b);

	document.querySelector("#new-shader").addEventListener("click", () => {
		document.body.appendChild(name);
		b.focus();
		window.addEventListener("keydown", (e) => { if (e.key == "Escape") { name.remove(); b.value = ""; } }, { once: true });
	})

	document.querySelectorAll(".moved").forEach((elem) => {
		draggable(elem);
	})

	render();
}


function draggable(el) {
	el.addEventListener('mousedown', function(e) {
		var offsetX = e.clientX - parseInt(window.getComputedStyle(el.parentElement).left);
		var offsetY = e.clientY - parseInt(window.getComputedStyle(el.parentElement).top);

		function mouseMoveHandler(e) {
			el.parentElement.style.top = (e.clientY - offsetY) + 'px';
			el.parentElement.style.left = (e.clientX - offsetX) + 'px';
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
	Editor.save();
	Engine.draw(Shader.shadersList);

	window.requestAnimationFrame(() => {
		render();
	})
}

function compile() {
	for (let i = 0; i < Shader.shadersList.length; i++) {
		try {
			if (Shader.shadersList[i].enable) {
				Shader.shadersList[i].compile();
			}
		} catch (err) { }
	}
}

main();
