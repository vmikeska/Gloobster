module Planning {
		
	export class SearchDataLoader {

		public getInitData(callback: Function) {

			var prms = [["actionName", "init"]];

			Views.ViewBase.currentView.apiGet("CustomSearch", prms, (res) => {
					callback(res);
				});
		}

		public getSearch(id, callback: Function) {
			var prms = [["actionName", "search"], ["id", id]];

			Views.ViewBase.currentView.apiGet("CustomSearch", prms, (res) => {
					callback(res);
				});
		}

		public createNewSearch(callback: Function) {

			var data = {
				actionName: "new"
			};

			Views.ViewBase.currentView.apiPost("CustomSearch", data, (res) => {
					callback(res);
				});
		}

		public deleteSearch(id, callback: Function) {
			Views.ViewBase.currentView.apiDelete("CustomSearch", [["actionName", "search"], ["id", id]], (res) => {
					callback(res);
				});
		}

		public removeAirport(searchId, origId, callback: Function) {

			var prms = [["actionName", "air"], ["id", searchId], ["paramId", origId]];

			Views.ViewBase.currentView.apiDelete("CustomSearch", prms, (res) => {
					callback(res);
				});
		}


	}
		
}