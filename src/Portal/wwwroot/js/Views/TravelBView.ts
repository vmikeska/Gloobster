module Views {
	export class TravelBView extends ViewBase {
			
		private travelMap: TravelB.TravelBMap;

		private mapCheckins: TravelB.MapCheckins;

		private hereAndNowTemplate;

		private tabs;
		private hereAndNowFuncs;

		private hereAndNowTabConst = "hereAndNowTab";

		constructor() {
			super();

			this.regEvents();

			this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");

			this.createMainTab();

			this.createMap();
				
			var status = new TravelB.Status();
		  status.refresh();
		}

		private createMainTab() {
			this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);

			this.tabs.onBeforeSwitch = () => {
				$("#theCont").html("");
			}

			this.tabs.addTab(this.hereAndNowTabConst, "Here and now", () => {
					this.createCheckinsFnc();
			});
			this.tabs.addTab("toCityCheckTab", "Check to a city", () => {
				this.createCityCheckinsFnc();
			});
			this.tabs.create();
		}

			private createCityCheckinsFnc() {
					$("#theCont").html("city checkins");
			}

			private createCheckinsFnc() {
					var $html = $(this.hereAndNowTemplate());
					$("#theCont").html($html);

					this.hereAndNowFuncs = new TravelB.HereAndNowTab();
					this.hereAndNowFuncs.onPlacesCheckins = () => {
							this.displayPlacesCheckins();
					};
					this.hereAndNowFuncs.onMeetingPoints = () => {
							this.displayMeetingPoints();
					}
					this.hereAndNowFuncs.onBeforeSwitch = () => {
							if (this.mapCheckins) {
									this.mapCheckins.clearMarkers();
							}
					}
					this.hereAndNowFuncs.createTab();
			}

		private regEvents() {
			$("#checkin").click((e) => {
				e.preventDefault();

				var win = new TravelB.CheckinWin();
				win.showCheckinWin(false);
			});

		}

		private onMapCreated(mapObj) {
				this.mapCheckins = new TravelB.MapCheckins(mapObj);
				
				
		}
			
		private onMapCenterChanged(c, bounds) {
			this.currentBounds = bounds;
			this.displayData();
		}

			private currentBounds;

			private displayPlacesCheckins() {
					if (!this.currentBounds) {
						return;
					}

					var prms = [
							["latSouth", this.currentBounds._southWest.lat],
							["lngWest", this.currentBounds._southWest.lng],
							["latNorth", this.currentBounds._northEast.lat],
							["lngEast", this.currentBounds._northEast.lng]
					];

					ViewBase.currentView.apiGet("TravelBCheckin", prms, (checkins) => {

							this.hereAndNowFuncs.genPeopleList(checkins);
							this.mapCheckins.genCheckins(checkins);

					});
			}

			private displayMeetingPoints() {
				this.hereAndNowFuncs.genMeetingPoints();
			}

		private displayData() {
			if (this.tabs.activeTabId === this.hereAndNowTabConst) {

				if (this.hereAndNowFuncs.tabs.activeTabId === this.hereAndNowFuncs.peopleTabConst) {
					this.displayPlacesCheckins();
				}

				if (this.hereAndNowFuncs.tabs.activeTabId === this.hereAndNowFuncs.mpTabConst) {
					this.displayMeetingPoints();
				}

			}
		}


		private createMap() {
			
			this.travelMap = new TravelB.TravelBMap();

			this.travelMap.onMapCreated = (mapObj) => this.onMapCreated(mapObj);

			this.travelMap.onCenterChanged = (c) => {
					var bounds = this.travelMap.mapObj.getBounds();
					this.onMapCenterChanged(c, bounds);
			}

			this.travelMap.create("map");
		}
			
		public static getActivityStr(val) {
				if (val === 0) {
						return "WalkingTour";
				}
				if (val === 1) {
						return "Bar or Pub";
				}
				if (val === 2) {
						return "Date";
				}

				return "Other";
		}

		public static getGenderStr(val) {
				if (val === 0) {
						return "Man";
				}
				if (val === 1) {
						return "Woman";
				}

				return "All";
		}

	

		}
}