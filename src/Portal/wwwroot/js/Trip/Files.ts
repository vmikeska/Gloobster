

class FilesConfig {
	public editable: boolean;
  public templateId: string;
	public addAdder: boolean;
  public containerId: string;
  public inputId: string;
  public entityId: string;
  public isMasterFile: boolean;
}

class Files {
	public static masterFiles: Files;  
	public tripId: string;

	private template: any;
	private createTemplate: any;
	public fileUpload: FileUpload;
	public files: any[];
	public static lastIdToDelete: string;
	
  private config: FilesConfig;

  private $container: any;
  private $adder: any;
  
	constructor(config: FilesConfig) {

		if (config.isMasterFile) {
			Files.masterFiles = this;
	 }
	 
	 this.config = config;
		this.$container = $("#" + config.containerId);
	 
		var source = $("#" + config.templateId).html();
		this.template = Handlebars.compile(source);

		if (config.addAdder) {
			if (config.editable) {
			 this.addAdder();
			}
		}

		if (this.config.editable) {			
			this.registerFileUpload();
		}

		var $deleteConfirm = $("#deleteFileConfirm");

		$deleteConfirm.unbind();
		$deleteConfirm.click(() => {
			this.callDelete(Files.lastIdToDelete);
			$("#popup-delete").hide();
		});
	}

  private addAdder() {
	 // var sourceCrt = $("#fileCreate-template").html();
	 //this.createTemplate = Handlebars.compile(sourceCrt);
	 //var adderHtml = this.createTemplate();

	 var adderHtml = `<input id="${this.config.inputId}" type="file" />`;
	 this.$adder = $(adderHtml);
	 this.$container.html(this.$adder);
  }

	public setFiles(files, tripId) {
		this.files = files;
		this.tripId = tripId;

		this.onFilesSet();
	}

	private onFilesSet() {
		this.displayFiles();
	}

	private displayFiles() {
		this.generateFiles();
	 
		if (this.config.editable) {
			$(".delete").click((evnt) => {
				Files.lastIdToDelete = $(evnt.target).data("id");
			});
			
		} else {
			$(".delete").hide();
		}
	}

	private callDelete(fileId: string) {
		var prms = [["fileId", fileId], ["tripId", this.tripId]];
		Views.ViewBase.currentView.apiDelete("tripFile", prms, (files) => {
		  this.filterFiles(files);			
		});
	}

  private filterFiles(files) {
	  if (!files) {
		  return;
	  }

	  if (this.config.entityId) {
		  var entityFiles = _.filter(files, (file) => { return file.entityId === this.config.entityId; });
		  this.files = entityFiles;
		  this.displayFiles();
	  } else {
		 this.files = files;
			this.displayFiles();
	  }

				if (Files.masterFiles && (!this.config.isMasterFile)) {
				 Files.masterFiles.files = files;
				 Files.masterFiles.displayFiles();
				}
			
  }

	private generateFiles() {
	 this.$container.children().not(this.$adder).remove();
	 if (this.files) {
		 this.files.forEach((file) => {
			var html = this.generateFile(file);
			 this.$container.prepend(html);
		 });
	 }	 
 }

 //doc xml html pdf
 private generateFile(file) {
	 var context = {
		 fileName: this.getShortFileName(file.originalFileName),
		 fileId: file.savedFileName,
		 fileType: this.getFileType(file.originalFileName),
		 tripId: this.tripId,
		 editable: this.config.editable
	 }; 

	var html = this.template(context);
	return html;
 }

 private getFileType(fileName) {
	 var prms = fileName.split(".");
	 var fileType = prms[prms.length - 1];
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
	 return prms[0].substring(0, 20) + "... ." + prms[prms.length -1];
 }

 private registerFileUpload() {
		var config = new FileUploadConfig();
		config.inputId = this.config.inputId;
		config.endpoint = "TripFile";		
	
		this.fileUpload = new FileUpload(config);
	
		this.fileUpload.onProgressChanged = (percent) => {
			$("#progressBar").text(percent);
		}
		this.fileUpload.onUploadFinished = (file, files) => {
		  this.filterFiles(files);
		}
	}

}