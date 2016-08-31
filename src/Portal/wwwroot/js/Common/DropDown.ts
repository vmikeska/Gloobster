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

			}

			public static setValue($dd, value) {
					$dd.val(value);
					var $li = $dd.find(`li[data-value="${value}"]`);
					var t = $li.text();
				$dd.find(".selected").text(t);
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