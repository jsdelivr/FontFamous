(function () {
	function fixScrollTop () {
		var $anchor = $(':target');
		var bOffset = parseInt($('.navbar').outerHeight());

		if ($anchor.length > 0) {
			window.scrollTo(0, $anchor.offset().top - bOffset);
		}
	}

	// fix scroll position for anchors (scroll up by static navbar height)
	$(window).on('hashchange', fixScrollTop);

	var first = true;
	$(window).on('scroll load', function() {
		var $navbar = $('.navbar');

		if (window.pageYOffset === 0) {
			$navbar.removeClass('fixed-top');
			$('body').css({ paddingTop: 0 });
		} else if (!$navbar.hasClass('fixed-top')) {
			$navbar.addClass('fixed-top');
			$('body').css({ paddingTop: $navbar.outerHeight() });

			// Edge fires scroll before load so we can't use e.type === load here
			if (first) {
				first = false;
				fixScrollTop();
			}
		}
	});
})();
