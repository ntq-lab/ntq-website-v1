;(function() {
	'use strict';

	angular.module('backend').directive('uploadImage', ['$timeout', 'Enhance', function ($timeout, Enhance) {
		return {
			templateUrl: '/backend/views/upload-image.html',
			scope: {
				control: '=control',
				ngUpload: '&ngUpload',
				ngRemove: '&ngRemove',
				ngAdd: '&ngAdd',
				image: '@uploadImage'
			},
			link: function ($scope, element, attrs, ctrl) {
				$scope.$watch('control', function () {
					var trigger = element.find('.upload-trigger');

					element.find('.remove-trigger').bind('click', function () {
						$timeout(function () {
							$scope.image = null;
							$scope.ngRemove();
						}, 0);
					});

					var uploader = new plupload.Uploader({
						runtimes: 'html5, html4',
						browse_button: trigger[0],
						url: Enhance.mount('/api/upload/image'),
						filters: {},
						multi_selection: !!$scope.control,
						unique_names: true,
						chunk_size: '512kb'
					});

					uploader.bind('FilesAdded', function (up, files) {
						up.files = files;

						$timeout(function () {
							$scope.ngAdd({
								images: files
							});
							up.start();
						});
					});

					uploader.bind('FileUploaded', function (up, file, data) {
						try {
							var response = JSON.parse(data.response);

							if (!!response.image) {
								$timeout(function () {
									if (!$scope.control) {
										$scope.image = response.image;
									}
									$scope.ngUpload({
										id: file.id,
										image: response.image
									});
								}, 0);
							}
						} catch (e) { }
					});
					uploader.init();
				});
			}
		};
	}]);

}());
