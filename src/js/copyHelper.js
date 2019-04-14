(function() {
	$(document).ready(function () {
		new ClipboardJS('.include .options-group .insert-group', {
			text: function(trigger) {
				return $('.include .options-group .insert-group .insert-text').text();
			}
		});

		new ClipboardJS('.section-4 .row>div>div', {
			text: function(trigger) {
				return '<i class="pr ' + $('.logo-title', trigger).text() + '"></i>';
			}
		});
	});
})();
