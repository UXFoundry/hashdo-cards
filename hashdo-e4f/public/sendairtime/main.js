card.onReady = function () {
    var $card = $('#' + locals.card.id),
		isActive = true,
		now = new Date(),
		renderUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();
	if (typeof __e4fsendAirtime == 'undefined') {		
		card.require('https://www.exchange4free.com/xandgo/lib/sendairtime.js?v=' + Math.round(new Date().getTime() / 1000), function () {			
			init();
		});
	}
	else {
		init();
	}
	function init() {
		__e4fsendAirtime.sendAirtime.onReady(card, $card, locals);
	}

}