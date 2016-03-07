$(document).ready(function () {
    // counttoevaluate
    $('.countto').each(function () {
        $(this).countTo();
    });
    // dropdownbubble
    $(document).on('click', '.dropdown .selected', function () {
        var selected = $(this);
        var dropdown = selected.closest('.dropdown');
        var input = selected.siblings('input');
        dropdown.toggleClass('dropdown-open');
        if (!dropdown.hasClass('with-checkbox')) {
            dropdown.find('li:not(.disabled)').unbind('click').click(function () {
                dropdown.removeClass('dropdown-open');
                selected.html($(this).html());
                input.val($(this).is('[data-value]') ? $(this).data('value') : $(this).html()).trigger('change');
            });
        }
    });
    $(document).on('keypress click', '.dropdown .inputed', function () {
        var inputed = $(this);
        var dropdown = inputed.closest('.dropdown');
        dropdown.addClass('dropdown-open');
        if (!dropdown.hasClass('with-checkbox')) {
            dropdown.find('li:not(.disabled)').unbind('click').click(function () {
                dropdown.removeClass('dropdown-open');
                inputed.val($(this).is('[data-value]') ? $(this).data('value') : $(this).html()).trigger('change');
            });
        }
    });
    $(document).on('click', function () {
        $('.dropdown').each(function () {
            if (!$(this).is(':hover')) {
                $(this).removeClass('dropdown-open');
            }
        });
    });
    // evaluate
    //$(document).on('click', '.evaluate .buttons', function (e) {
    //    e.preventDefault();
    //    $(this).closest('.evaluate').toggleClass('evaluate-open');
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
    //$(document).on('mouseenter', '.trips .trip .icon-wheel', function() {
    //    $(this).closest('.trip').siblings('.trip-menu').show();
    //}).on('mouseleave', '.trips .trip .icon-wheel', function() {
    //    $(this).closest('.trip').siblings('.trip-menu').hide();
    //});
    $(document).on('click', '.trip-holder .icon-wheel', function (e) {
        e.preventDefault();
        $(this).closest('.trip-holder').find('.trip-menu').slideToggle();
    });


    //// form
    //$('form.ajax').on('submit', function(e) {
    //    e.preventDefault();
    //    var form = $(this);
    //    $.post(form.attr('action'), form.serialize()).done(function(data) {
    //        //console.log(data);
    //        form.find('input[type=submit]').addClass('sent').prop('disabled', true);//.val('Sent');
    //        form.find('.thankyou').slideDown('slow');//.fadeIn('slow');
    //        form.find('input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=url],textarea').val('');
    //        form.find('input[type=checkbox],input[type=radio]').prop('checked', false);
    //    });
    //});

    //mata: profiq contact form
    ////contactus
    //$('#contactus input[name="pq_code"]').hide();
    //$('#contactus form').on('submit', function(e) {
    //    e.preventDefault();
    //    var form = $(this);
    //    var formData = form.serialize();
    //    $.post(form.attr('action'), formData).done(function(data) {
    //        //console.log(data);
    //        form.find('input[type=submit]').addClass('sent').prop('disabled', true);//.val('Sent');
    //        form.find('.thankyou').fadeIn('slow');
    //    });
    //});
    //mata: rare contact form
    //$(document).on('submit', 'form[data-ajax]', function(e) {
    //    e.preventDefault();
    //    var form = $(this);
    //    var ajax = form.data('ajax');
    //    var data = $.merge(form.serializeArray(), [{name: 'action', value: 'rare_ajax'}, {name: 'ajax', value: ajax}]);
    //    $.ajax({
    //        type: 'POST',
    //        cache: false,
    //        url: ajaxurl,
    //        data: data,
    //        dataType: 'html',
    //        success: function(serverResponse) {
    //            //console.log('success', serverResponse);
    //            switch (ajax) {
    //                case 'contactus':
    //                case 'newsletter':
    //                    form.find('.alert').html(serverResponse).fadeIn();
    //                    break;
    //            }
    //        },
    //        error: function(serverResponse) {
    //            //console.log('error', serverResponse);
    //        }
    //    });
    //});

});