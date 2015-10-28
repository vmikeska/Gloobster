class FileUpload {

	private files: any[];
	private currentFile: any;

	private bytesPerRequest = 102400;

	private lastEnd = 0;
	private currentStart = 0;
	private currentEnd = 0;
	private reachedEnd = false;
	private firstSent = false;
	private endpoint = "UploadAvatar";

	private onProgressChanged: Function;

  private owner: Views.ViewBase;
 
	constructor(inputId: string, owner: Views.ViewBase) {
		this.owner = owner;
		this.currentEnd = this.bytesPerRequest;

		$("#" + inputId).change(e => {

			this.files = e.target.files;
			this.currentFile = this.files[0];

			this.sendBlobToServer(true);
		});

	}


	private sendBlobToServer(isInitialCall) {

		if (this.reachedEnd) {
			console.log("transfere complete");
			console.log("file length: " + this.currentFile.size);
			return;
		}

		if (!isInitialCall) {
			this.currentStart = this.lastEnd;
			this.currentEnd = this.currentStart + this.bytesPerRequest;
		}

		//todo: secure currentStart
		if (this.currentEnd > this.currentFile.size) {
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
		if (!this.firstSent) {
			return "First";
	 } else if (this.firstSent && !this.reachedEnd) {
			return "Middle";
		} else if (this.reachedEnd) {
			return "Last";
		}
	}

	private onBlobLoad(evnt) {
		var dataBlob = evnt.target.result;

		var dataToSend = { data: dataBlob, filePartType: this.getFilePartType(), fileName: this.currentFile.name};

		this.owner.apiPost(this.endpoint, dataToSend, () => {
			this.onSuccessBlobUpload();
		});

		//dunno meaning of this. If it's actually not in the state, all transaction is corrupted anyway
		//if (evnt.target.readyState === FileReader.prototype.DONE) {
		//	var dataToSend = dataBlob;

		//	var callObj = {
		//		type: "POST",
		//		url: "ReceiveFileBlob",
		//		data: dataToSend,
		//		success(response) {
		//			self.onSuccessBlobUpload();

		//		},
		//		error(response) {
		//			//todo: add error handler
		//			alert("error");
		//		},
		//		dataType: "text",
		//		contentType: false
		//	}

		//	$.ajax(callObj);
	 //}

	}
}