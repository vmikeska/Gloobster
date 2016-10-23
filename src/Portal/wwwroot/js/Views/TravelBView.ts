module Views {


	

	export class TravelBView extends ViewBase {

		private travelMap: TravelB.TravelBMap;

		public checkinWin: TravelB.CheckinWin;

		private mapCheckins: TravelB.MapCheckins;

		private hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");

		public tabs: TravelB.MenuTabs;
		private nowFncs: TravelB.NowTab;
		private cityFncs: TravelB.CityTab;
		private currentBounds;

		public checkinMenu: TravelB.CheckinMenu;

		public nowTabConst = "nowTab";
		public cityTabConst = "cityTab";

		private reacts: TravelB.CheckinReacts;
		private notifs: NotifRefresh;
		private chat: TravelB.Chat;
			
		private youMarker;

		private mapObj;

		private props: TravelB.EmptyProps;

		public status: TravelB.Status;

		public filter: TravelB.Filter;
		public defaultLangs;
			
		public emptyProps = [];
		public homeLocation;

		public init() {
				
				this.checkinWin = new TravelB.CheckinWin(this);
				this.checkinMenu = new TravelB.CheckinMenu(this);

			this.filter = new TravelB.Filter(this);
		  this.filter.onFilterSelChanged = () => {
			  this.displayData();
		  }

			this.regEvents();
				
			this.createMainTab();

			this.createMap();
				
			this.status = new TravelB.Status(this);
			this.status.refresh();

			this.chat = new TravelB.Chat(this);
			this.chat.refreshAll();

			this.reacts = new TravelB.CheckinReacts(this);
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

			this.props = new TravelB.EmptyProps(this);
			this.props.generateProps(this.emptyProps);

			$(".city-chck-cnt .city-link").click((e) => {
					e.preventDefault();
				 $("#cityTab").click();
			});
		}
			
		private createMainTab() {
				this.tabs = new TravelB.MenuTabs($(".main-menu"));
			
			this.tabs.onBeforeSwitch = () => {
				$("#theCont").html("");
			}

			this.tabs.addTab({ id: this.nowTabConst, text: " " + this.t("MajorNowBtn", "jsTravelB"), customClass: "icon-clock" }, () => {
				this.nowTabClicked();
			});
		
			this.tabs.addTab({ id: this.cityTabConst, text: " " + this.t("MajorCityBtn", "jsTravelB"), customClass: "icon-location-on-road" }, () => {
				this.cityTabClicked();
			});

			this.tabs.create(`<div class="btn-cont"></div>`);
		}

			private nowTabClicked() {
					this.checkinMenu.setCheckinByTab(this.nowTabConst);

					this.createNowCheckinsFnc();
					$("#filterDateCont").hide();
					$("#cityCheckins").hide();

				  $(".entities-filter").show();

					this.cityCheckinsCnt();
		}

			private cityTabClicked() {
					this.checkinMenu.setCheckinByTab(this.cityTabConst);

					this.createCityCheckinsFnc();
					$(".city-chck-cnt").hide();
					$("#filterDateCont").show();
					$("#cityCheckins").show();

					$(".entities-filter").hide();
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

		private cityCheckinsCnt() {
				var prms = this.getBoundsQuery();

				if (prms === null) {
						return;
				}

			var now = TravelB.DateUtils.jsDateToMyDate(new Date());
			prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(now)]);
			prms.push(["toDate", TravelB.DateUtils.myDateToTrans(now)]);
			prms.push(["type", "count"]);

			ViewBase.currentView.apiGet("CheckinCity", prms, (cnt) => {

				if (cnt > 0) {
					$(".city-chck-cnt").show();
				} else {
						$(".city-chck-cnt").hide();
				}

				$("#cityCount").html(cnt);										
			});

		}

		private displayCityCheckins() {
			var prms = this.getBaseQuery();

			if (prms === null) {
				return;
			}

			prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateFrom)]);
			prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateTo)]);
				
			ViewBase.currentView.apiGet("CheckinCity", prms, (cs) => {					

					var fc = _.reject(cs, (c) => { return c.userId === ViewBase.currentUserId });

					this.cityFncs.genCheckinsList(fc);
					
					this.mapCheckins.genCheckins(fc, CheckinType.City);
			});
		}

		private getBoundsQuery() {

				if (!this.currentBounds) {
						return null;
				}

					var prms = [
							["latSouth", this.currentBounds._southWest.lat],
							["lngWest", this.currentBounds._southWest.lng],
							["latNorth", this.currentBounds._northEast.lat],
							["lngEast", this.currentBounds._northEast.lng]							
					];
				return prms;
			}

		private getBaseQuery() {
			if (!this.currentBounds) {
				return null;
			}

			var prms = this.getBoundsQuery();
				
			prms.push(["type", "query"]);
			prms.push(["filter", this.filter.selectedFilter]);
			
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
					this.cityCheckinsCnt();					
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

		private mapCenter;

		private createMap() {

			this.travelMap = new TravelB.TravelBMap();

			this.travelMap.onMapCreated = (mapObj) => this.onMapCreated(mapObj);

			this.travelMap.onCenterChanged = (c) => {
					this.mapCenter = c;
					this.refreshMap();
			}

			this.travelMap.create("map");
		}

		public refreshMap() {
				var bounds = this.travelMap.mapObj.getBounds();
				this.onMapCenterChanged(this.mapCenter, bounds);
		}

		private onMapCreated(mapObj) {
			this.mapObj = mapObj;
			this.mapCheckins = new TravelB.MapCheckins(this, mapObj);

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

			var $sc = $("#searchCity");
			this.initPlaceDD("2", $sc);
			$sc.change((e, p, c) => {
				this.setPlaceCenter(c.Coordinates.Lat, c.Coordinates.Lng);
			});
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
					var utc = Date.UTC(date.Year, date.Month - 1, date.Day);
					var d = moment.utc(utc).format("L");
				return d;
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