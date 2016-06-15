module Views {
	export class TravelBView extends ViewBase {
			
		private travelMap: TravelBMap;

		private hereAndNowTemplate;

		constructor() {
			super();

			this.regEvents();

			this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");

			this.switchTab(0);

			var status = new Status();
		  status.refresh();
		}

		private regEvents() {
			$("#checkin").click((e) => {
				e.preventDefault();

				var win = new CheckinWin();
				win.showCheckinWin(false);
			});

		}

		private switchTab(tab) {
			var $tabCont = $("#mainCont");
			this.travelMap = new TravelBMap();

			if (tab === 0) {
				var users = null;

				var $html = $(this.hereAndNowTemplate());
				$tabCont.html($html);
					
				this.travelMap.onMapCreated = (mapObj) => {

						users = new TravelBUsers(mapObj);
						users.onCheckinsChanged = (checkins) => {
								var tabClass = new HereAndNowTab($html);

								if (tabClass.currentTab === "checkins") {
										tabClass.genPeopleList(checkins);
								}
						}

				}
				
				this.travelMap.onCenterChanged = (c) => {
					if (users) {
						users.getCheckins(c);
					}
				}

				this.travelMap.create("map");

			}

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

	export class Status {

		private template;

		constructor() {
			this.template = ViewBase.currentView.registerTemplate("status-template");
		}

		public refresh() {
			var $cont = $("#statusCont");

			ViewBase.currentView.apiGet("TravelBCheckin", [["me", "true"]], (r) => {

					if (!r) {
						$cont.html("No status");
					}

				var context = {
					placeName: r.waitingAtText,
					wantMeetName: TravelBView.getGenderStr(r.wantMeet),
					wantDoName: TravelBView.getActivityStr(r.wantDo)
				}

				var $html = $(this.template(context));
				$html.click((e) => {
					e.preventDefault();
					this.editClick();
				});
				$cont.html($html);

			});
		}

		private editClick() {
				var win = new CheckinWin();
				win.showCheckinWin(false);
		}
	}

	export class HereAndNowTab {

			public currentTab = "checkins";

		private $listCont;
		private userTemplate;

		constructor($html) {

				this.userTemplate = ViewBase.currentView.registerTemplate("checkinUserItem-template");

			var btnPeople = $html.find("#tabPeopleBtn");
			var btnPoints = $html.find("#tabPointsBtn");

			btnPeople.click((e) => {
				e.preventDefault();
				this.tabClicked("checkins");
			});

			btnPoints.click((e) => {
				e.preventDefault();
				this.tabClicked("points");
			});

			this.$listCont = $html.find(".listCont");
		}

		private tabClicked(type) {

			this.currentTab = type;

			if (type === "checkins") {
					//this.genPeopleList();
			}

			if (type === "points") {

			}

		}

		public genPeopleList(checkins) {

			this.$listCont.html("");

			var d = new Date();
			var curYear = d.getFullYear();

			checkins.forEach((p) => {

				var context = {
					name: p.displayName,
					age: curYear - p.birthYear,
					waitingFor: TravelBView.getGenderStr(p.wantMeet),
					wants: TravelBView.getActivityStr(p.wantDo)
				}

				var $u = $(this.userTemplate(context));
				this.$listCont.append($u);
			});


		}
			
	}

	export class TravelBUsers {

			public checkins;
			public onCheckinsChanged: Function;

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

						if (this.onCheckinsChanged) {
							this.onCheckinsChanged(r);
						}

						this.genCheckins(r);
						this.checkins = r;
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
				var coord = u.waitingCoord;
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

			private $html;

			private nowTab = "nowTab";
			private futureTab = "futureTab";

			//private checkinWindowT;
			private checkinWindowDialog;
			private ddReg;

			private wpCombo;
			private wcCombo;
			private activeTab = this.nowTab;

			constructor() {					
					this.registerTemplates();
					this.ddReg = new Common.DropDown();
			}

		public showCheckinWin(isNew: boolean) {

			this.$html = $(this.checkinWindowDialog());

			$("body").append(this.$html);
			this.$html.fadeIn();

			var $cont = $("#checkinWinCont");

			this.ddReg.registerDropDown(this.$html.find("#fromAge"));
			this.ddReg.registerDropDown(this.$html.find("#toAge"));

			this.$html.find("#nowTabBtn").click((e) => {
				e.preventDefault();
				this.switchCheckinTabs(this.nowTab);
			});
			this.$html.find("#futureTabBtn").click((e) => {
				e.preventDefault();
				this.switchCheckinTabs(this.futureTab);
			});

			this.wpCombo = this.initPlaceDD("1,0,4", this.$html.find("#waitingPlace"));
			this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));

			this.$html.find("#submitCheckin").click((e) => {
				e.preventDefault();
				this.callServer();
			});

			this.$html.find(".cancel").click((e) => {
					e.preventDefault();
					this.$html.fadeOut();
			});

			$cont.html(this.$html);
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
				var status = new Status();
				status.refresh();
				this.$html.fadeOut();
			});
			
		}

		private registerTemplates() {
				this.checkinWindowDialog = ViewBase.currentView.registerTemplate("checkinDialog-template");
				
				//this.checkinWindowT = ViewBase.currentView.registerTemplate("checkinWindow-template");				
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