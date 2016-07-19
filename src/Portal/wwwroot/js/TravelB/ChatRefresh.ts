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

				var chatWins = $(".chat-cont").toArray();

				if (chatWins.length === 0) {
					this.stopRefresh();
				}

				var loadedIds = _.map(chatWins, (w) => { return $(w).data("id"); });
						
				var prms = [];
				var lastDate = null;
				loadedIds.forEach((rid) => {
					prms.push(["reactIds", rid]);
					var ld = Chat.getChatByRectId(rid).data("last");

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