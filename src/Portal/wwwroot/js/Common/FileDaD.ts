//https://css-tricks.com/examples/DragAndDropFileUploading/
module Common {
	export class FileDaD {

		public $container;
		public $dadArea;
		public onFiles: Function;

		private timeoutId;
	 
		public registerComponent(containerId) {
		 this.$container = $(`#${containerId}`);
		 this.$dadArea = this.$container.find(".upload-droparea");

			var $input = this.$container.find('input[type="file"]');

			$input.on("change", e => {
				var files = e.target.files;
				this.filesChose(files);
			});

			//Firefox focus bugfix for file input
			//$input
			//	.on("focus", () => { $input.addClass("has-focus"); })
			//	.on("blur", () => { $input.removeClass("has-focus"); });

			// drag&drop files if the feature is available
			if (this.isAdvancedUpload()) {
				this.$container
					.on("drag dragstart dragend dragover dragenter dragleave drop", e => {
						// preventing the unwanted behaviours
						e.preventDefault();
						e.stopPropagation();
					})
					//
					.on("dragenter dragover", (e) => {
						this.destroyHideTimeout();
						this.$dadArea.show();
					})
					.on("dragleave dragend drop", (e) => {
						this.createHideTimeout(this.$dadArea);
					})
					.on("drop", e => {
						var files = e.originalEvent.dataTransfer.files;
						this.filesChose(files);
					});
			}
		}

		private destroyHideTimeout() {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
		}

		private createHideTimeout($element) {
			this.timeoutId = setTimeout(() => {
				this.timeoutId = null;
				$element.hide();
			}, 50);
		}

		private filesChose(files) {
			if (this.onFiles) {
				this.onFiles(files);
			}
		}

		private isAdvancedUpload() {
			var div = document.createElement("div");
			return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
		}
	}


	export class FileDaDOld {

		private template: any;
		public $instance;
		public onFiles: Function;
	 
		constructor(id: string) {
			this.template = Views.ViewBase.currentView.registerTemplate("fileCreate-template");
			var html = this.template({ id: id });
			this.$instance = $(html);
			this.registerComponent();
		}

		public registerComponent() {			
			var $input = this.$instance.find('input[type="file"]');

			$input.on("change", e => {
				var files = e.target.files;
				this.filesChose(files);
			});

			//Firefox focus bugfix for file input
			$input
				.on("focus", () => { $input.addClass("has-focus"); })
				.on("blur", () => { $input.removeClass("has-focus"); });

			// drag&drop files if the feature is available
			if (this.isAdvancedUpload()) {
				this.$instance
					.on("drag dragstart dragend dragover dragenter dragleave drop", e => {
						// preventing the unwanted behaviours
						e.preventDefault();
						e.stopPropagation();
					})
					.on("dragover dragenter", () => {					
					 this.$instance.addClass("is-dragover");
					})
					.on("dragleave dragend drop", () => {						
					 this.$instance.removeClass("is-dragover");
					})
					.on("drop", e => {
						var files = e.originalEvent.dataTransfer.files;
						this.filesChose(files);
					});
			}
		}

		private filesChose(files) {
			if (this.onFiles) {
				this.onFiles(files);
			}
		}

		private isAdvancedUpload() {
			var div = document.createElement("div");
			return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
		}
	}
}