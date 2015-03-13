;(function() {
	'use strict';
	var CategoryListController = function ($scope, $timeout, $q, Category, Global) {
		var sortByIdentifier = function (categories) {
			categories.sort(function (l, r) {
				return l.identifier - r.identifier;
			});

			return categories;
		};

		var saveCategoryDelays = {};

		$scope.save = function (category, immediate) {
			saveCategoryDelays[category._id] = saveCategoryDelays[category._id] || {};
			saveCategoryDelays[category._id].defer = $q.defer();

			$timeout.cancel(saveCategoryDelays[category._id].timeout);

			saveCategoryDelays[category._id].timeout = $timeout(function () {
				Category.save(category).then(function (updatedCategory) {
					category = updatedCategory;
					saveCategoryDelays[category._id].defer.resolve(category);
				});
			}, !!immediate ? 0 : Global.autoSaveLatency);

			return saveCategoryDelays[category._id].defer.promise;
		};

		$scope.categories = [];

		Category.getAll().then(function (categories) {
			$scope.categories = sortByIdentifier(categories);
		});


		$scope.create = function () {
			Category.create().then(function (category) {
				$scope.categories.push(category);

				$scope.categories = sortByIdentifier($scope.categories);
			});
		};

		$scope.remove = function (category) {
			Category.remove(category).then(function (res) {
				var index = $scope.categories.indexOf(category);
				$scope.categories.splice(index, 1);
			});
		};

		$scope.moveUp = function (category) {
			var index = $scope.categories.indexOf(category);
			if (index > 0) {
				var downCategory = $scope.categories[index - 1];

				// swap identifier
				var temp = downCategory.identifier;
				downCategory.identifier = category.identifier;
				category.identifier = temp;

				$q.all([
					$scope.save(category, true),
					$scope.save(downCategory, true)
				]).then(function () {
					$scope.categories = sortByIdentifier($scope.categories);
				});
			}
		};

		$scope.moveDown = function (category) {
			var index = $scope.categories.indexOf(category);
			if (index < $scope.categories.length - 1) {
				var upCategory = $scope.categories[index + 1];
				// swap identifier
				var temp = upCategory.identifier;
				upCategory.identifier = category.identifier;
				category.identifier = temp;

				$q.all([
					$scope.save(category, true),
					$scope.save(upCategory, true)
				]).then(function () {
					$scope.categories = sortByIdentifier($scope.categories);
				});
			}
		};
	};

	CategoryListController.$inject = ['$scope', '$timeout', '$q', 'Category', 'Global'];

	angular.module('backend.category').controller('CategoryListController', CategoryListController);

}());
