/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * @param object menu               jQuery object
 * @param object trigger_element    jQuery object
 */
function FloatingMenu(menu, trigger_element){
    var self = this;

    self.menu = menu;
    self.position = trigger_element.offset().top;
    self.active = false;

    /**
     * Object initialization.
     */
    self._init = function() {
        // connect signals
        $(window).on('scroll', self.handle_scroll);

        // set initial state
        self.handle_scroll(null);
    };

    /**
     * Handle window scroll.
     *
     * @param object event
     */
    self.handle_scroll = function(event) {
        var over_position = $(window).scrollTop() >= self.position;

        if (over_position && !self.active) {
            self.menu.addClass('active');
            self.active = true;

        } else if (!over_position && self.active) {
            self.menu.removeClass('active');
            self.active = false;
        }
    };

    // finalize object
    self._init();
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile()) 
		Site.mobile_menu = new Caracal.MobileMenu();

	if (!Site.is_mobile()) {

		 Site.client_logo_slider_mobile = new Caracal.Gallery.Slider();
		 Site.client_logo_slider_mobile
			.images.set_container('div.slider')
			.images.set_visible_count(5)
			.images.set_step_size(1)
			.images.set_center(true)
			.images.add('div.slider img')
			.controls.attach_next(' a.next')
			.controls.attach_previous(' a.previous');
		 Site.client_logo_slider_mobile.images.update();

	}

	// create slider for client logo gallery
	 Site.client_logo_slider_mobile = new Caracal.Gallery.Slider();
	 Site.client_logo_slider_mobile
		.images.set_container('div.slider')
		.images.set_visible_count(1)
		.images.set_step_size(1)
		.images.set_center(true)
		.images.add('div.slider img')
		.controls.attach_next(' a.next')
		.controls.attach_previous(' a.previous');
	 Site.client_logo_slider_mobile.images.update();

	 // create fixed position menu
	Site.menu = new FloatingMenu($('div.menu'), $('section.about'));

	//Scroll Function
	$('a[href*=#]').bind('click', function(e) {
		e.preventDefault(); //prevent the "normal" behaviour which would be a "hard" jump

		var target = $(this).attr("href"); //Get the target

	// perform animated scrolling by getting top-position of target-element and set it as scroll target
		$('html, body').stop().animate({ scrollTop: $(target).offset().top - 120 }, 1000, function() {
		     location.hash = target;  //attach the hash (#jumptarget) to the pageurl
		});

		return false;
	   });

	var btn = $('a#open');
	var btn_payment = $('a.pay');
	var payment_option_dialog = $('div.payment_dialog');
	var form = $('div.form_wrap');
	var btn_close = $('a.close');
	var btn_close_payment = $('a.close_payment');
	// function for opening sponsers form
	btn.on('click',function() {
		form.addClass('open');
	});

	//  function for closing sponsers form 
	btn_close.on('click',function() {
		form.removeClass('open');
	});

	//  function for opening payment options
	btn_payment.on('click', function() {
		payment_option_dialog.addClass('open');
	})

	//  function for closing payment options dialog

	btn_close_payment.on('click',function() {
		payment_option_dialog.removeClass('open');
	})
};	


// connect document `load` event with handler function
$(Site.on_load);
