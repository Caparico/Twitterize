//A polyfill for older browsers that don't support the 'Object.create' function.

if (typeof Object.create !== 'function') {	//if the browser doesn't support 'Object.create' it will NOT recognize it as a function.
	Object.create = function(obj) {	// make the browser accept the object
		function F() {};	// a constructor function
		F.prototype = obj;	//setting the function's prototype = twitter object, on line 64. This will enable the inheritance of it's qualities.
		return new F();	// launch a new instatnce of this function, after it had inheritted methods from the 'twitter' object I define. This instance is then stored in the 'twitter' object.
	};
}

// Here starts the actual pplug-in:

(function($, window, document, undefined) {	// passing a self-executing anonymous function to make sure my plugin doesn't clash with any other script that might be using the $ to refer to something else. Also, adding common parameters like window & document & undefined.
	var Twitter = {
		init: function(options, elem) {	// an 'init' method to initiate the plugin's proccess.
			var self = this;	// Since 'this' is a moving target, I'm caching it into the 'self' variable for a comfortable LOCAL scope.

			self.elem = elem;		// I am storing the <ul> with a class of 'tweets'(from index.html) into the variable 'elem'.
			self.$elem = $(elem);	// Because I set 'elem' to the local scope variable self('this').elem, I am setting it here to $(elem), just so I can still use the jQuery method 'this' (and I will use it, in the Display method below).

			self.url = 'http://search.twitter.com/search.json';

			if (typeof options === 'string') { //if the user had passed a string to search for - I use it.
				self.search = options;
			} else { 					// if the user had passed an object - I store it to override the default search.
				self.search = options.search;
			}

			self.options = $.extend( {}, $.fn.Twitterize.options, options );	//making sure that the user can pass a search term that will override the default search('preendotme'). 'options' will be equal to the search term inserted by the user, on index.html.

			self.cycle();	 
		},
		cycle: function() {		// this is the method that calls/triggers all the functions below it, so they all appear inside it.
			var self = this;

			self.fetch().done(function(results) {	// once the 'fetch' method is done fetching relevant tweets - they will be available as 'results'.
				self.buildFragment(results);		// the buildFragment method will filter through them.
				self.display();						// the display method will simply display them.
			});
		},

		fetch: function() {		// this is the method that retrieves the relevant tweets from Twitter.
			return $.ajax({
				url: this.url,
				data: { q: this.search },
				dataType: 'jsonp'
			});
		},

		buildFragment: function(results) {	// this method is used to FILTER through all of the reults(tweets) that came back, and pick only some of them.
			var self = this;	// 

			self.tweets = $.map(results.results, function(obj, i) {	// setting the 'tweets' object to the query's results. I am mapping through 'results.results' because when the tweets are retrieved they come as an array of tweets wrapped inside an OBJECT. Filtering the results array using the 'map' method, to get access to the object(obj) and then to the Index(i).
				return $(self.options.wrapEachWith).append(obj.text)[0];	// (obj.text)[0] is picking only the specific 'text' node from the array within the object that is returned. Each one is then wrapped inside an <li> tag - as per the default settings of the plug-in.
			});
		
		},

		display: function() {	// This will be the method that displays the tweets that were filtered - onto the screen. 
			var self = this;
	          
   			self.$elem.html(self.tweets);	// I am referencing the search term which I cached earlier (into $elem) and using the jQuery method 'html' to display some tweets from Twitter api.
		}
	};
	
	$.fn.Twitterize = function(options) {
		return this.each(function() {	// inside this scope, 'this' is refering to the jquery object, not to a DOM node, so no need to wrap it in the $(this) jqeury object again, because it will create the following: $($(this)), which is redundent. Returning 'this' allows for a continuation of the cainability. Once it's returned, the object can be manipulated again.
			var twitter = Object.create(Twitter);	//creating an instance of the object by using the 'create' method on Object. It will create a new function and assign it with all of the Twitter object's methods from above, and then, return it.
			twitter.init(options, this); 
		});
	};

	$.fn.Twitterize.options = { // Defining the OPTIONS for the plugin. The user may access the 'options' object, and change them as per his/her defaults.
		search: 'preendotme',		// Setting a default search term, in case the user doesn't insert one.
		wrapEachWith: '<li></li>'	// as a default, wrapping each (text) element in the returned array inside an <li> tag.
	};

})(jQuery, window, document);	// passing the parameters from the top, so it creates a "local scope" for them, as a precaution. Also, not passing anything to the 'undefined' parameter, so that it always stays equal to 'undefined' (undefined=undefined).



