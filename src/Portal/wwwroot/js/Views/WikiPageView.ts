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

			this.regContribute();
		}

		private regContribute() {
			$(".contrib-link").click((e) => {
					e.preventDefault();
					var $t = $(e.target);
					var $cont = $t.closest(".empty-cont");
					if ($cont.length > 0) {
							var sid = $cont.data("sid");
							$(`.article_rating[data-id="${sid}"]`).find(".bubble").toggle();
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

				ViewBase.currentView.apiPost("WikiReport", data, (r) => {
					this.toggleForm($target);
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

		private getRatingDesign(rating) {
			var res = {
				rstr: rating,
				cls: ""
			};

			if (rating > 0) {
				res.rstr = `+${rating}`;
				res.cls = "plus";
			} else {
				res.cls = "minus";
			}

			return res;
		}

		private regRatingDD() {
			this.regRatingBase("pmBtn", "item", "WikiRating", (c) => {
				this.setLikeDislike(c.$cont, c.like, "pmBtn");
			});
		}

		private regRatingPrice() {
			this.regRatingBase("priceBtn", "rate", "WikiPriceRating", (c) => {
				this.setLikeDislike(c.$cont, c.like, "priceBtn");
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
			this.regRatingBase("ratingBtn", "article_rating", "WikiRating", (c) => {
				this.setLikeDislike(c.$cont, c.like, "ratingBtn");
				if (c.res != null) {
					var $r = c.$cont.find(".score");

					$r.removeClass("plus").removeClass("minus");
					var d = this.getRatingDesign(c.res);
					$r.text(d.rstr);
					$r.addClass(d.cls);
				}
			});
		}

		private setLikeDislike($cont, state, btnClass) {
				var $btns = $cont.find(`.${btnClass}`);				
				var btns = $btns.toArray();

			$btns.removeClass("active");

			btns.forEach((btn) => {
				var $btn = $(btn);
				var isLike = $btn.data("like");
				
				if (isLike && state) {						
						$btn.addClass("active");					
				}
				if (!isLike && !state) {
						$btn.addClass("active");
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