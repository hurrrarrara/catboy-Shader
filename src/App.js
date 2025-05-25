import { Editor } from "./Editor";
import { Project } from "./Project";

export class App {
	constructor() {
		/** @type {Map<string, Project>} this.projects */
		this.projects = new Map();
		/** @type {Project | null} this.currentPorject */
		this.currentPorject = null;

		document.querySelectorAll(".drag").forEach((e) => {
			draggable(e);
		})

		/** @type {number} this.currentZindex */
		this.currentZindex = 1;
		document.querySelectorAll(".window").forEach((el) => {
			el.style.display = "none";
			el.addEventListener("mousedown", (e) => {
				this.currentZindex += 1;
				el.style.zIndex = this.currentZindex;
			})
		})

		this.editor = new Editor();

		//TEMPO///////////////////////////////////////
		this.currentPorject = new Project("default");
		this.projects.set("default", this.currentPorject);
		this.editor.shader = this.currentPorject.newShader("default");
		document.querySelector("#editor-win").style.display = "block";
		//////////////////////////////////////////////

		document.querySelectorAll(".minimize").forEach((el) => {
			el.addEventListener("click", () => {
				el.parentElement.parentElement.style.display = "none";
			})
		});
		document.querySelector("#shader-list-task").addEventListener("click", () => {
			document.querySelector("#shader-list-win").style.display = "block";
			document.querySelector("#all-task").setAttribute("on", "");
		})
		document.querySelector("#shader-conf-task").addEventListener("click", () => {
			document.querySelector("#shader-conf-win").style.display = "block";
			document.querySelector("#all-task").setAttribute("on", "");
		})
		document.querySelector("#canvas-task").addEventListener("click", () => {
			document.querySelector("#canvas-win").style.display = "block";
			document.querySelector("#all-task").setAttribute("on", "");
		})
		document.querySelector("#system-task").addEventListener("click", () => {
			document.querySelector("#system-win").style.display = "block";
			document.querySelector("#all-task").setAttribute("on", "");
		})
		document.querySelector("#error-task").addEventListener("click", () => {
			document.querySelector("#error-win").style.display = "block";
			document.querySelector("#all-task").setAttribute("on", "");
		})
		document.querySelector("#all-task").addEventListener("click", (e) => {
			if (e.target.hasAttribute("on")) {
				document.querySelectorAll(".window").forEach((el) => el.style.display = "none");
				e.target.removeAttribute("on");
			} else {
				document.querySelectorAll(".window").forEach((el) => el.style.display = "block");
				e.target.setAttribute("on", "");
			}
		})

		var canvas = document.querySelector("canvas");
		var ctx = canvas.getContext('2d');

		// fill the entire canvas with black before drawing the circles
		ctx.fillStyle = 'cyan';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
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

