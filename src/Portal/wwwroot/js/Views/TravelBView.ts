module Views {
	export class TravelBView extends ViewBase {

		private travelMap: TravelBMap;

		private hereAndNowTemplate;

		constructor() {
			super();

			this.regEvents();

			this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");
			
			this.switchTab(0);
		}

		private regEvents() {
			$("#checkin").click((e) => {
				e.preventDefault();

				var win = new CheckinWin();
				win.showCheckinWin();
			});

		}

		private switchTab(tab) {
			var $tabCont = $("#mainCont");
			this.travelMap = new TravelBMap();

			if (tab === 0) {
				var users = null;
				var $html = this.hereAndNowTemplate();
				$tabCont.html($html);
				this.travelMap.onMapCreated = (mapObj) => {
					users = new TravelBUsers(mapObj);
				}
				this.travelMap.create("map");

				this.travelMap.onCenterChanged = (c) => {
					if (users) {
						users.getCheckins(c);
					}
				}
			}

		}

	}

	export class TravelBUsers {

			private visitedPin;
			private mapObj;
			private markers = [];

			constructor(mapObj) {
				this.mapObj = mapObj;
			}

			public getCheckins(c) {
					var bounds = this.mapObj.getBounds();					
					var prms = [
							["latSouth", bounds._southWest.lat],
							["lngWest", bounds._southWest.lng],
							["latNorth", bounds._northEast.lat],
							["lngEast", bounds._northEast.lng]					
					];
					
				ViewBase.currentView.apiGet("TravelBCheckin", prms, (r) => {
					this.genCheckins(r);
				});
			}

		private clearMarkers() {
			this.markers.forEach((m) => {
				this.mapObj.removeLayer(m);
			});
			this.markers = [];
		}

		private genCheckins(users) {
			this.clearMarkers();

			users.forEach((u) => {
				var coord = u.WaitingCoord;
				var marker = L.marker([coord.Lat, coord.Lng], { icon: this.getVisitedPin() }).addTo(this.mapObj);
				this.markers.push(marker);
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

	export class TravelBMap {

			public onCenterChanged: Function;
			public onMapCreated: Function;

		public mapCreator;

		private timeoutId;

		public create(mapId) {
			this.mapCreator = new Maps.MapsCreatorMapBox2D();
			this.mapCreator.onCenterChanged = (c) => {

				if (this.onCenterChanged) {
					this.mapMoved(() => {
						this.onCenterChanged(c);
					});
				}
			}
			this.mapCreator.setRootElement(mapId);

			this.mapCreator.show((mapObj) => this.onMapCreated(mapObj));
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

	export class CheckinWin {

			private nowTab = "nowTab";
			private futureTab = "futureTab";

			private checkinWindowT;
			private ddReg;

			private wpCombo;
			private wcCombo;
			private activeTab = this.nowTab;

			constructor() {					
					this.registerTemplates();
					this.ddReg = new Common.DropDown();
			}

		public showCheckinWin() {
			var $cont = $("#checkinWinCont");

			var $win = $(this.checkinWindowT());

			this.ddReg.registerDropDown($win.find("#fromAge"));
			this.ddReg.registerDropDown($win.find("#toAge"));

			$win.find("#nowTabBtn").click((e) => {
				e.preventDefault();
				this.switchCheckinTabs(this.nowTab);
			});
			$win.find("#futureTabBtn").click((e) => {
				e.preventDefault();
				this.switchCheckinTabs(this.futureTab);
			});

			this.wpCombo = this.initPlaceDD("1,0,4", $win.find("#waitingPlace"));
			this.wcCombo = this.initPlaceDD("2", $win.find("#waitingCity"));

			$win.find("#submitCheckin").click((e) => {
				e.preventDefault();
				this.callServer();
			});

			$cont.html($win);
		}

		private callServer() {

			var checkinType = (this.activeTab === this.nowTab) ? 0 : 1;

			var combo = (this.activeTab === this.nowTab) ? this.wpCombo : this.wcCombo;

			var data = {
				wantDo: $('input[name=wantDo]:checked').val(),
				wantMeet: $('input[name=wantMeet]:checked').val(),
				multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
				fromAge: $("#fromAge input").val(),
				toAge: $("#toAge input").val(),

				minsWaiting: $("#minsWaiting").val(),
				
				fromDate: $("#fromDate").val(),
				toDate: $("#toDate").val(),
				
				checkinType: checkinType,
				waitingAtId: combo.sourceId,
				waitingAtType: combo.sourceType,
				waitingAtText: combo.lastText,
				waitingCoord: combo.coord
			};

			ViewBase.currentView.apiPost("TravelBCheckin", data, (r) => {
				
			});
			
		}

		private registerTemplates() {
					this.checkinWindowT = ViewBase.currentView.registerTemplate("checkinWindow-template");
			}
			
			private initPlaceDD(providers, selObj) {
					var c = new Common.PlaceSearchConfig();
					c.providers = providers;
					c.selOjb = selObj;
					c.minCharsToSearch = 1;
					c.clearAfterSearch = false;

					var combo = new Common.PlaceSearchBox(c);
					return combo;
			}

		private switchCheckinTabs(tab) {
			$(`#${this.nowTab}`).hide();
			$(`#${this.futureTab}`).hide();

			$(`#${tab}`).show();

			this.activeTab = tab;
		}

	}
}