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
try {
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
}
catch (e) {
}
var toggle2 = true;
//error log / map slider
$(document).ready(function(){
  $("#switch").click(function(){
    
    
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

//creditss : https://frontendscript.com/html-table-of-contents-sidebar/
var toc = document.querySelector( '.toc' );
var tocPath = document.querySelector( '.toc-marker path' );
var tocItems;

// Factor of screen size that the element must cross
// before it's considered visible
var TOP_MARGIN = 0.1,
    BOTTOM_MARGIN = 0.2;

var pathLength;

var lastPathStart,
		lastPathEnd;

window.addEventListener( 'resize', drawPath, false );
window.addEventListener( 'scroll', sync, false );

drawPath();

function drawPath() {
  
  tocItems = [].slice.call( toc.querySelectorAll( 'li' ) );

  // Cache element references and measurements
  tocItems = tocItems.map( function( item ) {
    var anchor = item.querySelector( 'a' );
    var target = document.getElementById( anchor.getAttribute( 'href' ).slice( 1 ) );

    return {
      listItem: item,
      anchor: anchor,
      target: target
    };
  } );

  // Remove missing targets
  tocItems = tocItems.filter( function( item ) {
    return !!item.target;
  } );

  var path = [];
  var pathIndent;

  tocItems.forEach( function( item, i ) {

    var x = item.anchor.offsetLeft - 5,
        y = item.anchor.offsetTop,
        height = item.anchor.offsetHeight;

    if( i === 0 ) {
      path.push( 'M', x, y, 'L', x, y + height );
      item.pathStart = 0;
    }
    else {
      // Draw an additional line when there's a change in
      // indent levels
      if( pathIndent !== x ) path.push( 'L', pathIndent, y );

      path.push( 'L', x, y );
      
      // Set the current path so that we can measure it
      tocPath.setAttribute( 'd', path.join( ' ' ) );
      item.pathStart = tocPath.getTotalLength() || 0;
      
      path.push( 'L', x, y + height );
    }
    
    pathIndent = x;
    
    tocPath.setAttribute( 'd', path.join( ' ' ) );
    item.pathEnd = tocPath.getTotalLength();

  } );
  
  pathLength = tocPath.getTotalLength();
  
  sync();
  
}

function sync() {
  
  var windowHeight = window.innerHeight;
  
  var pathStart = pathLength,
      pathEnd = 0;
  
  var visibleItems = 0;
  
  tocItems.forEach( function( item ) {

    var targetBounds = item.target.getBoundingClientRect();
    
    if( targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * ( 1 - BOTTOM_MARGIN ) ) {
      pathStart = Math.min( item.pathStart, pathStart );
      pathEnd = Math.max( item.pathEnd, pathEnd );
      
      visibleItems += 1;
      
      item.listItem.classList.add( 'visible' );
    }
    else {
      item.listItem.classList.remove( 'visible' );
    }
    
  } );
  
  // Specify the visible path or hide the path altogether
  // if there are no visible items
  if( visibleItems > 0 && pathStart < pathEnd ) {
    if( pathStart !== lastPathStart || pathEnd !== lastPathEnd ) {
      tocPath.setAttribute( 'stroke-dashoffset', '1' );
      tocPath.setAttribute( 'stroke-dasharray', '1, '+ pathStart +', '+ ( pathEnd - pathStart ) +', ' + pathLength );
      tocPath.setAttribute( 'opacity', 1 );
    }
  }
  else {
    tocPath.setAttribute( 'opacity', 0 );
  }
  
  lastPathStart = pathStart;
  lastPathEnd = pathEnd;

}
