card.onReady = function () {
    var $card = $('#' + locals.card.id),
		isActive = true,
		now = new Date(),
		renderUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();
	if (typeof __e4fcreateben == 'undefined') {		
		card.require('https://www.exchange4free.com/xandgo/lib/createbeneficiary.js?v=' + Math.round(new Date().getTime() / 1000), function () {
			console.log('Finding');
			init();
		});
	}
	else {
		init();
	}
	function init() {
		__e4fcreateben.createbeneficiary.onReady(card, $card, locals);
	}

}