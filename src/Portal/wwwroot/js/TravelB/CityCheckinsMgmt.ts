module TravelB {

		export class CityCheckinsMgmt {

				private view: Views.TravelBView;

				private itemTmp = Views.ViewBase.currentView.registerTemplate("city-checkin-mgmt-item-template");
				private $wcont = $(".checkin-win .cont");
				
				constructor(view: Views.TravelBView) {
						this.view = view;
					
				}
				
				public genCheckins(callback) {
						this.$wcont.empty();

						Views.ViewBase.currentView.apiGet("CheckinCity", [["type", "my"]], (cs) => {

							cs.forEach((c) => {

									var context = {
										id: c.id,
										cityName: c.waitingAtText,
										fromDate: moment.utc(c.fromDate).format("L"),
										toDate: moment.utc(c.toDate).format("L"), 

										fromAge: c.fromAge,
										toAge: c.toAge,

										wmMan: ((c.wantMeet === WantMeet.Man) || (c.wantMeet === WantMeet.All)),
										wmWoman: ((c.wantMeet === WantMeet.Woman) || (c.wantMeet === WantMeet.All)),
										wmWomanGroup: ((c.wantMeet === WantMeet.Woman) && c.multiPeopleAllowed),
										wmManGroup: ((c.wantMeet === WantMeet.Man) && c.multiPeopleAllowed),
										wmMixGroup: ((c.wantMeet === WantMeet.All) && c.multiPeopleAllowed),

										wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),

										message: c.message
								};

									var $item = $(this.itemTmp(context));

								$item.find(".edit").click((e) => {
										e.preventDefault();

										var id = this.getId(e);
										this.edit(id);
									});

								$item.find(".delete").click((e) => {
										e.preventDefault();

										var id = this.getId(e);
										this.delete(id, $item);
								});
									
								this.$wcont.append($item);
								});

								callback();
						});						
				}

				private edit(id) {
						this.view.checkinMenu.activateTab("check", id);
				}

				private delete(id, $item) {

						var cd = new Common.ConfirmDialog();
						cd.create("Checkin deletion", "Do you want to delete this checkin ?", "Cancel", "Delete", () => {

								Views.ViewBase.currentView.apiDelete("CheckinCity",[["id", id]], () => {
										$item.remove();
										cd.hide();
								});
								
						});
				}

				private getId(e) {
						var $t = $(e.target);
						var $r = $t.closest(".checkin-mgmt-item");
						var id = $r.data("id");
						return id;
				}

		}
}