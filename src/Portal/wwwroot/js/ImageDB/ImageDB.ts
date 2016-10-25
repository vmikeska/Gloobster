
module ImageDb {

	export class ImageSender {
			private bytesPerRequest = 204800;
			private currentEnd;
			private totalLength;
			private canContinue = true;
			private filePart = 0;
			private masterBlob = null;

			private v: Views.ImageDbView;
			private endpoint: string;
			private finalDataCallback;
			private finishedCallback;
			private $cropper;
			
			constructor(v: Views.ImageDbView, endpoint: string, $cropper, finalDataCallback, finishedCallback) {
					this.v = v;
					this.endpoint = endpoint;
					this.$cropper = $cropper;
					this.finalDataCallback = finalDataCallback;
						this.finishedCallback = finishedCallback;
			}
			
			public send() {
					
					this.getImgData(this.$cropper, (masterBlob) => {

							this.masterBlob = masterBlob;
							this.currentEnd = 0;
							this.totalLength = this.masterBlob.size;
							this.filePart = 0;

							this.sendOnePart();							
					});
			}

			private getImgData($cropper, callback) {
					var canvas = $cropper.cropper("getCroppedCanvas");

					canvas.toBlob((blob) => {
							callback(blob);
					});
			}

			private sendOnePart() {

					var newEnd = this.currentEnd + this.bytesPerRequest;

					if (newEnd > this.totalLength) {
							newEnd = this.totalLength;
							this.filePart = 2;
					}

					var partBob = this.masterBlob.slice(this.currentEnd, newEnd);

					var reader = new FileReader();
					reader.onloadend = (e) => {
							this.onReadAsDataUrl(e);
					}
					reader.readAsDataURL(partBob);

					this.currentEnd = newEnd;
			}

			private onReadAsDataUrl(e) {
					var data = {
							data: e.target["result"],
							filePartType: this.filePart
					};

					var isLast = (this.filePart === 2);

				if (isLast) {
					var extData = this.finalDataCallback();
					data = $.extend(data, extData);
				}

				this.v.apiPost(this.endpoint, data, (finished) => {

							var s = Math.round((this.currentEnd / this.totalLength) * 100);
								$("#percentsUploaded").html(s);

							if (this.filePart === 0) {
									this.filePart = 1;
							}

							if (!isLast) {
								this.sendOnePart();
							}

							if (finished) {
									this.finishedCallback();
							}
						
					});
			}

			
	}
		
}
