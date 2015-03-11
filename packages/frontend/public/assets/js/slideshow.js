'use strict';

var SlideShow = function (slideOptions) {
    this.slideOptions = slideOptions;
    this.currentPosition = 0;
    this.slideShowInterval = null;
    this.numberOfSlides = $(this.slideOptions.slides).length;

    var self = this;
    //tell the buttons what to do when clicked
    $('#' + this.slideOptions.paginationID + ' li a').bind('click', function (e) {
        e.preventDefault();

        //determine new position
        if ($(this).attr('rel') === self.numberOfSlides - 1) {
            self.currentPosition = 0;
        } else {
            if (self.currentPosition === self.numberOfSlides - 1) {
                self.currentPosition = 0;
            } else {
                self.currentPosition++;
            }
        }

        //hide/show controls
        self.manageNav(self.currentPosition);
        clearInterval(self.slideShowInterval);
        self.setTimeInterval();
        //self.slideShowInterval = setInterval(function () {
        //    self.changePosition();
        //}, self.slideOptions.speed);
        self.moveSlide();
    });

    $(this.slideOptions.slides).hover(function () {
        clearInterval(self.slideShowInterval);
    }, function () {
        self.setTimeInterval();
    });

    this.run();
};

SlideShow.prototype.manageNav = function (position) {
    //active pagination
    $('#' + this.slideOptions.paginationID + ' li a').removeClass('active');
    $($('#' + this.slideOptions.paginationID + ' li a')[position]).addClass('active');
};

//moveSlide: this function moves the slide
SlideShow.prototype.moveSlide = function () {
    var self = this;
    $('#' + this.slideOptions.slideHolder).animate({ 'marginLeft': self.slideOptions.slideWidth * (-self.currentPosition) });
};

//changePosition: this is called when the slide is moved by the timer and NOT when the pagination buttons are clicked
SlideShow.prototype.changePosition = function () {
    if (this.currentPosition === this.numberOfSlides - 1) {
        this.currentPosition = 0;
        this.manageNav(this.currentPosition);
    } else {
        this.currentPosition++;
        this.manageNav(this.currentPosition);
    }
    this.moveSlide();
};

//set Time Interval
SlideShow.prototype.setTimeInterval = function () {
    var self = this;
    self.slideShowInterval = setInterval(function () {
        self.changePosition();
    }, self.slideOptions.speed);
};

SlideShow.prototype.run = function () {
    //Assign a timer, so it will run periodically
    var self = this;
    this.slideShowInterval = setInterval(function () {
        self.changePosition();
    }, this.slideOptions.speed);

    $(this.slideOptions.slides).wrapAll('<div id="' + this.slideOptions.slideHolder + '"></div>');
    $(this.slideOptions.slides).css({ 'float': 'left' });

    //set #slidesHolder width equal to the total width of all the slides
    $('#' + this.slideOptions.slideHolder).css('width', self.slideOptions.slideWidth * self.numberOfSlides);
};