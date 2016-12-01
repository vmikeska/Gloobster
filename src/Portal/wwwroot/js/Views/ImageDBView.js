var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var ImageDbView = (function (_super) {
        __extends(ImageDbView, _super);
        function ImageDbView() {
            _super.apply(this, arguments);
            this.cutsDlg = Views.ViewBase.currentView.registerTemplate("cutsDlg-template");
        }
        ImageDbView.prototype.init = function () {
            var _this = this;
            this.newPhotoFnc = new NewPhoto(this);
            this.cutsFnc = new Cuts(this);
            this.photosFnc = new Photos(this);
            var $scdd = $("#selectedCity");
            this.selectedCity = this.regCityCombo($scdd);
            this.$tabCont = $("#tabCont");
            this.tabs = new Tabs($("#naviCont"), "main", 50);
            this.tabs.addTab("CityPhotos", "City photos", function () {
                if (_this.selectedCity.sourceId) {
                    _this.photosFnc.create(_this.selectedCity.sourceId);
                }
                else {
                    _this.$tabCont.html("<div class=\"no-city\">No city selected</div>");
                }
            });
            this.tabs.addTab("AddNewPhoto", "Add new photo", function () {
                _this.newPhotoFnc.create();
            });
            this.tabs.addTab("CitiesWithPhotos", "Cities with photos", function () {
                var c = new CitiesWithPhotos(_this);
                c.create();
            });
            this.tabs.addTab("CitiesByPop", "Cities by population", function () {
                var c = new CitiesByPopulation(_this);
                c.create();
            });
            this.tabs.addTab("CutsMgmt", "Manage cuts (Just Vaclav)", function () {
                _this.fillMainContent(_this.cutsDlg);
                _this.cutsFnc.setCutsDlg();
            });
            this.tabs.create();
        };
        ImageDbView.prototype.regCityCombo = function ($scdd) {
            var _this = this;
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            c.selOjb = $scdd;
            var box = new Common.PlaceSearchBox(c);
            $scdd.change(function (e, a, b) {
                if (_this.tabs.activeTabId === "CityPhotos") {
                    _this.photosFnc.create(_this.selectedCity.sourceId);
                }
            });
            return box;
        };
        ImageDbView.prototype.fillMainContent = function (template) {
            this.$tabCont.empty();
            var $html = $(template());
            this.$tabCont.html($html);
        };
        return ImageDbView;
    }(Views.ViewBase));
    Views.ImageDbView = ImageDbView;
    var CitiesByPopulation = (function () {
        function CitiesByPopulation(v) {
            this.layoutTemplate = Views.ViewBase.currentView.registerTemplate("citiesByPopLayout-template");
            this.ag = Common.CountriesGroup;
            this.cities = [];
            this.v = v;
        }
        CitiesByPopulation.prototype.create = function () {
            var _this = this;
            this.v.$tabCont.html(this.layoutTemplate());
            var $cbByContinent = $("#cbByContinent");
            var $cbByCountry = $("#cbByCountry");
            $cbByContinent.change(function () {
                var byCont = $cbByContinent.prop("checked");
                var byCountry = $cbByCountry.prop("checked");
                _this.showPreloader(true);
                _this.displayData(byCont, byCountry);
                _this.regLinkEvent();
            });
            $cbByCountry.change(function () {
                var byCont = $cbByContinent.prop("checked");
                var byCountry = $cbByCountry.prop("checked");
                _this.showPreloader(true);
                _this.displayData(byCont, byCountry);
                _this.regLinkEvent();
            });
            this.$cont = this.v.$tabCont.find(".results");
            this.showPreloader(true);
            this.getData(function (citiesByPop, citiesWithPhotos) {
                _this.citiesByPop = citiesByPop;
                _this.citiesWithPhotos = citiesWithPhotos;
                _this.citiesByPop.forEach(function (cbp) {
                    var cwp = _.find(_this.citiesWithPhotos, function (c) {
                        return c.gid === cbp.gid;
                    });
                    var city = $.extend(cbp, { imgs: 0 });
                    if (cwp) {
                        city.imgs = cwp.images.length;
                    }
                    _this.cities.push(city);
                });
                _this.displayData(true, true);
                _this.regLinkEvent();
            });
        };
        CitiesByPopulation.prototype.displayData = function (byContinent, byCountry) {
            var _this = this;
            this.$cont.empty();
            if (!byContinent && !byCountry) {
                var $t = this.generateCities(this.cities);
                this.$cont.html($t);
                return;
            }
            var countryGroupedArray = [];
            if (byCountry) {
                var countryGrouped = _.groupBy(this.cities, "countryCode");
                for (var key in countryGrouped) {
                    if (countryGrouped.hasOwnProperty(key)) {
                        var citiesOfCountry = countryGrouped[key];
                        var $h = this.generateCities(citiesOfCountry);
                        countryGroupedArray.push({ countryCode: key, $h: $h });
                    }
                }
            }
            if (!byContinent) {
                countryGroupedArray.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                return;
            }
            if (byCountry && byContinent) {
                var europeCountries = this.coByCont(countryGroupedArray, this.ag.europe);
                var northAmericaCountries = this.coByCont(countryGroupedArray, this.ag.northAmerica);
                var asiaCountries = this.coByCont(countryGroupedArray, this.ag.asia);
                var southAmericaCountries = this.coByCont(countryGroupedArray, this.ag.southAmerica);
                var austrailaCountries = this.coByCont(countryGroupedArray, this.ag.austraila);
                var africaCountries = this.coByCont(countryGroupedArray, this.ag.africa);
                this.$cont.append("<h1>Europe</h1>");
                europeCountries.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                this.$cont.append("<h1>North America</h1>");
                northAmericaCountries.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                this.$cont.append("<h1>Asia</h1>");
                asiaCountries.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                this.$cont.append("<h1>South America</h1>");
                southAmericaCountries.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                this.$cont.append("<h1>Australia</h1>");
                austrailaCountries.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                this.$cont.append("<h1>Africa</h1>");
                africaCountries.forEach(function (cga) {
                    _this.dispalyCountryGroup(cga);
                });
                return;
            }
            var europeCities = [];
            var northAmericaCities = [];
            var asiaCities = [];
            var southAmericaCities = [];
            var austrailaCities = [];
            var africaCities = [];
            this.cities.forEach(function (c) {
                if (_.contains(_this.ag.europe, c.countryCode)) {
                    europeCities.push(c);
                }
                else if (_.contains(_this.ag.northAmerica, c.countryCode)) {
                    northAmericaCities.push(c);
                }
                else if (_.contains(_this.ag.asia, c.countryCode)) {
                    asiaCities.push(c);
                }
                else if (_.contains(_this.ag.southAmerica, c.countryCode)) {
                    southAmericaCities.push(c);
                }
                else if (_.contains(_this.ag.austraila, c.countryCode)) {
                    austrailaCities.push(c);
                }
                else if (_.contains(_this.ag.africa, c.countryCode)) {
                    africaCities.push(c);
                }
            });
            this.$cont.append("<h1>Europe</h1>");
            var $eu = this.generateCities(europeCities);
            this.$cont.append($eu);
            this.$cont.append("<h1>North America</h1>");
            var $na = this.generateCities(northAmericaCities);
            this.$cont.append($na);
            this.$cont.append("<h1>Asia</h1>");
            var $as = this.generateCities(asiaCities);
            this.$cont.append($as);
            this.$cont.append("<h1>South America</h1>");
            var $sa = this.generateCities(southAmericaCities);
            this.$cont.append($sa);
            this.$cont.append("<h1>Australia</h1>");
            var $au = this.generateCities(austrailaCities);
            this.$cont.append($au);
            this.$cont.append("<h1>Africa</h1>");
            var $af = this.generateCities(africaCities);
            this.$cont.append($af);
        };
        CitiesByPopulation.prototype.regLinkEvent = function () {
            var _this = this;
            $(".city-link").click(function (e) {
                e.preventDefault();
                var $tar = $(e.target);
                var gid = $tar.data("gid");
                _this.v.selectedCity.setText($tar.html());
                _this.v.selectedCity.sourceId = gid;
                _this.v.tabs.activateTab("CityPhotos");
            });
        };
        CitiesByPopulation.prototype.coByCont = function (countryGroupedArray, continentCountryCodes) {
            var res = [];
            countryGroupedArray.forEach(function (cga) {
                if (_.contains(continentCountryCodes, cga.countryCode)) {
                    res.push(cga);
                }
            });
            return res;
        };
        CitiesByPopulation.prototype.dispalyCountryGroup = function (cga) {
            this.$cont.append("<h2>" + cga.countryCode + "</h2>");
            this.$cont.append(cga.$h);
        };
        CitiesByPopulation.prototype.generateCities = function (cities) {
            cities = _.sortBy(cities, function (c) { return c.population; }).reverse();
            var $t = $("<table></table>");
            cities.forEach(function (c) {
                var stateClass = (c.imgs > 0) ? "checkmark" : "cross";
                var air = c.hasAir ? "<span class=\"icon-airplane\"></span>" : "";
                $t.append("\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#\" class=\"city-link\" data-gid=\"" + c.gid + "\">" + c.name + "</a>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>" + c.population + "</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>" + air + "</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td><span class=\"icon-" + stateClass + "\"></span></td>\n\t\t\t\t\t\t\t\t\t\t</tr>");
            });
            return $t;
        };
        CitiesByPopulation.prototype.showPreloader = function (visible) {
            if (visible) {
                this.$cont.html("<div class=\"preloader-cont\"><img src=\"/images/Preloader_1.gif\" /></div>");
            }
            else {
                $(".preloader-cont").remove();
            }
        };
        CitiesByPopulation.prototype.getCityByPopData = function (callback) {
            var data = [["mp", "100000"]];
            this.v.apiGet("CityByPop", data, function (cities) {
                var convCities = _.map(cities, function (c) {
                    return {
                        gid: c.g,
                        name: c.n,
                        countryCode: c.c,
                        population: c.p,
                        hasAir: c.a
                    };
                });
                callback(convCities);
            });
        };
        CitiesByPopulation.prototype.getCitiesWithPhotosData = function (callback) {
            var data = [["query", ""]];
            this.v.apiGet("imgDbCity", data, function (cities) {
                callback(cities);
            });
        };
        CitiesByPopulation.prototype.getData = function (callback) {
            var _this = this;
            this.getCityByPopData(function (citiesByPop) {
                _this.getCitiesWithPhotosData(function (citiesWithPhotos) {
                    callback(citiesByPop, citiesWithPhotos);
                });
            });
        };
        return CitiesByPopulation;
    }());
    Views.CitiesByPopulation = CitiesByPopulation;
    var CitiesWithPhotos = (function () {
        function CitiesWithPhotos(v) {
            this.v = v;
        }
        CitiesWithPhotos.prototype.create = function () {
            var _this = this;
            var data = [["query", ""]];
            this.v.$tabCont.empty();
            this.v.apiGet("imgDbCity", data, function (cities) {
                cities.forEach(function (c) {
                    var $h = $("<div>" + c.name + " - " + c.images.length + " </div>");
                    _this.v.$tabCont.append($h);
                });
            });
        };
        return CitiesWithPhotos;
    }());
    Views.CitiesWithPhotos = CitiesWithPhotos;
    var Photos = (function () {
        function Photos(v) {
            this.defaultCutImgTmp = Views.ViewBase.currentView.registerTemplate("defaultCutImg-template");
            this.v = v;
        }
        Photos.prototype.create = function (gid) {
            var _this = this;
            if (!gid) {
                return;
            }
            this.v.apiGet("ImgDbCity", [["gid", gid]], function (city) {
                if (city == null) {
                    _this.v.$tabCont.html("<div class=\"no-city\">No photos in this city</div>");
                    return;
                }
                _this.city = city;
                _this.createTabs();
            });
        };
        Photos.prototype.showDefaults = function () {
            var _this = this;
            this.$cont.empty();
            this.v.apiGet("ImgDbCut", [], function (cuts) {
                cuts.forEach(function (c) {
                    var context = {
                        cutId: c.id,
                        cutName: c.name,
                        cityId: _this.v.selectedCity.sourceId,
                        shortName: c.shortName,
                        random: _this.v.makeRandomString(10)
                    };
                    var $i = $(_this.defaultCutImgTmp(context));
                    _this.$cont.append($i);
                });
            });
        };
        Photos.prototype.createTabs = function () {
            var _this = this;
            var $tabCont = $("#tabCont");
            $tabCont.empty();
            $tabCont.append("<div id=\"photosTabCont\"></div>");
            $tabCont.append("<div id=\"photosCont\"></div>");
            this.$cont = $("#photosCont");
            this.tabs = new Tabs($("#photosTabCont"), "photos", 30);
            this.tabs.addTab("DefaultCuts", "Default cuts", function () {
                _this.showDefaults();
            });
            this.tabs.addTab("AllPhotos", "All Photos", function () {
                _this.showPhotos();
            });
            this.tabs.create();
        };
        Photos.prototype.showPhotos = function () {
            var _this = this;
            this.$cont.empty();
            this.city.images.forEach(function (img) {
                var $photo = $("<div class=\"img\" style=\"background-image:url('/Pic/" + img.id + "/orig');\"><div class=\"delete\">X</div></div>");
                $photo.find(".delete").click(function (e) {
                    e.stopPropagation();
                    var cd = new Common.ConfirmDialog();
                    cd.create("Photo deletion", "Do you want to delete the photo ?", "Cancel", "Delete", function () {
                        _this.v.apiDelete("ImgDbPhoto", [["cityId", _this.city.id], ["imgId", img.id]], function () {
                            $photo.remove();
                        });
                    });
                });
                $photo.click(function (e) {
                    e.preventDefault();
                    _this.origPhotoClicked(img.id, _this.city.id);
                });
                _this.$cont.append($photo);
            });
        };
        Photos.prototype.origPhotoClicked = function (imgId, cityId) {
            var _this = this;
            this.$cont.empty();
            this.v.apiGet("ImgDbCut", [], function (cuts) {
                cuts.forEach(function (cut) {
                    var $c = _this.v.cutsFnc.genCutInstance(cut, imgId, cityId);
                    _this.$cont.append($c);
                });
            });
        };
        return Photos;
    }());
    Views.Photos = Photos;
    var Cuts = (function () {
        function Cuts(v) {
            this.cutItemTmp = Views.ViewBase.currentView.registerTemplate("cutItemTmp-template");
            this.cutImgListItemTmp = Views.ViewBase.currentView.registerTemplate("cutImgListItemTmp-template");
            this.v = v;
        }
        Cuts.prototype.setCutsDlg = function () {
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
        Cuts.prototype.displayCuts = function () {
            var _this = this;
            var $l = $("#cutsList");
            $l.empty();
            this.v.apiGet("ImgDbCut", [], function (cuts) {
                cuts.forEach(function (c) {
                    var $i = $(_this.cutItemTmp(c));
                    $l.append($i);
                });
            });
        };
        Cuts.prototype.sendCreateCut = function () {
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
            this.v.apiPost("ImgDbCut", data, function (r) {
                _this.displayCuts();
            });
        };
        Cuts.prototype.setCutAsDefault = function (cityId, photoId, cutId) {
            var data = {
                cityId: cityId,
                photoId: photoId,
                cutId: cutId
            };
            this.v.apiPut("ImgDbDefault", data, function () {
            });
        };
        Cuts.prototype.setEditCutButtons = function ($cont, edit, save, cancel) {
            var $e = $cont.find(".edit");
            var $s = $cont.find(".save");
            var $c = $cont.find(".cancel");
            $e.toggle(edit);
            $s.toggle(save);
            $c.toggle(cancel);
        };
        Cuts.prototype.saveNewCut = function (photoId, cut, cityId) {
            var _this = this;
            var is = new ImageDb.ImageSender(this.v, "ImgDbPhotoCut", this.$imgCutCropper, function () {
                var d = {
                    cutId: cut.id,
                    photoId: photoId,
                    cutName: cut.shortName
                };
                return d;
            }, function () {
                _this.regenCutInstance(cut, photoId, cityId);
            });
            is.send();
        };
        Cuts.prototype.editCut = function ($c, photoId, cut) {
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
        Cuts.prototype.regenCutInstance = function (cut, photoId, cityId) {
            var $newInst = this.genCutInstance(cut, photoId, cityId);
            var $oldInst = $("#cutInst_" + cut.id);
            $oldInst.replaceWith($newInst);
        };
        Cuts.prototype.genCutInstance = function (cut, imgId, cityId) {
            var _this = this;
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
        return Cuts;
    }());
    Views.Cuts = Cuts;
    var NewPhoto = (function () {
        function NewPhoto(v) {
            this.addPhotoDlg = Views.ViewBase.currentView.registerTemplate("addPhotoDlg-template");
            this.v = v;
        }
        NewPhoto.prototype.create = function () {
            var _this = this;
            var $btn = $("<div class=\"new-photo-cont\"><input id=\"filePhoto\" type=\"file\" /><label for=\"filePhoto\">Choose a photo</label></div>");
            $btn.find("#filePhoto").change(function (e) {
                _this.showPreloader(true);
                _this.setupStudioWin(e.target);
            });
            this.v.$tabCont.html($btn);
        };
        NewPhoto.prototype.preloadImg = function (input, callback) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target["result"]);
                };
                reader.readAsDataURL(input.files[0]);
            }
        };
        NewPhoto.prototype.showPreloader = function (visible) {
            if (visible) {
                this.v.$tabCont.html("<div class=\"preloader-cont\"><img src=\"/images/Preloader_1.gif\" /></div>");
            }
            else {
                $(".preloader-cont").remove();
            }
        };
        NewPhoto.prototype.showCanvasDimensions = function ($cropper) {
            var canvas = $cropper.cropper("getCroppedCanvas");
            $("#cWidth").html(canvas.width);
            $("#cHeight").html(canvas.height);
        };
        NewPhoto.prototype.setupStudioWin = function (fileInput) {
            var _this = this;
            this.preloadImg(fileInput, function (imgData) {
                _this.v.fillMainContent(_this.addPhotoDlg);
                var $img = $("#photoOverview");
                $img.attr("src", imgData);
                _this.$currentCropper = _this.initCropper($img);
                _this.showCanvasDimensions(_this.$currentCropper);
                Common.DropDown.registerDropDown($("#originType"));
                $("#btnCreate").click(function (e) {
                    e.preventDefault();
                    if (!_this.v.selectedCity.sourceId || !_this.$currentCropper) {
                        var iDlg = new Common.InfoDialog();
                        iDlg.create("Validation", "City and photo must be choosen");
                        return;
                    }
                    _this.sendImgToSrv();
                });
            });
        };
        NewPhoto.prototype.sendImgToSrv = function () {
            var _this = this;
            var is = new ImageDb.ImageSender(this.v, "ImgDbPhoto", this.$currentCropper, function () {
                var r = {
                    gid: _this.v.selectedCity.sourceId,
                    isFree: $("#isFree").prop("checked"),
                    desc: $("#desc").val(),
                    cityName: _this.v.selectedCity.lastText,
                    origin: $("#originType input").val()
                };
                return r;
            }, function () {
                _this.create();
            });
            this.showPreloader(true);
            is.send();
        };
        NewPhoto.prototype.initCropper = function ($img) {
            var $cropper = $img.cropper({
                autoCropArea: 1.0,
                crop: function (e) {
                }
            });
            return $cropper;
        };
        return NewPhoto;
    }());
    Views.NewPhoto = NewPhoto;
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
        Tabs.prototype.activateTab = function (tabId) {
            var $tg = $("." + this.tabGroup);
            $tg.removeClass("act");
            $("#" + tabId).addClass("act");
            this.activeTabId = tabId;
            var tab = _.find(this.tabs, function (t) {
                return t.id === tabId;
            });
            tab.callback(tabId);
        };
        return Tabs;
    }());
    Views.Tabs = Tabs;
})(Views || (Views = {}));
//# sourceMappingURL=ImageDBView.js.map