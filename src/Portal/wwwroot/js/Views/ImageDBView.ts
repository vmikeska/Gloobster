
module Views {

	export class ImageDbView extends ViewBase {

		public $tabCont;

		public selectedCity: Common.PlaceSearchBox;

		public tabs;

		private cutsDlg = Views.ViewBase.currentView.registerTemplate("cutsDlg-template");

		private searchCityDlg;
		private addPhotoDlg;		
		private cutItemTmp;
		private cutImgListItemTmp;
		private defaultCutImgTmp;

		public newPhotoFnc: NewPhoto;
		public cutsFnc: Cuts;
		public photosFnc: Photos;

		public init() {

			this.newPhotoFnc = new NewPhoto(this);
			this.cutsFnc = new Cuts(this);
			this.photosFnc = new Photos(this);

			var $scdd = $("#selectedCity");

			this.selectedCity = this.regCityCombo($scdd);

			this.$tabCont = $("#tabCont");

			this.tabs = new Tabs($("#naviCont"), "main", 50);
			this.tabs.addTab("CityPhotos", "City photos", () => {

				if (this.selectedCity.sourceId) {
					this.photosFnc.create(this.selectedCity.sourceId);
				} else {
					this.$tabCont.html(`<div class="no-city">No city selected</div>`);
				}

			});
			this.tabs.addTab("AddNewPhoto", "Add new photo", () => {
				this.newPhotoFnc.create();
			});

			this.tabs.addTab("CitiesWithPhotos", "Cities with photos", () => {
					var c = new CitiesWithPhotos(this);
					c.create();
			});

			this.tabs.addTab("CitiesByPop", "Cities by population", () => {
					var c = new CitiesByPopulation(this);
					c.create();
			});

			this.tabs.addTab("CutsMgmt", "Manage cuts (Just Vaclav)", () => {
				this.fillMainContent(this.cutsDlg);
				this.cutsFnc.setCutsDlg();
			});

			this.tabs.create();

		}

		private regCityCombo($scdd) {

			var c = new Common.PlaceSearchConfig();
			c.providers = "2";
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;
			c.selOjb = $scdd;

			var box = new Common.PlaceSearchBox(c);
			$scdd.change((e, a, b) => {
				if (this.tabs.activeTabId === "CityPhotos") {
					this.photosFnc.create(this.selectedCity.sourceId);
				}
			});

			return box;
		}

		public fillMainContent(template) {
			this.$tabCont.empty();

			var $html = $(template());
			this.$tabCont.html($html);
		}

		}
		

		export class CitiesByPopulation {
			private v: ImageDbView;

			private layoutTemplate = Views.ViewBase.currentView.registerTemplate("citiesByPopLayout-template");

			constructor(v) {
					this.v = v;

				this.ac = new AggregatedCountries();
			}

			private ac: AggregatedCountries;

			private citiesByPop;
			private citiesWithPhotos;
			private cities = [];

		  private $cont;

			public create() {

					this.v.$tabCont.html(this.layoutTemplate());

					var $cbByContinent = $("#cbByContinent");
					var $cbByCountry = $("#cbByCountry");
					
					$cbByContinent.change(() => {
							var byCont = $cbByContinent.prop("checked");
							var byCountry = $cbByCountry.prop("checked");

							this.showPreloader(true);
							this.displayData(byCont, byCountry);
							this.regLinkEvent();
					});
					$cbByCountry.change(() => {
							var byCont = $cbByContinent.prop("checked");
							var byCountry = $cbByCountry.prop("checked");

							this.showPreloader(true);
							this.displayData(byCont, byCountry);
							this.regLinkEvent();
					});
					
				this.$cont = this.v.$tabCont.find(".results");

				this.showPreloader(true);

				this.getData((citiesByPop, citiesWithPhotos) => {
					this.citiesByPop = citiesByPop;
					this.citiesWithPhotos = citiesWithPhotos;
						
					this.citiesByPop.forEach((cbp) => {

						var cwp = _.find(this.citiesWithPhotos, (c) => {
							return c.gid === cbp.GID;
						});
							
						var city = $.extend(cbp, { imgs: 0});

						if (cwp) {
							city.imgs = cwp.images.length;
						}

						this.cities.push(city);

					});

					this.displayData(true, true);
					this.regLinkEvent();
				});
			}

			private displayData(byContinent: boolean, byCountry: boolean) {

				this.$cont.empty();

				if (!byContinent && !byCountry) {
					var $t = this.generateCities(this.cities);
					this.$cont.html($t);

					return;
				}

				var countryGroupedArray = [];

				if (byCountry) {
					var countryGrouped = _.groupBy(this.cities, "CountryCode");

					for (var key in countryGrouped) {
						if (countryGrouped.hasOwnProperty(key)) {
							var citiesOfCountry = countryGrouped[key];

							var $h = this.generateCities(citiesOfCountry);

							countryGroupedArray.push({ countryCode: key, $h: $h });
						}
					}
				}

				if (!byContinent) {
					countryGroupedArray.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});
					return;
				}

				if (byCountry && byContinent) {

					var europeCountries = this.coByCont(countryGroupedArray, this.ac.europe);
					var northAmericaCountries = this.coByCont(countryGroupedArray, this.ac.northAmerica);
					var asiaCountries = this.coByCont(countryGroupedArray, this.ac.asia);
					var southAmericaCountries = this.coByCont(countryGroupedArray, this.ac.southAmerica);
					var austrailaCountries = this.coByCont(countryGroupedArray, this.ac.austraila);
					var africaCountries = this.coByCont(countryGroupedArray, this.ac.africa);


					this.$cont.append(`<h1>Europe</h1>`);
					europeCountries.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});

					this.$cont.append(`<h1>North America</h1>`);
					northAmericaCountries.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});

					this.$cont.append(`<h1>Asia</h1>`);
					asiaCountries.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});

					this.$cont.append(`<h1>South America</h1>`);
					southAmericaCountries.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});

					this.$cont.append(`<h1>Australia</h1>`);
					austrailaCountries.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});

					this.$cont.append(`<h1>Africa</h1>`);
					africaCountries.forEach((cga) => {
						this.dispalyCountryGroup(cga);
					});
					return;
				}

				//just by continent


				var europeCities = [];
				var northAmericaCities = [];
				var asiaCities = [];
				var southAmericaCities = [];
				var austrailaCities = [];
				var africaCities = [];

				this.cities.forEach((c) => {

					if (_.contains(this.ac.europe, c.CountryCode)) {
						europeCities.push(c);
					} else if (_.contains(this.ac.northAmerica, c.CountryCode)) {
						northAmericaCities.push(c);
					} else if (_.contains(this.ac.asia, c.CountryCode)) {
						asiaCities.push(c);
					} else if (_.contains(this.ac.southAmerica, c.CountryCode)) {
						southAmericaCities.push(c);
					} else if (_.contains(this.ac.austraila, c.CountryCode)) {
						austrailaCities.push(c);
					} else if (_.contains(this.ac.africa, c.CountryCode)) {
						africaCities.push(c);
					}

				});

				this.$cont.append(`<h1>Europe</h1>`);
				var $eu = this.generateCities(europeCities);
				this.$cont.append($eu);

				this.$cont.append(`<h1>North America</h1>`);
				var $na = this.generateCities(northAmericaCities);
				this.$cont.append($na);

				this.$cont.append(`<h1>Asia</h1>`);
				var $as = this.generateCities(asiaCities);
				this.$cont.append($as);

				this.$cont.append(`<h1>South America</h1>`);
				var $sa = this.generateCities(southAmericaCities);
				this.$cont.append($sa);

				this.$cont.append(`<h1>Australia</h1>`);
				var $au = this.generateCities(austrailaCities);
				this.$cont.append($au);

				this.$cont.append(`<h1>Africa</h1>`);
				var $af = this.generateCities(africaCities);
				this.$cont.append($af);					
			}

				private regLinkEvent() {
						$(".city-link").click((e) => {
								e.preventDefault();
								var $tar = $(e.target);
								var gid = $tar.data("gid");

								this.v.selectedCity.setText($tar.html());
								this.v.selectedCity.sourceId = gid;

								this.v.tabs.activateTab("CityPhotos");

						});
				}

			private coByCont(countryGroupedArray, continentCountryCodes) {
				var res = [];

				countryGroupedArray.forEach((cga) => {
					if (_.contains(continentCountryCodes, cga.countryCode)) {
						res.push(cga);
					}
				});
				return res;
			}

			private dispalyCountryGroup(cga) {
						this.$cont.append(`<h2>${cga.countryCode}</h2>`);
						this.$cont.append(cga.$h);
				}

				private generateCities(cities) {

						cities = _.sortBy(cities, (c) => { return c.Population }).reverse();
						var $t = $(`<table></table>`);

						cities.forEach((c) => {

								var stateClass = (c.imgs > 0) ? "checkmark" : "cross";
								$t.append(`
										<tr>
												<td>
														<a href="#" class="city-link" data-gid="${c.GID}">${c.AsciiName}</a>
												</td>
												<td>${c.Population}</td>
												<td><span class="icon-${stateClass}"></span></td>
										</tr>`);								
						});

					return $t;
				}

				private showPreloader(visible) {
						if (visible) {					
								this.$cont.html(`<div class="preloader-cont"><img src="/images/Preloader_1.gif" /></div>`);
						} else {
								$(".preloader-cont").remove();
						}
				}

				private getCityByPopData(callback) {
						var data = [["mp", "100000"]];
						this.v.apiGet("CityByPop", data, (cities) => {
							callback(cities);
						});
				}

				private getCitiesWithPhotosData(callback) {
						var data = [["query", ""]];						
						this.v.apiGet("imgDbCity", data, (cities) => {
							callback(cities);
						});
				}

				private getData(callback) {
						this.getCityByPopData((citiesByPop) => {
						this.getCitiesWithPhotosData((citiesWithPhotos) => {
								callback(citiesByPop, citiesWithPhotos);
						});
					});
				}
		}

	export class CitiesWithPhotos {
			private v: ImageDbView;

			constructor(v) {
					this.v = v;
			}

			public create() {
				var data = [["query", ""]];

				this.v.$tabCont.empty();

				this.v.apiGet("imgDbCity", data, (cities) => {

					cities.forEach((c) => {
						var $h = $(`<div>${c.name} - ${c.images.length} </div>`);
						this.v.$tabCont.append($h);
					});
						
				});
			}
	}

	export class Photos {
		private v: ImageDbView;

		private defaultCutImgTmp = Views.ViewBase.currentView.registerTemplate("defaultCutImg-template");

		private tabs: Tabs;

		private city;
		private $cont;

		constructor(v) {
			this.v = v;
		}

		public create(gid) {
			if (!gid) {
				return;
			}

			this.v.apiGet("ImgDbCity", [["gid", gid]], (city) => {
				if (city == null) {
						this.v.$tabCont.html(`<div class="no-city">No photos in this city</div>`);
						return;
				}

				this.city = city;
				this.createTabs();
			});
		}

		private showDefaults() {

			this.$cont.empty();

			this.v.apiGet("ImgDbCut", [], (cuts) => {
				cuts.forEach((c) => {

					var context = {
						cutId: c.id,
						cutName: c.name,
						cityId: this.v.selectedCity.sourceId,
						shortName: c.shortName,
						random: this.v.makeRandomString(10)
					};

					var $i = $(this.defaultCutImgTmp(context));
					this.$cont.append($i);
				});
			});
		}

		private createTabs() {

			var $tabCont = $("#tabCont");
			$tabCont.empty();
			$tabCont.append(`<div id="photosTabCont"></div>`);
			$tabCont.append(`<div id="photosCont"></div>`);

			this.$cont = $("#photosCont");

			this.tabs = new Tabs($("#photosTabCont"), "photos", 30);
			this.tabs.addTab("DefaultCuts", "Default cuts", () => {
				this.showDefaults();
			});
			this.tabs.addTab("AllPhotos", "All Photos", () => {
				this.showPhotos();
			});

			this.tabs.create();
		}

		private showPhotos() {

			this.$cont.empty();

			this.city.images.forEach((img) => {
				var $photo = $(`<div class="img" style="background-image:url('/Pic/${img.id}/orig');"><div class="delete">X</div></div>`);

				$photo.find(".delete").click((e) => {
					e.stopPropagation();

					var cd = new Common.ConfirmDialog();
					cd.create("Photo deletion", "Do you want to delete the photo ?", "Cancel", "Delete", () => {

						this.v.apiDelete("ImgDbPhoto", [["cityId", this.city.id], ["imgId", img.id]], () => {
							$photo.remove();
						});

					});

				});

				$photo.click((e) => {
					e.preventDefault();
					this.origPhotoClicked(img.id, this.city.id);
				});

				this.$cont.append($photo);
			});
		}

		public origPhotoClicked(imgId, cityId) {				
				this.$cont.empty();

				this.v.apiGet("ImgDbCut", [], (cuts) => {
						cuts.forEach((cut) => {
								var $c = this.v.cutsFnc.genCutInstance(cut, imgId, cityId);
								this.$cont.append($c);
						});
				});

		}

	}

	export class Cuts {

			private v: ImageDbView;

			private $imgCutCropper;
			
			private cutItemTmp = Views.ViewBase.currentView.registerTemplate("cutItemTmp-template");
			private cutImgListItemTmp = Views.ViewBase.currentView.registerTemplate("cutImgListItemTmp-template");			

			constructor(v) {
					this.v = v;
			}

			public setCutsDlg() {

					$("#btnShowAddCutForm").click((e) => {
							e.preventDefault();
							$("#cutCreateForm").toggle();
					});

					$("#btnCreateCut").click((e) => {
							e.preventDefault();
							this.sendCreateCut();
					});

					this.displayCuts();
			}
			
			private displayCuts() {
					var $l = $("#cutsList");

					$l.empty();

					this.v.apiGet("ImgDbCut", [], (cuts) => {
							cuts.forEach((c) => {
									var $i = $(this.cutItemTmp(c));
									$l.append($i);
							});
					});
			}

			private sendCreateCut() {
					var $f = $("#cutCreateForm");

					var data = {
							name: $f.find("#name").val(),
							shortName: $f.find("#shortName").val(),
							width: $f.find("#width").val(),
							height: $f.find("#height").val()
					};


					var isValid = data.name && data.shortName && data.width && data.height;
					if (!isValid) {
							var iDlg = new Common.InfoDialog();
							iDlg.create("Invalid", "All fields are required");
							return;
					}

					this.v.apiPost("ImgDbCut", data, (r) => {
							this.displayCuts();
					});
			}

			private setCutAsDefault(cityId, photoId, cutId) {

					var data = {
							cityId: cityId,
							photoId: photoId,
							cutId: cutId
					};

					this.v.apiPut("ImgDbDefault", data, () => {

					});

			}

			private setEditCutButtons($cont, edit, save, cancel) {
					var $e = $cont.find(".edit");
					var $s = $cont.find(".save");
					var $c = $cont.find(".cancel");

					$e.toggle(edit);
					$s.toggle(save);
					$c.toggle(cancel);
			}

			private saveNewCut(photoId, cut, cityId) {
					var is = new ImageDb.ImageSender(this.v, "ImgDbPhotoCut", this.$imgCutCropper, () => {
							var d = {
									cutId: cut.id,
									photoId: photoId,
									cutName: cut.shortName
							};
							return d;
					}, () => {
							this.regenCutInstance(cut, photoId, cityId);
					});

					is.send();
			}

			private editCut($c, photoId, cut) {
					var $i = $c.find("img");
					$i.attr("src", `/Pic/${photoId}/orig`);
					$i.css({ "width": "", "height": "", "max-width": "100%" });

					this.$imgCutCropper = $i.cropper({
							aspectRatio: cut.width / cut.height,
							autoCropArea: 1.0,
							cropBoxResizable: false,
							crop: (e) => {
							}
					});
			}

			private regenCutInstance(cut, photoId, cityId) {
					var $newInst = this.genCutInstance(cut, photoId, cityId);
					var $oldInst = $(`#cutInst_${cut.id}`);

					$oldInst.replaceWith($newInst);
			}

			public genCutInstance(cut, imgId, cityId) {
					var context = {
							cutId: cut.id,
							cutName: cut.name,
							id: imgId,
							shortName: cut.shortName,
							width: cut.width,
							height: cut.height,
							random: this.v.makeRandomString(10)
					};

					var $c = $(this.cutImgListItemTmp(context));
					$c.find(".edit").click((e) => {
							e.preventDefault();
							this.setEditCutButtons($c, false, true, true);
							this.editCut($c, imgId, cut);
					});
					$c.find(".save").click((e) => {
							e.preventDefault();
							this.saveNewCut(imgId, cut, cityId);
					});
					$c.find(".cancel").click((e) => {
							e.preventDefault();
							this.regenCutInstance(cut, imgId, cityId);
					});
					$c.find(".default").click((e) => {
							e.preventDefault();
							this.setCutAsDefault(cityId, imgId, cut.id);
					});

					return $c;
			}
	}

	export class NewPhoto {

		private v: ImageDbView;

		private addPhotoDlg = ViewBase.currentView.registerTemplate("addPhotoDlg-template");

		private $currentCropper;

		constructor(v) {
			this.v = v;
		}

		public create() {
				
			var $btn = $(`<div class="new-photo-cont"><input id="filePhoto" type="file" /><label for="filePhoto">Choose a photo</label></div>`);

			$btn.find("#filePhoto").change((e) => {					
					this.showPreloader(true);
					this.setupStudioWin(e.target);
			});

			this.v.$tabCont.html($btn);
		}

		private preloadImg(input, callback) {

			//setTimeout(() => {
				if (input.files && input.files[0]) {
					var reader = new FileReader();

					reader.onload = (e) => {
						callback(e.target["result"]);
					}

					reader.readAsDataURL(input.files[0]);
				}
			//}, 500);
				
		}

		private showPreloader(visible) {
				
		  if (visible) {
					//this.v.$tabCont.html(`<div class="preloader-cont"><img src="/images/Preloader_1.gif" /><div class="percent-cont" style="display: none"><span id="percentsUploaded">0</span>%</div></div>`);
					this.v.$tabCont.html(`<div class="preloader-cont"><img src="/images/Preloader_1.gif" /></div>`);
			} else {
				$(".preloader-cont").remove();
			}
		}

		private showCanvasDimensions($cropper) {
			var canvas = $cropper.cropper("getCroppedCanvas");

			$("#cWidth").html(canvas.width);
			$("#cHeight").html(canvas.height);
		}
			
		private setupStudioWin(fileInput) {
				
				this.preloadImg(fileInput, (imgData) => {
						this.v.fillMainContent(this.addPhotoDlg);

						var $img = $("#photoOverview");
						$img.attr("src", imgData);

						this.$currentCropper = this.initCropper($img);
						this.showCanvasDimensions(this.$currentCropper);

						Common.DropDown.registerDropDown($("#originType"));

						$("#btnCreate").click((e) => {
								e.preventDefault();

								if (!this.v.selectedCity.sourceId || !this.$currentCropper) {
										var iDlg = new Common.InfoDialog();
										iDlg.create("Validation", "City and photo must be choosen");
										return;
								}

								this.sendImgToSrv();
						});
				});
				
		}

			private sendImgToSrv() {
					
					var is = new ImageDb.ImageSender(this.v, "ImgDbPhoto", this.$currentCropper, () => {
							var r = {
									gid: this.v.selectedCity.sourceId,
									isFree: $("#isFree").prop("checked"),
									desc: $("#desc").val(),
									cityName: this.v.selectedCity.lastText,
									origin: $("#originType input").val()
							}
							return r;
					}, () => {
							this.create();
					});

					this.showPreloader(true);
					is.send();
			}

		private initCropper($img) {
			var $cropper = $img.cropper({
				autoCropArea: 1.0,
				crop: (e) => {
					// Output the result data for cropping image.
					//console.log(e.x);
					//console.log(e.y);
					//console.log(e.width);
					//console.log(e.height);
					//console.log(e.rotate);
					//console.log(e.scaleX);
					//console.log(e.scaleY);
				}
			});

			return $cropper;
		}

	}

	export class Tabs {

		public onBeforeSwitch: Function;
		public activeTabId;

		public $cont;
		private tabGroup;
		private height;

		constructor($cont, tabGroup, height) {
			this.$cont = $cont;
			this.tabGroup = tabGroup;
			this.height = height;
		}

		private tabs = [];

		public addTab(id, text, callback) {
			this.tabs.push({ id: id, text: text, callback: callback });
		}

		public create() {
			this.tabs.forEach((t) => {
				var $t = this.genTab(t);
				this.$cont.append($t);
			});

			this.tabs[0].callback();
			this.activeTabId = this.tabs[0].id;
		}

		private isFirst = true;

		private genTab(t) {
			var width = (100 / this.tabs.length);

			var $t = $(`<div id="${t.id}" class="myTab ${this.tabGroup}" style="width: calc(${width}% - 2px); height: ${this.height}px">${t.text}</div>`);

			if (this.isFirst) {
				$t.addClass("act");
				this.isFirst = false;
			}

			$t.click((e) => {
				e.preventDefault();

				if ($t.hasClass("act")) {
					return;
				}

				if (this.onBeforeSwitch) {
					this.onBeforeSwitch();
				}

				var $target = $(e.target);

				$(`.${this.tabGroup}`).removeClass("act");
				$target.addClass("act");
				this.activeTabId = $target.attr("id");
				t.callback(t.id);
			});

			return $t;
		}

		public activateTab(tabId) {
			var $tg = $(`.${this.tabGroup}`);
			$tg.removeClass("act");
			$(`#${tabId}`).addClass("act");
			this.activeTabId = tabId;
			var tab = _.find(this.tabs, (t) => {
				return t.id === tabId;
			});

			tab.callback(tabId);
		}


	}
}
