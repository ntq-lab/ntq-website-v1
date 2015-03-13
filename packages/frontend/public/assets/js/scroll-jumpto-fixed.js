;(function() {
	'use strict';

	var ScrollJumpToFixed = window.ScrollJumpToFixed = function(defaultOptions) {
		this.defaultOptions = defaultOptions;
		//this.footerTop = $('.footer-container-fluid').offset().top;
		//this.widthBody = $(window).width();
		//this.widthContainer = 1000;
		this.contentTop = this.defaultOptions.contentTop.offset().top;
		//this.leftJumpTo = null;
		this.jumpToTop = $('#' + this.defaultOptions.jumpToElement).offset().top;
		//this.mainNavHeight = $('.main-nav-container-fluid').outerHeight();

		//var setResizeTask = null,
		//    self = this;

		//$(window).resize(function () {
		//    //$('#jump-to').removeClass('fixed');
		//    clearTimeout(setResizeTask);
		//    setResizeTask = setTimeout(function () {
		//        var widthBodyResize = $(window).width(),
		//        //widthContainerResize = 1000,
		//            leftJumpToResize;

		//        if ((widthBodyResize - self.widthContainer) > 0) {
		//            leftJumpToResize = (widthBodyResize - self.widthContainer) / 2;
		//        } else {
		//            leftJumpToResize = 0;
		//        }
		//        self.scrollJumpToSetFixed(leftJumpToResize);
		//    }, 300);
		//});

		//this.run();
		this.scrollJumpToSetFixed();
	};

	ScrollJumpToFixed.prototype.scrollJumpToSetFixed = function () {
		var self = this,
			//footerTop = self.defaultOptions.footerElement.offset().top,
			heightJumpto = $('#' + self.defaultOptions.jumpToElement).outerHeight(),
			paddingBottomContentFooter = self.defaultOptions.contentTop.parent().offset().top - self.defaultOptions.contentTop.offset().top;

		$(window).scroll(function () {
			var scrollY = $(this).scrollTop(),
				footerTop = self.defaultOptions.footerElement.offset().top,
				positionFixedJumpTo = footerTop - $('#' + self.defaultOptions.jumpToElement).outerHeight() - self.jumpToTop - paddingBottomContentFooter;
			//console.log(scrollY + '-' + footerTop + '-' + (footerTop - heightJumpto));
			//console.log(footerTop);

			if (scrollY > (self.contentTop - 70)) {
				//if (scrollY < (self.maxY - self.mainNavHeight)) {
				//if (scrollY < self.footerTop) {
				if (scrollY < (footerTop - heightJumpto - paddingBottomContentFooter)) {
					$('#' + self.defaultOptions.jumpToElement).addClass('fixed').removeAttr('style');
				} else {
					$('#' + self.defaultOptions.jumpToElement).removeClass('fixed').css({
						'position': 'absolute',
						//'top': (self.footerTop) + 'px'
						'top': (positionFixedJumpTo) + 'px'
					});
				}
			} else {
				$('#' + self.defaultOptions.jumpToElement).removeClass('fixed');
			}
		});
	};

}());
