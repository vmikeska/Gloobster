
module Views {

	export class ImageDBView extends ViewBase {

		private $currentCropper;
		private newCityBox;

		//private $cityDetailCont;

		private tabs;

		private searchCityDlg;
		private addPhotoDlg;
		private cutsDlg;
		private cutItemTmp;
		private cutImgListItemTmp;

		private $tabCont;

		public init() {

			this.$tabCont = $("#tabCont");

			this.searchCityDlg = this.registerTemplate("searchCityDlg-template");
			this.addPhotoDlg = this.registerTemplate("addPhotoDlg-template");
			this.cutsDlg = this.registerTemplate("cutsDlg-template");
			this.cutItemTmp = this.registerTemplate("cutItemTmp-template");
			this.cutImgListItemTmp = this.registerTemplate("cutImgListItemTmp-template");
				
			this.tabs = new Tabs($("#naviCont"), "main", 50);
			this.tabs.addTab("AddNewPhoto", "Add new photo", () => {
				this.resetNewPhotoForm();
			});
			this.tabs.addTab("CitySearch", "Search for city", () => {
				this.showForm(this.searchCityDlg);
				this.setCitySearchDlg();
			});
			this.tabs.addTab("CutsMgmt", "Manage cuts", () => {
					this.showForm(this.cutsDlg);
				this.setCutsDlg();
			});
			this.tabs.create();

		}

		private showForm(template) {
			this.$tabCont.empty();

			var $html = $(template());
			this.$tabCont.html($html);
		}

		private setCitySearchDlg() {
			var citySearch = this.regCityCombo($("#city"));
			citySearch.onPlaceSelected = (request, place) => {
				this.apiGet("ImgDbCity", [["gid", request.SourceId]], (city) => {
						if (city == null) {
								var idDlg = new Common.InfoDialog();
								idDlg.create("City empty", "The city is still empty");
						}
					this.showCity(city);
				});
			};
		}

		private setCutsDlg() {

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

			this.apiGet("ImgDbCut", [], (cuts) => {
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

			this.apiPost("ImgDbCut", data, (r) => {
				this.displayCuts();
			});
		}

		private showCity(city) {
			var $photosCont = $("#photosList");

			$photosCont.empty();

			city.images.forEach((img) => {
				var $photo = $(`<div class="img" style="background-image:url('/Pic/${img.id}/orig');"></div>`);
				$photo.click((e) => {
					e.preventDefault();
					this.origPhotoClicked(img.id);
				});
				$photosCont.append($photo);
			});
		}

		private origPhotoClicked(id) {
			var $cont = $("#picCutsList");
			$cont.empty();

			this.apiGet("ImgDbCut", [], (cuts) => {
				cuts.forEach((cut) => {
					var $c = this.genCutInstance(cut, id);
					$cont.append($c);
				});
			});

		}

			private genCutInstance(cut, imgId) {
					var context = {
							cutId: cut.id,
							cutName: cut.name,
							id: imgId,
							shortName: cut.shortName,
							width: cut.width,
							height: cut.height
					};
					var $c = $(this.cutImgListItemTmp(context));
					$c.find(".edit").click((e) => {
							e.preventDefault();
							this.editCut($c, imgId, cut);
					});
					$c.find(".save").click((e) => {
							e.preventDefault();
							this.saveNewCut(imgId, cut);
					});

				return $c;
			}

		
		private saveNewCut(photoId, cut) {

			this.getImgData(this.$imgCutCropper, (imgData) => {
				var data = {
					cutId: cut.id,
					photoId: photoId,
					data: imgData,
					cutName: cut.shortName
				};

				this.apiPut("ImgDbPhotoCut", data, () => {
						var $newInst = this.genCutInstance(cut, photoId);
						var $oldInst = $(`#cutInst_${cut.id}`);

						$oldInst.replaceWith($newInst);					
				});
			});

		}

		private $imgCutCropper;

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

		private setNewPhotoDlg() {
			this.newCityBox = this.regCityCombo($("#cityAdd"));

			$("#filePhoto").change((e) => {
				this.preloadImg(e.target);
			});

			Common.DropDown.registerDropDown($("#originType"));

			$("#btnCreate").click((e) => {
				e.preventDefault();
				this.sendCreateNewPhoto();
			});
		}

		private sendCreateNewPhoto() {
			this.getImgData(this.$currentCropper, (imgData) => {

				var data = {
					data: imgData,
					gid: this.newCityBox.sourceId,
					isFree: $("#isFree").prop("checked"),
					desc: $("#desc").val(),
					cityName: this.newCityBox.lastText,
					origin: $("#originType input").val()
				};

				this.showPreloader(true);

				this.apiPost("ImgDbPhoto", data, (r) => {
						this.resetNewPhotoForm();
						this.showPreloader(false);
				});

			});
		}

		private resetNewPhotoForm() {
			this.showForm(this.addPhotoDlg);
			this.setNewPhotoDlg();
		}

		private getImgData($cropper, callback) {
			$cropper.cropper('getCroppedCanvas').toBlob((blob) => {

				var reader = new FileReader();
				reader.onloadend = (evnt) => {
					callback(evnt.target["result"]);
				}
				reader.readAsDataURL(blob);
			});
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

		private preloadImg(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = (e) => {
					var $img = $("#photoOverview");
					$img.attr("src", e.target["result"]);

					this.$currentCropper = this.initCropper($img);
				}

				reader.readAsDataURL(input.files[0]);
			}
		}

		private regCityCombo(obj) {

			var c = new Common.PlaceSearchConfig();
			c.providers = "2";
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;
			c.selOjb = obj;

			var box = new Common.PlaceSearchBox(c);

			return box;
		}

		private showPreloader(visible) {
			if (visible) {
					this.$tabCont.html(`<div class="preloader-cont"><img src="/images/Preloader_1.gif" /></div>`);
			} else {
				$(".preloader-cont").remove();
			}
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
