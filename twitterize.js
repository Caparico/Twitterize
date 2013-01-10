//A polyfill for older browsers that don't support the 'Object.create' function.
if (typeof Object.create !== 'function') {	//if the browser doesn't support 'Object.create' it will not recognize it as a function
	Object.create = function(obj) {	// make the browser accept the object
		function F() {};	// a constructor function
		F.prototype = obj;	//setting the function's prototype = Twitter object, right below.
		return new F();	// launch a new instatnce of this function, after it had inheritted methods from the 'Twitter' object I define. This instance is then stored in the 'twitter' object.
	};
}

(function($, window, document, undefined) {	// passing a slef executing function to make sure my plugin doesn't clash with any other script that might be using the $ to refer to something else. Also, adding common parameters like window & document & undefined.
	var Twitter = {
		init: function(options, elem) {	// an 'init' method, to  get the plugin started.
			var self = this;	// Since 'this' is a moving target, I'm setting it into the variable 'self', so I can still use it later if I need to.

			self.elem = elem;
			self.$elem = $(elem);	// Since I had set elem to the local scope variable self('this').elem, I am setting it here to $(elem), just so I can still use the jQuery method 'this' if I need to.

			self.url = 'http://search.twitter.com/search.json';

			if (typeof options === 'string') { //if the user had passed a String to search for.
				self.search = options;
			} else { 					// if the user had passed an Object.
				self.search = options.search;
				self.options = $.extend( {}, $.fn.queryTwitter.options, options );
				// console.log(self.options);
			}

			self.cycle();	// this will be the method that calls everything and displays it. 
		},
		cycle: function() {
			var self = this;

			self.fetch().done(function(results) {
				self.buildFragment(results);
				self.display();
			});
		},

		fetch: function() {	// this will be the method that retrieves the relevant tweets from Twitter.
			return $.ajax({
				url: this.url,
				data: { q: this.search },
				dataType: 'jsonp'
			});
		},

		buildFragment: function(results) {
			var self = this;

			self.tweets = $.map(results.results, function(obj, i) {
				console.log(obj);
			});
		},

		display: function() {	// this will be the method that displays the tweets that were retrieved onto the screen. 
			this.$elem.html(self.tweets);	//is that available?? I am referencing the search term which I cached earlier into $elem.
		}
	};
	$.fn.queryTwitter = function(options) {
		return this.each(function() {	// inside this scope, 'this' is refering to the jquery object, not to a DOM node, so no need to wrap it in the $(this) jqeury object again, because it will create the following: $($(this)), which is redundent.
			var twitter = Object.create(Twitter);	//creating an instance of the object by using the 'create' method on Object. It will create a new function and assign it with all of the Twitter object's methods from above, and then, return it.
			twitter.init(options, this); 
		});
	};

	$.fn.queryTwitter.options = { // Defining the OPTIONS for the plugin. The user may access the 'options' object, and change them as per his/her defaults.
		search: 'preendotme'
	};

})(jQuery, window, document);	// passing the parameters from the top, so it creates a "local scope" for them, as a precaution. Also, not passing anything to the 'undefined' parameter, so that it always stays equal to 'undefined' (undefined=undefined).



