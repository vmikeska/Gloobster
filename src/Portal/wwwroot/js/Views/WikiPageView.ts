module Views {

	export enum ArticleType { Continent, Country, City } 


	export class WikiPageView extends ViewBase {

		public articleType: ArticleType;
		public articleId: string;
		public langVersion: string;
	 
		private report: Report;
	 
		constructor(articleId, articleType) {
		 super();
		 
			this.articleType = articleType;
			this.articleId = articleId;
			this.langVersion = this.getLangVersion();
				
			this.report = new Report(articleId, this.langVersion);

			this.regContribute();
		}

		private regContribute() {
			$(".contrib-link").click((e) => {
					e.preventDefault();
					
					if (ViewBase.currentView.fullReg) {
							var $t = $(e.target);
							var $cont = $t.closest(".empty-cont");
							if ($cont.length > 0) {
									var sid = $cont.data("sid");
									$(`.article_rating[data-id="${sid}"]`).find(".bubble").toggle();
							}
					} else {
							RegMessages.displayFullRegMessage();
					}
					
			});
		}


		public getLangVersion() {
			var urlParams = window.location.pathname.split("/");
			return urlParams[2];
		}

	}

	export class Report {

		private $bubble;
		private $evaluate;

		private articleId;
		private langVersion;

		constructor(articleId, langVersion) {
			this.regToggleButton();

			this.articleId = articleId;
			this.langVersion = langVersion;

			this.$bubble = $(".bubble");

			this.$bubble.find(".cancel").click((e) => {
				e.preventDefault();
				var $target = $(e.target);
				this.toggleForm($target);
			});

			this.regSend();
		}

		public toggleForm($element) {
			$element.closest(".article_rating").find(".bubble").toggle();
		}

		private regSend() {
			this.$bubble.find(".send").click((e) => {
				e.preventDefault();
				var $target = $(e.target);

				var $frame = $target.closest(".article_rating");
				var $bubble = $target.closest(".bubble");

				var data = {
					lang: this.langVersion,
					articleId: this.articleId,
					sectionId: $frame.data("id"),
					text: $bubble.find(".txt").val()
				};

				var v = ViewBase.currentView;

				v.apiPost("WikiReport", data, (r) => {
						this.toggleForm($target);

						var id = new Common.InfoDialog();
						id.create(v.t("ContributionThanksTitle", "jsWiki"), v.t("ContributionThanksBody", "jsWiki"));
				});

			});
		}

		private regToggleButton() {
				$(".icon-edit-pencil").click((e) => {
				e.preventDefault();

				if (ViewBase.currentView.fullReg) {
					var $target = $(e.target);
					this.toggleForm($target);
				} else {
				 RegMessages.displayFullRegMessage();
				}
			 
			});
		}


	}

	

	
	
}