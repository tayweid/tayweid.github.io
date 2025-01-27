jQuery(document).ready(function($) {
    $('.paper.expand').click(function(event) {
        var text = window.getSelection().toString();
        var tag = event.target.tagName.toLowerCase();
        if ((text.length == 0) && (tag != 'a')) {
            paper = $(this);
            var popup = paper.find('.popup');
            if (popup.length > 0) {
                popup.slideToggle('fast');
                paper.toggleClass('expanded');
            }
        }
    });
    $('#output').focus();
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-9065807-1', 'auto');
ga('send', 'pageview');


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