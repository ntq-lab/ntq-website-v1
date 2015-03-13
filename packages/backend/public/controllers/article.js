;(function() {

	'use strict';
	var ArticleController = function ($scope, $timeout, $q, Article, Category, Global) {
		var saveDraftDelay;
		var saveExtractDelay = {};
		// private function
		function addExtract(extract) {
			Article.createExtract(extract).then(function (extract) {
				$scope.article.extracts.push(extract);
			});
		}

		$scope.saveExtract = function (extract, immediate) {
			saveExtractDelay[extract._id] = saveExtractDelay[extract._id] || {};

			saveExtractDelay[extract._id].defer = $q.defer();

			$timeout.cancel(saveExtractDelay[extract._id].timeout);

			saveExtractDelay[extract._id].timeout = $timeout(function () {
				Article.updateExtract(extract).then(function (updatedExtract) {
					extract = updatedExtract;
					saveExtractDelay[extract._id].defer.resolve();
				});
			}, !!immediate ? 0 : Global.autoSaveLatency);

			return saveExtractDelay[extract._id].defer.promise;
		};

		$scope.saveChanges = function (immediate) {
			$timeout.cancel(saveDraftDelay);

			saveDraftDelay = $timeout(function () {
				Article.saveDraft($scope.article).then(function () {
					$scope.article.enabled = false;
				});
			}, !!immediate ? 0 : Global.autoSaveLatency);
		};

		// --------------- Controller logic below ---------------

		Article.get().then(function (article) {
			$scope.article = article;

			// bind languages
			$scope.languages = [];
			for (var index in Global.languages) {
				var language = Global.languages[index];

				var data = {
					selected: $scope.article.languages.indexOf(language) > -1,
					text: language
				};

				$scope.languages.push(data);
			}

			// bind categories
			Category.getAll().then(function (categories) {
				$scope.categories = [];

				for (var index in categories) {
					var category = categories[index];
					category.selected = $scope.article.categories.indexOf(category._id) > -1;
					$scope.categories.push(category);
				}
			});

			$scope.article.extracts.sort(function (extract1, extract2) {
				return extract1.identifier - extract2.identifier;
			});
		});

		$scope.onLanguagesChange = function () {
			var arr = [];

			for (var index in $scope.languages) {
				var language = $scope.languages[index];
				if (language.selected) {
					arr.push(language.text);
				}
			}

			$scope.article.languages = arr;

			$scope.saveChanges(true);
		};

		$scope.onCategoriesChange = function () {
			var arr = [];

			for (var index in $scope.categories) {
				var category = $scope.categories[index];
				if (category.selected) {
					arr.push(category._id);
				}
			}

			$scope.article.categories = arr;

			$scope.saveChanges(true);
		};

		// add logics
		$scope.addSmallHeading = function () {
			addExtract({
				style: 0,
				text: 'Small Heading'
			});
		};

		$scope.addParagraphTextOnly = function () {
			addExtract({
				style: 1,
				text: 'Text only'
			});
		};

		$scope.addParagraphTextLeft = function () {
			addExtract({
				style: 2,
				text: 'Text left'
			});
		};

		$scope.addParagraphTextRight = function () {
			addExtract({
				style: 3,
				text: 'Text right'
			});
		};

		$scope.addParagraphImageOnly = function () {
			addExtract({
				style: 4
			});
		};

		$scope.moveUp = function (extract) {
			var index = $scope.article.extracts.indexOf(extract);
			if (index > 0) {
				var downExtract = $scope.article.extracts[index - 1];

				// swap identifier
				var temp = downExtract.identifier;
				downExtract.identifier = extract.identifier;
				extract.identifier = temp;

				$q.all([
					$scope.saveExtract(extract, true),
					$scope.saveExtract(downExtract, true)
				]).then(function () {
					$scope.article.extracts.sort(function (extract1, extract2) {
						return extract1.identifier - extract2.identifier;
					});
				});
			}
		};

		$scope.moveDown = function (extract) {
			var index = $scope.article.extracts.indexOf(extract);
			if (index < $scope.article.extracts.length - 1) {
				var upExtract = $scope.article.extracts[index + 1];
				// swap identifier
				var temp = upExtract.identifier;
				upExtract.identifier = extract.identifier;
				extract.identifier = temp;

				$q.all([
					$scope.saveExtract(extract, true),
					$scope.saveExtract(upExtract, true)
				]).then(function () {
					$scope.article.extracts.sort(function (extract1, extract2) {
						return extract1.identifier - extract2.identifier;
					});
				});
			}
		};

		$scope.removeExtract = function (extract) {
			Article.removeExtract(extract).then(function () {
				var index = $scope.article.extracts.indexOf(extract);
				$scope.article.extracts.splice(index, 1);
			});
		};

		$scope.onImageUpload = function (extract, image) {
			extract.image = image;
			$scope.saveExtract(extract, true);
		};

		$scope.onImageRemove = function (extract) {
			Article.removeImage(extract.image);
			extract.image = null;
			$scope.saveExtract(extract, true);
		};

		var clientImages = {};

		$scope.onGalleryImageAdd = function (id, image) {
			$scope.article.gallery[clientImages[id]] = image;
			delete clientImages[id];
			$scope.saveChanges(true);
		};

		$scope.onGalleryImageClientAdd = function (images) {
			for (var i = 0; i < images.length; i++) {
				clientImages[images[i].id] = $scope.article.gallery.length;
				$scope.article.gallery.push('');
			}
		};

		$scope.onGalleryImageUpdate = function (image, index) {
			Article.removeImage($scope.article.gallery[index]);

			$scope.article.gallery[index] = image;

			$scope.saveChanges(true);
		};

		$scope.onGalleryImageRemove = function (index) {
			Article.removeImage($scope.article.gallery[index]);

			$scope.article.gallery.splice(index, 1);

			$scope.saveChanges(true);
		};

		$scope.onAvatarUpdate = function (image) {
			if (!!$scope.article.avatar) {
				Article.removeImage($scope.article.avatar);
			}

			$scope.article.avatar = image;

			$scope.saveChanges(true);
		};

		$scope.onAvatarRemove = function () {
			if (!!$scope.article.avatar) {
				Article.removeImage($scope.article.avatar);
			}

			$scope.article.avatar = null;

			$scope.saveChanges(true);
		};
	};

	ArticleController.$inject = ['$scope', '$timeout', '$q', 'Article', 'Category', 'Global'];

	angular.module('backend.article').controller('ArticleController', ArticleController);
}());
