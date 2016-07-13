module Views {

	export class EmptyProps {

		private formTemp;
		private setTemp;
		private $table;
		private $cont;

		constructor() {
			this.formTemp = Views.ViewBase.currentView.registerTemplate("settings-template");
			this.setTemp = Views.ViewBase.currentView.registerTemplate("settingsStat-template");
		}

		public generateProps(props) {

				this.$cont = $("#reqPropCont");
				
			var $form = $(this.formTemp());

			this.$table = $form.find("table");

			this.appSignals(this.$table);

			this.$cont.html($form);

				if (props.length > 0) {
						this.$cont.show();
				}

			props.forEach((prop) => {
				this.visible(prop, $form);

				if (prop === "HasProfileImage") {
						SettingsUtils.registerAvatarFileUpload("avatarFile", () => {
								this.validate(true, "HasProfileImage");
						});
				}

				if (prop === "FirstName") {
					SettingsUtils.registerEdit("firstName", "FirstName",
					(value) => {
						this.validate((value.length > 0), "FirstName");

						return { name: value };
					});
				}

				if (prop === "LastName") {
					SettingsUtils.registerEdit("lastName", "LastName",
					(value) => {
						this.validate((value.length > 0), "LastName");

						return { name: value };
					});
				}

				if (prop === "BirthYear") {
					SettingsUtils.registerEdit("birthYear", "BirthYear",
					(value) => {
						this.validate((value.length === 4), "BirthYear");

						return { year: value };
					});
				}

				if (prop === "Gender") {
					SettingsUtils.registerCombo("gender", (val) => {
						this.validate((val !== Gender.N), "Gender");

						return { propertyName: "Gender", values: { gender: val } };
					});
					Common.DropDown.registerDropDown($("#gender"));
				}

				if (prop === "FamilyStatus") {
					SettingsUtils.registerCombo("familyStatus", (val) => {
						this.validate((val !== 0), "FamilyStatus");

						return { propertyName: "FamilyStatus", values: { status: val } };
					});
					Common.DropDown.registerDropDown($("#familyStatus"));
				}

				if (prop === "HomeLocation") {
					SettingsUtils.registerLocationCombo("homeCity", "HomeLocation", () => {
						this.validate(true, "HomeLocation");
					});
				}

				if (prop === "Languages") {
					var tl = SettingsUtils.initLangsTagger([]);
					tl.onChange = (items) => {
						this.validate(items.length > 0, "Languages");
					}
				}

				if (prop === "Interests") {
					var ti = SettingsUtils.initInterestsTagger([]);
					ti.onChange = (items) => {
						this.validate(items.length > 0, "Interests");
					}
				}

			});
		}

		private validate(res, name) {
			if (res) {
				this.okStat(name);
			} else {
				this.koStat(name);
			}
		}

		private okStat(name) {
			var $tr = $(`#tr${name}`);
			var $stat = $tr.find(".stat");
			$stat.attr("src", "../images/tb/ok.png");
			$tr.find(".close").show();

			if (this.$table.find("tr").length === 0) {
				this.$cont.hide();
			}
		}

		private koStat(name) {
			var $tr = $(`#tr${name}`);
			var $stat = $tr.find(".stat");
			$stat.attr("src", "../images/tb/ko.png");
			$tr.find(".close").hide();
		}

		private appSignals($table) {
			var trs = $table.find("tr").toArray();
			trs.forEach((tr) => {

				var $tr = $(tr);
				var $stat = $(this.setTemp());
				$tr.append($stat);
				$tr.find(".close").click((e) => {
					e.preventDefault();
					$tr.remove();
				});

			});
		}

		private visible(name, $form) {
			var tr = $form.find(`#tr${name}`);
			tr.show();
		}
	}

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

		private props: EmptyProps;

		public filter: TravelB.Filter;
		public defaultLangs;

		public emptyProps = [];

		public init() {
			
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

			this.props = new EmptyProps();
			this.props.generateProps(this.emptyProps);
		}
			
		private createMainTab() {
			this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);
			
			this.tabs.onBeforeSwitch = () => {
				$("#theCont").html("");
			}

			this.tabs.addTab(this.nowTabConst, "Here and now", () => {
				this.createNowCheckinsFnc();				
			});
			this.tabs.addTab(this.cityTabConst, "Check to a city", () => {
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

			prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateFrom)]);
			prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateTo)]);
				
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