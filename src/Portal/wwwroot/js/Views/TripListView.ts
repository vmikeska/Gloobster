module Views {
	export class TripListView extends ViewBase {

		private pictureUpload: Common.FileUpload;
	
		constructor() {
				super();

			var isBig = window.location.href.indexOf("grid") !== -1;
			this.registerUploads(isBig);
	
			$(".menuClose").click((e) => {
				e.preventDefault();
				$(".trip-menu").hide();
			});
				
			this.registerTripDeletion();
		 
			$("#newTrip").keypress((e) => {
			 if (e.which === 13) {
				 e.preventDefault();
				 this.createNewTrip();
			 }
			});

			this.regSettings();
		}

			private regSettings() {
					$(".setting").click((e) => {
							e.preventDefault();
							var $t = $(e.target);
							$t.closest(".trip-holder").find(".trip-menu").slideToggle();
					});
			}
	 
		private registerTripDeletion() {
			
			$(".deleteTrip").click((e) => {			 
			 e.preventDefault();
			 var $target = $(e.target);
			 var tid = $target.closest(".trip-menu").data("tid");

			 var dialog = new Common.ConfirmDialog();
			 dialog.create(this.t("TripDelTitle", "jsTrip"), this.t("TripDelMessage", "jsTrip"), this.t("Cancel", "jsLayout"), this.t("Ok", "jsLayout"), () => {
				this.apiDelete("Trip", [["id", tid]], (r) => {
				 $("#popup-delete").hide();
				 $(`#${tid}`).remove();
				}); 
			 });
			 
		 });		 
		}

		private registerUploads(isBig: boolean) {
			var $i = $(".photo-link input");
			var inputs = $i.toArray();
			inputs.forEach((input) => {
				var $input = $(input);
				this.registerPhotoUpload($input.data("tid"), $input.attr("id"), isBig);
			});
		}

		public createNewTrip() {
			var tripName = $("#newTrip").val();
			if (tripName === "") {
				return;
			}

			window.location.href = `/Trip/CreateNewTrip/${tripName}`;
		}
	 
		private registerPhotoUpload(tripId, inputId, isBig: boolean) {
			var c = new Common.FileUploadConfig();
			c.inputId = inputId;
			c.endpoint = "TripPhotoSmall";
			c.maxFileSize = 5500000;
			c.useMaxSizeValidation = false;

			var pu = new Common.FileUpload(c);
			pu.customId = tripId;

			var ud = null;

			pu.onProgressChanged = (percent) => {
					if (ud === null) {
							ud = new Common.UploadDialog();
							ud.create();
					}

					ud.update(percent);
			}

			pu.onUploadFinished = (file, files) => {				
					$(".trip-menu").hide();

					if (isBig) {
							$(`#tripImg_${tripId}`).attr("src", `/Trip/TripPictureSmall_s/${tripId}?d=${this.makeRandomString(10)}`);			 
					} else {
							$(`#tripImg_${tripId}`).attr("src", `/Trip/TripPictureSmall_xs/${tripId}?d=${this.makeRandomString(10)}`);			 		
					}
				

				ud.destroy();				
			}
		}	 
	}
}