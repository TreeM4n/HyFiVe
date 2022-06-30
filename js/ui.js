// dark mode switch
var toggle = true;
export function darkmode() {
  /*
  if (toggle) {
  document.querySelector('html').style.filter = 'invert(100%)';
  toggle  = false;

  } else {
  document.querySelector('html').style.filter = 'invert(0%)';
  toggle = true;}
  */
  var element = document.body;
  element.classList.toggle("dark-mode");
   
}
 document.querySelector('#darkmode').addEventListener('click', darkmode)
// When the user scrolls the page, execute myFunction
window.onscroll = function () { stickybar(); };

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
export function stickybar() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")

  } else {

    navbar.classList.remove("sticky");
  }
}

document.querySelector('ul').addEventListener('click', function(e) {   // 1.
  var selected;
  //console.log(e.target.tagName )
  if(e.target.tagName === 'OPTION' || e.target.tagName === 'LI') {                                      // 2.
    selected= document.querySelector('option.selected');      
    //console.log(selected )
    if(selected) selected.className= '';                               // "
    e.target.className= 'selected';                                    // 2b.
  }
});

