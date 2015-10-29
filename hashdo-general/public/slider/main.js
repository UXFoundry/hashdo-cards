/* global card */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    $inner = $card.find('.hdc-inner'),
    $nav = $card.find('.nav'),
    $cont = $card.find('.cont'),
    $slides = $cont.find('.slide'),
    card_w = $inner.width() - parseInt($inner.css('padding-left'), 10) - parseInt($inner.css('padding-right'), 10),
    cont_w = $slides.size() * card_w,
    ht_elem = document.getElementById(locals.card.id),

    m_current = 0,
    m_last = 0,
    m_min = -cont_w / $slides.size() * ($slides.size() - 1),
    slide_current = 0,

    indicateNav = function () {
      $nav.find('a').removeClass('active').eq(slide_current).addClass('active');
    },

    snap = function () {
      var m_goto = -slide_current * card_w;
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
      var ht = new Hammer(ht_elem);

      ht.on('pan', function (ev) {
        m_current = containM(m_last + ev.deltaX);
        $cont.css('margin-left', m_current);
      });

      ht.on('panend', function (ev) {
        var v = -ev.velocityX * card_w / 2;
        m_last = m_current;
        m_current = containM(m_current + v);

        slide_current = Math.abs(Math.round(m_current / card_w));
        indicateNav();
        snap();
      });
    };

  $cont.width(cont_w);

  $nav.find('a').on('click', function () {
    slide_current = $(this).index();
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
