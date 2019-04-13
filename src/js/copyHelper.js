(function() {
	function copyToClipboard(text) {
		var $temp = $("<input style=\"opacity: 0\">");
		$("body").append($temp);
		$temp.val(text).select();
		document.execCommand("copy");
		$temp.remove();
		toastr.success('Copied');
	}

	$(document).ready(function () {
		$('.include .options-group .insert-group').click(function () {
			copyToClipboard($('.include .options-group .insert-group .insert-text').text());
		});

		$('.section-4 .row>div>div').click(function () {
			copyToClipboard('<i class="pr ' + $('.logo-title', this).text() + '"></i>');
		});
	});
})();
