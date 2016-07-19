module Views {
	export class TravelBView extends ViewBase {

		private travelMap: TravelB.TravelBMap;

		private mapCheckins: TravelB.MapCheckins;

		private hereAndNowTemplate;

		private tabs;
		private nowFncs: TravelB.NowTab;
		private cityFncs: TravelB.CityTab;
		private currentBounds;

		private nowTabConst = "nowTab";
		private cityTabConst = "cityTab";

		private reacts: CheckinReacts;
		private notifs: NotifRefresh;
		private chat: Chat;

		private props: TravelB.EmptyProps;

		public filter: TravelB.Filter;
		public defaultLangs;

		public checkinWin;
			
		public emptyProps = [];

		public init() {

			this.checkinWin = new TravelB.CheckinWin();

			this.filter = new TravelB.Filter();
		  this.filter.onFilterSelChanged = () => {
			  this.displayData();
		  }

			this.regEvents();

			this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");

			this.createMainTab();

			this.createMap();
				
			var status = new TravelB.Status();
			status.refresh();

			this.chat = new Chat();
			this.chat.refreshAll();

			this.reacts = new CheckinReacts();
			this.reacts.onStartChat = (callback) => {
				this.chat.refreshAll(() => {
					callback();
				});
			}
			this.reacts.refreshReacts();
				
			this.notifs = new NotifRefresh();
			this.notifs.onRefresh = (callback) => {

				this.reacts.refreshReacts(() => {

					this.chat.refreshAll(() => {
						callback();
					});

				});

			}
			this.notifs.startRefresh();

			this.props = new TravelB.EmptyProps();
			this.props.generateProps(this.emptyProps);				
		}
			
		private createMainTab() {
			this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);
			
			this.tabs.onBeforeSwitch = () => {
				$("#theCont").html("");
			}

			this.tabs.addTab(this.nowTabConst, "I am here and now", () => {
				this.createNowCheckinsFnc();				
			});
			this.tabs.addTab(this.cityTabConst, "I will be in a city", () => {
				this.createCityCheckinsFnc();				
			});
			this.tabs.create();
		}

		private createCityCheckinsFnc() {
			this.filter.initCity();

			this.cityFncs = new TravelB.CityTab();

			this.displayCityCheckins();
		}

		private createNowCheckinsFnc() {
			this.filter.initNow();

			var $html = $(this.hereAndNowTemplate());
			$("#theCont").html($html);

			this.nowFncs = new TravelB.NowTab();
			this.nowFncs.onPlacesCheckins = () => {
				this.displayNowCheckins();
			};
			this.nowFncs.onMeetingPoints = () => {
				this.displayMeetingPoints();
			}
			this.nowFncs.onBeforeSwitch = () => {
				if (this.mapCheckins) {
					this.mapCheckins.clearMarkers();
				}
			}
			this.nowFncs.createTab();
		}

		private regEvents() {
			$("#checkin").click((e) => {
				e.preventDefault();
					
				if (this.tabs.activeTabId === this.nowTabConst) {
					this.checkinWin.showNowCheckin();
				} else {
						this.checkinWin.showCityCheckin(null);
				}

			});

		}
			
		private displayNowCheckins() {
			var prms = this.getBaseQuery();

			if (prms === null) {
				return;
			}

			ViewBase.currentView.apiGet("CheckinNow", prms, (checkins) => {

				var fc = _.reject(checkins, (c) => { return c.userId === ViewBase.currentUserId });

				this.nowFncs.genCheckinsList(fc);
				this.mapCheckins.genCheckins(fc, CheckinType.Now);
			});
		}
			
		private displayCityCheckins() {
			var prms = this.getBaseQuery();

			if (prms === null) {
				return;
			}

			prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateFrom)]);
			prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateTo)]);
				
			ViewBase.currentView.apiGet("CheckinCity", prms, (checkins) => {
				this.cityFncs.genCheckinsList(checkins);
				this.mapCheckins.genCheckins(checkins, CheckinType.City);
			});
		}

		private getBaseQuery() {
			if (!this.currentBounds) {
				return null;
			}

			var prms = [
				["latSouth", this.currentBounds._southWest.lat],
				["lngWest", this.currentBounds._southWest.lng],
				["latNorth", this.currentBounds._northEast.lat],
				["lngEast", this.currentBounds._northEast.lng],
				["type", "query"]
			];

			this.filter.langs.forEach((l) => {
				prms.push(["lang", l]);
			});

			if (this.filter.selectedFilter) {
				prms.push(["filter", this.filter.selectedFilter.join(",")]);
			}

			return prms;
		}

		private displayMeetingPoints() {

			var prms = this.getBaseQuery();

			ViewBase.currentView.apiGet("MeetingPoint", prms, (points) => {
				this.nowFncs.genMeetingPoints(points);
				this.mapCheckins.genMPs(points);
			});


		}

		private displayData() {
			if (this.tabs.activeTabId === this.nowTabConst) {

				if (this.nowFncs.tabs.activeTabId === this.nowFncs.peopleTabConst) {
					this.displayNowCheckins();
				}

				if (this.nowFncs.tabs.activeTabId === this.nowFncs.mpTabConst) {
					this.displayMeetingPoints();
				}

			}

			if (this.tabs.activeTabId === this.cityTabConst) {
				this.displayCityCheckins();
			}

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

		private createMap() {

			this.travelMap = new TravelB.TravelBMap();

			this.travelMap.onMapCreated = (mapObj) => this.onMapCreated(mapObj);

			this.travelMap.onCenterChanged = (c) => {
				var bounds = this.travelMap.mapObj.getBounds();
				this.onMapCenterChanged(c, bounds);
			}

			this.travelMap.create("map");
		}

		private onMapCreated(mapObj) {
				this.mapCheckins = new TravelB.MapCheckins(mapObj);

			this.getLocation((lat, lng) => {
				this.setPlaceCenter(lat, lng);
				});

			var search = this.initPlaceDD("2", $("#searchCity"));
			search.onPlaceSelected = (p, e) => {
					this.setPlaceCenter(e.Coordinates.Lat, e.Coordinates.Lng);
			}
		}

		private onMapCenterChanged(c, bounds) {
				this.currentBounds = bounds;
				this.displayData();
		}

		public setPlaceCenter(lat, lng) {
			this.travelMap.mapObj.setView([lat, lng], 12);
		}

		private getLocation(callback) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((p) => {
					callback(p.coords.latitude, p.coords.longitude);
				});
			} else {
				var lat = geoip_latitude();
				var lng = geoip_longitude();
				callback(lat, lng);
			}
		}
	}

	export class StrOpers {

			public static formatDate(date) {
				return `${date.Day}.${date.Month}.${date.Year}`;
			}

			public static getActivityStr(vals) {
					var outStrs = [];
					var items = TravelB.TravelBUtils.wantDoDB();

					vals.forEach((id) => {
							var item = _.find(items, (i) => { return i.id === id });
							outStrs.push(item.text);
					});

					return outStrs.join(", ");
			}

			public static getInterestsStr(vals) {
					var outStrs = [];
					var items = TravelB.TravelBUtils.interestsDB();

					vals.forEach((id) => {
							var item = _.find(items, (i) => { return i.id === id });
							outStrs.push(item.text);
					});

					return outStrs.join(", ");
			}

			public static getGenderStr(val) {
					if (val === 0) {
							return "Man";
					}
					if (val === 1) {
							return "Woman";
					}

					return "Any gender";
			}

			public static getMultiStr(multi: boolean) {
					if (multi) {
						return "More people can come";
					}

					return "Prefer one single person";
			}
	}
}