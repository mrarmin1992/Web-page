$(document).ready(function() {
  $('#container').hScroll();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
  // scroll body to 0px on click
  $('#back-to-top').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 400);
    return false;
  });
});
$.fn.hScroll = function(options) {
  function scroll(obj, e) {
     var evt = e.originalEvent;
     var direction = evt.detail ? evt.detail * (-120) : evt.wheelDelta;

     if (direction > 0) {
        direction = $(obj).scrollLeft() - 120;
     } else {
        direction = $(obj).scrollLeft() + 120;
     }

     $(obj).scrollLeft(direction);

     e.preventDefault();
  }

  $(this).width($(this).find('div').width());

  $(this).bind('DOMMouseScroll mousewheel', function(e) {
     scroll(this, e);
  });
}
