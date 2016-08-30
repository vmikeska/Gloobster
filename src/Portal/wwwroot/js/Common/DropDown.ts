module Common {
	export class DropDown {

		//https://github.com/jquery/PEP


		public static registerDropDown($dd) {

			$dd.find('.selected').on('click', (e) => {

				var selected = $(e.target);
				var dropdown = selected.closest('.dropdown');
				var input = selected.siblings('input');

				DropDown.hideOthers(dropdown);

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

			//what was the meaning of this ?
			// $(document).on('keypress click', '.dropdown .inputed', (e) => {	   
			//  var inputed = $(e.target);
			//var dropdown = inputed.closest('.dropdown');

			//dropdown.addClass('dropdown-open');

			//  if (!dropdown.hasClass('with-checkbox')) {
			//   dropdown.find('li:not(.disabled)').unbind('click').click(() => {
			//    dropdown.removeClass('dropdown-open');
			//    inputed.val(inputed.is('[data-value]') ? inputed.data('value') : inputed.html()).trigger('change');
			//   });
			//  }
			// });
		}
			
		private static hideOthers(hovered) {
			var $items = $('.dropdown').not(hovered);

			$items.each((i, el) => {
				$(el).removeClass('dropdown-open');

			});
		}

		public static init() {
				$(document).ready(() => {
					//setTimeout(() => {
						$(".dropdown").toArray().forEach((c) => {
							var $c = $(c);
							this.registerDropDown($c);
						});
					//}, 1000);
				});
		}

	}
}