﻿module Common {
	export class FileUploadConfig {
		public bytesPerRequest = 204800;
		public customInputRegistration = false;
		public inputId: string;
		public endpoint: string;
		public maxFileSize = 21000000;
		public useMaxSizeValidation = true;
	}
		
	export class TripFileCustom {
		public tripId: string;
		public entityType: TripEntityType;
		public entityId: string;
	}

	export class FileUpload {

		private files: any[];
		private currentFile: any;

		private lastEnd = 0;
		private currentStart = 0;
		private currentEnd = 0;
		private reachedEnd = false;
		private firstSent = false;

		public customConfig = {};
		public customId: string;
		private finalResponse: any;

		public onProgressChanged: Function;
		public onUploadFinished: Function;

		private config: FileUploadConfig;
	  private v : Views.ViewBase;

	  public $filesInput;

		constructor(config: FileUploadConfig, customConfig = null) {
			if (customConfig) {
				this.customConfig = customConfig;
			}

			if (!config.customInputRegistration) {
				this.registerFileInput(config.inputId);
			}

			this.config = config;

			this.v = Views.ViewBase.currentView;
		}

		public registerFileInput(inputId) {
		 this.$filesInput = $(`#${inputId}`);
		 this.$filesInput.change(e => {
			this.filesEvent(e.target.files);
		 });
	  }

	  public filesEvent(files) {
		 this.files = files;
		 this.currentFile = this.files[0];

		  this.fileValidations(() => {
			 this.sendBlobToServer(true);
		  });		 
		}

		private fileValidations(callback) {
		 var id = new InfoDialog();
		 
		 if (this.currentFile.size > this.config.maxFileSize) {
			var maxSize = (this.config.maxFileSize / (1024 * 1024)).toFixed(0);			 
			id.create(this.v.t("FileTooBigTitle", "jsLayout"), this.v.t("FileTooBigBody", "jsLayout").replace("${maxSize}", maxSize));
			return;
		 }

		 if (!this.config.useMaxSizeValidation) {
			 callback();
			 return;
		 }

		 this.v.apiGet("FilesUsage", [], (allowed) => {
			 if (allowed) {
				 callback();
			 } else {				
				id.create(this.v.t("OverLimitTitle", "jsLayout"), this.v.t("OverLimitBody", "jsLayout"));
			 }
		 });
	  }

		private resetValues() {
			this.lastEnd = 0;
			this.currentStart = 0;
			this.currentEnd = 0;
			this.reachedEnd = false;
			this.firstSent = false;
			this.$filesInput.val("");
		}

		private sendBlobToServer(isInitialCall) {		 
			if (this.reachedEnd) {
				
				if (this.onUploadFinished) {
					this.onUploadFinished(this.currentFile, this.finalResponse);
				}

				this.resetValues();

				return;
			}

			if (!isInitialCall) {
				this.currentStart = this.lastEnd;
				this.currentEnd = this.currentStart + this.config.bytesPerRequest;
			} else {
				this.currentEnd = this.config.bytesPerRequest;
			}
			
			if (this.currentEnd >= this.currentFile.size) {
				this.currentEnd = this.currentFile.size;
				this.reachedEnd = true;
			}

			var reader = this.createReader();
			
			var blob = this.currentFile.slice(this.currentStart, this.currentEnd);
			reader.readAsDataURL(blob);

			this.lastEnd = this.currentEnd;
		}

		private createReader() {
			var reader = new FileReader();
			reader.onloadend = evnt => {
				this.onBlobLoad(evnt);
			}
			return reader;
		}

		private recalculateUpdateProgress() {
			var percents = (this.currentEnd / this.currentFile.size) * 100;
			var percentsRounded = Math.round(percents);

			if (this.onProgressChanged && !(percentsRounded === 0)) {
				this.onProgressChanged(percentsRounded);
			}
		}

		private onSuccessBlobUpload() {
			this.firstSent = true;
			this.sendBlobToServer(false);
			this.recalculateUpdateProgress();
		}

		private getFilePartType() {
			if (this.reachedEnd) {
				return "Last";
			} else if (!this.firstSent) {
				return "First";
			} else if (this.firstSent) {
				return "Middle";
			}
		}

		private onBlobLoad(evnt) {
			var dataBlob = evnt.target.result;

			var dataToSend = $.extend(this.customConfig, {
				data: dataBlob,
				filePartType: this.getFilePartType(),
				fileName: this.currentFile.name,
				customId: this.customId,
				type: this.currentFile.type
			});

			this.v.apiPost(this.config.endpoint, dataToSend, (finalResponse) => {
				this.finalResponse = finalResponse;
				this.onSuccessBlobUpload();
			});
		}
	}
}