
module Views {

	export class ImageDbView extends ViewBase {

		public $tabCont;

		public selectedCity: Common.PlaceSearchBox;

		private tabs;

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

		private $cont;
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


	}
}
