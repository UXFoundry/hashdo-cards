/* global card */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    $inner = $card.find('.hdc-inner'),
    $nav = $card.find('.nav'),
    $cont = $card.find('.cont'),
    $slides = $cont.find('.slide'),
    cardWidth = $inner.width() - parseInt($inner.css('padding-left'), 10) - parseInt($inner.css('padding-right'), 10),
    containerWidth = $slides.size() * cardWidth,

    m_current = 0,
    m_last = 0,
    m_min = -containerWidth / $slides.size() * ($slides.size() - 1),
    currentSlide = 0,

    indicateNav = function () {
      $nav.find('a').removeClass('active').eq(currentSlide).addClass('active');
    },

    snap = function () {
      var m_goto = -currentSlide * cardWidth;

      if (m_last != m_goto) {
        m_last = m_goto;

        $cont.addClass('transition').css('margin-left', m_last).on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          $cont.removeClass('transition').unbind('transitionend webkitTransitionEnd oTransitionEnd');
        });
      }
    },

    containM = function (m) {
      if (m > 0) m = 0;
      else if (m < m_min) m = m_min;
      return m;
    },

    setUpHammer = function () {
      var ht = new Hammer($card[0]);

      ht.on('pan', function (ev) {
        m_current = containM(m_last + ev.deltaX);
        $cont.css('margin-left', m_current);

        ev.srcEvent.stopPropagation();
      });

      ht.on('panend', function (ev) {
        var v = -ev.velocityX * cardWidth / 2;
        m_last = m_current;
        m_current = containM(m_current + v);

        currentSlide = Math.abs(Math.round(m_current / cardWidth));
        indicateNav();
        snap();
        
        ev.srcEvent.stopPropagation();
      });
    };

  $cont.width(containerWidth);

  $nav.find('a').on('click', function () {
    currentSlide = $(this).index();
    indicateNav();
    snap();
  });

  if (typeof Hammer === 'undefined') {
    var disabledAmd = false;

    if (typeof define == 'function' && define.amd) {
      disabledAmd = true;
      define.amd = false;
    }

    card.require('https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.4/hammer.min.js', function () {
      if (disabledAmd) {
        define.amd = true;
      }

      setUpHammer();
    });
  }
  else {
    setUpHammer();
  }
};
