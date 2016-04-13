module Views {

	export enum ArticleType { Continent, Country, City } 


	export class WikiPageView extends ViewBase {

		public articleType: ArticleType;
		public articleId: string;
		public langVersion: string;
	 
		private rating: Rating;
		private photos: WikiPhotosUser;
		private report: Report;
	 
		constructor(articleId, articleType) {
		 super();
		 
			this.articleType = articleType;
			this.articleId = articleId;
			this.langVersion = this.getLangVersion();

			this.photos = new WikiPhotosUser(articleId);
			this.rating = new Rating(articleId, this.langVersion);
			this.report = new Report(articleId, this.langVersion);
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

		private toggleForm($element) {		 
			$element.closest(".evaluate").toggleClass("evaluate-open");
		}

		private regSend() {
			this.$bubble.find(".send").click((e) => {
				e.preventDefault();
				var $target = $(e.target);

				var $evaluate = $target.closest(".evaluate");
				var $bubble = $target.closest(".bubble");

				var data = {
					lang: this.langVersion,
					articleId: this.articleId,
					sectionId: $evaluate.data("id"),
					text: $bubble.find("input").val()
				};

				ViewBase.currentView.apiPost("WikiReport", data, (r) => {
					this.toggleForm($target);
				});

			});
		}

		private regToggleButton() {
			$(".icon-flag").click((e) => {
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

	export class RegMessages {
	 public static displayFullRegMessage() {
		var id = new Common.InfoDialog();
		var v = ViewBase.currentView;
		id.create(v.t("FullRegTitle", "jsWiki"), v.t("FullRegBody", "jsWiki"));
	 }
	}

	export class Rating {

		private articleId;
		private langVersion;

		constructor(articleId, langVersion) {
			this.regRating();
			this.regRatingDD();
			this.regRatingPrice();

			this.articleId = articleId;
			this.langVersion = langVersion;
		}

		private regRatingDD() {
			this.regRatingBase("pmBtn", "place", "WikiRating", (c) => {
				this.setLikeDislike(c.$cont, c.like, !c.like, "pmBtn", "icon-plus", "icon-minus");
			});
		}

		private regRatingPrice() {
			this.regRatingBase("priceBtn", "rate", "WikiPriceRating", (c) => {
				this.setLikeDislike(c.$cont, c.like, !c.like, "priceBtn", "icon-plus", "icon-minus");
				c.$cont.prev().find(".price").text(c.res.toFixed(2));
			});
		}

		private regRatingBase(btnClass, contClass, endpoint, callback) {
			$(`.${btnClass}`).click((e) => {
				e.preventDefault();
				var $btn = $(e.target);
				var like = $btn.data("like");
				var $cont = $btn.closest(`.${contClass}`);
				var id = $cont.data("id");

				var data = {
					articleId: this.articleId,
					sectionId: id,
					language: this.langVersion,

					like: like
				};

				if (ViewBase.currentView.fullReg) {
					ViewBase.currentView.apiPut(endpoint, data, (r) => {
						callback({ $cont: $cont, like: like, res: r });
					});
				} else {
				 RegMessages.displayFullRegMessage();
				}
			});
		}
	 
		private regRating() {
			this.regRatingBase("ratingBtn", "evaluate", "WikiRating", (c) => {
				this.setLikeDislike(c.$cont, c.like, !c.like, "ratingBtn", "icon-heart", "icon-nosmile");
			});
		}

		private setLikeDislike($cont, like, dislike, btnClass, likeClass, dislikeClass) {
			var $btns = $cont.find(`.${btnClass}`);
			var btns = $btns.toArray();
			btns.forEach((btn) => {
				var $btn = $(btn);
				var isLike = $btn.data("like");
				if (isLike) {
					var lc = `${likeClass}Red`;
					$btn.removeClass(likeClass);
					$btn.removeClass(lc);

					$btn.addClass(like ? lc : likeClass);
				} else {
					var dc = `${dislikeClass}Red`;
					$btn.removeClass(dislikeClass);
					$btn.removeClass(dc);

					$btn.addClass(dislike ? dc : dislikeClass);
				}
			});

		}
	}

	export class WikiPhotosUser {

		private articleId;

		constructor(articleId) {

			this.articleId = articleId;

			$("#recommendPhoto").click((e) => {
				e.preventDefault();

				if (ViewBase.currentView.fullReg) {
					$("#photosForm").show();
					$("#recommendPhoto").hide();
				} else {
					RegMessages.displayFullRegMessage();
				}
			});

			$("#photosForm .cancel").click((e) => {
				e.preventDefault();
				$("#photosForm").hide();
				$("#recommendPhoto").show();
			});

			var $terms = $("#photosForm #cid");
			$terms.change((e) => {
				e.preventDefault();

				var checked = $terms.prop("checked");
				if (checked) {
					$(".photoButton").show();
				} else {
					$(".photoButton").hide();
				}
			});

			this.registerPhotoUpload(this.articleId, "galleryInput");
		}


		private registerPhotoUpload(articleId, inputId) {
			var config = new Common.FileUploadConfig();
			config.inputId = inputId;
			config.endpoint = "WikiPhotoGallery";

			var picUpload = new Common.FileUpload(config);
			picUpload.customId = articleId;

			picUpload.onProgressChanged = (percent) => {
				var $pb = $("#galleryProgress");
				$pb.show();
				var pt = `${percent}%`;
				$(".progress").css("width", pt);
				$pb.find("span").text(pt);
			}

			picUpload.onUploadFinished = (file, fileId) => {
				var $pb = $("#galleryProgress");
				$pb.hide();
				var id = new Common.InfoDialog();
				var v = ViewBase.currentView;
				id.create(v.t("UploadTitle", "jsWiki"), v.t("UploadBody", "jsWiki"));
			}
		}
	}

}