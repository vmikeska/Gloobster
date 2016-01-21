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
			this.displayFiles();
		}

		private displayFiles() {
			this.generateFiles();

			if (this.config.editable) {
				$(".delete").click((evnt) => {
					Files.lastIdToDelete = $(evnt.target).data("id");
				});

				$(".filePublic").change((e) => {
					var $target = $(e.target);
					var fileId = $target.data("id");
					var state = $target.prop("checked");
					var prms = { fileId: fileId, tripId: this.tripId, state: state };
					Views.ViewBase.currentView.apiPut("tripFilePublic", prms, (res) => {
						
					});
				});
			}
		}

		private callDelete(fileId: string) {
			var prms = [["fileId", fileId], ["tripId", this.tripId]];
			Views.ViewBase.currentView.apiDelete("tripFile", prms, (files) => {
				this.filterFiles(files);
			});
		}

		private filterFiles(files) {
			if (!files) {
				return;
			}

			if (this.config.entityId) {
				var entityFiles = _.filter(files, (file) => { return file.entityId === this.config.entityId; });
				this.files = entityFiles;
				this.displayFiles();
			} else {
				this.files = files;
				this.displayFiles();
			}

			if (Files.masterFiles && (!this.config.isMasterFile)) {
				Files.masterFiles.files = files;
				Files.masterFiles.displayFiles();
			}

		}

		private generateFiles() {
			this.$container.children().not(this.$adder).not(this.$noFiles).remove();
			if (this.files && this.files.length > 0) {
				this.$noFiles.hide();
				this.files.forEach((file) => {
					var filePublic = _.find(this.filesPublic, (f) => {
					 return f.fileId === file.id;
					});
					var html = this.generateFile(file);
					var $html = $(html);
					$html.find("#filePublic" + file.id).prop("checked", filePublic.isPublic);
					this.$container.prepend($html);
				});
			} else {
				this.$noFiles.show();
			}
		}

		//doc xml html pdf
		private generateFile(file) {
			var context = {
				fileName: this.getShortFileName(file.originalFileName),
				//fileId: file.savedFileName,
			  id: file.id,
				fileType: this.getFileType(file.originalFileName),
				tripId: this.tripId,
				editable: this.config.editable
			};

			var html = this.template(context);
			return html;
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

			this.fileUpload.onUploadFinished = (file, files) => {
				$(".pb_all").hide();
				this.filterFiles(files);
			}
		}

	}
}