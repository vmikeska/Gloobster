module Planning {

	export class PropsDataUpload {

		private searchId;
		private value;
		private values = [];
		private propName;

		constructor(searchId, propName) {
			this.searchId = searchId;
			this.propName = propName;
		}

		public setVal(val) {
			this.value = val;
		}

		public addVal(name, val) {
			this.values.push({ name: name, val: val });
		}


		public send(callback: Function = null) {

			var req = {
				id: this.searchId,
				name: this.propName,
				value: this.value,
				values: this.values
			};

			Views.ViewBase.currentView.apiPut("CustomSearch",
				req,
				(res) => {
					if (callback) {
						callback(res);
					}
				});
		}
	}
	
}