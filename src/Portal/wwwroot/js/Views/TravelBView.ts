module Views {
	
	export class TravelBView extends ViewBase {

		private travelMap: TravelB.TravelBMap;

		private mapCheckins: TravelB.MapCheckins;

		private hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");

		private tabs;
		private nowFncs: TravelB.NowTab;
		private cityFncs: TravelB.CityTab;
		private currentBounds;

		private nowTabConst = "nowTab";
		private cityTabConst = "cityTab";

		private reacts: CheckinReacts;
		private notifs: NotifRefresh;
		private chat: Chat;
			
		private youMarker;

		private mapObj;

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
				this.tabs = new TravelB.MenuTabs($(".main-menu .tbl"));
			
			this.tabs.onBeforeSwitch = () => {
				$("#theCont").html("");
			}

			this.tabs.addTab(this.nowTabConst, "I am here and now", () => {
				this.createNowCheckinsFnc();				
			});
			this.tabs.addTab(this.cityTabConst, "I will be in a city", () => {
				this.createCityCheckinsFnc();				
			});
			this.tabs.create(`<div class="btn-cont"></div>`);
		}
			
		private createCityCheckinsFnc() {			
			$(".meeting-points").hide();

			this.filter.initCity();
				
			this.cityFncs = new TravelB.CityTab();

			this.displayCityCheckins();
		}

		private createNowCheckinsFnc() {
			this.filter.initNow();

			$(".meeting-points").show();

			this.nowFncs = new TravelB.NowTab();		
			this.displayNowCheckins();
			this.displayMeetingPoints();			
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

			$("#fShowPeople").change((e) => {				
				this.displayNowCheckins();
			});

			$("#fPoints").change((e) => {
					this.displayMeetingPoints();
			});

		}

		private displayNowCheckins() {
			var prms = this.getBaseQuery();

			if (prms === null) {
				return;
			}

			var showPeople = $("#fShowPeople").prop("checked");
			if (showPeople) {
				ViewBase.currentView.apiGet("CheckinNow", prms, (checkins) => {					
						this.nowFncs.genCheckinsList(checkins);

						this.mapCheckins.genCheckins(checkins, CheckinType.Now);
				});
			} else {					
				this.mapCheckins.clearCheckins();
			}

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

					var fc = _.reject(checkins, (c) => { return c.userId === ViewBase.currentUserId });

					this.mapCheckins.genCheckins(fc, CheckinType.City);
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
				["type", "query"],
				["filter", this.filter.selectedFilter]
			];

			this.filter.langs.forEach((l) => {
				prms.push(["lang", l]);
			});

			if (this.filter.wds) {
					prms.push(["wds", this.filter.wds.join(",")]);
			}

			return prms;
		}

		private displayMeetingPoints() {

			var prms = this.getBaseQuery();

			var showMPs = $("#fPoints").prop("checked");

			ViewBase.currentView.apiGet("MeetingPoint", prms, (points) => {
				this.nowFncs.genMeetingPoints(points);

				if (showMPs) {
					this.mapCheckins.genMPs(points);
				}
			});
				
			if (!showMPs && this.mapCheckins) {
				this.mapCheckins.clearMPs();
			}				
		}

		private displayData() {
			if (this.tabs.activeTabId === this.nowTabConst) {
					this.displayNowCheckins();
					this.displayMeetingPoints();					
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
			this.mapObj = mapObj;
			this.mapCheckins = new TravelB.MapCheckins(mapObj);

			TravelB.UserLocation.getLocation((res) => {
					TravelB.UserLocation.setCurrentLocation(res.lat, res.lng);				
				this.setPlaceCenter(res.lat, res.lng);

				if (res.exactLoc) {
					this.createUserMarker(res.lat, res.lng);
					this.startUserTracking();
				}

				if (res.userDenied) {
					$(".no-location-perm").show();
				}
			});
				
			var search = this.initPlaceDD("2", $("#searchCity"));
			search.onPlaceSelected = (p, e) => {
				this.setPlaceCenter(e.Coordinates.Lat, e.Coordinates.Lng);
			}
		}

		private createUserMarker(lat, lng) {
			this.youMarker = L.marker([lat, lng], { title: "Your position" }).addTo(this.mapObj);
		}

		private clearUserMarker() {
			if (this.youMarker) {
				this.mapObj.removeLayer(this.youMarker);
				this.youMarker = null;
			}
		}

		

		private startUserTracking() {
				navigator.geolocation.watchPosition(
						(pos) => {
								TravelB.UserLocation.setCurrentLocation(pos.coords.latitude, pos.coords.longitude);
								this.clearUserMarker();
								this.createUserMarker(pos.coords.latitude, pos.coords.longitude);
							},
							(error) => {
									this.clearUserMarker();
							}
					);
			}

		private onMapCenterChanged(c, bounds) {
				this.currentBounds = bounds;
				this.displayData();
		}

		public setPlaceCenter(lat, lng) {
			this.travelMap.mapObj.setView([lat, lng], 12);
		}

		
		}

	export class StrOpers {

			public static formatDate(date) {
					var utc = Date.UTC(date.Year, date.Month, date.Day);
					var d = moment.utc(utc).format("L");
				return d;
				//return `${date.Day}.${date.Month}.${date.Year}`;
			}

		public static langsToFlags(langs, homeCountry) {
			//todo: implement most common
				
			var out = [];

			langs.forEach((l) => {
				var lang = l.toLowerCase();

				if (lang === "en") {
					if (homeCountry.toLowerCase() === "us") {
						out.push("us");
					} else {
						out.push("gb");
					}
				} else {
						out.push(lang);
				}
			});

			return out;

		}

		public static getActivityStrArray(vals) {
					var outStrs = [];
					var items = TravelB.TravelBUtils.wantDoDB();

					vals.forEach((id) => {
							var item = _.find(items, (i) => { return i.id === id });
							outStrs.push(item.text);
					});

					return outStrs;
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