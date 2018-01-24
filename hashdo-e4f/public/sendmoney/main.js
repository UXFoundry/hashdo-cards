card.onReady = function () {
  var $card = $('#' + locals.card.id);

  if (typeof __e4f == 'undefined') {
    card.require('https://www.exchange4free.com/xandgo/lib/sendmoney.js?v=' + Math.round(new Date().getTime() / 1000), function () {
			init();
		});
	}
	else {
		init();
	}

	function init() {
		__e4f.sendMoney.onReady(card, $card, locals);
	}
};