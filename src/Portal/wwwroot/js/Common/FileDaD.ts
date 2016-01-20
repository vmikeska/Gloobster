//https://css-tricks.com/examples/DragAndDropFileUploading/
module Common {
	export class FileDaD {

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
				.on('blur', () => { $input.removeClass("has-focus"); });

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