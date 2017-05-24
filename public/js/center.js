"use strict";

let div, margin_top;

window.onload = () => {

  div = document.getElementById( 'center' );
  margin_top = window.innerHeight - div.offsetHeight;
  div.style.marginTop = ( ( margin_top / 2 ) - 10 ) + 'px';

};

window.onresize = () => {

  margin_top = window.innerHeight - div.offsetHeight;
  div.style.marginTop = ( ( margin_top / 2 ) - 10 ) + 'px';

};
