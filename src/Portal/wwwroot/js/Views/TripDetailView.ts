
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

		this.files = new Files(filesConfig);				
		this.setFilesCustomConfig(id);
		this.getTrip(id);

		var ndc = new DelayedCallback("nameInput");
		ndc.callback = (name) => {
		 var data = { propertyName: "Name", values: { id: this.trip.tripId, name: name } };
		 this.apiPut("tripProperty", data, () => {});
		}

		var ddc = new DelayedCallback("description");
		ddc.callback = (description) => {
		 var data = { propertyName: "Description", values: { id: this.trip.tripId, description: description } };
		 this.apiPut("tripProperty", data, () => {});
		}

		var ntdc = new DelayedCallback("notes");
		ntdc.callback = (notes) => {
		 var data = { propertyName: "Notes", values: { id: this.trip.tripId, notes: notes } };
		 this.apiPut("tripProperty", data, () => {});
		}

		$("#public").change((e) => {
		 var isPublic = $(e.target).prop("checked");
		 var data = { propertyName: "NotesPublic", values: { id: this.trip.tripId, isPublic: isPublic } };
		 this.apiPut("tripProperty", data, () => {});
		});
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
		this.planner = new Planner(this.trip);	 
	}


	private registerPhotoUpload() {
	 var config = new FileUploadConfig();
	 config.inputId = "photoInput";	 
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