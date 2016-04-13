module Trip {

	export class FilesConfig {
		public editable: boolean;
		public templateId: string;
		public addAdder: boolean;
		public mainContainerId: string;
		public containerId: string;
		public inputId: string;
		public entityId: string;
		public isMasterFile: boolean;		
	  public adderTemplate: string;
	}

	export class TripFiles {
	  public static masterFiles: TripFiles;
		public tripId: string;

		private fileDocumentTemplate: any;
		private fileInputTemplate: any;
		public fileUpload: Common.FileUpload;
		public fileDaD: Common.FileDaD;
		public files: any[];
		public filesPublic: any[];
		public static lastIdToDelete: string;

		private config: FilesConfig;

		private $mainContainer: any;
		private $container: any;
		private $adderContainer: any;
		private $adder: any;
		private $noFiles: any;

		private v: Views.ViewBase;

		constructor(config: FilesConfig, customConfig = null) {

			if (config.adderTemplate) {
				this.fileInputTemplate = Views.ViewBase.currentView.registerTemplate(config.adderTemplate);
			}

			this.fileDocumentTemplate = Views.ViewBase.currentView.registerTemplate(config.templateId);

			if (config.isMasterFile) {
			 TripFiles.masterFiles = this;
			}

			this.config = config;
			this.$mainContainer = $(`#${config.mainContainerId}`);
			this.$container = $(`#${config.containerId}`);
			
			var $deleteConfirm = $("#deleteFileConfirm");

			$deleteConfirm.unbind();
			$deleteConfirm.click(() => {
			 this.callDelete(TripFiles.lastIdToDelete);
				$("#popup-delete").hide();
			});

			if (this.config.editable) {
			 this.registerFileUpload(customConfig);
			}

			this.v = Views.ViewBase.currentView;
		}

		private registerFileUpload(customConfig) {
		 var config = new Common.FileUploadConfig();
		 config.inputId = this.config.inputId;
		 config.endpoint = "TripFile";
			config.customInputRegistration = true;
		 this.fileUpload = new Common.FileUpload(config, customConfig);

		 this.fileUpload.onProgressChanged = (percent) => {
			this.$mainContainer.find(".upload-droparea").show();
			this.$mainContainer.find(".upload-progressbar").show();

			var $progressBarCont = this.$mainContainer.find(".upload-progressbar");
			$progressBarCont.show();

			this.setUploadProgress(percent);
		 }

		 this.fileUpload.onUploadFinished = (file, res) => {
			this.$mainContainer.find(".upload-droparea").hide();
			this.$mainContainer.find(".upload-progressbar").hide();
			this.setUploadProgress(0);

			if (res) {
			 this.filterFiles(res.files, res.filesPublic);
			}
		 }
		}

		private addAdder() {
			this.$adder = $(this.fileInputTemplate({ id: this.config.inputId }));
			this.fileDaD = new Common.FileDaD();

			this.$container.append(this.$adder);
		  //now when file input exists, we can register events
			this.fileUpload.$filesInput = this.$adder.find(`#${this.config.inputId}`);
			this.fileDaD.onFiles = (files) => {
				this.fileUpload.filesEvent(files);
			};

			this.fileDaD.registerComponent(this.config.mainContainerId);
		}


		public setFiles(files, tripId, filesPublic) {
			this.filesPublic = filesPublic;
			this.files = files;
			this.tripId = tripId;

			this.onFilesSet();
		}

		private onFilesSet() {
		 this.generateFiles();
		}
	 
		private callDelete(fileId: string) {
			var prms = [["fileId", fileId], ["tripId", this.tripId]];
			this.v.apiDelete("tripFile", prms, (res) => {			 
			 this.filterFiles(res.files, res.filesPublic);
			});
		}

		private filterFiles(files, filesPublic) {
			if (!files) {
				return;
			}

			this.filesPublic = filesPublic;

			if (this.config.entityId) {
				var entityFiles = _.filter(files, (file) => { return file.entityId === this.config.entityId; });
				this.files = entityFiles;
				this.generateFiles();
			} else {
				this.files = files;
				this.generateFiles();
			}

			if (TripFiles.masterFiles && (!this.config.isMasterFile)) {
				TripFiles.masterFiles.files = files;
				TripFiles.masterFiles.filesPublic = filesPublic;
				TripFiles.masterFiles.generateFiles();
			}

		}

		private generateFiles() {
			this.$container.children().not(this.$adder).remove();

			if (this.files && this.files.length > 0) {
				$(".fileDocs").show();

				this.files.forEach((file) => {

					var isOwner = file.ownerId === Views.ViewBase.currentUserId;
					var filePublic = this.getFilePublic(file.id);
					var displayFile = isOwner || filePublic.isPublic;

					if (displayFile) {

						var context = {
							fileName: this.getShortFileName(file.originalFileName),
							id: file.id,
							fileType: this.getFileType(file.originalFileName),
							tripId: this.tripId,
							editable: this.config.editable,
							isOwner: isOwner,
							canManipulate: this.config.editable && isOwner
						};

						var $html = this.generateFile(context);
						this.$container.prepend($html);
					}
				});


				this.$container.find(".delete").click((e) => {
					e.preventDefault();
					var $target = $(e.target);
					var id = $target.data("id");
					
					var dialog = new Common.ConfirmDialog();
					dialog.create(this.v.t("DelDialogTitle", "jsTrip"), this.v.t("DelDialogBody", "jsTrip"), this.v.t("Cancel", "jsLayout"), this.v.t("Ok", "jsLayout"), () => {					 
						this.callDelete(id);					 
					});

				});
			} 

			if (this.config.editable && this.config.addAdder && !this.$adder) {				
				 this.addAdder();				 				
			}			
		}
	 
		private generateFile(context) {			
		 var filePublic = this.getFilePublic(context.id);

		 var html = this.fileDocumentTemplate(context);
			var $html = $(html);

			var $filePublic = $html.find(".filePublic");

			$filePublic.prop("checked", filePublic.isPublic);

			if (this.config.editable) {

				$filePublic.change((e) => {
					var $target = $(e.target);
					var fileId = $target.data("id");
					var state = $target.prop("checked");
					var prms = { fileId: fileId, tripId: this.tripId, state: state };
					Views.ViewBase.currentView.apiPut("tripFilePublic", prms, (res) => {

						var $sisterChecks = $(".filePublic" + fileId);
						$sisterChecks.prop("checked", state);

					});
				});			 
			}

			return $html;
		}

		private getFilePublic(fileId: string) {
			var filePublic = _.find(this.filesPublic, (f) => {
				return f.fileId === fileId;
			});
			return filePublic;
		}

		private getFileType(fileName) {
			var prms = fileName.split(".");
			var fileType = prms[prms.length - 1];

			if (_.contains(["jpg", "jpeg", "bmp", "png", "gif"], fileType)) {
			 return "img";
			}

			if (_.contains(["docx", "doc"], fileType)) {
			 return "doc";
			}
		 
			var recognizedTypes = ["doc", "docx", "xml", "html", "pdf", "txt", "jpg", "jpeg", "bmp", "png", "gif"];
			var isRecognized = _.contains(recognizedTypes, fileType);
			if (isRecognized) {			 
				return fileType;
			}
			return "txt";
		}

		private getShortFileName(fileName) {
			if (fileName.length <= 13) {
				return fileName;
			}

			var act = 0;
			var outName = "";
			fileName.split("").forEach((char) => {
				if (outName.length > 24) {
					return;
				}
				act++;
				outName += char;
				if (act === 10) {
					outName += "-";
					act = 0;
				}
			});

			return outName;
		}

		

		private setUploadProgress(percent) {
		 var $progressBarCont = this.$mainContainer.find(".upload-progressbar");
			$progressBarCont.find(".progress").css("width", percent + "%");
			$progressBarCont.find("span").text(percent + "%");
		}

	}
}