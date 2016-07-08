module Views {
	export class NotifRefresh {
		
		public onRefresh: Function;

		private refreshCycleFinished = true;
		private lastRefreshDate = null;
			
		public startRefresh() {
			
			var i = setInterval(() => {

				if (!this.refreshCycleFinished) {
					return;
				} else {
					this.refreshCycleFinished = false;
				}

				this.onRefresh(() => {
						this.refreshCycleFinished = true;
				});
				
			}, 10000);
		}
	}
}