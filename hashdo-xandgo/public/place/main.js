/* global card, Swiper */

card.onReady = function () {
  if (locals.photoCount > 0) {
    if (typeof Swiper === 'undefined') {
      card.requireCSS('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/css/swiper.min.css');

      card.require('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.min.js', function () {
        new Swiper('#' + locals.card.id + ' .swiper-container', {
          loop: true,
          width: 225,
          nextButton: '#' + locals.card.id + ' .swiper-button-next',
          prevButton: '#' + locals.card.id + ' .swiper-button-prev'
        });
      });
    }
    else {
      new Swiper('#' + locals.card.id + ' .swiper-container', {
        loop: true,
        width: 225,
        nextButton: '#' + locals.card.id + ' .swiper-button-next',
        prevButton: '#' + locals.card.id + ' .swiper-button-prev'
      });
    }
  }
};