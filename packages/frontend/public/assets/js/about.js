;(function() {
	'use strict';

	$(function () {
		$('#main-nav-about-content').tabs({
			event: 'mouseover'
		});

		//Set max height for element about
		new window.SetMaxHeightElement({
			element: '.main-nav-about-content-slide'
		});

		// Play video
		$('#play-video').click(function (e) {
			e.preventDefault();

			var elementVideo = '<div class="video-box" id="video-box">';
			elementVideo += '<div class="video-box-container">';
			elementVideo += '<div class="video">';
			elementVideo += '<iframe width="640" height="480" src="//www.youtube.com/embed/DD1xnGubRI8" frameborder="0" allowfullscreen></iframe>';
			elementVideo += '</div>';
			elementVideo += '</div>';
			elementVideo += '</div>';

			$('body').append(elementVideo);

			$('#video-box').fadeIn(300, function() {
				$(this).click(function () {
					var self = $(this);
					self.fadeOut(150, self.remove);
				});
			});
		});
	});

}());
