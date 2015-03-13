;(function() {
	'use strict';

	angular.module('backend.downloadable').factory('Folder', ['API', function(API) {
		return {
			all: function () {
				return API.call('get', '/folders').then(function (data) {
					return data.folders;
				});
			},
			create: function () {
				return API.call('post', '/folder').then(function (data) {
					return data.folder;
				});
			},
			save: function (folder) {
				return API.call('put', '/folder/' + folder._id, folder).then(function (data) {
					return data.folder;
				});
			},
			remove: function (folder) {
				return API.call('delete', '/folder/' + folder._id);
			},
			createFile: function (folder, file) {
				return API.call('post', '/file/' + folder._id, file).then(function (data) {
					return data.file;
				});
			},
			updateFile: function (folder, file) {
				return API.call('put', '/file/' + folder._id + '/' + file._id, file).then(function(data) {
					return data.file;
				});
			},
			removeFile: function (folder, file) {
				return API.call('delete', '/file/' + folder._id + '/' + file._id);
			}
		};
	} ]);

}());
