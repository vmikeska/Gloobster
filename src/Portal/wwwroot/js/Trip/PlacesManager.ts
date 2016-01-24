module Trip {
	export enum NewPlacePosition { ToLeft, ToRight }

	export enum TravelType { Walk, Plane, Car, Bus, Train, Ship, Bike }

	export class Place {
		public id: string;
		public orderNo: number;

		public place: PlaceLocation;

		public arriving: Travel;
		public leaving: Travel;
	}

	export class PlaceLocation {
		public sourceId: string;
		public sourceType: SourceType;
		public selectedName: string;
	}

	export class Travel {
		public id: string;
		public type: TravelType;

		public from: Place;
		public to: Place;

		public arrivingDateTime: Date;
		public leavingDateTime: Date;

	}

	export class PlacesManager {
		private tripId: string;
		public places = [];
		public travels = [];

		constructor(tripId: string) {
			this.tripId = tripId;
		}

		public mapTravel(resp, from: Place, to: Place): Travel {
			var t = new Travel();
			t.id = resp.id;
			t.type = resp.type;
			t.arrivingDateTime = Utils.dateStringToUtcDate(resp.arrivingDateTime);
			t.leavingDateTime = Utils.dateStringToUtcDate(resp.leavingDateTime);
			t.from = from;
			t.to = to;
			return t;
		}

		public mapPlace(resp, arriving: Travel, leaving: Travel): Place {
			var p = new Place();
			p.id = resp.id;
			p.orderNo = resp.orderNo;
			p.place = resp.place;
			p.arriving = arriving;
			p.leaving = leaving;

			return p;
		}

		public setData(travels, places) {
			places.forEach((place) => {
				var p = this.mapPlace(place, null, null);

				if (place.arrivingId !== Constants.emptyId) {
					p.arriving = this.getOrCreateTravelById(place.arrivingId, travels);
					p.arriving.to = p;
				}

				if (place.leavingId !== Constants.emptyId) {
					p.leaving = this.getOrCreateTravelById(place.leavingId, travels);
					p.leaving.from = p;
				}
				this.places.push(p);
			});
		}

		private getOrCreateTravelById(travelId, travelsInput) {

			var cachedTravel = _.find(this.travels, (travel) => {
				return travel.id === travelId;
			});

			if (cachedTravel) {
				return cachedTravel;
			}

			var newTravel = _.find(travelsInput, (travel) => {
				return travel.id === travelId;
			});

			var newTravelObj = this.mapTravel(newTravel, null, null);
			this.travels.push(newTravelObj);

			return newTravelObj;
		}

		public getTravelById(id: string): Travel {
			return _.find(this.travels, (travel) => { return travel.id === id });
		}

		public getLastPlace(): Place {
			var lastPlace = _.max(this.places, (place) => { return place.orderNo });
			return lastPlace;
		}
	}
}