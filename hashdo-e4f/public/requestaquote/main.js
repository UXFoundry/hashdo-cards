card.onReady = function () {
    var $card = $('#' + locals.card.id),
		isActive = true,
		now = new Date(),
		renderUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();
	if (typeof __e4fraq == 'undefined') {		
		card.require('http://www.exchange4free.com/xandgo/lib/requestaquote.js?v=1.1.1', function () {			
			init();
		});
	}
	else {
		init();
	}
	function init() {
		__e4fraq.requestaquote.onReady(card, $card, locals);
	}

}