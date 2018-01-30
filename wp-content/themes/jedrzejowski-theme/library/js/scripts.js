/*
 * Bones Scripts File
 * Author: Eddie Machado
 *
 * This file should contain any js scripts you want to add to the site.
 * Instead of calling it in the header or throwing it inside wp_head()
 * this file will be called automatically in the footer so as not to
 * slow the page load.
 *
 * There are a lot of example functions and tools in here. If you don't
 * need any of it, just remove it. They are meant to be helpers and are
 * not required. It's your world baby, you can do whatever you want.
*/
var $ = jQuery;

/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
    return { width:x,height:y };
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
        if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;


/*
 * Here's an example so you can see how we're using the above function
 *
 * This is commented out so it won't work, but you can copy it and
 * remove the comments.
 *
 *
 *
 * If we want to only do it on a certain page, we can setup checks so we do it
 * as efficient as possible.
 *
 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
 *
 * This once checks to see if you're on the home page based on the body class
 * We can then use that check to perform actions on the home page only
 *
 * When the window is resized, we perform this function
 * $(window).resize(function () {
 *
 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
 *    if( is_home ) { waitForFinalEvent( function() {
 *
 *	// update the viewport, in case the window size has changed
 *	viewport = updateViewportDimensions();
 *
 *      // if we're above or equal to 768 fire this off
 *      if( viewport.width >= 768 ) {
 *        console.log('On home page and window sized to 768 width or more.');
 *      } else {
 *        // otherwise, let's do this instead
 *        console.log('Not on home page, or window sized to less than 768.');
 *      }
 *
 *    }, timeToWaitForLast, "your-function-identifier-string"); }
 * });
 *
 * Pretty cool huh? You can create functions like this to conditionally load
 * content and other stuff dependent on the viewport.
 * Remember that mobile devices and javascript aren't the best of friends.
 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
 *
*/

/*
 * We're going to swap out the gravatars.
 * In the functions.php file, you can see we're not loading the gravatar
 * images on mobile to save bandwidth. Once we hit an acceptable viewport
 * then we can swap out those images since they are located in a data attribute.
*/
function loadGravatars() {
    // set the viewport using the function above
    viewport = updateViewportDimensions();
    // if the viewport is tablet or larger, we load in the gravatars
    if (viewport.width >= 768) {
        jQuery('.comment img[data-gravatar]').each(function(){
            jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
        });
    }
} // end function


/*
 * Put all your regular jQuery in here.
*/

function makeSticky() {
    var headerContainer = jQuery('.inner-header-container');
    var offset = $('#inner-header').offset().top;
    $(window).on('scroll', function(){
        if (($(this)).scrollTop() > offset) {
            headerContainer.addClass('sticky');
        } else {
            headerContainer.removeClass('sticky');
        }
    });
}

function toggleMobileMenu() {
    
    var menuToggler = $('#menu-toggler');
    
    var menuContent = $('#menu-header');
    var menuToDrop = $('.menu-item-has-children');
    
    var closeBtn = $('<div class="mobile-close">');
    
    // clear desktop state
    
    menuContent.hide();
    menuToDrop.off('mouseenter');
    menuToDrop.off('mouseleave');
    
    
    // mobile events
    menuToDrop.on('click', '.submenu-pointer', function(){
        $(this).prev('.sub-menu').slideToggle();
        if ($(this).hasClass('fa-angle-down')) {
            $(this).removeClass('fa-angle-down').addClass('fa-angle-up');
        } else {
            $(this).removeClass('fa-angle-up').addClass('fa-angle-down');
        } 
    });

    menuToggler.on('click', function(){
        if (!menuContent.find('.mobile-close').length) {
            var closeClone = closeBtn.clone(true);
            menuContent.append(closeClone);
        }
        menuContent.fadeIn().addClass('mobile-visible');
    });
    
    menuContent.on('click', '.mobile-close', function(){
        menuContent.fadeOut(400).delay(2000).removeclass('mobile-visible');
        $(this).remove();
    })
}

function desktopDropdown(){
    var menuContent = $('#menu-header');
    var menuToDrop = $('.menu-item-has-children');
    
    menuContent.show();
    
    // clear mobile state
    if (menuContent.hasClass('mobile-visible')) {
        menuContent.removeClass('mobile-visible').show();
        menuContent.find('.mobile-close').remove();
    }
    
    menuToDrop.off('click', '.submenu-pointer');
    
    // desktop events
    menuToDrop.on('mouseenter', function(){
        var subMenu = $(this).find('.sub-menu');
        subMenu.slideDown();
    });
    
    menuToDrop.on('mouseleave', function(){
        var subMenu = $(this).find('.sub-menu');
        subMenu.slideUp();
    });
}

function fixSubmenu () {
    var menuContent = $('#menu-header');
    var menuArrow = $('<div>').addClass('submenu-pointer fa fa-angle-down');
    var menuHasChildren = menuContent.find('.menu-item-has-children');
    menuHasChildren.each(function(){
        var arrow = menuArrow.clone(true);
        $(this).append(arrow);
    });
}

function simpleLightBox() {
    var gallery = $('.gallery');
    
    var imageAnchors = gallery.find('.gallery-icon a');
    var images = gallery.find('img');
    console.log(images);
    console.log(imageAnchors);
    
    imageAnchors.on('click', function(e){
        e.preventDefault();
        var src = $(this).attr('href');
        
        var box = $('<div class="lightbox-layer">');
        var image = $('<img>').attr('src', src);
        var imageWrapper = $('<div class="lightbox-image-wrapper>');
        var arrowLeft = $('<i class="fa fa-chevron-left prev');
    })
}

jQuery(document).ready(function($) {

    /*
   * Let's fire off the gravatar function
   * You can remove this if you don't need it
  */
    
    var mobBreakpoint = window.matchMedia('screen and (max-width: 767px)');
    if (mobBreakpoint.matches) {
        toggleMobileMenu();
    } else {
        desktopDropdown();
    }
    
    mobBreakpoint.addListener(function(mq) {
        if (mq.matches) {
            toggleMobileMenu();
        } else {
            desktopDropdown();
        }
    })
    
    loadGravatars();
    makeSticky();
    fixSubmenu();
    simpleLightBox();

}); /* end of as page load scripts */
