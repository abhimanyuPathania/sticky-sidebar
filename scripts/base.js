
var sidebarContent = document.querySelector(".sticky-sidebar-content");

sidebarContent.addEventListener("click", scrollToLink, false);

function scrollToLink(e){
	e.preventDefault();

	var clickTarget = e.target || e.srcElement;
	var targetId = clickTarget.getAttribute("href");
	if (!targetId) {
		return false;
	}
	var targetElement = document.querySelector(targetId);
	Velocity(targetElement, "scroll", {
		duration: 400,
		easing: "ease-in-out",
		offset: -30,
	}); 

	
}