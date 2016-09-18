module Views {
	export class ChatRefresh {

		public get isStarted(): boolean {
			return this.intRef !== null;
		}

		public onRefresh: Function;
			
		private refreshCycleFinished = true;
		private lastRefreshDate = null;

		private intRef = null;

		private stopRefresh() {
			if (this.intRef) {
				clearInterval(this.intRef);
				this.intRef = null;
			}
		}

		public startRefresh() {				
			this.intRef = setInterval(() => {

				if (!this.refreshCycleFinished) {
					return;
				} else {
					this.refreshCycleFinished = false;
				}

				var persons = $(".nchat-all .people .person").toArray();

				if (persons.length === 0) {
					this.stopRefresh();
				}

				var loadedIds = _.map(persons, (p) => { return $(p).data("rid"); });
						
				var prms = [];
				var lastDate = null;
				loadedIds.forEach((rid) => {
					prms.push(["reactIds", rid]);
					var ld = Chat.getUserTitleNameTag(rid).data("last");

					if (lastDate === null) {
						lastDate = ld;
					} else if (ld > lastDate) {
						lastDate = ld;
					}
				});
				if (lastDate) {
					prms.push(["lastDate", lastDate.toString()]);
				}

				ViewBase.currentView.apiGet("ReactChat", prms, (responses) => {

					this.onRefresh(responses);

					this.refreshCycleFinished = true;
				});

			}, 5000);
		}
	}
}