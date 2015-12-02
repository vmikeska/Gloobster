module Views {
	export class TripViewView extends ViewBase {
		trip: any;
		comments: Trip.Comments;
		files: Trip.Files;
		shareDialogView: ShareDialogView;
		planner: Trip.Planner;

		initialize(id: string) {
			var self = this;

			var filesConfig = new Trip.FilesConfig();
			filesConfig.containerId = "filesContainer";
			filesConfig.inputId = "fileInput";
			filesConfig.editable = false;
			filesConfig.addAdder = true;
			filesConfig.templateId = "file-template";

			this.files = new Trip.Files(filesConfig);

			this.getTrip(id);

			$("#commentSubmit").click(() => {
				self.comments.postComment(self.trip.tripId);
			});
		}

		private getTrip(id: string) {
			var prms = [["id", id]];
			super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
		}

		private setFilesCustomConfig(tripId: string) {
			var customData = new Common.TripFileCustom();
			customData.tripId = tripId;
			this.files.fileUpload.customConfig = customData;
		}

		private onTripLoaded(request) {
			this.trip = request;

			this.files.setFiles(this.trip.files, this.trip.tripId);

			this.comments = new Trip.Comments();
			this.comments.comments = this.trip.comments;
			this.comments.users = this.trip.users;
			this.comments.displayComments();

			this.planner = new Trip.Planner(this.trip, false);
		}


		private generateButtons() {

		}
	}
}