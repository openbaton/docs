// jQuery(document).ready(function($){
//     var path = window.location.pathname.split("/").pop();
//     if (path == ''){
//         path = 'index.html';
//     }
//
//     var target = $('li  a[href="'+path+'"]');
//     target.addClass('active')
// });

// (function($)
// {
//     $.fn.extend(
//         {
//             matchactive:function(getvar)
//             {
//                 var pathArray = window.location.pathname.split( '/' );
//                 var sn = pathArray[pathArray.length - 1];
//                 var setOfAnchors = $(this);
//                 var anchorFound = false;
//                 $(setOfAnchors).each(function()
//                 {
//                     if($(this).attr('href') == sn)
//                     {
//                         $(this).parent().addClass('active');
//                         anchorFound = true;
//                     }
//                 });
//                 if(anchorFound == false)
//                 {
//                     $(setOfAnchors).each(function()
//                     {
//                         if(($(this).attr('href') == 'index.php') || ($(this).attr('href') == 'index.html'))
//                         {
//                             $(this).parent().addClass('active');
//                         }
//                     });
//                 }
//             }
//         });
// })(jQuery);