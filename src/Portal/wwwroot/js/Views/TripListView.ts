module Views {
	export class TripListView extends ViewBase {

		private pictureUpload: Common.FileUpload;

		private tripIdToDelete: string;

		constructor() {
			super();
			this.registerUploads();

			$(".menuClose").click((e) => {
				e.preventDefault();
				$(".trip-menu").hide();
			});

			this.registerTripDeletion();

			this.registerOpenMenu();
		}

	 //todo: delete this workaround later
		private registerOpenMenu() {
		 $(".icon-wheel").click((e) => {
			 e.preventDefault();
			 var $i = $(e.target);
			 var tid = $i.data("tid");
			 var $menu = $(`#tripMenu_${tid}`);
			 $menu.show();
		 });
	 }

		private registerTripDeletion() {
			$("#deleteTripConfirm").click((e) => {
				e.preventDefault();
				this.apiDelete("Trip", [["id", this.tripIdToDelete]], (r) => {
				 $("#popup-delete").hide();
					$(`#${this.tripIdToDelete}`).remove();
				});
		 });

			$(".deleteTrip").click((e) => {
			 e.preventDefault();
			 var $a = $(e.target);
			 var tid = $a.data("tid");
			 this.tripIdToDelete = tid;
			 $("#popup-delete").show();
			});
		}

		private registerUploads() {
		 var $i = $(".inputs");
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

	 public deleteTrip() {
		 
	 }

		private registerPhotoUpload(tripId, inputId) {
			var config = new Common.FileUploadConfig();
			config.inputId = inputId;
			config.endpoint = "TripPhotoSmall";

			var picUpload = new Common.FileUpload(config);
			picUpload.customId = tripId;

			picUpload.onProgressChanged = (percent) => {
			}

			picUpload.onUploadFinished = (file, files) => {
				var d = new Date();
				$(".trip-menu").hide();
				$(`#tripImg_${tripId}`).attr("src", `/Trip/TripPictureSmall_s/${tripId}?d=${d.getDate()}`);

				//this.refreshBackground(this.trip.tripId);
			}
		}

	}
}