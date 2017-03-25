module Wiki {

		export class ReportWindow {

				private langVersion;
				private articleId;

				private v: Views.WikiPageView;

				constructor(langVersion, articleId, v) {
						this.langVersion = langVersion;
						this.articleId = articleId;

						this.v = v;

						this.registerBtnEvent();
				}

				private registerBtnEvent() {
						$(".article-rating-all .report-btn").click((e) => {
								e.preventDefault();
								var $t = $(e.target);
								var $p = $t.closest(".article-rating");
								var sectionId = $p.data("id");
								this.createWindow(sectionId);
						});

						$(".empty-block .contrib-link").click((e) => {
								e.preventDefault();
								var $t = $(e.target);
								var $p = $t.closest(".empty-block");
								var sectionId = $p.data("sid");
								this.createWindow(sectionId);
						});
				}



				private createWindow(sectionId) {
						var cd = new Common.CustomDialog();

						var t = this.v.registerTemplate("block-report-tmp");
						var $html = $(t());

						$html.find("#uploadSectionPhoto").click((e) => {
								e.preventDefault();

								this.v.articlePhotos.showPhotoUploadDialog(sectionId);

						});

						cd.init($html, this.v.t("ReportText", "jsWiki"));

						cd.addBtn(this.v.t("Cancel", "jsLayout"), "red-orange", () => {
								cd.close();
						});

						cd.addBtn(this.v.t("ReportSend", "jsWiki"), "green-orange", () => {
								var txt = $html.find(".txt-area").val();
								this.sendReport(sectionId, txt, () => {
										cd.close();
								});
						});

				}

				private sendReport(sectionId, txt, callback: Function) {
						var data = {
								lang: this.langVersion,
								articleId: this.articleId,
								sectionId: sectionId,
								text: txt
						};

						this.v.apiPost("WikiReport", data, (r) => {
								var id = new Common.InfoDialog();
								id.create(this.v.t("ContributionThanksTitle", "jsWiki"), this.v.t("ContributionThanksBody", "jsWiki"));
								callback();
						});
				}

		}

}