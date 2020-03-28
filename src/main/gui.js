const FLEX_SRC = "img/muscleFlexButton.gif";
const RELAX_SRC = "img/muscleRelaxButton.gif";

var buttonElement = document.getElementById("muscleButton");

function intializeAnimation() {
	buttonElement.addEventListener("mouseenter", flex);
	buttonElement.addEventListener("mouseEnter", relax);
	relax();
}

function relax() {
	buttonElement.setAttribute("src", RELAX_SRC);
	console.log("Giving the Monero network a break");
}

function flex() {
	buttonElement.setAttribute("src", FLEX_SRC);
	console.log("Stressing the Monero network out, man!");
}


