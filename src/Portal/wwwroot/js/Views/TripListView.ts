module Views {
		export class TripListView extends ViewBase {

				private pictureUpload: Common.FileUpload;

				private listIsBig = true;

				constructor() {
						super();

						var currentWidth = $(window).width();
						if (currentWidth < 640) {
								this.listIsBig = false;
						}

						$(window).resize(() => {

								if (this.listIsBig) {
										var currentWidth = $(window).width();
										if (currentWidth < 640) {
												this.listIsBig = false;

												this.generateList(this.listIsBig);
												this.setActiveSwitch(this.listIsBig);
										}
								}

						});

						this.setActiveSwitch(this.listIsBig);

						this.generateList(this.listIsBig);

						$(".type-switcher").click((e) => {
								e.preventDefault();

								var $t = $(e.target);
								var type = $t.data("type");

								this.listIsBig = type === "grid";

								this.setActiveSwitch(this.listIsBig);

								this.generateList(this.listIsBig);
						});

				}

				private setActiveSwitch(big) {
						$("#bigSwitch").toggleClass("active", big);
						$("#smallSwitch").toggleClass("active", !big);
				}

				private $currentResults = $("#currentResults");
				private $oldResults = $("#oldResults");
				private $resultsCont = $("#resultsCont");
				private $titleOld = $("#titleOld");


				private generateList(listSizeBig) {

						this.$currentResults.empty();
						this.$oldResults.empty();

						this.apiGet("TripList", [], (trips) => {

								var old = _.filter(trips, { isOld: true });
								var current = _.filter(trips, { isOld: false });

								var hasOld = any(old);

								this.$titleOld.toggleClass("hidden", !hasOld);

								if (listSizeBig) {

										if (hasOld) {
												this.generateBigList(old, this.$oldResults, false);
										}

										this.generateBigList(current, this.$currentResults, true);
								} else {
										if (hasOld) {
												this.generateSmallList(old, this.$oldResults, false);
										}

										this.generateSmallList(current, this.$currentResults, true);
								}

						});

						setTimeout(() => {

								$("#newTrip").keypress((e) => {
										if (e.which === 13) {
												e.preventDefault();
												this.createNewTrip();
										}
								});

						}, 100);

				}

				private createMenu($cont, id) {

						$cont.find(".trip-menu").remove();

						var t = this.registerTemplate("trip-menu-template");
						var $t = $(t({ id: id }));

						$cont.append($t);

						$t.find(".menuClose").click((e) => {
								e.preventDefault();
								$t.remove();
						});

						$t.find(".deleteTrip").click((e) => {
								e.preventDefault();

								var dialog = new Common.ConfirmDialog();
								dialog.create(this.t("TripDelTitle", "jsTrip"), this.t("TripDelMessage", "jsTrip"), this.t("Cancel", "jsLayout"), this.t("Ok", "jsLayout"), () => {
										this.apiDelete("Trip", [["id", id]], (r) => {
												$("#popup-delete").hide();
												$(`#${id}`).remove();
										});
								});

						});

						this.registerPhotoUpload(id, $t.find(`input[type="file"]`).attr("id"), this.listIsBig);

				}

				private generateBigList(trips, $cont, addAdd) {

						this.$resultsCont.attr("class", "trips-big");

						var lg = Common.ListGenerator.init($cont, "trip-item-big-template");

						lg.customMapping = (i) => {
								return this.itemMapping(i);
						}

						lg.evnt(".setting", (e, $item, $target, item) => {
								this.createMenu($item, item.id);
						});


						lg.generateList(trips);

						if (addAdd) {
								var newRow = this.registerTemplate("new-trip-big-template");
								var $newRow = $(newRow());
								$cont.append($newRow);
						}

				}

				private generateSmallList(trips, $cont, addAdd) {

						this.$resultsCont.attr("class", "trips-small");

						var tb = this.registerTemplate("table-layout-template");
						var $tb = $(tb());

						$cont.html($tb);

						if (addAdd) {
								var newRow = this.registerTemplate("new-trip-small-template");
								var $newRow = $(newRow());
								$tb.append($newRow);
						}

						var lg = Common.ListGenerator.init($tb, "trip-item-row-template");

						lg.customMapping = (i) => {
								return this.itemMapping(i);
						}

						lg.evnt(".setting", (e, $item, $target, item) => {
								this.createMenu($item.find(".setting-wrap"), item.id);
						});

						lg.onItemAppended = ($item, item) => {
								var lgp = Common.ListGenerator.init($item.find(".participants"), "participant-row-template");
								lgp.generateList(item.participants);
						}

						lg.generateList(trips);
				}

				private itemMapping(i) {

						i.participantsCount = i.participants.length;

						i.imgLink = i.hasSmallPicture ? `/Trip/TripPictureSmall_xs/${i.id}` : "/images/placeholder-70.png";

						i.itemLink = i.isOwner ? `/tripedit/${i.id}` : `/trip/${i.id}`;

						i.fromDateDis = moment(i.fromDate).format("l");
						i.toDateDis = moment(i.toDate).format("l");

						return i;
				}


				public createNewTrip() {
						var tripName = $("#newTrip").val();
						if (tripName === "") {
								return;
						}

						window.location.href = `/Trip/CreateNewTrip/${tripName}`;
				}

				private registerPhotoUpload(tripId, inputId, isBig: boolean) {
						var c = new Common.FileUploadConfig();
						c.inputId = inputId;
						c.endpoint = "TripPhotoSmall";
						c.maxFileSize = 5500000;
						c.useMaxSizeValidation = false;

						var pu = new Common.FileUpload(c);
						pu.customId = tripId;

						var ud = null;

						pu.onProgressChanged = (percent) => {
								if (ud === null) {
										ud = new Common.UploadDialog();
										ud.create();
								}

								ud.update(percent);
						}

						pu.onUploadFinished = (file, files) => {
								$(".trip-menu").hide();

								if (isBig) {
										$(`#tripImg_${tripId}`).attr("src", `/Trip/TripPictureSmall_s/${tripId}?d=${this.makeRandomString(10)}`);
								} else {
										$(`#tripImg_${tripId}`).attr("src", `/Trip/TripPictureSmall_xs/${tripId}?d=${this.makeRandomString(10)}`);
								}


								ud.destroy();
						}
				}
		}
}