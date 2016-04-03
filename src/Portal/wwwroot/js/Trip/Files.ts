module Trip {

	export class FilesConfig {
		public editable: boolean;
		public templateId: string;
		public addAdder: boolean;
		public containerId: string;
		public inputId: string;
		public entityId: string;
		public isMasterFile: boolean;
		public adderContainer: string;
	}

	export class Files {
		public static masterFiles: Files;
		public tripId: string;

		private template: any;
		private createTemplate: any;
		public fileUpload: Common.FileUpload;
		public fileDaD: Common.FileDaD;
		public files: any[];
		public filesPublic: any[];
		public static lastIdToDelete: string;

		private config: FilesConfig;

		private $container: any;
		private $adderContainer: any;
		private $adder: any;
		private $noFiles: any;

		constructor(config: FilesConfig) {

			if (config.isMasterFile) {
				Files.masterFiles = this;
			}

			this.config = config;
			this.$container = $("#" + config.containerId);
			this.$noFiles = this.$container.find(".noFiles");

			if (config.addAdder) {
				this.$adderContainer = $("#" + config.adderContainer);
			}

			var source = $("#" + config.templateId).html();
			this.template = Handlebars.compile(source);

			if (config.addAdder) {
				if (config.editable) {
					this.addAdder();
				}
			}

			if (this.config.editable) {
				this.registerFileUpload();
			}

			var $deleteConfirm = $("#deleteFileConfirm");

			$deleteConfirm.unbind();
			$deleteConfirm.click(() => {
				this.callDelete(Files.lastIdToDelete);
				$("#popup-delete").hide();
			});
		}

		private addAdder() {
			this.fileDaD = new Common.FileDaD(this.config.inputId);
			this.$adder = this.fileDaD.$instance;
			this.$adderContainer.html(this.$adder);
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
			Views.ViewBase.currentView.apiDelete("tripFile", prms, (res) => {			 
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

			if (Files.masterFiles && (!this.config.isMasterFile)) {
			 Files.masterFiles.files = files;
			 Files.masterFiles.filesPublic = filesPublic;
				Files.masterFiles.generateFiles();
			}

		}

		private generateFiles() {
			this.$container.children().not(this.$adder).not(this.$noFiles).remove();

			if (this.files && this.files.length > 0) {
				this.$noFiles.hide();
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
			} else {
				this.$noFiles.show();
			}
		}

		//doc xml html pdf
		private generateFile(context) {			
		 var filePublic = this.getFilePublic(context.id);

			var html = this.template(context);
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

				$html.find(".delete").click((e) => {
					Files.lastIdToDelete = $(e.target).data("id");
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
			var recognizedTypes = ["doc", "docx", "xml", "html", "pdf"];
			var isRecognized = _.contains(recognizedTypes, fileType);
			if (isRecognized) {

				if (fileType === "docx") {
					return "doc";
				}
				return fileType;
			}
			return "xml";
		}

		private getShortFileName(fileName) {
			if (fileName.length <= 13) {
				return fileName;
			}

			var act = 0;
			var outName = "";
			fileName.split("").forEach((char) => {
				if (outName.length > 30) {
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

		private registerFileUpload() {
			var config = new Common.FileUploadConfig();
			config.inputId = this.config.inputId;
			config.endpoint = "TripFile";

			this.fileUpload = new Common.FileUpload(config);
			this.fileDaD.onFiles = (files) => {
				this.fileUpload.filesEvent(files);
			};

			this.fileUpload.onProgressChanged = (percent) => {
				$(".pb_all").show();
				$(".pb_percent").text(percent + "%");
				$(".pb_inner").css("width", percent + "%");
			}

			this.fileUpload.onUploadFinished = (file, res) => {
				$(".pb_all").hide();
				this.filterFiles(res.files, res.filesPublic);
			}
		}

	}
}