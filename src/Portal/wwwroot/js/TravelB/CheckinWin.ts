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

			var btnTxt = isNew ? "Checkin" : "Update checkin";

			var context = { sumbitText: btnTxt };

			this.$html = $(this.checkinWindowDialog(context));

			$("body").append(this.$html);
			this.$html.fadeIn();
				
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
				this.callServer(isNew);
			});

			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				this.$html.fadeOut();
				this.$html.remove();
			});

			this.fillAgeCombo("fromAge");
			this.fillAgeCombo("toAge");


			if (!isNew) {
				Views.ViewBase.currentView.apiGet("TravelBCheckin", [["me", "true"]], (r) => {

					this.selectRadio("wantDo", r.wantDo);
					this.selectRadio("wantMeet", r.wantMeet);

					$("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);

					var combo = null;

					//todo: init tab switch
					if (r.checkinType === 0) {
						combo = this.wpCombo;
							
						var diffMins = TravelBUtils.waitingMins(r.waitingUntil);
						this.$html.find("#minsWaiting").val(diffMins);
					}
					if (r.checkinType === 1) {
						combo = this.wcCombo;
					}

					this.setCombo(this.$html.find("#fromAge"), r.fromAge);
					this.setCombo(this.$html.find("#toAge"), r.toAge);

					combo.initValues({
						sourceId: r.waitingAtId,
						sourceType: r.waitingAtType,
						lastText: r.waitingAtText,
						coord: r.waitingCoord
					});

				});
			}

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

		private callServer(isNew) {

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

			if (isNew) {
				Views.ViewBase.currentView.apiPost("TravelBCheckin", data, (r) => {
					this.refreshStat();
				});
			} else {
				Views.ViewBase.currentView.apiPut("TravelBCheckin", data, (r) => {
					this.refreshStat();
				});
			}
				
		}

		private refreshStat() {
			var status = new Status();
			status.refresh();
			this.$html.fadeOut();
			this.$html.remove();
		}

		private registerTemplates() {
			this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");

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