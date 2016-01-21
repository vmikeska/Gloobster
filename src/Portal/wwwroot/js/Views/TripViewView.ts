module Views {
	export class TripViewView extends ViewBase {
		trip: any;
		comments: Trip.Comments;
		files: Trip.Files;
		inviteDialogView: InviteDialogView;
		shareDialogView: ShareDialogView;
		planner: Trip.Planner;
	  acceptCombo: Trip.AcceptCombo;

		initialize(id: string) {
			var self = this;
		 
			this.inviteDialogView = new InviteDialogView();
			this.shareDialogView = new ShareDialogView();

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

		private initAcceptCombo() {
			var isOwner = this.trip.ownerId === Reg.LoginManager.currentUserId;
			if (!isOwner) {
				var thisParticipant = _.find(this.trip.participants, (p) => { return p.userId === Reg.LoginManager.currentUserId });
				var acConfig = {
					comboId: "invitationState",
					initialState: thisParticipant.state,
					tripId: this.trip.tripId
				};

				this.acceptCombo = new Trip.AcceptCombo(acConfig);
				$("#invitationState").show();
			}
		}

		private onTripLoaded(request) {
			this.trip = request;

			this.initAcceptCombo();

			this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);

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