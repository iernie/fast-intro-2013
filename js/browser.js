
var browser = {
	isFullscreen: function () {
		return document.mozFullscreenElement || 
		       document.webkitFullscreenElement;
	},

	requestFullscreen: function ( target ) {

		target = target || document.documentElement;

		target.requestFullscreen = target.requestFullscreen ||
								   target.mozRequestFullScreen ||
								   function () { target.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) };

		target.requestFullscreen();
	},

	requestPointerLock: function() {

		target = document.mozFullscreenElement || 
		         document.webkitFullscreenElement;

        target.requestPointerLock = target.requestPointerLock    ||
                              	    target.mozRequestPointerLock ||
                              	    target.webkitRequestPointerLock;

    	target.requestPointerLock();

    }
}