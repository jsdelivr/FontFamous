(function() {
	$(document).ready(function () {
		var switchClipboard = new ClipboardJS('.include .options-group .insert-group', {
			text: function(trigger) {
				return $('.include .options-group .insert-group .insert-text').text();
			}
		});

		switchClipboard.on('success', function() {
			toastr.options.iconClass = 'toast-success';
			toastr.options.timeOut = 2000;
			toastr.options.preventDuplicates = true;
			toastr.success('Copied');
		});

		var logoClipboard = new ClipboardJS('.section-4 .row>div>div', {
			text: function(trigger) {
				return `<i class="pr ${$('.logo-title', trigger).text()}"></i>`;
			}
		});

		logoClipboard.on('success', function() {
			toastr.options.iconClass = 'toast-success';
			toastr.options.timeOut = 2000;
			toastr.options.preventDuplicates = true;
			toastr.success('Copied');
		});
	});
})();
