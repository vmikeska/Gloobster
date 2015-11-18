class TripViewView extends Views.ViewBase {
	trip: any; 
	comments: Comments;
	files: Files;
	shareDialogView: ShareDialogView;
	planner: Planner;

	initialize(id: string) {
	 var self = this;

	 var filesConfig = new FilesConfig();
	 filesConfig.containerId = "filesContainer";
	 filesConfig.inputId = "fileInput";
	 filesConfig.editable = false;
	 filesConfig.addAdder = true;
	 filesConfig.templateId = "file-template";

	 this.files = new Files(this, filesConfig);

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
	 var customData = new TripFileCustom();
	 customData.tripId = tripId;
	 this.files.fileUpload.customConfig = customData;
	}

	private onTripLoaded(request) {
	 this.trip = request;

	 this.files.setFiles(this.trip.files, this.trip.tripId);

	 this.comments = new Comments(this);
	 this.comments.comments = this.trip.comments;
	 this.comments.users = this.trip.users;
	 this.comments.displayComments();

	 this.planner = new Planner(this, this.trip);	
	}


  private generateButtons() {
	  
  }
}