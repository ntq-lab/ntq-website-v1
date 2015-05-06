;(function () {
	'use strict';

	function goToByScroll(id, heightMenu) {
		// Remove "link" from the ID
		id = id.replace('link2', '');
		// Scroll
		$('html,body').animate({ scrollTop: $('#' + id).offset().top - heightMenu }, 750, 'swing');
	}

	function setFullHeightELement(heightWindow, heightDefault, heightMenu) {
		var distanceVerticleBoxes = 6,
			distanceHorizontalBoxes = 4,
			distanceBoxes = 2,
			minWidthBody = 1200;

		// Welcome Page
		if (heightWindow > heightDefault.welcome) {
			$('#welcome').css({ 'height': heightWindow + heightMenu + 'px' });
			$('#welcome .container').css({ 'height': heightWindow + heightMenu + 'px' });
			$('#first-page').css({ 'height': heightWindow + heightMenu + 'px' });
			//$('#wrapper-parallax').css({ 'margin-top': heightWindow + heightMenu + 'px' });
		}

		// News Page
		if (heightWindow > heightDefault.news) {
			var heightBox = (heightWindow - distanceVerticleBoxes) / 2;
			if((heightBox * 3) < minWidthBody) {
				$('#news').css({ 'height': heightWindow + 'px' });
				$('#news .news-container').css({'height': heightWindow + 'px', 'width': (heightBox * 3) + distanceHorizontalBoxes + 'px'});
				$('#news .news-container .news-box').css({'height': heightBox + 'px', 'width' : heightBox + 'px'});
				$('#news .news-container .news-box:first').css({'height': heightBox + 'px', 'width' : (heightBox * 2) + distanceBoxes + 'px'});
			} else {
				var widthBox = (minWidthBody - distanceHorizontalBoxes) / 3;
				$('#news').css({ 'height': (widthBox * 2) + distanceVerticleBoxes + 'px' });
				$('#news .news-container').css({'height': (widthBox * distanceBoxes) + distanceVerticleBoxes + 'px', 'width': (widthBox * 3) + distanceHorizontalBoxes + 'px'});
				$('#news .news-container .news-box').css({'height': widthBox + 'px', 'width' : widthBox + 'px'});
				$('#news .news-container .news-box:first').css({'height': widthBox + 'px', 'width' : (widthBox * 2) + distanceBoxes + 'px'});
			}
		}

		// About Page
		if (heightWindow > heightDefault.about) {
			$('#about').css({ 'height': heightWindow + 'px' });
			//var heightLineBlack = $('#about .line-black').height(),
			//    heightHgroup = $('#about hgroup').height(),
			//    heightTimeLine = $('#about .timeline').height(),
			//    heightFounderImage = $('#about .founder-image').height();

			//$('#about hgroup').css({ 'margin-bottom': (heightWindow - heightLineBlack - heightTimeLine - heightFounderImage) / 2 + 'px' });
			var heightAboutContainer = $('#about .container').height();
			$('#about .founder-image').css({ 'height': heightWindow - heightAboutContainer + 'px' });
		}

		// Services Page
		//if (heightWindow > heightDefault.services) {
			$('#services').css({ 'height': heightWindow + 'px' });
			$('#services .container').css({ 'height': heightWindow + 'px' });
		//}

		// Technology Page
		if (heightWindow > heightDefault.technology) {
			$('#technology').css({ 'height': heightWindow + 'px' });
			$('#technology .container').css({ 'height': heightWindow + 'px' });
			var heightTechnologyTop = $('#technology .technology-container-top').height();
			//var heightLineBottomTechnology = $('#technology .line-white-bottom').height();
			var heightTechnologyPost = $('#technology .technology-post').height();
			$('#technology .technology-post').css({ 'margin-top': (heightWindow - heightTechnologyTop - heightTechnologyPost) / 2 + 'px' });
			//$('#technology .line-white-bottom').css({ 'height': (heightWindow - heightTechnologyTop - heightTechnologyPost) / 2 + 'px' });
		}

		// Partner Page
		if (heightWindow > heightDefault.partner) {
			$('#partner').css({ 'height': heightWindow + 'px' });
			$('#partner .container').css({ 'height': heightWindow + 'px' });
			var heightPartnerTop = $('#partner .partner-top').height();
			var heightPartnerBottom = $('#partner .partner-bottom').height();
			$('#partner .partner-bottom').css({ 'margin-top': ((heightWindow - heightPartnerTop) - heightPartnerBottom) / 2 + 'px' });
		}
	}

	function setFullHeight(heightMenu) {
		// Get height default
		var heightDefault = {
			welcome : $('#first-page').height(),
			news : $('#news').height(),
			about : $('#about').height(),
			services : $('#services').height(),
			technology : $('#technology').height(),
			partner : $('#partner').height()
		};

		var heightWindow = $(window).height();
		heightWindow = heightWindow - heightMenu;

		// Set position Jump To
		//var heightJumpTo = $('#jump-to').height();
		//$('#jump-to').css({ 'top': (heightWindow - heightJumpTo) / 2 + 'px' });

		// Set full height page
		setFullHeightELement(heightWindow, heightDefault, heightMenu);

		var setFullHeightTask;

		$(window).resize(function () {
			clearTimeout(setFullHeightTask);
			setFullHeightTask = setTimeout(function () {
				var heightWindowResize = $(window).height();
				heightWindowResize = heightWindowResize - heightMenu;

				// Set position Jump To
				//$('#jump-to').css({ 'top': (heightWindowResize - heightJumpTo) / 2 + 'px' });

				// Set full height page
				setFullHeightELement(heightWindowResize, heightDefault);

				// Set image logo align center
				var heightCanvasResize = $('#canvas').height();

				if (heightCanvasResize > $('#canvas img').height()) {
					$('#canvas img').css({
						'margin-top': (heightCanvasResize - $('#canvas img').height()) / 2 + 'px'
					});
				}
			}, 30);
		});
	}

	function loadLogoFallback(logo) {
		$('#canvas').append($(logo));
		$(logo).animate({
			opacity: 1
		}, 1e3);

		var heightLogo = $('#canvas img').height(),
			heightCanvas = $('#canvas').height();

		$('#canvas img').css({
			'margin-top': (heightCanvas - heightLogo) / 2 + 'px'
		});
	}

	function logoFallback() {
		var logo = new Image();

		logo.src = '/frontend/assets/img/NTQ-Solution.png';

		logo.onreadystatechange = function () {
			if(this.readyState === 'complete') {
				loadLogoFallback(logo);
			}
		};

		logo.onload = function () {
			loadLogoFallback(logo);
		};

		$(logo).css('opacity', 0);
	}

	$(document).ready(function () {
		var heightMenu = $('.main-nav-container-fluid').outerHeight();

		// Set full height
		setFullHeight(heightMenu);

		// Pagination move page
		$('#jump-to').onePageNav().scroll();

		$('#serviceslink2').click(function (e) {
			$('#jump-to li').removeClass('current');
			// Prevent a page reload when a link is pressed
			e.preventDefault();
			// Call the scroll function
			goToByScroll($(this).attr('id'), heightMenu);
			// Add class "active"
			$('#newsJumpTo').addClass('current');
		});

		// Slideshow services
		new window.SlideShow({
			slideWidth: 1024,
			slides: '.slide',
			paginationID: 'sevices-pagination',
			slideHolder: 'slidesHolder',
			speed: 10000
		});

		//Slideshow testimonials
		new window.SlideShow({
			slideWidth: 1024,
			slides: '.slide-testimonials',
			paginationID: 'testimonials-pagination',
			slideHolder: 'slidesHolderTestimonials',
			speed: 10000
		});

		$('.loading-mask').fadeOut(function () {
			$('.loading-mask').remove();

			if (window.LOGO && window.LOGO.show) {
				window.LOGO.show(logoFallback);
			}
		});

		// Play video
		$('#play-video').click(function (e) {
			e.preventDefault();

			var elementVideo = '<div class="video-box" id="video-box">';
			elementVideo += '<div class="video-box-container">';
			elementVideo += '<div class="video">';
			elementVideo += '<iframe width="640" height="480" src="//www.youtube.com/embed/DD1xnGubRI8?autoplay=1" frameborder="0" allowfullscreen></iframe>';
			elementVideo += '</div>';
			elementVideo += '</div>';
			elementVideo += '</div>';

			$('body').append(elementVideo);

			$('#video-box').fadeIn(300);

			$('#video-box').click(function () {
				$(this).fadeOut(100);
				$(this).remove();
			});
		});
	});

}());
