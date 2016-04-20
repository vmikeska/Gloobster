$(document).ready(function () {
    // counttoevaluate
    $('.countto').each(function () {
        $(this).countTo();
    });


    // dropdownbubble
    //$(document).on('click', '.dropdown .selected', function () {
    //    var selected = $(this);
    //    var dropdown = selected.closest('.dropdown');
    //    var input = selected.siblings('input');
    //    dropdown.toggleClass('dropdown-open');
    //    if (!dropdown.hasClass('with-checkbox')) {
    //        dropdown.find('li:not(.disabled)').unbind('click').click(function () {
    //            dropdown.removeClass('dropdown-open');

    //            selected.html($(this).html());
    //            input.val($(this).is('[data-value]') ? $(this).data('value') : $(this).html()).trigger('change');
    //        });
    //    }
    //});
    //$(document).on('keypress click', '.dropdown .inputed', function () {
    //    var inputed = $(this);
    //    var dropdown = inputed.closest('.dropdown');
    //    dropdown.addClass('dropdown-open');
    //    if (!dropdown.hasClass('with-checkbox')) {
    //        dropdown.find('li:not(.disabled)').unbind('click').click(function () {
    //            dropdown.removeClass('dropdown-open');
    //            inputed.val($(this).is('[data-value]') ? $(this).data('value') : $(this).html()).trigger('change');
    //        });
    //    }
    //});
    //$(document).on('click', function () {
    //    $('.dropdown').each(function () {
    //        if (!$(this).is(':hover')) {
    //            $(this).removeClass('dropdown-open');
    //        }
    //    });
    //});





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
        //var popup = $($(this).data('target'));
        //var content = popup.find('div');
        //content.hide();
        //popup.show();
        //content.fadeIn();
    });
    $(document).on('click', '.popup .close', function (e) {
        e.preventDefault();
        $(this).closest('.popup').fadeOut();
        //var popup = $(this).closest('.popup');
        //var content = popup.find('div');
        //content.fadeOut(function() {
        //    popup.hide();
        //});
    });
    $(document).on('click', '.popup', function (e) {
        if ($(this).is(e.target)) {// e.target === $(this)[0]
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
        $(this).closest('.popup2').slideUp().data('target').removeClass('popup-open');
    });
    // scrollto
    $(document).on('click', '.scrollto, a[href^=#]', function (e) {
        if ($($(this).attr('href')).length > 0) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 1000);
        }
    });
    // tabs
    $(document).on('click', '.tab', function (e) {
        e.preventDefault();
        var tab = $(this);
        var tabs = tab.closest('.tabs').find('.tab');
        tabs.removeClass('active');
        tab.addClass('active');
        $('.tab-content').hide();
        $(tab.data('target')).show();
    });
    // trips

    $(document).on('click', '.trip-holder .icon-wheel', function (e) {
        e.preventDefault();
        $(this).closest('.trip-holder').find('.trip-menu').slideToggle();
    });


   

});