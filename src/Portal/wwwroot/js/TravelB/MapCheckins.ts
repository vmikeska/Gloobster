module TravelB {

	export class MapCheckins {

		public checkins;

		private popupTemplateNow;
		private popupTemplateCity;
		private visitedPin;

		private markers = [];

		private mapObj;

		constructor(mapObj) {
			this.mapObj = mapObj;

			this.popupTemplateNow = Views.ViewBase.currentView.registerTemplate("userPopupNow-template");
			this.popupTemplateCity = Views.ViewBase.currentView.registerTemplate("userPopupCity-template");
		}

		public clearMarkers() {
			this.markers.forEach((m) => {
				this.mapObj.removeLayer(m);
			});
			this.markers = [];
		}

		public genCheckins(checkins, type: CheckinType) {
			//this.clearMarkers();

			checkins.forEach((c) => {
				var coord = c.waitingCoord;
				var ico = MapPins.getByGender(c.gender);
				var marker = L.marker([coord.Lat, coord.Lng], { icon: ico }).addTo(this.mapObj);
				marker.on("click", (e) => {

					if (type === CheckinType.Now) {
						this.displayPopupNow(e.latlng, c.userId);
					}

					if (type === CheckinType.City) {
						this.displayPopupCity(e.latlng, c.id);
					}

				});

				this.markers.push(marker);
			});

		}

		public genMPs(mps) {
			this.clearMarkers();

			mps.forEach((c) => {
				var marker = L.marker([c.coord.Lat, c.coord.Lng], { icon: MapPins.mpPin() }).addTo(this.mapObj);
				//marker.on("click", (e) => {
				//		this.displayPopup(e.latlng, c.userId);
				//});

				this.markers.push(marker);
			});

		}

		private displayPopupCity(latlng, cid) {

				Views.ViewBase.currentView.apiGet("CheckinCity", [["type", "id"], ["id", cid]], (checkin) => {

						var d = new Date();
						var curYear = d.getFullYear();

						var context = {
								id: checkin.userId,
								name: checkin.displayName,
								age: curYear - checkin.birthYear,
								waitingFor: Views.StrOpers.getGenderStr(checkin.wantMeet),
								multiStr: Views.StrOpers.getMultiStr(checkin.multiPeopleAllowed),
								wants: Views.StrOpers.getActivityStr(checkin.wantDo),
								fromStr: Views.StrOpers.formatDate(checkin.fromDate),
								toStr: Views.StrOpers.formatDate(checkin.toDate),								
								interests: Views.StrOpers.getInterestsStr(checkin.interests),
								message: checkin.message
						}

						var ppCont = this.popupTemplateCity(context);

						var popup = new L.Popup();
						popup.setLatLng(latlng);
						popup.setContent(ppCont);
						this.mapObj.openPopup(popup);

				});

		}
			
		private displayPopupNow(latlng, userId) {

			Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "id"], ["id", userId]], (checkin) => {

				var d = new Date();
				var curYear = d.getFullYear();

				var context = {
					id: checkin.userId,
					name: checkin.displayName,
					age: curYear - checkin.birthYear,
					waitingFor: Views.StrOpers.getGenderStr(checkin.wantMeet),
					multiStr: Views.StrOpers.getMultiStr(checkin.multiPeopleAllowed),
					wants: Views.StrOpers.getActivityStr(checkin.wantDo),
					waitingMins: TravelBUtils.waitingMins(checkin.waitingUntil),
					interests: Views.StrOpers.getInterestsStr(checkin.interests),
					message: checkin.message
				}

				var ppCont = this.popupTemplateNow(context);

				var popup = new L.Popup();
				popup.setLatLng(latlng);
				popup.setContent(ppCont);
				this.mapObj.openPopup(popup);

			});

		}

	}

	export class MapPins {

		private static manPinVal = null;
		private static womanPinVal = null;
		private static youPinVal = null;
		private static mpPinVal = null;

		public static getByGender(gender: Gender) {
			if (gender === Gender.F) {
				return this.womanPin();
			}

			if (gender === Gender.M) {
				return this.manPin();
			}

			return null;
		}

		public static mpPin() {
			if (this.mpPinVal == null) {
				this.mpPinVal = L.icon({
					iconUrl: '../images/tb/mp.png',
					iconSize: [32, 32],
					iconAnchor: [16, 32],
					popupAnchor: [-3, -76]
				});
			}

			return this.mpPinVal;
		}

		public static manPin() {
			if (this.manPinVal == null) {
				this.manPinVal = L.icon({
					iconUrl: '../images/tb/man.png',
					iconSize: [32, 32],
					iconAnchor: [16, 32],
					popupAnchor: [-3, -76]
				});
			}

			return this.manPinVal;
		}

		public static womanPin() {
			if (this.womanPinVal == null) {
				this.womanPinVal = L.icon({
					iconUrl: '../images/tb/woman.png',
					iconSize: [32, 32],
					iconAnchor: [16, 32],
					popupAnchor: [-3, -76]
				});
			}

			return this.womanPinVal;
		}


		public static youPin() {
			if (this.youPinVal == null) {
				this.youPinVal = L.icon({
					iconUrl: '../images/tb/you.png',
					iconSize: [32, 32],
					iconAnchor: [16, 32],
					popupAnchor: [-3, -76]
				});
			}

			return this.youPinVal;
		}


	}


}