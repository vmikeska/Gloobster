
class FileUploadConfig {
	public bytesPerRequest = 102400;
	public inputId: string;
  public owner: Views.ViewBase;
	public endpoint: string;
	public getAsBase64AfterUpload = false;
}

class FileUpload {

	private files: any[];
	private currentFile: any;
 
	private lastEnd = 0;
	private currentStart = 0;
	private currentEnd = 0;
	private reachedEnd = false;
	private firstSent = false;
	

	public onProgressChanged: Function;
	public onUploadFinished: Function;

  private owner: Views.ViewBase;
	private config: FileUploadConfig;
	private $input: any;
 
	constructor(config: FileUploadConfig) {
		this.config = config;
		this.owner = config.owner;		

		this.$input = $("#" + this.config.inputId);

		this.$input.change(e => {

			this.files = e.target.files;
			this.currentFile = this.files[0];

			this.sendBlobToServer(true);
		});
	}

	private resetValues() {
		this.lastEnd = 0;
		this.currentStart = 0;
		this.currentEnd = 0;
		this.reachedEnd = false;
		this.firstSent = false;
		this.$input.val("");
	}

	private sendBlobToServer(isInitialCall) {

		if (this.reachedEnd) {
			console.log("transfere complete");
			console.log("file length: " + this.currentFile.size);

			if (this.onUploadFinished) {
			 this.onUploadFinished(this.currentFile);
			}

			this.resetValues();
			
			return;
		}

		if (!isInitialCall) {
			this.currentStart = this.lastEnd;
			this.currentEnd = this.currentStart + this.config.bytesPerRequest;
		} else {
		 this.currentEnd = this.config.bytesPerRequest;
		}

		//todo: secure currentStart
		if (this.currentEnd >= this.currentFile.size) {
			this.currentEnd = this.currentFile.size;
			this.reachedEnd = true;
		}

		var reader = this.createReader();
		console.log("reading: " + this.currentStart + ".." + this.currentEnd);
		var blob = this.currentFile.slice(this.currentStart, this.currentEnd);
		reader.readAsDataURL(blob);

		this.lastEnd = this.currentEnd;
	}

	private createReader() {
		var reader = new FileReader();
		reader.onloadend = evnt => {
			this.onBlobLoad(evnt);
		}
		return reader;
	}
 

	private recalculateUpdateProgress() {
		var percents = (this.currentEnd / this.currentFile.size) * 100;
		var percentsRounded = Math.round(percents);

		if (this.onProgressChanged) {
			this.onProgressChanged(percentsRounded);
		}
	}

	private onSuccessBlobUpload() {
		this.firstSent = true;
	 this.sendBlobToServer(false);
		this.recalculateUpdateProgress();
	}

	private getFilePartType() {
		if (this.reachedEnd) {
			return "Last";
		} else if (!this.firstSent) {
			return "First";
		} else if (this.firstSent) {
			return "Middle";
		}
	}

	private onBlobLoad(evnt) {
		var dataBlob = evnt.target.result;

		var dataToSend = { data: dataBlob, filePartType: this.getFilePartType(), fileName: this.currentFile.name};

		this.owner.apiPost(this.config.endpoint, dataToSend, () => {
			this.onSuccessBlobUpload();
		});
	}
}