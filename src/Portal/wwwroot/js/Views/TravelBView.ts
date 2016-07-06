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
		private chat: Chat;

		constructor() {
			super();

			this.regEvents();

			this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");

			this.createMainTab();

			this.createMap();

			this.initFilter();
			this.initFilterDates();

			var status = new TravelB.Status();
			status.refresh();

			this.reacts = new CheckinReacts();
			this.reacts.refreshReacts();

			this.chat = new Chat();
			this.chat.createAll();
		}
			
		private createMainTab() {
			this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);
			var filterDateCont = $("#filterDateCont");

			this.tabs.onBeforeSwitch = () => {
				$("#theCont").html("");
			}

			this.tabs.addTab(this.nowTabConst, "Here and now", () => {
				this.createCheckinsFnc();
				filterDateCont.hide();
			});
			this.tabs.addTab(this.cityTabConst, "Check to a city", () => {
				this.createCityCheckinsFnc();
				filterDateCont.show();
			});
			this.tabs.create();
		}

		private initFilterDates() {
			var fromDate = TravelB.DateUtils.jsDateToMyDate(new Date());
			var toDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 30));
			this.filterDateFrom = fromDate;
			this.filterDateTo = toDate;

			TravelB.DateUtils.initDatePicker($("#fromDateFilter"), fromDate, (d) => {
				this.filterDateFrom = d;
				this.displayData();
			});

			TravelB.DateUtils.initDatePicker($("#toDateFilter"), toDate, (d) => {
				this.filterDateTo = d;
				this.displayData();
			});
		}

		private initFilter() {
			var items = TravelB.TravelBUtils.wantDoDB();

			var $c = $("#filterCont");
			var $ac = $("#allCheckins");

			items.forEach((i) => {
				var $h = $(`<input id="f_${i.id}" type="checkbox" /><label for="f_${i.id}">${i.text}</label>`);
				$c.append($h);
			});

			$(".filter").find("input").click((e) => {
				var $t = $(e.target);
				var id = $t.attr("id");

				if (id === "allCheckins") {
					if ($ac.prop("checked") === true) {
						$("#filterCont").find("input").prop("checked", false);
						this.onFilterChanged(["all"]);
					} else {
						this.onFilterChanged(null);
					}
				} else if (id.startsWith("f_")) {
					if ($t.prop("checked") === true) {
						$ac.prop("checked", false);
					}

					var selVals = [];
					$c.find("input").each((i, c) => {
						var $c = $(c);
						if ($c.prop("checked")) {
							var id = $c.attr("id");
							var val = id.split("_")[1];
							selVals.push(val);
						}
					});
					this.onFilterChanged(selVals);

				}

			});
		}

		public selectedFilter = null;
		public filterDateFrom;
		public filterDateTo;

		private onFilterChanged(filter) {
			this.selectedFilter = filter;
			this.displayData();
		}

		private createCityCheckinsFnc() {
			this.cityFncs = new TravelB.CityTab();

			this.displayCityCheckins();
		}

		private createCheckinsFnc() {
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

				var win = new TravelB.CheckinWin();

				if (this.tabs.activeTabId === this.nowTabConst) {
					win.showNowCheckin();
				} else {
					win.showCityCheckin(null);
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
				this.mapCheckins.genCheckins(fc);
			});
		}

		private displayCityCheckins() {
			var prms = this.getBaseQuery();

			if (prms === null) {
				return;
			}

			prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filterDateFrom)]);
			prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filterDateTo)]);

			ViewBase.currentView.apiGet("CheckinCity", prms, (checkins) => {
				this.cityFncs.genCheckinsList(checkins);
				this.mapCheckins.genCheckins(checkins);
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
				["lngEast", this.currentBounds._northEast.lng]
			];

			if (this.selectedFilter) {
				prms.push(["filter", this.selectedFilter.join(",")]);
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
		}

		private onMapCenterChanged(c, bounds) {
				this.currentBounds = bounds;
				this.displayData();
		}

		public setPlaceCenter(lat, lng) {
			this.travelMap.mapObj.setView([lat, lng], 9);
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

					return "All";
			}
	}
}