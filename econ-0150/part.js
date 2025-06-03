// Scroll to top on page load (disabled on mobile to prevent glitches)
$(document).ready(function(){
    // Only scroll to top on desktop to avoid mobile scrolling issues
    if (window.innerWidth > 1000) {
        window.scrollTo(0, 0);
    }
});

$(window).scroll(function(){
    var scrollTop = $(document).scrollTop();
    var anchors = $('body').find('div');
    
    for (var i = 0; i < anchors.length; i++){
        if (scrollTop > $(anchors[i]).offset().top - 100 && scrollTop < $(anchors[i]).offset().top + $(anchors[i]).height() - 100) {
            $('nav a[href="#' + $(anchors[i]).attr('id') + '"]').addClass('active');
        } else {
            $('nav a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('active');
        }
    }
});

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    
}