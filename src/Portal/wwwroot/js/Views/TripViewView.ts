module Views {
	export class TripViewView extends ViewBase {
		trip: any;
		comments: Trip.Comments;
		files: Trip.TripFiles;
		
		planner: Trip.Planner;
		acceptCombo: Trip.AcceptCombo;
		tripMenu: TripMenu;
		pictureUpload: Common.FileUpload;

		initialize(id: string) {
			var self = this;

			this.createFilesConfig();
			this.getTrip(id);

			$("#commentSubmit").click((e) => {
				e.preventDefault();
				self.comments.postComment(self.trip.tripId);
			});

			this.tripMenu = new TripMenu();
		}

		private createFilesConfig() {
		 var c = new Trip.FilesConfig();
		 c.containerId = "filesContainer";
		 c.inputId = "fileInput";
		 c.editable = false;
		 c.addAdder = true;
		 c.templateId = "fileView-template";
		 
		 this.files = new Trip.TripFiles(c);
		}

		private registerPhotoUpload() {
			var c = new Common.FileUploadConfig();
			c.inputId = "photoInput";
			c.endpoint = "TripPhoto";
			c.maxFileSize = 7500000;
			c.useMaxSizeValidation = false;

			this.pictureUpload = new Common.FileUpload(c);
			this.pictureUpload.customId = this.trip.tripId;

			this.pictureUpload.onProgressChanged = (percent) => {
			 var $pb = $("#progressBarTit");
			 $pb.show();
			 var pt = `${percent}%`;
			 $(".progress").css("width", pt);
			 $pb.find("span").text(pt);				 
			}
			this.pictureUpload.onUploadFinished = (file, files) => {
			 this.refreshBackground(this.trip.tripId);

			 var $pb = $("#progressBarTit");
			 $pb.hide();
			}
		}

		private refreshBackground(tripId) {
			$("#bckPhoto").css("background", "");
			$("#bckPhoto").css("background", `transparent url('../../Trip/TripPicture/${tripId}') center top no-repeat`);
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
		 var isOwner = this.trip.ownerId === ViewBase.currentUserId;
			if (!isOwner) {
			 var thisParticipant = _.find(this.trip.participants, (p) => {
				  return p.userId === ViewBase.currentUserId;
			 });
			 var wasInvited = thisParticipant != null;
				if (wasInvited) {
					var acConfig = {
						comboId: "invitationState",
						initialState: thisParticipant.state,
						tripId: this.trip.tripId
					};

					this.acceptCombo = new Trip.AcceptCombo(acConfig);
					$("#invitationState").show();
				}
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

			this.registerPhotoUpload();
		}
	 
	}
}