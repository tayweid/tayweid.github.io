// Contents Sidebar Action

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
