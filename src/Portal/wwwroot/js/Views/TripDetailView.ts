
class TripDetailView extends Views.ViewBase
{
	trip: any; 
	files: Files;
	pictureUpload: FileUpload;
	shareDialogView: ShareDialogView;
  planner: Planner;

	initialize(id: string) {
		var filesConfig = new FilesConfig();
		filesConfig.containerId = "filesContainer";
		filesConfig.inputId = "fileInput";		
		filesConfig.templateId = "file-template";
		filesConfig.editable = true;
		filesConfig.addAdder = true;
		filesConfig.isMasterFile = true;

		this.files = new Files(this, filesConfig);		
		//this.planner.masterFiles = this.files;
		this.setFilesCustomConfig(id);
		this.getTrip(id);
	}

	private setFilesCustomConfig(tripId: string) {
		var customData = new TripFileCustom();
		customData.tripId = tripId;
		this.files.fileUpload.customConfig = customData;
	}

	private getTrip(id: string) {
	  var prms = [["id", id]];
	  super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
  }

	private onTripLoaded(request) {
		this.trip = request;

		this.files.setFiles(this.trip.files, this.trip.tripId);
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