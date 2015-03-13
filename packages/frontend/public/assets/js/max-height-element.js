;(function() {
	'use strict';

	var SetMaxHeightElement = window.SetMaxHeightElement = function(options) {
		this.options = options;
		this.maxHeight = 0;

		var self = this;
		$(this.options.element).each(function iterate() {
			self.maxHeight = (self.maxHeight > $(this).height()) ? self.maxHeight : $(this).height();
		});

		this.run();
	};

	SetMaxHeightElement.prototype.run = function() {
		var self = this;

		$(this.options.element).each(function iterate() {
			$(this).height(self.maxHeight);
		});
	};

}());
