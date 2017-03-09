module Planning {


		export class DealsInitSettings {

				public onThirdStep: Function;

				private airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
				private $airportsCont;
				private kmRangeSelected = 200;

				private $stepOne = $(".step-one");
				private $stepTwo = $(".step-two");
				private $stepThree = $(".step-three");

				public get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				private locDlg: LocationSettingsDialog;

				constructor(locDlg: LocationSettingsDialog) {
					this.locDlg = locDlg;
				}


			public init(hasCity, hasCountry) {

				this.setForm(hasCity, hasCountry, false);

				Views.AirLoc.registerLocationCombo($("#wizCurrentCity"), (place) => {
						this.locDlg.updateLoc(place.City, place.CountryCode);
						this.setForm(true, false, false);

						this.getAirs((as) => {
								this.genAirs(as);								
						});

				});

				this.regNextBtns();

				this.initAirports();
			}

			private setForm(hasCity, hasAirs, anyItems) {
						$(".labels .label").removeClass("active");
						$(".step").addClass("hidden");

					  var num;
						if (!hasCity) {
							 num = "one";
						} else if (!hasAirs) {
								num = "two";								
						} else if (!anyItems) {
								num = "three";
						}

						$(`.step-${num}`).removeClass("hidden");
						$(`.label-${num}`).addClass("active");
					
						this.locDlg.showTop(hasCity && hasAirs);				
						this.locDlg.showRatingFilter(hasCity && hasAirs);		
			}

				private regNextBtns() {
						$("#stepTwoNext").click((e) => {
							e.preventDefault();
							this.setForm(true, true, false);

							this.onThirdStep();
						});

						$("#stepThreeClose").click((e) => {
								e.preventDefault();
							$(".deals-block-all").remove();
						});
				}
				
				private getAirs(callback: Function) {
					this.v.apiGet("airportRange", null, (as) => {							
						  callback(as);
					});
				}

				private genAirs(as) {
						this.locDlg.generateAirports(as);

						var lg = Common.ListGenerator.init($("#wizAirCont"), "wiz-air-item");
					  lg.clearCont = true;
					  lg.evnt(".delete", (e, $item, $target, item) => {
								var data = [["id", item.origId]];
								Views.ViewBase.currentView.apiDelete("AirportRange", data, () => {

									this.getAirs((ass) => {
											this.genAirs(ass);
									});
										
								});
						});

						lg.generateList(as);
				}
				
				private initAirports() {
						var ac = new Trip.AirportCombo("wizAirCombo", { clearAfterSelection: true });
						ac.onSelected = (e) => {

								var data = { airportId: e.id };
								this.v.apiPost("airportRange", data, (a) => {

										this.getAirs((ass) => {
												this.genAirs(ass);
										});

								});

						}
				}
		}

	export class LocationSettingsDialog {
			
		private airTemplate;
		private contTmp;

		private $airportsCont;
		private $airContS;

		private kmRangeSelected = 200;

		private dialog: Common.CustomDialog;

		private v: Views.DealsView;

		constructor(v: Views.DealsView) {
			this.v = v;
			this.airTemplate = this.v.registerTemplate("homeAirportItem-template");
			this.contTmp = this.v.registerTemplate("loc-dlg-tmp");
		}

		public initTopBar(hasCity, hasAirs) {
			this.$airContS = $(".top-all .airports");
			this.loadMgmtAirports();

			this.showTop(hasCity && hasAirs);
		}

			public showTop(show) {
					$(".top-all").toggleClass("hidden", !show);
		}

			public showRatingFilter(show) {
					$(".rating-filter").toggleClass("hidden", !show);
			}

		public initDlg() {

			  var $tmp = this.contTmp();

				this.dialog = new Common.CustomDialog();
				this.dialog.init($tmp, this.v.t("AirsAndLocationSettings", "jsDeals"), "air-dlg");
				this.dialog.addBtn("Close", "green-orange", () => {
						this.v.allSections.forEach((s) => {
							s.resultsEngine.refresh();
						});
						this.dialog.close();
					});
				
				Views.AirLoc.registerLocationCombo($("#currentCity"), (place) => {
						this.updateLoc(place.City, place.CountryCode);
				});

				this.regRangeCombo();

				this.$airportsCont = $("#airportsCont");
				

				this.initAirports();
				this.loadMgmtAirports();
				
				$("#airClose").click((e) => {
						e.preventDefault();
						$(".location-dialog").addClass("hidden");
						this.hideRefresh();
				});
				
				this.hideRefresh();
			}

		

			public updateLoc(city, cc) {
					$("#rangeBlock").removeClass("hidden");
					$(".home-location-name").html(`${city}, (${cc})`);
			} 

		private hideRefresh() {
					$(".refresh-line").addClass("hidden");
			}

		private changed() {			
				if (this.hasAirports()) {
					$(".no-airs-info").hide();
				}
		}

		private loadMgmtAirports() {
			this.v.apiGet("airportRange", null, (as) => {
				this.generateAirports(as);
			});
		}

		private initAirports() {				
			var ac = new Trip.AirportCombo("airportCombo", { clearAfterSelection: true });
			ac.onSelected = (e) => {

				var data = { airportId: e.id };
				this.v.apiPost("airportRange", data, (a) => {
						this.genAirport(a);
						this.genAirportS(a.airCode);
						this.changed();
				});

			}				
		}

			public hasAirports() {
				return $("#airportsCont").find(".airport").length > 0;
			}

		private regRangeCombo() {
			var $dd = $("#airportsRange");
			Common.DropDown.registerDropDown($dd);
			$dd.change((e) => {
				var kms = parseInt($dd.find("input").val());
				this.kmRangeSelected = kms;
			});

			$("#addAirsRange").click((e) => {
					e.preventDefault();
					this.callAirportsByRange();
				});

		}

		private callAirportsByRange() {
			var data = { distance: this.kmRangeSelected };
			this.v.apiPut("AirportRange", data, (airports) => {
					this.generateAirports(airports);
				  this.changed();
			});
		}
			                                                                                                                                                                                            
		public generateAirports(airports) {

			if (this.$airportsCont) {
				this.$airportsCont.find(".airport").remove();
			}

			this.$airContS.empty();

			airports.forEach((a) => {
					this.genAirport(a);
					this.genAirportS(a.airCode);
			});
		}

		private genAirportS(code) {
			var $h = $(`<span id="s_${code}" class="airport">${code}</span>`);
			this.$airContS.append($h);
		}

		private genAirport(a) {
				if (!this.$airportsCont) {
						return;
				}

			var context = {
				id: a.origId,
				city: a.city,
				airCode: a.airCode,
				airName: a.airName
			};

			var $html = $(this.airTemplate(context));
			
			$html.find(".delete").click((e) => {
				var $c = $(e.target).parent();
				var id = $c.attr("id");
				var code = $c.data("code");
				var data = [["id", id]];
				Views.ViewBase.currentView.apiDelete("AirportRange", data, (as) => {
						$(`#${id}`).remove();
						$(`#s_${code}`).remove();
					this.changed();
				});
			});

			this.$airportsCont.prepend($html);
		}

	}
}