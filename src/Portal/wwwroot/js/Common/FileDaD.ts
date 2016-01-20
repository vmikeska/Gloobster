//https://css-tricks.com/examples/DragAndDropFileUploading/
module Common {
	export class FileDaD {

		private isAdvancedUpload() {
			var div = document.createElement("div");
			return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
		}

		public init() {			
			$(".box").each((i, ele) => {
			 this.registerComponent(ele);
			});
		}

		private filesChose(files) {
			var file = files[0];
			this.showImage(file);
		}

		private showImage(file) {
		 var reader = new FileReader();
		 reader.onloadend = evnt => {
			var img = document.getElementById("myImg");
			img["src"] = evnt.target["result"];
		 }
		 var blob = file.slice(0, file.size);
		 reader.readAsDataURL(blob);
		}

		public registerComponent(rootElement) {			
			var $rootElement = $(rootElement);
			var $input = $rootElement.find('input[type="file"]');
			var $restart = $rootElement.find(".box__restart");
			
			$input.on("change", e => {
				var files = e.target.files;
				this.filesChose(files);			
			});
		 
			// drag&drop files if the feature is available
			if (this.isAdvancedUpload()) {
				$rootElement					
					.on("drag dragstart dragend dragover dragenter dragleave drop", e => {
						// preventing the unwanted behaviours
						e.preventDefault();
						e.stopPropagation();
					})
					.on("dragover dragenter", () => {
						$rootElement.addClass("is-dragover");
					})
					.on("dragleave dragend drop", () => {
						$rootElement.removeClass("is-dragover");
					})
					.on("drop", e => {
					 var files = e.originalEvent.dataTransfer.files;
					 var file = files[0];
					 this.showImage(file);		 
					});
			}
		 
			//restart the form if has a state of error/success
			$restart.on("click", e => {
				e.preventDefault();
				$rootElement.removeClass("is-error is-success");
				$input.trigger("click");
			});

			//Firefox focus bugfix for file input
			$input
				.on("focus", () => { $input.addClass("has-focus"); })
				.on('blur', () => { $input.removeClass("has-focus"); });
		}
	}
}