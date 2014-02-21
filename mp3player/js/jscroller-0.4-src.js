/*
 * jScroller 0.4 - Autoscroller PlugIn for jQuery
 *
 * Copyright (c) 2007 Markus Bordihn (http://markusbordihn.de)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-06-18 20:00:00 +0100 (Sat, 18 Jul 2009) $
 * $Rev: 0.4 $
 */

$jScroller = {

 info: {
  Name: "ByRei jScroller Plugin for jQuery",
  Version: 0.4,
  Author: "Markus Bordihn (http://markusbordihn.de)",
  Description: "Next Generation Autoscroller"
 },

 config: {
  obj : [],
  refresh: 120,
  regExp: {
   px: /([0-9,.\-]+)px/
  }
 },

 cache: {
  timer: 0,
  init: 0
 },

 add: function(parent,child,direction,speed,mouse) {
  if ($(parent).length && $(child).length && direction && speed >= 1) {
      $(parent).css({overflow: 'hidden'});
      $(child).css({position: 'absolute', left: 0, top: 0});
      /* Usability improvement by Nimrod Yonatan Ben-Nes, thanks Nimrod. */
      if (mouse) {
          $(child).hover(
            function(){
             $jScroller.pause($(child),true);
            },
            function(){
             $jScroller.pause($(child),false);
          });
      }
      $jScroller.config.obj.push({
                                  parent:    $(parent),
                                  child:     $(child),
                                  direction: direction,
                                  speed:     speed,
                                  pause:     false
       });
  }
 },

 pause: function(obj,status) {
  if (obj && typeof status !== 'undefined') {
      for (var i in $jScroller.config.obj) {
           if ($jScroller.config.obj[i].child.attr("id") === obj.attr("id")) {
               $jScroller.config.obj[i].pause = status;
           }
      }
  }
 },
reset: function(){
      $jScroller.config.obj=[];
	  
   },
 start: function() {
  if ($jScroller.cache.timer === 0 && $jScroller.config.refresh > 0) {
      $jScroller.cache.timer = window.setInterval($jScroller.scroll, $jScroller.config.refresh);
  }
  if (!$jScroller.cache.init) {
      $(window).blur($jScroller.stop);
      $(window).focus($jScroller.start);
      $(window).resize($jScroller.start);
      $(window).scroll($jScroller.start);
      $(document).mousemove($jScroller.start);
      if ($.browser.msie) {window.focus();}
      $jScroller.cache.init = 1;
  }
 },

 stop: function() {
  if ($jScroller.cache.timer) {
      window.clearInterval($jScroller.cache.timer);
      $jScroller.cache.timer = 0;
  }
 },

 get: {
  px: function(value) {
   var result = '';
   if (value) {
       if (value.match($jScroller.config.regExp.px)) {
           if (typeof value.match($jScroller.config.regExp.px)[1] !== 'undefined') {
               result = value.match($jScroller.config.regExp.px)[1];
           }
       }
   }
   return result;
  }
 },

 scroll: function() {
  for (var i in $jScroller.config.obj) {
       if ($jScroller.config.obj.hasOwnProperty(i)) {
           var
            obj        = $jScroller.config.obj[i],
            left       = Number(($jScroller.get.px(obj.child.css('left'))||0)),
            top        = Number(($jScroller.get.px(obj.child.css('top'))||0)),
            min_height = obj.parent.height(),
            min_width  = obj.parent.width(),
            height     = obj.child.height(),
            width      = obj.child.width();

           if (!obj.pause) {
               switch(obj.direction) {
                case 'up':
                 if (top <= -1 * height) {top = min_height;}
                 obj.child.css('top',top - obj.speed + 'px');
                break;
                case 'right':
                 if (left >= min_width) {left = -1 * width;}
                 obj.child.css('left',left + obj.speed + 'px');
                break;
                case 'left':
                 if (left <= -1 * width) {left = min_width;}
                 obj.child.css('left',left - obj.speed + 'px');
                break;
                case 'down':
                 if (top >= min_height) {top = -1 * height;}
                 obj.child.css('top',top + obj.speed + 'px');
                break;
               }
           }
       }
  }
 }
};