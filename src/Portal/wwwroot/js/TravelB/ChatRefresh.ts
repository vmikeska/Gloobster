module Views {
	export class ChatRefresh {

		public isStarted = false;

		public onRefresh: Function;
			
		private refreshCycleFinished = true;
		private lastRefreshDate = null;

		public startRefresh() {

			this.isStarted = true;
			var i = setInterval(() => {

				if (!this.refreshCycleFinished) {
					return;
				} else {
					this.refreshCycleFinished = false;
				}

				var chatWins = $(".chat-cont").toArray();

				if (chatWins.length === 0) {
					clearInterval(i);
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