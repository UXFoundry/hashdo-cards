/* global card, Swiper */

card.onReady = function () {
  if (typeof Swiper === 'undefined') {
    card.requireCSS('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.2.7/css/swiper.min.css');

    card.require('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.2.7/js/swiper.min.js', function () {
      new Swiper('#' + locals.card.id + ' .swiper-container', {
        loop: true,
        width: 225,
        pagination: '#' + locals.card.id + ' .swiper-pagination'
      });
    });
  }
  else {
    new Swiper('#' + locals.card.id + ' .swiper-container', {
      loop: true,
      width: 225,
      pagination: '#' + locals.card.id + ' .swiper-pagination'
    });
  }
};