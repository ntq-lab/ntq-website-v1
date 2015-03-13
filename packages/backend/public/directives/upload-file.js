;(function() {
	'use strict';

	angular.module('backend').directive('uploadFile', ['$timeout', 'Enhance', function($timeout, Enhance) {

		return {
			scope: {
				onFilesAdd: '&onFilesAdd',
				onProcess: '&onProcess',
				onUploadComplete: '&onUploadComplete',
				onFileUpload: '&onFileUpload'
			},
			link: function ($scope, element, attrs, ctrl) {
				var trigger = element.find('[upload-file-trigger]');
				var dropzone = element.find('[upload-file-dropzone]');
				var maskDock = element.find('.upload-mask-dock');

				var uploader = new plupload.Uploader({
					runtimes: 'html5',
					browse_button: trigger[0],
					url: Enhance.mount('/api/upload/file'),
					filters: {},
					multi_selection: true,
					unique_names: true,
					drop_element: dropzone[0],
					chunk_size: '512kb'
				});

				uploader.bind('FilesAdded', function (up, files) {
					$timeout(function () {
						$scope.onFilesAdd({
							files: files,
							callback: function (addedFiles) {
								maskDock.append(angular.element('<div class="upload-mask" />'));
								uploader.start();
							}
						});
					}, 0);
				});

				uploader.bind('FileUploaded', function (up, file, data) {
					try {
						var response = JSON.parse(data.response);
						if (!!response.file) {
							$timeout(function () {
								$scope.onFileUpload({
									id: file.id,
									file: response.file
								});
							}, 0);
						}
					} catch (e) { }
				});

				uploader.bind('UploadProgress', function (up, file) {
					$timeout(function () {
						$scope.onProcess({
							id: file.id,
							percent: file.percent
						});
					}, 0);
				});

				uploader.bind('UploadComplete', function () {
					$timeout(function () {
						maskDock.find('.upload-mask').remove();

						$scope.onUploadComplete();
					}, 0);
				});

				uploader.init();
			}
		};
	}]);
}());
