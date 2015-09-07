
module Views {

	export class ViewBase {

		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;

			var request = new RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendGet();
	 }

		public apiPost(endpointName: string, data: any, callback: Function) {

		 var endpoint = '/api/' + endpointName;

		 var request = new RequestSender(endpoint, data, true);		 
		 request.serializeData();
		 request.onSuccess = callback;
		 request.onError = response => { alert('error') };
		 request.sentPost();
		}


	}
}