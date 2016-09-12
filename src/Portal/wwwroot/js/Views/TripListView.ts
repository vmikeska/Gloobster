﻿module Views {
	export class TripListView extends ViewBase {

		private pictureUpload: Common.FileUpload;
	
		constructor() {
			super();
			this.registerUploads();

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
	
		private registerUploads() {
				var $i = $(".photo-link input");
		 var inputs = $i.toArray();
		  inputs.forEach((input) => {
			 var $input = $(input);			 
			 this.registerPhotoUpload($input.data("tid"), $input.attr("id"));
		  });
	  }

		public createNewTrip() {
			var tripName = $("#newTrip").val();
			if (tripName === "") {
				return;
			}

			window.location.href = `/Trip/CreateNewTrip/${tripName}`;
		}
	 
		private registerPhotoUpload(tripId, inputId) {
			var c = new Common.FileUploadConfig();
			c.inputId = inputId;
			c.endpoint = "TripPhotoSmall";
			c.maxFileSize = 5500000;
			c.useMaxSizeValidation = false;

			var pu = new Common.FileUpload(c);
			pu.customId = tripId;

			pu.onProgressChanged = (percent) => {
			 var $pb = $("#progressBar");
			 $pb.show();
			 var pt = `${percent}%`;
			 $(".progress").css("width", pt);
			 $pb.find("span").text(pt);			 
			}

			pu.onUploadFinished = (file, files) => {				
				$(".trip-menu").hide();
				$(`#tripImg_${tripId}`).attr("src", `/Trip/TripPictureSmall_s/${tripId}?d=${this.makeRandomString(10)}`);			 
				var $pb = $("#progressBar");
				$pb.hide();
			}
		}	 
	}
}