;(function() {
	'use strict';

	$(window).load(function () {
		// Pagination move page
		$('#jump-to').onePageNav().scroll();

		//Set max height for element success stories
		new window.SetMaxHeightElement({
			element: '.success-stories-right-box-slide-content'
		});

		// Menu tab
		$('.success-stories-right-box-slide').tabs({
			event: 'mouseover'
		});

		var defaultOptions = {
			contentTop: $('.success-stories-content'),
			jumpToElement: 'jump-to',
			footerElement: $('.footer-container-fluid')
		};
		new window.ScrollJumpToFixed(defaultOptions);
	});

}());
