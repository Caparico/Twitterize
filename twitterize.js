//A polyfill for older browsers that don't support the 'Object.create' function.
if (typeof Object.create !== 'function') {	//if the browser doesn't support 'Object.create' it will not recognize it as a function
	Object.create = function(obj) {	// make the browser accept the object
		function F() {};	// a constructor function
		F.prototype = obj;	//setting the function's prototype = Twitter object, right below.
		return new F();	// launch a new instatnce of this function, after it had inheritted methods from the 'Twitter' object I define. This instance is then stored in the 'twitter' object.
	};
}
(function($, window, document, undefined) {	// passing a slef executing function to make sure my plugin doesn't clash with any other script that might be using the $ to refer to something else. Also, adding common parameters like window & document.
	var Twitter = {
		init: function(options, elem) {	// an 'init' method, to  get the plugin started.
			var self = this;

			self.elem = elem;
			self.$elem = $(elem);

			self.url = 'http://search.twitter.com/search.json';

			if (typeof options == 'string') { //if the user had passed a string to search for.
				self.search = options;
			} else { // the user had passed an object.
				self.search = options.search;
				self.options = $.extend( {}, $.fn.queryTwitter.options, options );
				console.log(self.options);
			};
		}
	};
	$.fn.queryTwitter = function(options) {
		return this.each(function() {	// inside this scope, 'this' is refering to the jquery object, not to a DOM node, so no need to wrap it in the $(this) jqeury object again, because it will create the following: $($(this)), which is redundent.
			var twitter = Object.create(Twitter);	//creating an instance of the object by using the 'create' method on Object. It will create a new function and assign it with all of the Twitter object's methods from above, and then, return it.
			twitter.init(options, this); 
		});
	};

	$.fn.queryTwitter.options = { // Defining the OPTIONS for the plugin. The user may access the 'options' object, and change them as per his/her defaults.
		search: '#preendotme'
	};

})(jQuery, window, document);	// passing the parameters from the top, so it creates a "local scope" for them in order to acheive a small performance improvement when the code is minified. I am also not passing anything to the 'undefined' parameter, so that it always stays equal to 'undefined' (undefined=undefined).
