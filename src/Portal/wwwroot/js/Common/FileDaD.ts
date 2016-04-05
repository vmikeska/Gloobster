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

}