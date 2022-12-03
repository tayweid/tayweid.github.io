$(window).scroll(function(){
    var scrollTop = $(document).scrollTop();
    var anchors = $('body').find('h1');
    
    for (var i = 0; i < anchors.length; i++){
        if (scrollTop > $(anchors[i]).offset().top - 50 && scrollTop < $(anchors[i]).offset().top + $(anchors[i]).height() - 50) {
            $('nav ul li a[href="#' + $(anchors[i]).attr('id') + '"]').addClass('active');
        } else {
            $('nav ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('active');
        }
    }
});