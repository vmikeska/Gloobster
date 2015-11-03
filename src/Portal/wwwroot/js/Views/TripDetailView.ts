
class TripDetailView extends Views.ViewBase
{
	trip: any; 
	comments: Comments;
	files: Files;
	pictureUpload: FileUpload;

	initialize(id: string) {
		var self = this;

		this.files = new Files(this);

	 this.getTrip(id);

		$("#commentSubmit").click(() => {
			self.comments.postComment(self.trip.tripId);
	 });		
	}


  private getTrip(id: string) {
	  var prms = [["id", id]];
	  super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
  }

	private onTripLoaded(request) {
	 this.trip = request;

		this.files.setTrip(this.trip);

	 this.comments = new Comments(this);
	 this.comments.comments = this.trip.comments;
		this.comments.users = this.trip.users;		

		this.comments.displayComments();
		this.registerPhotoUpload();
	}

  
	private registerPhotoUpload() {
	 var config = new FileUploadConfig();
	 config.inputId = "photoInput";
	 config.owner = this;
	 config.endpoint = "TripPhoto";

	 this.pictureUpload = new FileUpload(config);
	 this.pictureUpload.customId = this.trip.tripId;

	 this.pictureUpload.onProgressChanged = (percent) => {
		//$("#progressBar").text(percent);
	 }
	 this.pictureUpload.onUploadFinished = (file, files) => {
		//this.files = files;
		//this.displayFiles();
	 }
	}
	



}