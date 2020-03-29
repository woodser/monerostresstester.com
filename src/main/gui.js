const FLEX_SRC = "img/muscleFlex.gif";
const RELAX_SRC = "img/muscleRelax.gif";

var buttonElement = document.getElementById("muscleButton");

var toggledElement = document.getElementById("isToggled");
var isToggled = false;

buttonElement.addEventListener("click", toggle);
relax();

function toggle() {
	var isToggled = (toggledElement.innerHTML == "true");
	isToggled ? relax() : flex();
	console.log("Toggling switch");
	console.log("isToggled: " + isToggled);
}

function relax() {
	buttonElement.setAttribute("src", RELAX_SRC);
	toggledElement.innerHTML = "false";
	console.log("Giving the Monero network a break");
}

function flex() {
	buttonElement.setAttribute("src", FLEX_SRC);
	toggledElement.innerHTML = "true";
	console.log("Stressing the Monero network out, man!");
}

