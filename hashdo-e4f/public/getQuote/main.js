card.onReady = function () {
    var $card = $('#' + locals.card.id),
		isActive = true,
		now = new Date(),
		renderUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();
	if (typeof __e4f == 'undefined') {		
		card.require('external/getQuote.js?v=1.1.1', function () {
			console.log('Finding');
			init();
		});
	}
	else {
		init();
	}
	function init() {
		__e4f.getQuote.onReady(card, $card, locals);
	}

}