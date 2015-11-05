
class Files {

	public owner: Views.ViewBase;
	public trip: any;
	private template: any;
	private createTemplate: any;
	public fileUpload: FileUpload;
	public files: any[];
	public lastIdToDelete: string;
	private editable: boolean;

	constructor(owner: Views.ViewBase, editable: boolean) {
		this.owner = owner;
		this.editable = editable;

		var source = $("#file-template").html();
		this.template = Handlebars.compile(source);

		if (this.editable) {
			var sourceCrt = $("#fileCreate-template").html();
			this.createTemplate = Handlebars.compile(sourceCrt);
		}

		$("#deleteFileConfirm").click(() => {
			this.callDelete(this.lastIdToDelete);
			$("#popup-delete").hide();
		});
	}

	public setTrip(trip) {
		this.trip = trip;
		this.files = trip.files;

		this.onTripSet();
	}

	private onTripSet() {
		this.displayFiles();
	}

	private displayFiles() {
		var filesHtml = this.generateFiles();

		if (this.editable) {
			var createFileHtml = this.createTemplate();
			filesHtml += createFileHtml;
		}
		$("#filesContainer").html(filesHtml);

		if (this.editable) {
			$(".delete").click((evnt) => {
				this.lastIdToDelete = $(evnt.target).data("id");
		 });

			this.registerFileUpload();	 
		} else {
			$(".delete").hide();
		}	
 }

 private callDelete(fileId: string) {
	 var prms = [["fileId", fileId], ["tripId", this.trip.tripId]];
	 this.owner.apiDelete("tripFile", prms, (files) => {

		if (files != null) {
			this.files = files;
			this.displayFiles();
		}

	 });
 }

 private generateFiles() {
	 var html = "";
	 if (this.files) {
		 this.files.forEach((file) => {
			 html += this.generateFile(file);
		 });
	 }
	 return html;
 }

 //doc xml html pdf
 private generateFile(file) {
	 var context = {
		 fileName: this.getShortFileName(file.originalFileName),
		 fileId: file.savedFileName,
		 fileType: this.getFileType(file.originalFileName),
		 tripId: this.trip.tripId
	 }; 

	var html = this.template(context);
	return html;
 }

 private getFileType(fileName) {
	 var prms = fileName.split(".");
	 var fileType = prms[1];
	 var recognizedTypes = ["doc", "docx", "xml", "html", "pdf"];
	 var isRecognized = _.contains(recognizedTypes, fileType);
	 if (isRecognized) {

		if (fileType === "docx") {
			return "doc";
		}
		return fileType;
	 }
	 return "xml";
 }

 private getShortFileName(fileName) {

	if (fileName.length <= 24) {
		return fileName;
	}

	var prms = fileName.split(".");
	 return prms[0].substring(0, 20) + "... ." + prms[1];
 }

 private registerFileUpload() {
		var config = new FileUploadConfig();
		config.inputId = "fileInput";
		config.owner = this.owner;
		config.endpoint = "TripFile";		
	
		this.fileUpload = new FileUpload(config);
		this.fileUpload.customId = this.trip.tripId;

		this.fileUpload.onProgressChanged = (percent) => {
			$("#progressBar").text(percent);
		}
		this.fileUpload.onUploadFinished = (file, files) => {
			this.files = files;
			this.displayFiles();
		}
	}

}