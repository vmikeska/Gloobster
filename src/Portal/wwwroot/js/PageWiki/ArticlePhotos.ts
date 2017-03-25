module Wiki {


		export class ArticlePhotos {

				private articleId;

				constructor(articleId, canUpload) {
						this.articleId = articleId;

						$("#openPhotoDialog").click((e) => {
								this.showPhotoUploadDialog(null);
						});

						if (canUpload) {
							$("#openPhotoDialog").removeClass("hidden");
						}
				}

				private getThumbs(layoutSize, photosLimit, callback: Function) {

						var data = [["articleId", this.articleId], ["layoutSize", layoutSize.toString()], ["photosLimit", photosLimit.toString()]];

						Views.ViewBase.currentView.apiGet("WikiPhotoThumbnails", data, (photos) => {
								callback(photos);
						});
				}

				public fillPhotos($cont, layoutSize, photosLimit) {
						this.getThumbs(layoutSize, photosLimit, (photos) => {

								photos.forEach((p) => {
										var link = `/Wiki/ArticlePhoto?photoId=${p.photoId}&articleId=${p.articleId}`;

										var $img = $(`<a class="photo-link" href="${link}" target="_blank"><img src="data:image/jpeg;base64,${p.data}" /></a>`);

										$cont.append($img);
								});

						});
				}

				public showPhotoUploadDialog(sectionId) {
						var cd = new Common.CustomDialog();

						var v = Views.ViewBase.currentView;

						var t = v.registerTemplate("photo-upload-dlg-template");

						var $t = $(t());

						cd.init($t, v.t("UploadAPhoto", "jsWiki"));

						cd.addBtn("Close", "yellow-orange", () => {
								cd.close();
						});

						this.registerPhotoUpload(this.articleId, "addUserPhoto", sectionId, () => {
								cd.close();
						});
				}


				private registerPhotoUpload(articleId, inputId, sectionId, callback) {
						var config = new Common.FileUploadConfig();
						config.inputId = inputId;
						config.endpoint = "WikiPhotoGallery";

						var pu = new Common.FileUpload(config);

						pu.customId = articleId;
						if (sectionId) {
								pu.customId += `,${sectionId}`;
						}

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
								var v = Views.ViewBase.currentView;
								id.create(v.t("UploadTitle", "jsWiki"), v.t("UploadBody", "jsWiki"));

								if (ud) {
										ud.destroy();
								}
								callback();
						}
				}

		}


}