var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var ImageDBView = (function (_super) {
        __extends(ImageDBView, _super);
        function ImageDBView() {
            _super.apply(this, arguments);
        }
        ImageDBView.prototype.init = function () {
            var _this = this;
            this.selectedCity = this.regCityCombo($("#selectedCity"));
            this.selectedCity.onPlaceSelected = function (request, place) {
                if (_this.tabs.activeTabId === "CityPhotos") {
                    _this.showCityPhotos(_this.selectedCity.sourceId);
                }
            };
            this.$tabCont = $("#tabCont");
            this.searchCityDlg = this.registerTemplate("searchCityDlg-template");
            this.addPhotoDlg = this.registerTemplate("addPhotoDlg-template");
            this.cutsDlg = this.registerTemplate("cutsDlg-template");
            this.cutItemTmp = this.registerTemplate("cutItemTmp-template");
            this.cutImgListItemTmp = this.registerTemplate("cutImgListItemTmp-template");
            this.defaultCutImgTmp = this.registerTemplate("defaultCutImg-template");
            this.tabs = new Tabs($("#naviCont"), "main", 50);
            this.tabs.addTab("CityPhotos", "City photos", function () {
                _this.showForm(_this.searchCityDlg);
                _this.setCitySearchDlg();
            });
            this.tabs.addTab("AddNewPhoto", "Add new photo", function () {
                _this.resetNewPhotoForm();
            });
            this.tabs.addTab("CutsMgmt", "Manage cuts (Just Vaclav)", function () {
                _this.showForm(_this.cutsDlg);
                _this.setCutsDlg();
            });
            this.tabs.create();
        };
        ImageDBView.prototype.showForm = function (template) {
            this.$tabCont.empty();
            var $html = $(template());
            this.$tabCont.html($html);
        };
        ImageDBView.prototype.setCitySearchDlg = function () {
            var _this = this;
            this.showCityPhotos(this.selectedCity.sourceId);
            $("#showDefaults").click(function (e) {
                e.preventDefault();
                var $cont = $("#picCutsList");
                if (_this.selectedCity.sourceId) {
                    $cont.empty();
                    _this.apiGet("ImgDbCut", [], function (cuts) {
                        cuts.forEach(function (c) {
                            var context = {
                                cutId: c.id,
                                cutName: c.name,
                                cityId: _this.selectedCity.sourceId,
                                shortName: c.shortName
                            };
                            var $i = $(_this.defaultCutImgTmp(context));
                            $cont.append($i);
                        });
                    });
                }
            });
        };
        ImageDBView.prototype.showCityPhotos = function (gid) {
            var _this = this;
            if (!gid) {
                return;
            }
            this.apiGet("ImgDbCity", [["gid", gid]], function (city) {
                if (city == null) {
                    var idDlg = new Common.InfoDialog();
                    idDlg.create("City empty", "The city is still empty");
                }
                _this.showCity(city);
            });
        };
        ImageDBView.prototype.setCutsDlg = function () {
            var _this = this;
            $("#btnShowAddCutForm").click(function (e) {
                e.preventDefault();
                $("#cutCreateForm").toggle();
            });
            $("#btnCreateCut").click(function (e) {
                e.preventDefault();
                _this.sendCreateCut();
            });
            this.displayCuts();
        };
        ImageDBView.prototype.displayCuts = function () {
            var _this = this;
            var $l = $("#cutsList");
            $l.empty();
            this.apiGet("ImgDbCut", [], function (cuts) {
                cuts.forEach(function (c) {
                    var $i = $(_this.cutItemTmp(c));
                    $l.append($i);
                });
            });
        };
        ImageDBView.prototype.sendCreateCut = function () {
            var _this = this;
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
            this.apiPost("ImgDbCut", data, function (r) {
                _this.displayCuts();
            });
        };
        ImageDBView.prototype.showCity = function (city) {
            var _this = this;
            var $photosCont = $("#photosList");
            $photosCont.empty();
            city.images.forEach(function (img) {
                var $photo = $("<div class=\"img\" style=\"background-image:url('/Pic/" + img.id + "/orig');\"><div class=\"delete\">X</div></div>");
                $photo.find(".delete").click(function (e) {
                    e.stopPropagation();
                    var cd = new Common.ConfirmDialog();
                    cd.create("Photot deletion", "Do you want to delete the photo ?", "Cancel", "Delete", function () {
                        _this.apiDelete("ImgDbPhoto", [["cityId", city.id], ["imgId", img.id]], function () {
                            $photo.remove();
                        });
                    });
                });
                $photo.click(function (e) {
                    e.preventDefault();
                    _this.origPhotoClicked(img.id, city.id);
                });
                $photosCont.append($photo);
            });
        };
        ImageDBView.prototype.origPhotoClicked = function (imgId, cityId) {
            var _this = this;
            var $cont = $("#picCutsList");
            $cont.empty();
            this.apiGet("ImgDbCut", [], function (cuts) {
                cuts.forEach(function (cut) {
                    var $c = _this.genCutInstance(cut, imgId, cityId);
                    $cont.append($c);
                });
            });
        };
        ImageDBView.prototype.genCutInstance = function (cut, imgId, cityId) {
            var _this = this;
            var context = {
                cutId: cut.id,
                cutName: cut.name,
                id: imgId,
                shortName: cut.shortName,
                width: cut.width,
                height: cut.height
            };
            var $c = $(this.cutImgListItemTmp(context));
            $c.find(".edit").click(function (e) {
                e.preventDefault();
                _this.setEditCutButtons($c, false, true, true);
                _this.editCut($c, imgId, cut);
            });
            $c.find(".save").click(function (e) {
                e.preventDefault();
                _this.saveNewCut(imgId, cut, cityId);
            });
            $c.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.regenCutInstance(cut, imgId, cityId);
            });
            $c.find(".default").click(function (e) {
                e.preventDefault();
                _this.setCutAsDefault(cityId, imgId, cut.id);
            });
            return $c;
        };
        ImageDBView.prototype.setCutAsDefault = function (cityId, photoId, cutId) {
            var data = {
                cityId: cityId,
                photoId: photoId,
                cutId: cutId
            };
            this.apiPut("ImgDbDefault", data, function () {
            });
        };
        ImageDBView.prototype.setEditCutButtons = function ($cont, edit, save, cancel) {
            var $e = $cont.find(".edit");
            var $s = $cont.find(".save");
            var $c = $cont.find(".cancel");
            $e.toggle(edit);
            $s.toggle(save);
            $c.toggle(cancel);
        };
        ImageDBView.prototype.saveNewCut = function (photoId, cut, cityId) {
            var _this = this;
            this.getImgData(this.$imgCutCropper, function (imgData) {
                var data = {
                    cutId: cut.id,
                    photoId: photoId,
                    data: imgData,
                    cutName: cut.shortName
                };
                _this.apiPut("ImgDbPhotoCut", data, function () {
                    _this.regenCutInstance(cut, photoId, cityId);
                });
            });
        };
        ImageDBView.prototype.regenCutInstance = function (cut, photoId, cityId) {
            var $newInst = this.genCutInstance(cut, photoId, cityId);
            var $oldInst = $("#cutInst_" + cut.id);
            $oldInst.replaceWith($newInst);
        };
        ImageDBView.prototype.editCut = function ($c, photoId, cut) {
            var $i = $c.find("img");
            $i.attr("src", "/Pic/" + photoId + "/orig");
            $i.css({ "width": "", "height": "", "max-width": "100%" });
            this.$imgCutCropper = $i.cropper({
                aspectRatio: cut.width / cut.height,
                autoCropArea: 1.0,
                cropBoxResizable: false,
                crop: function (e) {
                }
            });
        };
        ImageDBView.prototype.setNewPhotoDlg = function () {
            var _this = this;
            $("#filePhoto").change(function (e) {
                _this.preloadImg(e.target);
            });
            Common.DropDown.registerDropDown($("#originType"));
            $("#btnCreate").click(function (e) {
                e.preventDefault();
                _this.sendCreateNewPhoto();
            });
        };
        ImageDBView.prototype.sendCreateNewPhoto = function () {
            var _this = this;
            if (!this.selectedCity.sourceId || !this.$currentCropper) {
                var iDlg = new Common.InfoDialog();
                iDlg.create("Validation", "City and photo must be choosen");
                return;
            }
            this.getImgData(this.$currentCropper, function (imgData) {
                var data = {
                    data: imgData,
                    gid: _this.selectedCity.sourceId,
                    isFree: $("#isFree").prop("checked"),
                    desc: $("#desc").val(),
                    cityName: _this.selectedCity.lastText,
                    origin: $("#originType input").val()
                };
                _this.showPreloader(true);
                _this.apiPost("ImgDbPhoto", data, function (r) {
                    _this.resetNewPhotoForm();
                    _this.showPreloader(false);
                });
            });
        };
        ImageDBView.prototype.resetNewPhotoForm = function () {
            this.showForm(this.addPhotoDlg);
            this.setNewPhotoDlg();
        };
        ImageDBView.prototype.getImgData = function ($cropper, callback) {
            $cropper.cropper('getCroppedCanvas').toBlob(function (blob) {
                var reader = new FileReader();
                reader.onloadend = function (evnt) {
                    callback(evnt.target["result"]);
                };
                reader.readAsDataURL(blob);
            });
        };
        ImageDBView.prototype.initCropper = function ($img) {
            var $cropper = $img.cropper({
                autoCropArea: 1.0,
                crop: function (e) {
                }
            });
            return $cropper;
        };
        ImageDBView.prototype.preloadImg = function (input) {
            var _this = this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var $img = $("#photoOverview");
                    $img.attr("src", e.target["result"]);
                    _this.$currentCropper = _this.initCropper($img);
                };
                reader.readAsDataURL(input.files[0]);
            }
        };
        ImageDBView.prototype.regCityCombo = function (obj) {
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            c.selOjb = obj;
            var box = new Common.PlaceSearchBox(c);
            return box;
        };
        ImageDBView.prototype.showPreloader = function (visible) {
            if (visible) {
                this.$tabCont.html("<div class=\"preloader-cont\"><img src=\"/images/Preloader_1.gif\" /></div>");
            }
            else {
                $(".preloader-cont").remove();
            }
        };
        return ImageDBView;
    }(Views.ViewBase));
    Views.ImageDBView = ImageDBView;
    var Tabs = (function () {
        function Tabs($cont, tabGroup, height) {
            this.tabs = [];
            this.isFirst = true;
            this.$cont = $cont;
            this.tabGroup = tabGroup;
            this.height = height;
        }
        Tabs.prototype.addTab = function (id, text, callback) {
            this.tabs.push({ id: id, text: text, callback: callback });
        };
        Tabs.prototype.create = function () {
            var _this = this;
            this.tabs.forEach(function (t) {
                var $t = _this.genTab(t);
                _this.$cont.append($t);
            });
            this.tabs[0].callback();
            this.activeTabId = this.tabs[0].id;
        };
        Tabs.prototype.genTab = function (t) {
            var _this = this;
            var width = (100 / this.tabs.length);
            var $t = $("<div id=\"" + t.id + "\" class=\"myTab " + this.tabGroup + "\" style=\"width: calc(" + width + "% - 2px); height: " + this.height + "px\">" + t.text + "</div>");
            if (this.isFirst) {
                $t.addClass("act");
                this.isFirst = false;
            }
            $t.click(function (e) {
                e.preventDefault();
                if ($t.hasClass("act")) {
                    return;
                }
                if (_this.onBeforeSwitch) {
                    _this.onBeforeSwitch();
                }
                var $target = $(e.target);
                $("." + _this.tabGroup).removeClass("act");
                $target.addClass("act");
                _this.activeTabId = $target.attr("id");
                t.callback(t.id);
            });
            return $t;
        };
        return Tabs;
    }());
    Views.Tabs = Tabs;
})(Views || (Views = {}));
//# sourceMappingURL=ImageDBView.js.map