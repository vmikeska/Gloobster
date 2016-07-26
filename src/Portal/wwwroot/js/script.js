$(document).ready(function () {
    // counttoevaluate
    $('.countto').each(function () {
        $(this).countTo();
    });


    // hamburger
    $(document).on('click', '.hamburger', function (e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $($(this).data('target')).fadeToggle();
    });
    // popup
    $(document).on('click', '.popup-target', function (e) {
        e.preventDefault();
        $($(this).data('target')).fadeIn();

    });
    $(document).on('click', '.popup .close', function (e) {
        e.preventDefault();
        $(this).closest('.popup').fadeOut();

    });
    $(document).on('click', '.popup', function (e) {
        if ($(this).is(e.target)) {
            e.preventDefault();
            $(this).fadeOut();
        }
    });
    // popup2
    $(document).on('click', '.popup2-target', function (e) {
        e.preventDefault();
        $(this).toggleClass('popup-open');
        $($(this).data('target')).slideToggle().data('target', $(this));
    });
    $(document).on('click', '.popup2 .close', function (e) {
        e.preventDefault();
        var $target = $(this).closest('.popup2').slideUp().data('target');
        if ($target) {
            $target.removeClass('popup-open');
        }            
    });
    // scrollto
    $(document).on('click', '.scrollto, a[href^=#]', function (e) {
        if ($($(this).attr('href')).length > 0) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 1000);
        }
    });
   
    $(document).on('click', '.trip-holder .icon-wheel', function (e) {
        e.preventDefault();
        $(this).closest('.trip-holder').find('.trip-menu').slideToggle();
    });


   

});