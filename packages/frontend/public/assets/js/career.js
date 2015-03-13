;(function() {
	'use strict';

	$(function () {
		$('.detail-career-box').each(function () {
			var childHead = $(this).find('.detail-career-box-head');
			var parent = $(this);
			$(childHead).click(function () {

				var childContent = $(parent).find('.detail-career-box-content');
				$(childContent).slideToggle();
				if ($(parent).hasClass('active')) {
					$(parent).removeClass('active');
				} else {
					$(parent).addClass('active');
				}
			});
		});
	});
}());
