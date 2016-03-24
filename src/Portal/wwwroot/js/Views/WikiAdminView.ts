module Views {
	export class WikiAdminView extends ViewBase {
		
	 constructor() {
		 super();
		 this.regActionButtons();
	 }

		private regActionButtons() {
			$(".actionButton").click((e) => {
				e.preventDefault();
				var $target = $(e.target);
				var name = $target.data("action");

				var $cont = $target.closest(".task");
				var id = $cont.attr("id");

				var data = {
					action: name,
					id: id
				};

				this.apiPost("AdminAction", data, (r) => {
					if (r) {
						$(`#${id}`).remove();
					}
				});

			});
		}

		public callAction(taskId, action) {
		
		

	 }

	}
}