var $ = require('jquery')

function scrollTo (element) {
  var pos = 0
  if (element != 0) pos = $(element).offset().top - 80
  $('html, body').animate({scrollTop: pos}, 'slow')
}

$(document).ready(function () {
  $(document).scroll(function (e) {
    var scrollValue = $(this).scrollTop()
    var anchor = 100 // $('.pages').offset().top
    var $nav = $('.nav')
    if (scrollValue > anchor && !$nav.hasClass('solid')) {
      $nav.addClass('solid')
    } else if (scrollValue < anchor && $nav.hasClass('solid')) {
      $nav.removeClass('solid')
    }
    $('.down').css('opacity', Math.max(1 - scrollValue / 500, 0))
  })
  $('#home-btn').click(function () { scrollTo(0) })
  $('#about-btn, .down').click(function () { scrollTo('.page:nth-child(1)') })
  $('#portfolio-btn').click(function () { scrollTo('.page:nth-child(2)') })
  $('#contact-btn').click(function () { scrollTo('.page:nth-child(3)') })
})
