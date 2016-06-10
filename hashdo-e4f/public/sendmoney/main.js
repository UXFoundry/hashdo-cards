card.onReady = function () {
  var $card = $('#' + locals.card.id);

  if (typeof __e4f === 'undefined') {
    card.require('http://www.exchange4free.com/xandgo/lib/sendmoney.min.js?v=' + Math.round(new Date().getTime() / 1000), function () {
      init();
    });
  }
  else {
    init();
  }

  function init() {
    __e4f.sendMoney.onReady(card, $card, locals);
  }
}