module Views {

		export class WikiPageView extends ViewBase {

				private rating: Wiki.Rating;
				public articlePhotos: Wiki.ArticlePhotos;
				private reportWin: Wiki.ReportWindow;

				private resizer: Wiki.WikiResizer;

				public articleType: Wiki.ArticleType;
				public articleId: string;
				public langVersion: string;

				public photoGID;

				constructor(articleId, articleType, photoGID) {
						super();

						this.photoGID = photoGID;
						this.articleType = articleType;
						this.articleId = articleId;

						this.resizer = new Wiki.WikiResizer(this);

						this.resizer.init();

						this.langVersion = this.getLangVersion();

						this.rating = new Wiki.Rating(articleId, this.langVersion);

					  var canUpload = this.articleType === Wiki.ArticleType.City;
						this.articlePhotos = new Wiki.ArticlePhotos(articleId, canUpload);
						this.loadPhotos();

						this.reportWin = new Wiki.ReportWindow(this.langVersion, this.articleId, this);

						this.regEmptySectionsBtn();
				}

				private regEmptySectionsBtn() {
						$(".empty-button").click(() => {
								$(".cont-left").append($(".empty-blocks").children());

							$(".empty-block-all").hide();
						});

						
				}

				private loadPhotos() {
						this.articlePhotos.fillPhotos($("#photosCont"), 0, 9);
				}

				public getLangVersion() {
						var urlParams = window.location.pathname.split("/");
						return urlParams[2];
				}

		}

}