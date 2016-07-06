module Views {
		export class CropImg {

				private $frame;

				private frameId;
				private frameWidth;
				private frameHeight;
				private src;
				
				constructor(frameId, frameWidth, frameHeight, src) {
					this.$frame = $(`#${frameId}`);

					this.frameId = frameId;
					this.frameWidth = frameWidth;
					this.frameHeight = frameHeight;
					this.src = src;

					this.setFrame();
				}
				//https://github.com/fengyuanchen/cropper
				private setFrame() {
						this.$frame.addClass("ci-frame");
						this.$frame.css("width", this.frameWidth);
						this.$frame.css("height", this.frameHeight);

						var $img = $(`<img src="${this.src}" style="max-width: 100%" />`);
						this.$frame.append($img);

						$img.cropper({
								aspectRatio: 600 / 400,
								
								crop: (e) => {
										// Output the result data for cropping image.
										console.log(e.x);
										console.log(e.y);
										console.log(e.width);
										console.log(e.height);
										console.log(e.rotate);
										console.log(e.scaleX);
										console.log(e.scaleY);
								}
						});

						//var myimage = document.getElementById(this.frameId);
						//if (myimage.addEventListener) {
						//		// IE9, Chrome, Safari, Opera
						//		myimage.addEventListener("mousewheel", this.mouseWheelHandler, false);
						//		// Firefox
						//		myimage.addEventListener("DOMMouseScroll", this.mouseWheelHandler, false);
						//}




				}

			private mouseWheelHandler(e) {
				e.preventDefault();
				
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

				console.log(delta);										
			}


		}
}
