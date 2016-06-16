$(document).ready(function() {

  var sel = "#scr-home";

  $(document).scroll(function (e) {

    var scroll = $(this).scrollTop();
    var anchor = $("#about").offset().top;

    // change navbar

    if (scroll > anchor) {
      $('.nav').css({
        'background': '#222',
        'box-shadow': '0px 2px 10px rgba(0,0,0,0.3)'
      });
      $('.nav > a').css({
        'padding-top': '5px',
        'padding-bottom': '5px',
        'margin-top': '5px',
        'margin-bottom': '5px'
      });
      $('h1').css({
        'margin-top': '3px',
        'margin-bottom': '3px'
      });
    } else {
      $('.nav').css({
        'background': 'rgba(0, 0, 0, 0)',
        'box-shadow': 'none'
      });
      $('.nav > a').css({
        'padding-top': '10px',
        'padding-bottom': '10px',
        'margin-top': '10px',
        'margin-bottom': '10px'
      });
      $('h1').css({
        'margin-top': '13px',
        'margin-bottom': '13px'
      });
    }

    var set = function(id) {
      if (sel == id) return;
      $("[id^='scr-']").removeClass("btn-sel");
      $(id).addClass("btn-sel");
      sel = id;
    }

    // set selected page

    if (scroll < $("#about").offset().top) {
      set("#scr-home");
    } else if (scroll < $("#portfolio").offset().top) {
      set("#scr-about");
    } else if (scroll < $("#contact").offset().top) {
      set("#scr-portfolio");
    } else {
      set("#scr-contact");
    }

  });

});

function scrollTo(element) {
    var position = 0;
    if (element != 0) {
        position = $(element).offset().top;
    }
    $("html, body").animate({ scrollTop: position }, "slow");
}