module Common {

	export class HintDialog {
	 private template;
	 private $html;

	 constructor() {
		this.template = Views.ViewBase.currentView.registerTemplate("hint-template");
	 }

	 public create(message) {
		this.$html = $(this.template({ message: message }));
		 this.$html.find(".close").click((e) => {
			e.preventDefault();
			 this.$html.remove();
		 });

		 $("body").append(this.$html);
	 }
	}

	export class InprogressDialog {
	 private template;
	 private $html;

	 constructor() {
		this.template = Views.ViewBase.currentView.registerTemplate("inPorgressDialog-template");
	 }

	 public create(message, $before) {
		this.$html = $(this.template({ message: message }));		
		$before.before(this.$html);		
	 }

	 public remove() {
		 this.$html.remove();
	 }
	}

		export class ErrorDialog {

			public static show(error) {

					var v = Views.ViewBase.currentView;

					var tmp = v.registerTemplate("error-dialog-template");

					var $h = $(tmp({ error: error }));

					$("body").append($h);

					$h.find(".refresh-btn").click((e) => {
							e.preventDefault();

							window.location.reload(true);

					});
			}
		}

	export class InfoDialog {
		private template;
		private $html;

		constructor() {
			this.template = Views.ViewBase.currentView.registerTemplate("infoDialog-template");
		}

		public create(title, text, callback = null) {
			var context = {
				title: title,
				text: text
			};

			this.$html = $(this.template(context));
			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				if (callback) {
					callback();
				}
				this.$html.fadeOut();
			});

			$("body").append(this.$html);
			this.$html.fadeIn();
		}

		public hide() {
			this.$html.hide();
		}

	}

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
				this.$html.fadeOut();
			});
			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				this.$html.fadeOut();
			});

			$("body").append(this.$html);
			this.$html.fadeIn();
		}

	  public hide() {
		  this.$html.hide();
	  }

	}
}