
(function(){

//query the resources
var sidebar = document.querySelector(".sticky-sidebar");
var sidebarHeader = document.querySelector(".sticky-sidebar-header");
var sidebarContent = document.querySelector(".sticky-sidebar-content");
var pageContent = document.querySelector(".page-content");

var navbarClassPrefix = detectCssTransform();

//the only function that runs
setupSidebar();


function setupSidebar() {

	/*These 4 variables(behave like globals) are accessed via closure scope by different event handlers.
	The event handler modify them and because of scoping the the updated values
	are visible to all event handlers invoked hence.*/

	/*Adding the scroll bar postion to the sidebar top coordinates gives us consistent top value
	(in document coordinates) irrespective of the scroll postion*/
	var sidebarBox = sidebar.getBoundingClientRect();
	var scroll = getScroll();
	var sidebarY = sidebarBox.top + scroll;
	var viewportWidth = getViewportWidth();



	/*User settings for the sidebar*/
	var switchWidth = parseInt(sidebar.getAttribute("data-switch-width"), 10);
	var addClass =  !(sidebar.getAttribute("data-optimize") === "true");

	if(window.addEventListener){
		window.addEventListener("scroll", stickySidebar, false);
		window.addEventListener("resize", sidebarResize, false);
		sidebarHeader.addEventListener("click", displayNavbarMenu, false);
	} else{
		// IE8
		window.attachEvent("onscroll", stickySidebar);
		window.attachEvent("onresize", sidebarResize);
		sidebarHeader.attachEvent("onclick", displayNavbarMenu);
	}
	
	/* If user starts in the mobile display mode, we need to attach the
	navbar classe for fixing layout. Only run if addClass is false.*/
	/*if (switchWidth && viewportWidth <= switchWidth && addClass) {
		sidebar.classList.add("navbar");
		pageContent.classList.add("navbar");
	}*/
	addNavbarClass();

	function stickySidebar() {

		if (switchWidth && viewportWidth <= switchWidth) {
			//user in mobile view; let stickyNavbar handle it
			stickyNavbar();
			return false;
		}

		/* if srcoll postion is below the sidebar top value, make its position fixed.
		When user scrolls back top remove all the inline attributes*/
		var scroll = getScroll();
		var sidebarStyle = sidebar.style;
		if(scroll >= sidebarY) {
			if(sidebarStyle.position !== "fixed") {
				//only apply inline styles if have not applied before
				sidebarStyle.position = "fixed";
				sidebarStyle.top = "0px";
				sidebarStyle.left = sidebarBox.left + "px";
			}
		} else {
			// only run removeAttribute if there is some inline style applied
			if (sidebarStyle.position) {
				sidebar.removeAttribute("style");
			}	
		}
	}

	function stickyNavbar() {

		//add the navbar class if not there
		/*if (!sidebar.classList.contains("navbar") && addClass){
			sidebar.classList.add("navbar");
			pageContent.classList.add("navbar");
		}*/
		
		var scroll = getScroll();
		var sidebarStyle = sidebar.style;
		if(scroll >= sidebarY) {
			if(sidebarStyle.position !== "fixed") {

				/* to avoid the sticky navbar covering the some page content add margin-top
				on the sibling .page-content.*/
				var headerBox = sidebarHeader.getBoundingClientRect();
				var pageContentCompStyle = window.getComputedStyle(pageContent);
				//take into account the existing margin-top if any
				var oldMargin = parseInt(pageContentCompStyle.marginTop, 10);
				pageContent.style.marginTop = oldMargin + headerBox.height + 5 + "px";

				//fix to make sticky navbar
				sidebarStyle.position = "fixed";
				sidebarStyle.top = "0px";
			}
		} else {
			if(sidebarStyle.position){
				sidebar.removeAttribute("style");
				pageContent.removeAttribute("style");
			}
		}
	}

	function displayNavbarMenu() {
		if(!switchWidth || (viewportWidth > switchWidth)){
			return false;
		}

		if(navbarClassPrefix !== "-plain"){
			sidebarContent.classList.toggle("reveal");
		} else{
			var sidebarContentStyle = sidebarContent.style;
			if (sidebarContentStyle.display === "none" || sidebarContentStyle.display === "" ) {
				sidebarContentStyle.display = "block";
			} else {
				sidebarContentStyle.display = "none";
			}
		}
	}

	function sidebarResize() {
		setupResize();
		stickySidebar();	
	}

	function setupResize() {
		sidebar.removeAttribute("style");
		pageContent.removeAttribute("style");

		//update navbar class if needed
		viewportWidth = getViewportWidth();
		removeNavbarClass();
		addNavbarClass();
		if(viewportWidth > switchWidth){
			//edge case; the navbar menu is not removed on resize unless we change layout
			sidebarContent.removeAttribute("style");
			if(sidebarContent.classList.contains("reveal")){
				//remove reveal class if there
				sidebarContent.classList.remove("reveal");
			}
		}

		//update the closure variables (must do this after updating the navbar class)
		var newScroll = getScroll();
		sidebarBox = sidebar.getBoundingClientRect();
		sidebarY =  sidebarBox.top + newScroll;
	}

	function addNavbarClass() {
		if (switchWidth && viewportWidth <= switchWidth && addClass){
			sidebar.classList.add("navbar" + navbarClassPrefix);
			pageContent.classList.add("navbar" + navbarClassPrefix);
		}
	}

	function removeNavbarClass() {
		if (switchWidth && viewportWidth > switchWidth && addClass){
			sidebar.classList.remove("navbar" + navbarClassPrefix);
			pageContent.classList.remove("navbar" + navbarClassPrefix);
		}
	}
}

function detectCssTransform() {
	if (sidebar.style.transform !== undefined && sidebar.style.transition !== undefined){
		return ""; // no prefix when CSS transforms available
	}

	return "-plain";
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

function getViewportWidth(w) {
	// Use the specified window or the current window if no argument
	w = w || window;
	// This works for all browsers except IE8 and before
	if (w.innerWidth != null) return w.innerWidth;

	// For IE (or any browser) in Standards mode
	var d = w.document;
	if (document.compatMode == "CSS1Compat") return d.documentElement.clientWidth;
	
	// For browsers in Quirks mode
	return d.body.clientWidth;
}

//classList polyfill
(function () {

if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

var prototype = Array.prototype,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join;

function DOMTokenList(el) {
  this.el = el;
  // The className needs to be trimmed and split on whitespace
  // to retrieve a list of classes.
  var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    push.call(this, classes[i]);
  }
};

DOMTokenList.prototype = {
  add: function(token) {
    if(this.contains(token)) return;
    push.call(this, token);
    this.el.className = this.toString();
  },
  contains: function(token) {
    return this.el.className.indexOf(token) != -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    if (!this.contains(token)) return;
    for (var i = 0; i < this.length; i++) {
      if (this[i] == token) break;
    }
    splice.call(this, i, 1);
    this.el.className = this.toString();
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (!this.contains(token)) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return this.contains(token);
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();//end polyfill

}()); // end sticky-sidebar