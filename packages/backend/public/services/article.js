;(function() {
	'use strict';

	angular.module('backend.article').factory('Article', ['API', 'Global', function (API, Global) {
		var id = Global.articleID;
		return {
			get: function () {
				return API.call('get', '/article/' + id).then(function (data) {
					return data.article;
				});
			},
			saveDraft: function (article) {
				//return console.log(article);
				return API.call('put', '/article/' + id, {
					avatar: article.avatar,
					bulletin: article.bulletin,
					categories: article.categories,
					enabled: false,
					gallery: article.gallery,
					heading: article.heading,
					highlighted: article.highlighted,
					languages: article.languages,
					time: article.time
				}).then(function (data) {
					return data.article;
				});
			},
			removeImage: function (image) {
				return API.call('delete', '/upload/image/' + image);
			},
			createExtract: function (extract) {
				return API.call('post', '/extract/' + id, extract).then(function (data) {
					return data.extract;
				});
			},
			updateExtract: function (extract) {
				return API.call('put', '/extract/' + id + '/' + extract._id, extract).then(function (data) {
					return data.extract;
				});
			},
			removeExtract: function (extract) {
				return API.call('delete', '/extract/' + id + '/' + extract._id);
			}
		};
	} ]);

}());
