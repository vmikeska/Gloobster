module Views {
	export class ShareTripView extends ViewBase {

		private maps: Maps.MapsCreatorMapBox2D;

		private tripId: string;
		private trip: any;
	  
	  private map: any;

		constructor(tripId) {
			super();

			this.initialize(tripId);
		}

		private initialize(tripId) {
			this.tripId = tripId;

			this.maps = new Maps.MapsCreatorMapBox2D();
			this.maps.setRootElement("map");
			this.maps.show((map) => {
				this.map = map;

				this.getData((trip) => {
					this.trip = trip;
					this.draw(trip);
				});

			});
		}

		private draw(trip) {

			for (var p = 0; p <= trip.places.length - 2; p++) {
				var actPlace = trip.places[p];
				var nextPlace = trip.places[p + 1];

				var fromP = new L.LatLng(actPlace.place.coordinates.Lat, actPlace.place.coordinates.Lng);
				var toP = new L.LatLng(nextPlace.place.coordinates.Lat, nextPlace.place.coordinates.Lng);
				var pointList = [fromP, toP];

				var c = {
					color: 'red',
					weight: 3,
					opacity: 0.5,
					smoothFactor: 1
				};
				var firstpolyline = new L.polyline(pointList, c);
				firstpolyline.addTo(this.map);
			}
		}

		private getData(callback) {
			var prms = [["tripId", this.tripId]];
			ViewBase.currentView.apiGet("tripShare", prms, (trip) => callback(trip));
		}


	}
}