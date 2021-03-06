﻿module Views {

		
	export class TripDetailView extends ViewBase {
		trip: any;
		files: Trip.TripFiles;
		pictureUpload: Common.FileUpload;

		tripMenu: TripMenu;
		
		planner: Trip.Planner;
		
		initialize(id: string) {

			this.createFilesConfig();
			this.setFilesCustomConfig(id);
			this.getTrip(id);

			var ndc = new Common.DelayedCallback("nameInput");
			ndc.callback = (name) => {
				var data = { propertyName: "Name", values: { id: this.trip.tripId, name: name } };
				this.apiPut("tripProperty", data, () => {});
			}

			var ddc = new Common.DelayedCallback("description");
			ddc.callback = (description) => {
				var data = { propertyName: "Description", values: { id: this.trip.tripId, description: description } };
				this.apiPut("tripProperty", data, () => {});
			}

			var ntdc = new Common.DelayedCallback("notes");
			ntdc.callback = (notes) => {
				var data = { propertyName: "Notes", values: { id: this.trip.tripId, notes: notes } };
				this.apiPut("tripProperty", data, () => {});
			}

			$("#public").change((e) => {
				var isPublic = $(e.target).prop("checked");
				var data = { propertyName: "NotesPublic", values: { id: this.trip.tripId, isPublic: isPublic } };
				this.apiPut("tripProperty", data, () => {});
			});

			this.tripMenu = new TripMenu();
				
		}

	 private createFilesConfig() {
		var filesConfig = new Trip.FilesConfig();
		filesConfig.containerId = "filesContainer";		
		filesConfig.inputId = "fileInput";		
		filesConfig.templateId = "fileItem-template";			 
		filesConfig.isMasterFile = true;
		
		//finish DnD functionality ?
		filesConfig.editable = true;
		//filesConfig.mainContainerId = "filesContainer";
		//filesConfig.addAdder = true;
		//filesConfig.adderTemplate = "fileCreateGeneral-template";

		this.files = new Trip.TripFiles(filesConfig);
	 }

		private setFilesCustomConfig(tripId: string) {
			if (this.files.fileUpload) {
				var customData = new Common.TripFileCustom();
				customData.tripId = tripId;
				this.files.fileUpload.customConfig = customData;
			}
		}

		private getTrip(id: string) {
			var prms = [["id", id]];
			super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
		}

		private onTripLoaded(request) {
			this.trip = request;

			this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);			
			this.planner = new Trip.Planner(this.trip, true);
		}
	 
	}
}