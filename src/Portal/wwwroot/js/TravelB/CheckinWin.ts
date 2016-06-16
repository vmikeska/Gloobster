module TravelB {

	export class TravelBUtils {
			public static waitingMins(waitingUntil) {
					var now = new Date();
					var untilDate = new Date(waitingUntil);
					var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
					var untilUtc = new Date(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate(), untilDate.getUTCHours(), untilDate.getUTCMinutes(), untilDate.getUTCSeconds());
					var dd = Math.abs(nowUtc.getTime() - untilUtc.getTime());
					var diffMins = Math.ceil(dd / (1000 * 60));
					return diffMins;
			}		
	}

	export class CheckinWin {

		private $html;

		private nowTabConst = "nowTab";
		private futureTabConst = "futureTab";


		private checkinWindowDialog;
		private dlgNow;
		private dlgCity;
		private ddReg;

		private wpCombo;
		private wcCombo;

		private tabs: Tabs;

		constructor() {
			this.registerTemplates();
			this.ddReg = new Common.DropDown();
		}

		//public createTab($html) {
		//		this.tabs = new Tabs($html.find("#checkDlgTab"), "placeType", 40);

		//		this.tabs.onBeforeSwitch = () => {
		//				$(`#${this.nowTabConst}`).hide();
		//				$(`#${this.futureTabConst}`).hide();
		//		}

		//		this.tabs.addTab(this.nowTabConst, "Checkin now", () => {
		//				$(`#${this.nowTabConst}`).show();
		//		});
		//		this.tabs.addTab(this.futureTabConst, "Checkin future", () => {
		//				$(`#${this.futureTabConst}`).show();
		//		});
		//		this.tabs.create();
		//}

		private createWin(edit: boolean) {
			var btnTxt = edit ? "Update checkin" : "Checkin";
			var context = { sumbitText: btnTxt };

			this.$html = $(this.checkinWindowDialog(context));

			//this.createTab(this.$html);

			$("body").append(this.$html);
			this.$html.fadeIn();

			this.ddReg.registerDropDown(this.$html.find("#fromAge"));
			this.ddReg.registerDropDown(this.$html.find("#toAge"));
				
			this.$html.find("#submitCheckin").click((e) => {
				e.preventDefault();
				this.callNow();
			});

			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				this.$html.fadeOut();
				this.$html.remove();
			});

			this.fillAgeCombo("fromAge");
			this.fillAgeCombo("toAge");
		}

		private createWinNow() {
			var $d = $(this.dlgNow());

			this.$html.find("#dlgSpec").html($d);
			this.wpCombo = this.initPlaceDD("1,0,4", this.$html.find("#waitingPlace"));
		}

			private createWinCity() {
					this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));
			}

		public showNowCheckin() {

			Views.ViewBase.currentView.apiGet("CheckinNow", [["me", "true"]], (r) => {

				var hasStatus = r !== null;

				this.createWin(hasStatus);
				this.createWinNow();

				if (hasStatus) {

					this.selectRadio("wantDo", r.wantDo);
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

				}

			});
		}

		private setCombo($combo, value) {
			$combo.find("input").val(value);
			$combo.find("span").html(value);
		}

		private selectRadio(group, val) {
			$(`input[name=${group}][value=${val}]`).prop('checked', true);
		}

		private fillAgeCombo(id) {
			var $ul = $(`#${id}`).find("ul");;
			var ageStart = 18;
			var ageEnd = 70;
			for (var act = ageStart; act <= ageEnd; act++) {
				$ul.append(`<li data-value="${act}">${act}</li>`);
			}
		}

		private getRequestObj() {
				var data = {
						wantDo: $('input[name=wantDo]:checked').val(),
						wantMeet: $('input[name=wantMeet]:checked').val(),
						multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
						fromAge: $("#fromAge input").val(),
						toAge: $("#toAge input").val(),

						minsWaiting: $("#minsWaiting").val(),

						fromDate: $("#fromDate").val(),
						toDate: $("#toDate").val()						
				};
			return data;
		}



		private callNow() {

				var data = this.getRequestObj();
				data = $.extend(data, {
						waitingAtId: this.wpCombo.sourceId,
						waitingAtType: this.wpCombo.sourceType,
						waitingAtText: this.wpCombo.lastText,
						waitingCoord: this.wpCombo.coord
			});
	
			Views.ViewBase.currentView.apiPost("CheckinNow", data, (r) => {
				this.refreshStat();
			});
				
		}

			private callCity() {
					var data = this.getRequestObj();
					data = $.extend(data, {
							waitingAtId: this.wcCombo.sourceId,
							waitingAtType: this.wcCombo.sourceType,
							waitingAtText: this.wcCombo.lastText,
							waitingCoord: this.wcCombo.coord
					});

					Views.ViewBase.currentView.apiPost("CheckinCity", data, (r) => {
							
					});
			}

	private refreshStat() {
			var status = new Status();
			status.refresh();
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
			return combo;
		}
			

	}
}