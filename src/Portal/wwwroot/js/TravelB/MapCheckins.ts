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

		private view: Views.TravelBView;

		constructor(view: Views.TravelBView, mapObj) {
			this.view = view;
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

			private groupByPlace(cs) {
					var csgs = _.groupBy(cs, (c) => { return c.waitingAtId });

					var o = [];

					for (var key in csgs) {
							if (csgs.hasOwnProperty(key)) {
									o.push(csgs[key]);
							}
					}

					return o;
			}

			private addPixelsToCoord(lat, lng, xPixelsOffset, yPixelsOffset, map) {
					var latLng = L.latLng([lat, lng]);

					var point = map.latLngToContainerPoint(latLng);

					var newPoint = L.point([point.x + xPixelsOffset, point.y + yPixelsOffset]);

					var newLatLng = map.containerPointToLatLng(newPoint);
					return newLatLng;
			}

		public genCheckins(cs, type: CheckinType) {	
			this.clearCheckins();
			this.checkinsLayer = new L.LayerGroup();

			var csgs = this.groupByPlace(cs);
				
			csgs.forEach((csg) => {
					
				csg.forEach((c, i) => {
						var coord = c.waitingCoord;
						
						var markerCont = MapPins.getCheckinCont(c);
						
						var newCoord = this.addPixelsToCoord(coord.Lat, coord.Lng, i * 30, 0, this.mapObj);
						
						var marker = L.marker(newCoord, { icon: markerCont });
						this.checkinsLayer.addLayer(marker);
				
						marker.on("click", (e) => {

								if (type === CheckinType.Now) {
										this.displayPopupNow(e.latlng, c.userId);
								}

								if (type === CheckinType.City) {
										this.displayPopupCity(e.latlng, c.id);
								}

						});
						
				});
					
			});

			this.mapObj.addLayer(this.checkinsLayer);
		}

		public genMPs(mps) {
				
			this.clearMPs();
			this.clusterLayerMPs = L.markerClusterGroup();


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
				var context = CheckinMapping.map(c, CheckinType.City);

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

				var context = CheckinMapping.map(c, CheckinType.Now);
				
				var ppCont = this.popupTemplateNow(context);

				var popup = new L.Popup();
				popup.setLatLng(latlng);
				popup.setContent(ppCont);
				this.mapObj.openPopup(popup);

				$(".chat-btn-popup").click((e) => {
						e.preventDefault();
						var cr = new CheckinReact();

						var $t = $(e.delegateTarget);
						var $c = $t.closest(".user-popup");
						cr.askForChat($c.data("uid"), $c.data("cid"));
				});

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
			
	}


}