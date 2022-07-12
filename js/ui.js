// dark mode switch
var toggle = true;
export function darkmode() {
  
  if (toggle) {
  document.querySelector('html').style.filter = 'invert(100%)';
  
  toggle  = false;

  } else {
  document.querySelector('html').style.filter = 'invert(0%)';
  toggle = true;}
  
  var element = document.body;
  //element.classList.toggle("dark-mode");
   
}
 document.querySelector('#darkmode').addEventListener('click', darkmode)
// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "40px 10px";
    document.getElementById("logo").style.fontSize = "20px";
    document.getElementById("navbar").style.fontSize = "20px";
    //document.getElementById("row2").style.position = "fixed";
    
  } else {
    document.getElementById("navbar").style.padding = "50px 10px";
    document.getElementById("logo").style.fontSize = "35px";
    document.getElementById("navbar").style.fontSize = "35px";
    //document.getElementById("row2").style.position = "relative";
   
  
  }
} 
//on click ID list show selected data 
document.querySelector('#list').addEventListener('click', function(e) {   // 1.
  var selected;
  //console.log(e.target.tagName )
  if(e.target.tagName === 'OPTION' ) {                                      // 2.
    selected= document.querySelector('option.selected');      
    //console.log(selected )
    if(selected) selected.className= '';                               // "
    e.target.className= 'selected';                                    // 2b.
  }
  
});

var toggle2 = true;
//error log / map slider
$(document).ready(function(){
  $("#switch").click(function(){
    $("#panel").slideToggle("1000");
    $("#map").slideToggle("1000");
    if (toggle2) {
      document.getElementById("switch").textContent = "˅˅ Switch to map ˅˅";
      toggle2 = false;
    }
    else {
      document.getElementById("switch").textContent = "⌃⌃ Switch to log ⌃⌃";
      toggle2 = true;
    }
  });
});

