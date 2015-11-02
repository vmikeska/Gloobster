
class RequestSender {

	constructor(endPoint: string, data: any = null, addLocalAuthentication: boolean = false) {
		this.endPoint = endPoint;
		this.data = data;
		this.dataToSend = data;
		this.addLocalAuthentication = addLocalAuthentication;
	}

	endPoint: string;
	data: any;
	dataToSend: any;
	params: string[][];
	addLocalAuthentication: boolean;

	onSuccess: Function;
	onError: Function;


	private addAuthentication(reqObj) {
	 var cookieStr = $.cookie(Constants.cookieName);	 
	 if (cookieStr) {

		var cookieObj = JSON.parse(cookieStr);
		
		var headers = {};		
		headers["Authorization"] = cookieObj.encodedToken;
		 reqObj.headers = headers;

	 } else {
		 //todo: handle error message
			alert("no token found in cookies");
		}
	}

	public serializeData() {
		this.dataToSend = JSON.stringify(this.data);
	}

	public sentPost() {
		var self = this;

		var callObj = {
		 type: 'POST',
		 url: this.endPoint,
		 data: this.dataToSend,
		 success(response) {
			if (self.onSuccess) {
			 self.onSuccess(response);
			}
		 },
		 error(response) {
			if (self.onError) {
			 self.onError(response);
			}
		 },
		 dataType: 'json',
		 contentType: 'application/json; charset=utf-8'

		}

	 if (this.addLocalAuthentication) {
		 this.addAuthentication(callObj);
	 }

		$.ajax(callObj);
	}

	public sendGet() {

		var urlQuery = "";
		if (this.params) {
			urlQuery = "?";

			this.params.forEach(param => {
				urlQuery += param[0] + "=" + param[1] + "&";
			});

			urlQuery = urlQuery.substring(0, urlQuery.length - 1);
		}

		var self = this;

		var callObj = {
			type: 'GET',
			url: this.endPoint + urlQuery,
			success(response) {
				if (self.onSuccess) {
					self.onSuccess(response);
				}
			},
			error(response) {
				if (self.onError) {
					self.onError(response);
				}
			}
		};

		if (this.addLocalAuthentication) {
		 this.addAuthentication(callObj);
		}

		$.ajax(callObj);
	}

	public sendDelete() {

	 var urlQuery = "";
	 if (this.params) {
		urlQuery = "?";

		this.params.forEach(param => {
		 urlQuery += param[0] + "=" + param[1] + "&";
		});

		urlQuery = urlQuery.substring(0, urlQuery.length - 1);
	 }

	 var self = this;

	 var callObj = {
		type: 'DELETE',
		url: this.endPoint + urlQuery,
		success(response) {
		 if (self.onSuccess) {
			self.onSuccess(response);
		 }
		},
		error(response) {
		 if (self.onError) {
			self.onError(response);
		 }
		}
	 };

	 if (this.addLocalAuthentication) {
		this.addAuthentication(callObj);
	 }

	 $.ajax(callObj);

	}

}