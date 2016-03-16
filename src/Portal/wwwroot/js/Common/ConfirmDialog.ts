module Common {
	export class ConfirmDialog {
		private template;
		private $html;

		constructor() {
			this.template = Views.ViewBase.currentView.registerTemplate("confirmDialog-template");
		}

		public create(title, text, textCancel, textOk, okCallback) {
			var context = {
				title: title,
				text: text,
				textCancel: textCancel,
				textOk: textOk
			};

			this.$html = $(this.template(context));
			this.$html.find(".confirm").click((e) => {
				e.preventDefault();
				okCallback(this.$html);
			});
			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				this.$html.remove();
			});

			$("body").append(this.$html);
			this.$html.fadeIn();
		}

	  public hide() {
		  this.$html.hide();
	  }

	}
}