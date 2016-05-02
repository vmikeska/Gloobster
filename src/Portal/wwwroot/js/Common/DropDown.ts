module Common {
	export class DropDown {
	
	 //https://github.com/jquery/PEP

        
        public registerDropDown($dd) {

            $dd.find('.selected').on('pointerdown', (e) => {

                var selected = $(e.target);
                var dropdown = selected.closest('.dropdown');
                var input = selected.siblings('input');

                this.hideOthers(dropdown);

                dropdown.toggleClass('dropdown-open');

                if (!dropdown.hasClass('with-checkbox')) {
                    dropdown.find('li:not(.disabled)').unbind('click').click((e) => {
                        dropdown.removeClass('dropdown-open');
                        var $li = $(e.target);
                        selected.html($li.html());

                        var selValue = $li.is('[data-value]') ? $li.data('value') : $li.html();
                        input.val(selValue);
                        input.trigger('change');
                    });
                }
            });
        }


	 public initBody() {

		$('.dropdown .selected').unbind();
		$('.dropdown .inputed').unbind();


    $('.dropdown .selected').on('pointerdown', (e) => {
	    
	    var selected = $(e.target);
	    var dropdown = selected.closest('.dropdown');
			var input = selected.siblings('input');

			this.hideOthers(dropdown);

			dropdown.toggleClass('dropdown-open');

	    if (!dropdown.hasClass('with-checkbox')) {
		    dropdown.find('li:not(.disabled)').unbind('click').click((e) => {
			    dropdown.removeClass('dropdown-open');
			    var $li = $(e.target);
					selected.html($li.html());
				 
					var selValue = $li.is('[data-value]') ? $li.data('value') : $li.html();
					input.val(selValue);
					input.trigger('change');				 
		    });
	    }
    });

    $(document).on('keypress click', '.dropdown .inputed', (e) => {	   
	    var inputed = $(e.target);
			var dropdown = inputed.closest('.dropdown');

			dropdown.addClass('dropdown-open');

	    if (!dropdown.hasClass('with-checkbox')) {
		    dropdown.find('li:not(.disabled)').unbind('click').click(() => {
			    dropdown.removeClass('dropdown-open');
			    inputed.val(inputed.is('[data-value]') ? inputed.data('value') : inputed.html()).trigger('change');
		    });
	    }
    });

	 }

	 private hideOthers(hovered) {
		 var $items = $('.dropdown').not(hovered);

		 $items.each((i, el) => {		 
			$(el).removeClass('dropdown-open');
		 
		});
	 }

	 public init() {
		$(document).ready(() => {
			this.initBody();
		 });

	 }


	}
}