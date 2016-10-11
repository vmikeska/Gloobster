module TravelB {

	export class MapCheckins {

		public checkins;

		private popupTemplateNow = Views.ViewBase.currentView.registerTemplate("userPopupNow-template");
		private popupTemplateCity = Views.ViewBase.currentView.registerTemplate("userPopupCity-template");
		private popupMP = Views.ViewBase.currentView.registerTemplate("mpPopup-template");

		private visitedPin;		
		private checkinsLayer;		
		private clusterLayerMPs; 

		private mapObj;

		constructor(mapObj) {
			this.mapObj = mapObj;			
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
				marker.on("click", (e) => {						
						this.displayPopupMP(e.latlng, c.id);						
				});
					
				this.clusterLayerMPs.addLayer(marker);
			});

			this.mapObj.addLayer(this.clusterLayerMPs);
		}

		private displayPopupCity(latlng, cid) {
				
				Views.ViewBase.currentView.apiGet("CheckinCity", [["type", "id"], ["id", cid]], (c) => {

						var d = new Date();
						var curYear = d.getFullYear();

					var context = {
						id: c.userId,
						name: c.displayName,
						age: curYear - c.birthYear,
						languages: Views.StrOpers.langsToFlags(c.languages, c.homeCountry),

						wmMan: ((c.wantMeet === WantMeet.Man) || (c.wantMeet === WantMeet.All)),
						wmWoman: ((c.wantMeet === WantMeet.Woman) || (c.wantMeet === WantMeet.All)),
						wmWomanGroup: ((c.wantMeet === WantMeet.Woman) && c.multiPeopleAllowed),
						wmManGroup: ((c.wantMeet === WantMeet.Man) && c.multiPeopleAllowed),
						wmMixGroup: ((c.wantMeet === WantMeet.All) && c.multiPeopleAllowed),

						wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
						fromStr: Views.StrOpers.formatDate(c.fromDate),
						toStr: Views.StrOpers.formatDate(c.toDate),								
						interests: Views.StrOpers.getInterestsStr(c.interests),
						message: c.message
					};


						var ppCont = this.popupTemplateCity(context);

						var popup = new L.Popup();
						popup.setLatLng(latlng);
						popup.setContent(ppCont);
						this.mapObj.openPopup(popup);

				});

		}

		private displayPopupMP(latlng, id) {

				Views.ViewBase.currentView.apiGet("MeetingPoint", [["id", id]], (mp) => {
						
						var context = {
								id: mp.id,
								photoUrl: mp.photoUrl,
								link: Common.GlobalUtils.getSocLink(mp.type, mp.sourceId),
								name: mp.text,
								categories: mp.categories, 
								peopleMet: mp.peopleMet
						}

						var ppCont = this.popupMP(context);

						var popup = new L.Popup();
						popup.setLatLng(latlng);
						popup.setContent(ppCont);
						this.mapObj.openPopup(popup);

				});

		}

		private displayPopupNow(latlng, userId) {

			Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "id"], ["id", userId]], (c) => {

				var d = new Date();
				var curYear = d.getFullYear();

				var context = {
					id: c.userId,
					name: c.displayName,
					age: curYear - c.birthYear,
					languages: Views.StrOpers.langsToFlags(c.languages, c.homeCountry),
					
					wmMan: ((c.wantMeet === WantMeet.Man) || (c.wantMeet === WantMeet.All)),
					wmWoman: ((c.wantMeet === WantMeet.Woman) || (c.wantMeet === WantMeet.All)),
					wmWomanGroup: ((c.wantMeet === WantMeet.Woman) && c.multiPeopleAllowed),
					wmManGroup: ((c.wantMeet === WantMeet.Man) && c.multiPeopleAllowed),
					wmMixGroup: ((c.wantMeet === WantMeet.All) && c.multiPeopleAllowed),

					wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
					waitingStr: TravelBUtils.minsToTimeStr(TravelBUtils.waitingMins(c.waitingUntil)),
					interests: Views.StrOpers.getInterestsStr(c.interests),
					message: c.message
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