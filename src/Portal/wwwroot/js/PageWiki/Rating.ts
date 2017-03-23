module Wiki {
		
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

								if (Views.ViewBase.currentView.fullReg) {
										Views.ViewBase.currentView.apiPut(endpoint, data, (r) => {
												callback({ $cont: $cont, like: like, res: r });
										});
								} else {
										RegMessages.displayFullRegMessage();
								}
						});
				}

				private regRating() {
						this.regRatingBase("ratingBtn", "article-rating", "WikiRating", (c) => {
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

		//todo: check
		export class RegMessages {
				public static displayFullRegMessage() {
						var id = new Common.InfoDialog();
						var v = Views.ViewBase.currentView;
						id.create(v.t("FullRegTitle", "jsWiki"), v.t("FullRegBody", "jsWiki"));
				}
		}

}