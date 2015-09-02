
module Views {

	export class ViewBase {

		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var urlBase = '/api/' + endpointName;

			var urlQuery = "";
			if (params) {
				urlQuery = "?";

				params.forEach(param => {
					urlQuery += param[0] + "=" + param[1] + "&";
				});

				urlQuery = urlQuery.substring(0, urlQuery.length - 1);
			}

			var url = urlBase + urlQuery;

			$.ajax({
				type: 'GET',
				url: url,
				success(response) {
					callback(response);
				},
				error(res) {

					//todo: some universal error handler
					alert(JSON.stringify(res));
				}
			});
		}
	}
}