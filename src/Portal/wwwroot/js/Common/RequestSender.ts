module Common {
	export class RequestSender {

	 private cookieManager: CookieManager;

		constructor(endPoint: string, data: any = null, addLocalAuthentication: boolean = false) {
			this.cookieManager = new CookieManager();

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
		 var cookieStr = this.cookieManager.getString(Constants.tokenCookieName);
		 if (cookieStr) {			
			var headers = {};
			headers["Authorization"] = cookieStr;
			reqObj.headers = headers;
		 }
		}
	 
		public serializeData() {
			this.dataToSend = JSON.stringify(this.data);
		}

		public sendPost() {
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
				cache: false,
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
				},
				dataType: 'json',
				contentType: 'application/json; charset=utf-8'
			};

			if (this.addLocalAuthentication) {
				this.addAuthentication(callObj);
			}

			$.ajax(callObj);

		}

		public sendPut() {
			var self = this;

			var callObj = {
				type: 'PUT',
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

	}
}