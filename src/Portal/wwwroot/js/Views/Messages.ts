module Views {
	export class MessagesHome extends ViewBase {
			
		constructor() {
			super();

			$(".um-all").click((e) => {
				e.preventDefault();
				var $t = $(e.delegateTarget);
				var url = $t.data("url");

				window.location.href = url;
			});
		}
			
	}
}