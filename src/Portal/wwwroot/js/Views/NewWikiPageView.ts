module Views {

		export class NewWikiPageView extends ViewBase {

				private rating: Rating;
				private articlePhotos: ArticlePhotos;

				public articleType: ArticleType;
				public articleId: string;
				public langVersion: string;

				constructor(articleId, articleType) {
						super();

						this.articleType = articleType;
						this.articleId = articleId;
						this.langVersion = this.getLangVersion();

						this.rating = new Rating(articleId, this.langVersion);

						this.articlePhotos = new ArticlePhotos(articleId);
					this.loadPhotos();
				}

				private loadPhotos() {
						this.articlePhotos.fillPhotos($("#photosCont"), 0, 9);					
				}

				public getLangVersion() {
						var urlParams = window.location.pathname.split("/");
						return urlParams[2];
				}



		}

		export class ArticlePhotos {

				private articleId;

			constructor(articleId) {
					this.articleId = articleId;

					this.registerPhotoUpload(this.articleId, "addUserPhoto");
			}

			private getThumbs(layoutSize, photosLimit, callback: Function) {

					var data = [["articleId", this.articleId], ["layoutSize", layoutSize.toString()], ["photosLimit", photosLimit.toString()]];

						ViewBase.currentView.apiGet("WikiPhotoThumbnails", data, (photos) => {
								callback(photos);
						});
				}

				public fillPhotos($cont, layoutSize, photosLimit) {
						this.getThumbs(layoutSize, photosLimit, (photos) => {

							photos.forEach((p) => {
									var $img = $(`<img src="data:image/jpeg;base64,${p}" />`);

								$cont.append($img);
							});

						});
				}

				

				private registerPhotoUpload(articleId, inputId) {
						var config = new Common.FileUploadConfig();
						config.inputId = inputId;
						config.endpoint = "WikiPhotoGallery";

						var pu = new Common.FileUpload(config);
						pu.customId = articleId;
						
						var ud = null;

						pu.onProgressChanged = (percent) => {
								if (ud === null) {
										ud = new Common.UploadDialog();
										ud.create();
								}

								ud.update(percent);
						}

						pu.onUploadFinished = (file, fileId) => {
								var $pb = $("#galleryProgress");
								$pb.hide();
								var id = new Common.InfoDialog();
								var v = ViewBase.currentView;
								id.create(v.t("UploadTitle", "jsWiki"), v.t("UploadBody", "jsWiki"));

								ud.destroy();
						}
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


		export class RegMessages {
				public static displayFullRegMessage() {
						var id = new Common.InfoDialog();
						var v = ViewBase.currentView;
						id.create(v.t("FullRegTitle", "jsWiki"), v.t("FullRegBody", "jsWiki"));
				}
		}

}