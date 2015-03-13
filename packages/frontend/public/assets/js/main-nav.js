;(function() {
	'use strict';

	$(function () {
		// Scroll top auto gen main nav
		$(window).scroll(function () {
			var top = $(window).scrollTop();
			if (top > 0) {
				$('.main-nav-container-fluid').addClass('fixed');
			} else {
				$('.main-nav-container-fluid').removeClass('fixed');
			}
		});
	});

}());
