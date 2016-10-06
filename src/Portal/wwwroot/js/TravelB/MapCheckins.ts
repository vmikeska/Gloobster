module TravelB {

	export class MapCheckins {

		public checkins;

		private popupTemplateNow;
		private popupTemplateCity;
		private visitedPin;

		private checkinsLayer;
		
		private clusterLayerMPs; 

		private mapObj;

		constructor(mapObj) {
			this.mapObj = mapObj;

			this.popupTemplateNow = Views.ViewBase.currentView.registerTemplate("userPopupNow-template");
			this.popupTemplateCity = Views.ViewBase.currentView.registerTemplate("userPopupCity-template");
		}

		public clearCheckins() {
			if (this.checkinsLayer) {
					this.mapObj.removeLayer(this.checkinsLayer);
					this.checkinsLayer = null;
			}			
		}

		public clearMPs() {
			if (this.clusterLayerMPs) {
				this.mapObj.removeLayer(this.clusterLayerMPs);
				this.clusterLayerMPs = null;
			}
		}

		public genCheckins(checkins, type: CheckinType) {	
			this.clearCheckins();
			this.checkinsLayer = new L.LayerGroup();
				
			checkins.forEach((c) => {
				var coord = c.waitingCoord;
				var isYou = c.userId === Views.ViewBase.currentUserId;
				if (isYou) {
						var mc = MapPins.getYourCheckinCont(c);
						var m = L.marker([coord.Lat, coord.Lng], { icon: mc, title: "Your checkin" });
							m.on("click", (e) => {
									var win = new CheckinWin();
									win.showNowCheckin();
						});
						this.checkinsLayer.addLayer(m);

				} else {
					var markerCont = MapPins.getCheckinCont(c);

					var marker = L.marker([coord.Lat, coord.Lng], { icon: markerCont });
					marker.on("click", (e) => {

						if (type === CheckinType.Now) {
							this.displayPopupNow(e.latlng, c.userId);
						}

						if (type === CheckinType.City) {
							this.displayPopupCity(e.latlng, c.id);
						}

					});
					this.checkinsLayer.addLayer(marker);
				}
			});

			this.mapObj.addLayer(this.checkinsLayer);
		}

		public genMPs(mps) {
				
			this.clearMPs();
			this.clusterLayerMPs = new L.MarkerClusterGroup();


			mps.forEach((c) => {

				var markerCont = MapPins.getMpCont(c);

				var marker = L.marker([c.coord.Lat, c.coord.Lng], { icon: markerCont });
					
				this.clusterLayerMPs.addLayer(marker);
			});

			this.mapObj.addLayer(this.clusterLayerMPs);
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

		public static getCheckinCont(checkin) {
			var html =
				`<div class="thumb-cont border">
            <img src="/PortalUser/ProfilePicture_s/${checkin.userId}">
        </div>`;
			var cont = L.divIcon({
				className: "checkin-icon",
				html: html,
				iconSize: [40, 40],
				iconAnchor: [20, 0]
			});

			return cont;
		}

		public static getMpCont(mp) {
				var html =
						`<div class="cont">
								<img src="${mp.photoUrl}">
						</div>`;
				var cont = L.divIcon({
						className: "mp-icon",
						html: html,
						iconSize: [40, 40],
						iconAnchor: [20, 0]
				});

				return cont;				
		}

		public static getYourCheckinCont(checkin) {
				var html =
						`<span>C</span>`;
				var cont = L.divIcon({
						className: "checkin-you-icon",
						html: html,
						iconSize: [40, 40],
						iconAnchor: [20, 0]
				});

				return cont;
		}
			
	}


}