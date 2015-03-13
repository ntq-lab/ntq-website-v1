;(function() {
	'use strict';

	var currentPage = 1;

	function loadMoreData() {
		currentPage = 1; //track user click on "load more" button, righ now it is 0 click
	}

	function filterDataArticles (categoryID) {
		var isFilterArticles = false;

		if(isFilterArticles) {
			return;
		}
		isFilterArticles = true;

		var dataProcess = {};

		if(categoryID !== null) {
			dataProcess.categoryID = categoryID;
		}

		if($('#display-month-year li a.active').hasClass('year')) {
			dataProcess.year = $('#display-month-year li a.active').attr('data-date');
		} else if($('#display-month-year li a.active').hasClass('month')) {
			dataProcess.month = $('#display-month-year li a.active').attr('data-date');
		}

		$.ajax({
			type: 'GET',
			url: '/api/filter-articles',
			data: dataProcess,
			success: function (data) {
				$('#list-article').html('').fadeOut(100);
				$('#list-article').html(data).fadeIn(300);

				var dataPage = $('#total-page').attr('data-count');

				if(dataPage > 1) {
					$('#load-more').attr('data-page', dataPage);
					$('#load-more').fadeIn();
					loadMoreData();
				}
			},
			error: function () {
				console.log('500 Internal Server Error');
			},
			complete: function () {
				isFilterArticles = false;
			}
		});
	}

	function loadArticles() {
		$('#display-month-year li a').click(function (e) {
			e.preventDefault();

			var categoryID = null;

			//Get categoryID
			if(!!$('#filter-articles').val()) {
				categoryID = $('#filter-articles').val();
			}

			$('#display-month-year li a').removeClass('active');
			$(this).addClass('active');

			filterDataArticles(categoryID);
		});
	}

	function filterArticles() {
		$('#filter-articles').change(function () {
			var categoryID = null;

			if(!!$(this).val()) {
				categoryID = $(this).val();
			}

			filterDataArticles(categoryID);
		});
	}

	$(function () {
		var isLoadingMore = false;

		$('#load-more').click(function (e) {
			e.preventDefault();

			if (isLoadingMore) {
				return;
			}
			isLoadingMore = true;

			var dataProcess = {},
				categoryID = $('#filter-articles').val(),
				totalPages = $(this).attr('data-page');

			dataProcess.categoryID = categoryID;

			if($('#display-month-year li a.active').hasClass('year')) {
				dataProcess.year = $('#display-month-year li a.active').attr('data-date');
			} else if($('#display-month-year li a.active').hasClass('month')) {
				dataProcess.month = $('#display-month-year li a.active').attr('data-date');
			}

			//$('.animation_image').show(); //show loading image

			//make sure user clicks are still less than total pages
			if (currentPage < totalPages) {
				dataProcess.currentPage = currentPage;

				//post page number and load returned data into result element
				$.ajax({
					type: 'GET',
					url: '/api/filter-articles',
					data: dataProcess,
					success: function (data) {
						$('#list-article').append(data); //append data received from server

						//scroll page to button element
						//$("html, body").animate({scrollTop: $("#load_more_button").offset().top}, 500);

						currentPage++;
					},
					error: function () {
						console.log('500 Internal Server Error');
					},
					complete: function() {
						isLoadingMore = false;
					}
				});

				//if (currentPage >= totalPages - 1) {
				//    //reached end of the page yet? disable load button
				//    $('#load-more').attr('disabled', 'disabled');
				//    //$('.animation_image').hide();
				//}
			}

		});

		$('#slideshow-news').tabs().tabs('rotate', 3000, true).addClass('ui-tabs-vertical ui-helper-clearfix');
		loadArticles();
		filterArticles();
		loadMoreData();
	});

}());
