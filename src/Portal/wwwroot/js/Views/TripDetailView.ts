
class TripDetailView extends Views.ViewBase
{
	trip: any; 
	files: Files;
	pictureUpload: FileUpload;
	shareDialogView: ShareDialogView;
  planner: Planner;

	initialize(id: string) {
		//var self = this;
	 
		this.files = new Files(this, true);

	 this.getTrip(id);
	}


  private getTrip(id: string) {
	  var prms = [["id", id]];
	  super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
  }

	private onTripLoaded(request) {
		this.trip = request;

		this.files.setTrip(this.trip);
		this.registerPhotoUpload();
		this.planner = new Planner(this, this.trip);
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