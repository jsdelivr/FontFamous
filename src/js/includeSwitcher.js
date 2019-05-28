(function() {
	const jsdelivrEndpoint = 'https://data.jsdelivr.com/v1/package/npm/';
	const pkgName = 'fontfamous';
	const filePath = '/dist/css/font-famous.min.css';

	$.get(jsdelivrEndpoint + pkgName, function(response) {
		const latestVersion = response.tags.latest;

		function isName(pkg) {
			return pkg.name === filePath;
		}

		$.get(`${jsdelivrEndpoint + pkgName}@${latestVersion}/flat`, function(pkgList) {
			const hash = 'sha256-' + pkgList.files.find(isName).hash;
			const baseCdnUrl = 'https://cdn.jsdelivr.net/npm/fontfamous';

			const getVersion = full => full ? latestVersion : latestVersion.split('.')[0];
			const getHref = full => `<div class="orange">href</div><div class="white">=</div>"${baseCdnUrl}@${getVersion(full)}${full ? filePath : ''}"`;

			const rel = '<div class="orange">rel</div><div class="white">=</div>"stylesheet"';
			const integrity = `<div class="orange">integrity</div><div class="white">=</div>"${hash}"`;
			const crossorigin = '<div class="orange">crossorigin</div><div class="white">=</div>"anonymous"';

			function getHtml (sri) {
				return `<div class="white">&lt</div><div class="red">link</div> ${rel} ${getHref(sri)}${sri ? ` ${integrity} ${crossorigin}` : ''}<div class="white">&gt</div>`;
			}

			function getPug (sri) {
				return `<div class="red">link</div> <div class="white">(</div>${rel}<div class="white">, </div> ${getHref(sri)}${sri ? `<div class="white">,</div> ${integrity}<div class="white">,</div> ${crossorigin}` : ''}<div class="white">)</div>`;
			}

			function getHaml(sri) {
				return `<div class="red">%link</div> <div class="white">{</div><div class="orange">rel</div><div class="white">:</div> "stylesheet"<div class="white">,</div> <div class="orange">href</div><div class="white">:</div> "${baseCdnUrl}@${sri ? latestVersion : latestVersion.split('.')[0]}"${sri ? `<div class="white">,</div> <div class="orange">integrity</div><div class="white">:</div> "${hash}"<div class="white">,</div> <div class="orange">crossorigin</div><div class="white">:</div> "anonymous"` : ''}<div class="white">}</div>`;
			}

			let $checkbox = $('.include .options-group .container input');
			let $insertText = $('.options-group .insert-group .insert-text');

			$(document).ready(function () {
				$insertText.html(getHtml($checkbox.prop("checked")));

				$('.include .options-group .options a').click(function () {
					$('.options a').removeClass('active');
					$(this).addClass('active');

					if ($(document).width() < 768) {
						$('.options .bottom-slider').css({left: $(this).data('xs-left')});
					} else {
						$('.options .bottom-slider').css({left: $(this).data('left')});
					}
				});

				$('.include .options-group .container input, .include .options-group .options a').click(function () {
					let $selectedOption = $('.include .options-group .options .active');

					if ($selectedOption.hasClass('html')) {
						$insertText.html(getHtml($checkbox.prop("checked")));
					} else if ($selectedOption.hasClass('pug')) {
						$insertText.html(getPug($checkbox.prop("checked")));
					} else {
						$insertText.html(getHaml($checkbox.prop("checked")));
					}
				});
			});
		});
	});
})();
