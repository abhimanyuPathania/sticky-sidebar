
var sidebarContent = document.querySelector(".sticky-sidebar-content");
var mainListLinks = document.querySelectorAll(".main-list > li > a");
var innerList = document.querySelector(".inner-list");

var itemDivKeys = [];
var activeLinkObj = {};
var animating = false;

setupActiveLink();
sidebarContent.addEventListener("click", scrollToLink, false);
window.addEventListener("scroll", addActiveClass, false); 

function setupActiveLink() {
	for( var i = 0, len = mainListLinks.length; i < len-1; i+=1 ){
		var href = mainListLinks[i].getAttribute("href");
		var itemDiv = document.querySelector(href);

		itemDivKeys.push(href);
		activeLinkObj[href] = {div: itemDiv, link: mainListLinks[i]};
	}
}

function addActiveClass() {
	if (window.innerWidth < 768 || animating) {
		return false;
	}

	for (var i=0, len = itemDivKeys.length; i < len; i+=1) {
		var itemDiv = activeLinkObj[itemDivKeys[i]].div;
		var box = itemDiv.getBoundingClientRect();

		if (box.top <= 30 && box.top >= -box.height) {

			var link = activeLinkObj[itemDivKeys[i]].link;
			link.classList.add("active");
			if (itemDivKeys[i] === "#customize"){
				var display = innerList.style.display;
				if (display === "" || display === "none"){
					if(!innerList.classList.contains("velocity-animating")){
						dispayInnerList();
					}
				}
			}

			if(i-1 >= 0) {
				var previousLink = activeLinkObj[itemDivKeys[i-1]].link;
				previousLink.classList.remove("active");
				if (itemDivKeys[i-1] === "#customize"){
					if (innerList.style.display === "block"){
						hideInnerList();
					}
				}
			}

			if(i+1 < len) {
				var nextLink = activeLinkObj[itemDivKeys[i+1]].link;
				nextLink.classList.remove("active");
				if (itemDivKeys[i+1] === "#customize"){
					if (innerList.style.display === "block"){
						hideInnerList();
					}
				}
			}

			break;
		}
	}

	//handle the edge case to remove active class on first link
	var topBox = activeLinkObj["#what"].div.getBoundingClientRect();
	if (topBox.top > 50){
		activeLinkObj["#what"].link.classList.remove("active");
	}
}

function scrollToLink(e){
	e.preventDefault();

	var clickTarget = e.target || e.srcElement;
	var targetId = clickTarget.getAttribute("href");
	var activeLink = document.querySelector(".active");
	if (!targetId) {
		return false;
	}

	if(activeLink && (activeLink.getAttribute("href") === targetId)){
		return false;
	}

	if (!(targetId in activeLinkObj)){
		var innerLinkTarget = document.querySelector(targetId);
		Velocity(innerLinkTarget, "scroll", {
			duration: 200,
			easing: "ease-in-out",
			offset: -10,
		});
	} else{
		var targetElement = activeLinkObj[targetId].div;
		var linkClicked = activeLinkObj[targetId].link;
		Velocity(targetElement, "scroll", {
			duration: 400,
			easing: "ease-in-out",
			offset: -10,
			begin: beforeAnimation,
			complete: afterAnimation
		});
	}



	function beforeAnimation() {
		animating = true;
		if (!activeLink){
			return false;
		}
		activeLink.classList.remove("active");
		if (activeLink.getAttribute("href") === "#customize"){
			hideInnerList();	
		}
	}

	function afterAnimation() {
		animating = false;
		if (targetId === "#customize"){
			dispayInnerList();
		}
		linkClicked.classList.add("active");	
	}
	
	
}

function dispayInnerList() {
	Velocity(innerList, "slideDown", {
		display: "block",
		duration: 150
	});
	
}

function hideInnerList() {
	if (innerList.classList.contains("velocity-animating")){
		return false;
	}
	Velocity(innerList, "slideUp", {
		display: "none",
		duration: 150
	});
}




function getScroll(w) {
	// Use the specified window or the current window if no argument
	w = w || window;
	// This works for all browsers except IE versions 8 and before
	if (w.pageXOffset != null) return w.pageYOffset;
	// For IE (or any browser) in Standards mode
	var d = w.document;
	if (document.compatMode == "CSS1Compat")
	return d.documentElement.scrollTop;
	// For browsers in Quirks mode
	return d.body.scrollTop ;
}