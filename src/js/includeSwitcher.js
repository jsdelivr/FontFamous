(function() {
	const jsdelivrEndpoint = 'https://data.jsdelivr.com/v1/package/npm/';
	const pkgName = 'fontfamous';
	const filePath = '/dist/css/font-famous.min.css';

	$.get(jsdelivrEndpoint + pkgName, function(response) {
		$.get(jsdelivrEndpoint + pkgName + '@' + response.tags.latest, function(pkg) {
			const latestVersion = response.tags.latest;

			let currentDir = pkg;
			let path = Array.from(filePath.split('/'));

			for (let i = 0; i < path.length; i++) {
				currentDir.files.forEach(function(item) {
					if (item.name === path[i]) {
						currentDir = item;
						return currentDir;
					}
				});
			}

			const hash = 'sha256-' + currentDir.hash;

			const rel = '<div class="orange">rel</div><div class="white">=</div>"stylesheet"';
			const href = '<div class="orange">href</div><div class="white">=</div>"https://cdn.jsdelivr.net/npm/fontfamous@' + latestVersion + filePath + '"';
			const integrity = '<div class="orange">integrity</div><div class="white">=</div>"' + hash + '"';
			const crossorigin = '<div class="orange">crossorigin</div><div class="white">=</div>"anonymous"';

			let $checkbox = $('.include .options-group .container input');
			let $insertText = $('.options-group .insert-group .insert-text');

			$(document).ready(function () {
				$checkbox.prop("checked", false);

				$insertText.html('<div class="white">&lt</div><div class="red">link</div> ' + rel + ' ' + href + ' ' + ($checkbox.prop("checked") ? integrity + ' ' + crossorigin : '') + '<div class="white">&gt</div>');

				$('.include .options-group .options a').click(function () {
					$('.options a').removeClass('active');
					$(this).addClass('active');

					if ($(document).width() < 768) {
						$('.options .bottom-slider').css({left: $(this).data('xs-left')});
					} else {
						$('.options .bottom-slider').css({left: $(this).data('left')});
					}

					if ($(this).hasClass('html')) {
						$insertText.html('<div class="white">&lt</div><div class="red">link</div> ' + rel + ' ' + href + ($checkbox.prop("checked") ? ' ' + integrity + ' ' + crossorigin : '') + '<div class="white">&gt</div>');
					} else if ($(this).hasClass('pug')) {
						$insertText.html('<div class="red">link</div> <div class="white">(</div>' + rel + '<div class="white">, </div> ' + href + ($checkbox.prop("checked") ? '<div class="white">,</div> ' + integrity + '<div class="white">,</div> ' + crossorigin : '') + '<div class="white">)</div>');
					} else {
						$insertText.html('<div class="red">%link</div> <div class="white">{</div><div class="orange">rel</div><div class="white">:</div> "stylesheet"<div class="white">,</div> <div class="orange">href</div><div class="white">:</div> "https://cdn.jsdelivr.net/npm/fontfamous@' + latestVersion + filePath + '"' + ($checkbox.prop("checked") ? '<div class="white">,</div> ' + '<div class="orange">integrity</div><div class="white">:</div> "' + hash + '"' + '<div class="white">,</div> ' + '<div class="orange">crossorigin</div><div class="white">:</div> "anonymous"' : '') + '<div class="white">}</div>');
					}
				});

				$checkbox.click(function () {
					let $selectedOption = $('.include .options-group .options .active');

					if ($selectedOption.hasClass('html')) {
						$insertText.html('<div class="white">&lt</div><div class="red">link</div> ' + rel + ' ' + href + ($checkbox.prop("checked") ? ' ' + integrity + ' ' + crossorigin : '') + '<div class="white">&gt</div>');
					} else if ($selectedOption.hasClass('pug')) {
						$insertText.html('<div class="red">link</div> <div class="white">(</div>' + rel + '<div class="white">, </div> ' + href + ($checkbox.prop("checked") ? '<div class="white">,</div> ' + integrity + '<div class="white">,</div> ' + crossorigin : '') + '<div class="white">)</div>');
					} else {
						$insertText.html('<div class="red">%link</div> <div class="white">{</div><div class="orange">rel</div><div class="white">:</div> "stylesheet"<div class="white">,</div> <div class="orange">href</div><div class="white">:</div> "https://cdn.jsdelivr.net/npm/fontfamous@' + latestVersion + filePath + '"' + ($checkbox.prop("checked") ? '<div class="white">,</div> ' + '<div class="orange">integrity</div><div class="white">:</div> "' + hash + '"' + '<div class="white">,</div> ' + '<div class="orange">crossorigin</div><div class="white">:</div> "anonymous"' : '') + '<div class="white">}</div>');
					}
				});
			});
		});
	});
})();
