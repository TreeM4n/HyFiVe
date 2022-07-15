// dark mode switch
var toggle = true;
export function darkmode() {

  if (toggle) {
    document.querySelector('html').style.filter = 'invert(100%)';

    toggle = false;

  } else {
    document.querySelector('html').style.filter = 'invert(0%)';
    toggle = true;
  }

  var element = document.body;
  //element.classList.toggle("dark-mode");

}
document.querySelector('#darkmode').addEventListener('click', darkmode)
// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "0px 10px";
    //document.getElementById("logo").style.fontSize = "20px";
    document.getElementById("navbar").style.fontSize = "14px";
    //document.getElementById("row2").style.position = "fixed";

  } else {
    document.getElementById("navbar").style.padding = "0px 10px";
    //document.getElementById("logo").style.fontSize = "35px";
    document.getElementById("navbar").style.fontSize = "18px";
    //document.getElementById("row2").style.position = "relative";


  }
}
try {
  //on click ID list show selected data 
  document.querySelector('#list').addEventListener('click', function (e) {   // 1.
    var selected;
    //console.log(e.target.tagName )
    if (e.target.tagName === 'OPTION') {                                      // 2.
      selected = document.querySelector('option.selected');
      //console.log(selected )
      if (selected) selected.className = '';                               // "
      e.target.className = 'selected';                                    // 2b.
    }

  });
}
catch (e) {
}
var toggle2 = true;
//error log / map slider
$(document).ready(function () {
  $("#switch").click(function () {


    if (toggle2) {
      document.getElementById("switch").textContent = "˅˅ Switch to map ˅˅";

      $("#panel").slideToggle("1000");
      $("#map").slideToggle("1000");
      toggle2 = false;
    }
    else {
      document.getElementById("switch").textContent = "⌃⌃ Switch to log ⌃⌃";
      $("#map").slideToggle("1000");
      $("#panel").slideToggle("1000");
      toggle2 = true;
    }
  });
});


//credits https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/
window.addEventListener('DOMContentLoaded', () => {

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
      } else {
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
      }
    });
  });

  // Track all sections that have an `id` applied
  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });

});


function doOnOrientationChange() {
  
  document.getElementById("switch").textContent = window.orientation;
  switch (window.orientation) {
    
 
    case 180:
      document.getElementsByTagName('body')[0].style.transform = "rotate(-90deg)";
      break;
    case -90:
      document.getElementsByTagName('body')[0].style.transform = "rotate(0deg)";
      document.getElementById("landscape").style.display = "block";
      break;
    case 90:
      
      document.getElementsByTagName('body')[0].style.transform = "rotate(0deg)";
      document.getElementById("landscape").style.display = "block";
      break;
    default:
      document.getElementsByTagName('body')[0].style.transform = "rotate(90deg)";
      document.getElementById("landscape").style.display = "none";
      break;
  }
}

//Listen to orientation change
window.addEventListener('orientationchange', doOnOrientationChange);  