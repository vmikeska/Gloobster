module Views {
	export class WikiAdminPageView extends WikiPageView {	 
		private $adminMode;
		private isAdminMode = false;

		private linksAdmin: LinksAdmin;
		
		private photoAdmin: PhotoAdmin;
		private photosAdmin: PhotosAdmin;

		constructor(articleId, articleType) {
			super(articleId, articleType);
			
			this.linksAdmin = new LinksAdmin(articleId);
			
			
			
			this.photoAdmin = new PhotoAdmin(articleId);
			this.photosAdmin = new PhotosAdmin(articleId);

			this.$adminMode = $("#adminMode");
			this.regAdminMode();
		}

		private regAdminMode() {
			this.$adminMode.change(() => {
				this.isAdminMode = this.$adminMode.prop("checked");
				this.onAdminModeChanged();
			});
		}

		private onAdminModeChanged() {
			if (this.isAdminMode) {
				this.generateBlocks();
			} else {
				this.destroyBlocks();
			}
		}
	 
		private generateBlocks() {
			var adminBlocks = $(".adminBlock").toArray();

			adminBlocks.forEach((block) => {
				var $block = $(block);
				var id = $block.data("id");
				var adminType = $block.data("at");
					
			});
			
			this.photoAdmin.generateAdmin();

			if (this.articleType === Views.ArticleType.City) {
			 this.photosAdmin.createAdmin();
			}		 
		}

		private destroyBlocks() {
			$(".editSection").remove();
			//this.linksAdmin.removeAdminLinks();
			
			this.photoAdmin.clean();

			if (this.articleType === Views.ArticleType.City) {
				this.photosAdmin.clean();
			}
		}
			
	}

	export class PhotosAdmin {
		private articleId;
	 
		private $cont;

		constructor(articleId) {
			this.articleId = articleId;
		 
			this.$cont = $("#photos");			
		}

		public createAdmin() {						
			this.refreshPhotos(this.articleId, true);			
		}

		public clean() {
		 this.refreshPhotos(this.articleId, false);		 
		}
	 
		private regDelPhoto() {
			this.$cont.find(".delete").click((e) => {
				e.preventDefault();
				var $target = $(e.target);

				var confirmDialog = new Common.ConfirmDialog();
				confirmDialog.create("Delete", "Do you want to permanently delete this photo ?", "Cancel", "Ok", ($dialog) => {
				 
					ViewBase.currentView.apiDelete("WikiPhotoGallery", [["articleId", $target.data("ai")], ["photoId", $target.data("pi")]], (r) => {
						$dialog.remove();
						this.refreshPhotos(this.articleId, true);

					});
				});
			});
		}

		private regConfPhoto() {
		 this.$cont.find(".confirm").click((e) => {
			e.preventDefault();
			var $target = $(e.target);
				
				var data = {
				 articleId: $target.data("ai"),
				 photoId: $target.data("pi")
				};
				ViewBase.currentView.apiPut("WikiPhotoGallery", data, (r) => {		
				 this.refreshPhotos(this.articleId, true);
				});
			});
		}
	 
		private refreshPhotos(id: string, admin: boolean) {
			var request = new Common.RequestSender("/Wiki/ArticlePhotos", null, false);
			request.params = [["id", id], ["admin", admin.toString()]];
			request.onSuccess = (html) => {
			 this.$cont.html(html);
				var $photoBtn = $("#duCont");
				if (admin) {
					this.regConfPhoto();
					this.regDelPhoto();
					this.registerPhotoUpload(this.articleId, "galleryPhotoInput");

					$photoBtn.show();
				}
				//else {
				//	$photoBtn.hide();
				//}
			};
			request.onError = (response) => { $("#photos").html("Error") };
			request.sendGet();		 
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
				this.refreshPhotos(this.articleId, true);
			}
		}

	}

	export class PhotoAdmin {
		private buttonTemplate;

		private articleId;

		constructor(articleId) {
			this.articleId = articleId;
			this.buttonTemplate = ViewBase.currentView.registerTemplate("photoEdit-template");
		}

		public generateAdmin() {
			var $html = $(this.buttonTemplate());
			$(".titlePhoto").before($html);

			this.registerPhotoUpload(this.articleId, "titlePhotoInput");
		}

		public clean() {
				$(".photo-button").remove();
		}

		private registerPhotoUpload(articleId, inputId) {
			var config = new Common.FileUploadConfig();
			config.inputId = inputId;
			config.endpoint = "WikiTitlePhoto";

			var picUpload = new Common.FileUpload(config);
			picUpload.customId = articleId;

			picUpload.onProgressChanged = (percent) => {
			}

			picUpload.onUploadFinished = (file, files) => {
				var d = new Date();

				$(".titlePhoto img").attr("src", `/wiki/ArticleTitlePhoto/${this.articleId}?d=${d.getDate()}`);

			}
		}
	}
		
}