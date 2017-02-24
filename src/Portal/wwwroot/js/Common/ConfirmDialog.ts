module Common {

		export class CustomDialog {

				private $t;
				
				public init($html, title, custClass = "") {
						var t = Views.ViewBase.currentView.registerTemplate("custom-dialog-template");
					var context = {
							title: title,
							custClass: custClass
					};
					this.$t = $(t(context));
						$("body").append(this.$t);

						this.$t.find(".dlg-cont").html($html);

						this.$t.fadeIn();

						this.$t.click((e) => {
								var isOut = e.target.className === "popup3";
								if (isOut) {
										e.preventDefault();
										this.close();
								}
						});

					this.$t.find(".close").click((e) => {
							this.close();
					});
						
				}

				public addBtn(txt, cls, callback) {
						var $b = $(`<a href="#" class="lbtn2 ${cls}">${txt}</a>`);
						this.$t.find(".dlg-btns").append($b);

					$b.click((e) => {
							e.preventDefault();
						callback();
					});
				}

				public close() {
						this.$t.fadeOut(() => {
								this.$t.remove();
						});
				}
		}

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

		export class UploadDialog {

				public $html;
				public $progresBar;
				public visible = false;

				public create() {
						var t = Views.ViewBase.currentView.registerTemplate("upload-dialog-template");
						this.$html = $(t());
						this.$progresBar = this.$html.find("#progressBar");

						this.$progresBar.show();
						this.$html.show();

						$("body").append(this.$html);
					this.visible = true;
				}

				public update(percent) {
					if (this.$html) {
						var pt = `${percent}%`;
						this.$progresBar.find(".progress").css("width", pt);
						this.$progresBar.find("span").text(pt);
					}
				}

				public destroy() {

					if (this.$html) {
							this.$html.remove();
							this.visible = false;
					}
					
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