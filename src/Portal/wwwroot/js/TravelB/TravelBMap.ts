module TravelB {
	export class TravelBMap {

		public onCenterChanged: Function;
		public onMapCreated: Function;

		public mapCreator;

			public mapObj;

		private timeoutId;

		public create(mapId) {
				this.mapCreator = new Maps.MapsCreatorMapBox2D();
			this.mapCreator.options.minZoom = 12;
			this.mapCreator.onCenterChanged = (c) => {

				if (this.onCenterChanged) {
					this.mapMoved(() => {
						this.onCenterChanged(c);
					});
				}
			}
			this.mapCreator.setRootElement(mapId);

			this.mapCreator.show((mapObj) => {
				this.mapObj = mapObj;
					this.onMapCreated(mapObj);
			});
		}

		private mapMoved(callback) {

			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
			this.timeoutId = setTimeout(() => {
				this.timeoutId = null;
				callback();
			}, 200);
		}

	}
}