module TravelB {
		
	export class MapCheckins {

		public checkins;
		
		private popupTemplate;
		private visitedPin;
		
		private markers = [];

		private mapObj;

		constructor(mapObj) {
			this.mapObj = mapObj;

			this.popupTemplate = Views.ViewBase.currentView.registerTemplate("userPopup-template");
		}
			
		public clearMarkers() {
			this.markers.forEach((m) => {
				this.mapObj.removeLayer(m);
			});
			this.markers = [];
		}

		public genCheckins(checkins) {
			this.clearMarkers();

			checkins.forEach((c) => {
				var coord = c.waitingCoord;
				var marker = L.marker([coord.Lat, coord.Lng], { icon: this.getVisitedPin() }).addTo(this.mapObj);
				marker.on("click", (e) => {
					this.displayPopup(e.latlng, c.userId);
				});
					
				this.markers.push(marker);
			});

		}

		private displayPopup(latlng, userId) {

				Views.ViewBase.currentView.apiGet("TravelBCheckin", [["id", userId]], (checkin) => {

						var d = new Date();
						var curYear = d.getFullYear();

						var context = {
								id: checkin.userId,
								name: checkin.displayName,
								age: curYear - checkin.birthYear,
								waitingFor: Views.TravelBView.getGenderStr(checkin.wantMeet),
								wants: Views.TravelBView.getActivityStr(checkin.wantDo),
								waitingMins: TravelBUtils.waitingMins(checkin.waitingUntil)
						}

						var ppCont = this.popupTemplate(context);

						var popup = new L.Popup();
						popup.setLatLng(latlng);
						popup.setContent(ppCont);
						this.mapObj.openPopup(popup);

				});
				
		}

		private getVisitedPin() {
			if (this.visitedPin == null) {
				this.visitedPin = L.icon({
					iconUrl: '../images/visited-ico.png',
					iconSize: [26, 31],
					iconAnchor: [13, 31],
					popupAnchor: [-3, -76]
				});
			}

			return this.visitedPin;
		}








	}
}