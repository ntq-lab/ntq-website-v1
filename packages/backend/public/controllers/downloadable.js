'use strict';
var DownloadableController = function ($scope, $timeout, $q, Global, Folder) {
	// define ultility functions
	var saveFolderDelays = {};
	var saveFilesDelays = {};

	$scope.saveFolder = function (folder, immediate) {
		saveFolderDelays[folder._id] = saveFolderDelays[folder._id] || {};
		saveFolderDelays[folder._id].defer = $q.defer();

		$timeout.cancel(saveFolderDelays[folder._id].timeout);

		saveFolderDelays[folder._id].timeout = $timeout(function () {
			Folder.save(folder).then(function (updatedFolder) {
				folder = updatedFolder;
				saveFolderDelays[folder._id].defer.resolve(folder);
			});
		}, !!immediate ? 0 : Global.autoSaveLatency);

		return saveFolderDelays[folder._id].defer.promise;
	};

	$scope.saveFile = function (folder, file, immediate) {
		saveFilesDelays[file._id] = saveFilesDelays[file._id] || {};
		saveFilesDelays[file._id].defer = $q.defer();
		$timeout.cancel(saveFilesDelays[file._id].timeout);

		saveFilesDelays[file._id].timeout = $timeout(function () {
			Folder.updateFile(folder, file).then(function (updatedFile) {
				file = updatedFile;
				saveFilesDelays[file._id].defer.resolve(file);
			});
		}, !!immediate ? 0 : Global.autoSaveLatency);

		return saveFilesDelays[file._id].defer.promise;
	};

	$scope.folders = [];
	$scope.createFolder = function () {
		Folder.create().then(function (folder) {
			$scope.folders.push(folder);
		});
	};

	$scope.removeFolder = function (folder) {
		var index = $scope.folders.indexOf(folder);
		Folder.remove(folder).then(function () {
			$scope.folders.splice(index, 1);
		});
	};

	Folder.all().then(function (folders) {
		folders.sort(function (folder1, folder2) {
			return folder1.identifier - folder2.identifier;
		});

		folders.forEach(function (folder) {
			folder.files.sort(function (file1, file2) {
				return file1.identifier - file2.identifier;
			});
		});

		$scope.folders = folders;
	});

	// define event handlers

	var freshedFiles = {};

	$scope.onFilesAdd = function (folder, files, callback) {
		var jobs = [];

		files.forEach(function (file, index) {
			var name = {};

			for (var i in Global.languages) {
				name[Global.languages[i]] = files[index].name;
			}

			var promise = Folder.createFile(folder, {
				name: name,
				size: file.size
			}).then(function (createdFile) {
				createdFile.client = {
					id: file.id,
					percent: 0
				};

				folder.files.push(createdFile);
				freshedFiles[file.id] = createdFile;

				return createdFile;
			});

			jobs.push(promise);
		});

		$q.all(jobs).then(function (files) {
			callback(files);
		});
	};

	$scope.onUploadProcess = function (id, percent) {
		freshedFiles[id].client.percent = percent;
	};

	$scope.onFileUpload = function (id, folder, file) {
		freshedFiles[id].file = file;
		$scope.saveFile(folder, freshedFiles[id]).then(function () {
			delete freshedFiles[id].client;
			delete freshedFiles[id];
		});
	};

	$scope.removeFile = function (folder, file) {
		var index = folder.files.indexOf(file);
		Folder.removeFile(folder, file).then(function () {
			folder.files.splice(index, 1);
		});
	};

	$scope.moveFolderUp = function (folder) {
		var index = $scope.folders.indexOf(folder);
		if (index > 0) {
			var downFolder = $scope.folders[index - 1];

			// swap identifier
			var temp = downFolder.identifier;
			downFolder.identifier = folder.identifier;
			folder.identifier = temp;

			$q.all([
				$scope.saveFolder(folder, true),
				$scope.saveFolder(downFolder, true)
			]).then(function () {
				$scope.folders.sort(function (folder1, folder2) {
					return folder1.identifier - folder2.identifier;
				});
			});
		}
	};

	$scope.moveFolderDown = function (folder) {
		var index = $scope.folders.indexOf(folder);
		if (index < $scope.folders.length - 1) {
			var upFolder = $scope.folders[index + 1];
			// swap identifier
			var temp = upFolder.identifier;
			upFolder.identifier = folder.identifier;
			folder.identifier = temp;

			$q.all([
				$scope.saveFolder(folder, true),
				$scope.saveFolder(upFolder, true)
			]).then(function () {
				$scope.folders.sort(function (folder1, folder2) {
					return folder1.identifier - folder2.identifier;
				});
			});
		}
	};

	$scope.moveFileUp = function (folder, file) {
		var index = folder.files.indexOf(file);
		if (index > 0) {
			var downFile = folder.files[index - 1];

			// swap identifier
			var temp = downFile.identifier;
			downFile.identifier = file.identifier;
			file.identifier = temp;

			$q.all([
				$scope.saveFile(folder, file, true),
				$scope.saveFile(folder, downFile, true)
			]).then(function () {
				folder.files.sort(function (file1, file2) {
					return file1.identifier - file2.identifier;
				});
			});
		}
	};

	$scope.moveFileDown = function (folder, file) {
		var index = folder.files.indexOf(file);
		if (index < folder.files.length - 1) {
			var upFile = folder.files[index + 1];
			// swap identifier
			var temp = upFile.identifier;
			upFile.identifier = file.identifier;
			file.identifier = temp;

			$q.all([
				$scope.saveFile(folder, file, true),
				$scope.saveFile(folder, upFile, true)
			]).then(function () {
				folder.files.sort(function (file1, file2) {
					return file1.identifier - file2.identifier;
				});
			});
		}
	};
};

DownloadableController.$inject = ['$scope', '$timeout', '$q', 'Global', 'Folder'];

angular.module('backend.downloadable').controller('DownloadableController', DownloadableController);
