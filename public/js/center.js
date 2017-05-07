var div, div_height, window_height, margin_top;

$(document).ready(function() {
  div = $('#center');
  div_height = div.height();
  window_height = window.innerHeight;
  margin_top = window_height - div_height;

  div.css('margin-top', ( ( margin_top / 2 ) - 10 + 'px' ) );
});

$(window).on('resize', function () {
  div = $('#center');
  div_height = div.height();
  window_height = window.innerHeight;
  margin_top = window_height - div_height;

  div.css('margin-top', ( ( margin_top / 2 ) - 10 + 'px' ) );
});
