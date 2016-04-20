$(window).scroll(function (e) {
   var anchor = $("#about").offset().top;
   
   if ($(this).scrollTop() > anchor) {
       $('.nav').css({
          'background': 'rgba(0, 0, 0, 0.6)'
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
          'background': 'rgba(0, 0, 0, 0)'
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
});

function scrollTo(element) {
    var position = 0;
    if (element != 0) {
        position = $(element).offset().top;
    }
    $("html, body").animate({ scrollTop: position }, "slow");
}