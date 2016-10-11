module TravelB {
	
	export class CheckinWin {

		private $html;

		private nowTabConst = "nowTab";
		private futureTabConst = "futureTab";


		private checkinWindowDialog;
		private dlgNow;
		private dlgCity;		

		public wpCombo: Common.PlaceSearchBox;
		private wcCombo: Common.PlaceSearchBox;

		private tabs: Tabs;
		private wantDos: CategoryTagger;

			private $win;

		constructor() {
			this.registerTemplates();
			this.$win = $(".checkin-win");
		}

		public showCityCheckin(editId) {

			var isEdit = (editId != null);
			if (isEdit) {

			}

			this.createWin(isEdit, CheckinType.City);
			this.createWinCity();
		}
			
		public showNowCheckin(callback = null) {

			Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], (r) => {

				var hasStatus = r !== null;

				this.createWin(hasStatus, CheckinType.Now);
				this.createWinNow();

				if (hasStatus) {

					this.wantDos.initData(r.wantDo);
						
					this.selectRadio("wantMeet", r.wantMeet);

					$("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);

					var diffMins = TravelBUtils.waitingMins(r.waitingUntil);
					this.$html.find("#minsWaiting").val(diffMins);

					this.setCombo(this.$html.find("#fromAge"), r.fromAge);
					this.setCombo(this.$html.find("#toAge"), r.toAge);

					this.wpCombo.initValues({
						sourceId: r.waitingAtId,
						sourceType: r.waitingAtType,
						lastText: r.waitingAtText,
						coord: r.waitingCoord
					});
						
					this.$html.find("#chckMsg").val(r.message);
				}

				if (callback) {
					callback();
				}

			});
		}

		private initWantDo() {
			var $c = this.$html.find("#wantDoCont");

			this.wantDos = new CategoryTagger();
			var data = TravelBUtils.getWantDoTaggerData();
			this.wantDos.create($c, "checkin", data, "Pick activities you'd like to do");
		}

		private createWin(edit: boolean, type: CheckinType) {
			
			var btnTxt = edit ? "Update checkin" : "Checkin";
			var context = { sumbitText: btnTxt };

			this.$html = $(this.checkinWindowDialog(context));
				
			this.$win.html(this.$html);
			this.$win.slideDown();

			this.initWantDo();

			Common.DropDown.registerDropDown(this.$html.find("#fromAge"));
			Common.DropDown.registerDropDown(this.$html.find("#toAge"));

			this.$html.find("#submitCheckin").click((e) => {
				e.preventDefault();
				if (type === CheckinType.Now) {
					this.callNow();
				}
				if (type === CheckinType.City) {
					this.callCity();
				}
			});

			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				this.$win.slideUp(() => {
						this.$win.empty();
				});				
			});				
		}

		private createWinNow() {
			var $d = $(this.dlgNow());
			this.$html.find("#dlgSpec").html($d);
				
			this.wpCombo = this.initPlaceDD("1,4", this.$html.find("#waitingPlace"));

			Common.DropDown.registerDropDown(this.$html.find("#minsWaiting"));
		}

		private createWinCity() {
			var $d = $(this.dlgCity());
			this.$html.find("#dlgSpec").html($d);

			this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));

			var fromDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 2));
			var toDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 5));
				
			DateUtils.initDatePicker(this.$html.find("#fromDate"), fromDate);
			DateUtils.initDatePicker(this.$html.find("#toDate"), toDate);
		}

		private setCombo($combo, value) {
			$combo.find("input").val(value);
			$combo.find("span").html(value);
		}

		private selectRadio(group, val) {
			this.$html.find(`input[name=${group}][value=${val}]`).prop("checked", true);
		}
			
		private getRequestObj() {
			var data = {
				wantDo: this.getWantDos(),
				wantMeet: $('input[name=wantMeet]:checked').val(),
				multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
				fromAge: $("#fromAge input").val(),
				toAge: $("#toAge input").val(),
				message: $("#chckMsg").val()
			};
			return data;
		}

		private getWantDos() {
			//var res = [];
			//var items = $("#wantDoCont").children().toArray();
			//items.forEach((i) => {
			//	var $i = $(i);
			//	if ($i.prop("checked")) {
			//		var id = $i.attr("id");
			//		var val = id.split("_")[1];
			//		res.push(val);
			//	}
			//});
			var res = this.wantDos.getSelectedIds();
			return res;
		}


		private callNow() {

			var data = this.getRequestObj();
			data = $.extend(data, {
				waitingAtId: this.wpCombo.sourceId,
				waitingAtType: this.wpCombo.sourceType,
				waitingAtText: this.wpCombo.lastText,
				waitingCoord: this.wpCombo.coord,
				minsWaiting: $("#minsWaiting input").val(),
				checkinType: CheckinType.Now
			});

			Views.ViewBase.currentView.apiPost("CheckinNow", data, (r) => {
				this.refreshStat();
				this.closeWin();
			});

		}

		private callCity() {
			var data = this.getRequestObj();
			data = $.extend(data, {
				waitingAtId: this.wcCombo.sourceId,
				waitingAtType: this.wcCombo.sourceType,
				waitingAtText: this.wcCombo.lastText,
				waitingCoord: this.wcCombo.coord,
				fromDate: $("#fromDate").data("myDate"),
				toDate: $("#toDate").data("myDate"),
				checkinType: CheckinType.City
			});

			Views.ViewBase.currentView.apiPost("CheckinCity", data, (r) => {
				this.closeWin();
			});
		}

		private refreshStat() {
			var status = new Status();
			status.refresh();			
		}

		private closeWin() {
			this.$html.fadeOut();
			this.$html.remove();
		}

		private registerTemplates() {
			this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");

			this.dlgNow = Views.ViewBase.currentView.registerTemplate("dlgNow-template");
			this.dlgCity = Views.ViewBase.currentView.registerTemplate("dlgCity-template");
		}

		private initPlaceDD(providers, selObj) {
			var c = new Common.PlaceSearchConfig();
			c.providers = providers;
			c.selOjb = selObj;
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;

			var combo = new Common.PlaceSearchBox(c);

			var loc = UserLocation.currentLocation;
			if (loc) {
					combo.setCoordinates(loc.lat, loc.lng);
			}

			return combo;
		}


	}
}