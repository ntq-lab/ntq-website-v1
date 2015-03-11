'use strict';

$(window).ready(function () {
    // Pagination move page
    $('#jump-to').onePageNav().scroll();

    new window.ScrollJumpToFixed({
        contentTop: $('.services-container'),
        jumpToElement: 'jump-to',
        footerElement: $('.footer-container-fluid')
    });

});