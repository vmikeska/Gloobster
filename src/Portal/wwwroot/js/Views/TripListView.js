var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TripListView = (function (_super) {
        __extends(TripListView, _super);
        function TripListView() {
            var _this = this;
            _super.call(this);
            this.listIsBig = true;
            this.$currentResults = $("#currentResults");
            this.$oldResults = $("#oldResults");
            this.$resultsCont = $("#resultsCont");
            this.$titleOld = $("#titleOld");
            var currentWidth = $(window).width();
            if (currentWidth < 640) {
                this.listIsBig = false;
            }
            $(window).resize(function () {
                if (_this.listIsBig) {
                    var currentWidth = $(window).width();
                    if (currentWidth < 640) {
                        _this.listIsBig = false;
                        _this.generateList(_this.listIsBig);
                        _this.setActiveSwitch(_this.listIsBig);
                    }
                }
            });
            this.setActiveSwitch(this.listIsBig);
            this.generateList(this.listIsBig);
            $(".type-switcher").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var type = $t.data("type");
                _this.listIsBig = type === "grid";
                _this.setActiveSwitch(_this.listIsBig);
                _this.generateList(_this.listIsBig);
            });
        }
        TripListView.prototype.setActiveSwitch = function (big) {
            $("#bigSwitch").toggleClass("active", big);
            $("#smallSwitch").toggleClass("active", !big);
        };
        TripListView.prototype.generateList = function (listSizeBig) {
            var _this = this;
            this.$currentResults.empty();
            this.$oldResults.empty();
            this.apiGet("TripList", [], function (trips) {
                var old = _.filter(trips, { isOld: true });
                var current = _.filter(trips, { isOld: false });
                var hasOld = any(old);
                _this.$titleOld.toggleClass("hidden", !hasOld);
                if (listSizeBig) {
                    if (hasOld) {
                        _this.generateBigList(old, _this.$oldResults, false);
                    }
                    _this.generateBigList(current, _this.$currentResults, true);
                }
                else {
                    if (hasOld) {
                        _this.generateSmallList(old, _this.$oldResults, false);
                    }
                    _this.generateSmallList(current, _this.$currentResults, true);
                }
            });
            setTimeout(function () {
                $("#newTrip").keypress(function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        _this.createNewTrip();
                    }
                });
            }, 100);
        };
        TripListView.prototype.createMenu = function ($cont, id) {
            var _this = this;
            $cont.find(".trip-menu").remove();
            var t = this.registerTemplate("trip-menu-template");
            var $t = $(t({ id: id }));
            $cont.append($t);
            $t.find(".menuClose").click(function (e) {
                e.preventDefault();
                $t.remove();
            });
            $t.find(".deleteTrip").click(function (e) {
                e.preventDefault();
                var dialog = new Common.ConfirmDialog();
                dialog.create(_this.t("TripDelTitle", "jsTrip"), _this.t("TripDelMessage", "jsTrip"), _this.t("Cancel", "jsLayout"), _this.t("Ok", "jsLayout"), function () {
                    _this.apiDelete("Trip", [["id", id]], function (r) {
                        $("#popup-delete").hide();
                        $("#" + id).remove();
                    });
                });
            });
            this.registerPhotoUpload(id, $t.find("input[type=\"file\"]").attr("id"), this.listIsBig);
        };
        TripListView.prototype.generateBigList = function (trips, $cont, addAdd) {
            var _this = this;
            this.$resultsCont.attr("class", "trips-big");
            var lg = Common.ListGenerator.init($cont, "trip-item-big-template");
            lg.customMapping = function (i) {
                return _this.itemMapping(i);
            };
            lg.evnt(".setting", function (e, $item, $target, item) {
                _this.createMenu($item, item.id);
            });
            lg.generateList(trips);
            if (addAdd) {
                var newRow = this.registerTemplate("new-trip-big-template");
                var $newRow = $(newRow());
                $cont.append($newRow);
            }
        };
        TripListView.prototype.generateSmallList = function (trips, $cont, addAdd) {
            var _this = this;
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
            lg.customMapping = function (i) {
                return _this.itemMapping(i);
            };
            lg.evnt(".setting", function (e, $item, $target, item) {
                _this.createMenu($item.find(".setting-wrap"), item.id);
            });
            lg.onItemAppended = function ($item, item) {
                var lgp = Common.ListGenerator.init($item.find(".participants"), "participant-row-template");
                lgp.generateList(item.participants);
            };
            lg.generateList(trips);
        };
        TripListView.prototype.itemMapping = function (i) {
            i.participantsCount = i.participants.length;
            i.imgLink = i.hasSmallPicture ? "/Trip/TripPictureSmall_xs/" + i.id : "/images/placeholder-70.png";
            i.itemLink = i.isOwner ? "/tripedit/" + i.id : "/trip/" + i.id;
            i.fromDateDis = moment(i.fromDate).format("l");
            i.toDateDis = moment(i.toDate).format("l");
            return i;
        };
        TripListView.prototype.createNewTrip = function () {
            var tripName = $("#newTrip").val();
            if (tripName === "") {
                return;
            }
            window.location.href = "/Trip/CreateNewTrip/" + tripName;
        };
        TripListView.prototype.registerPhotoUpload = function (tripId, inputId, isBig) {
            var _this = this;
            var c = new Common.FileUploadConfig();
            c.inputId = inputId;
            c.endpoint = "TripPhotoSmall";
            c.maxFileSize = 5500000;
            c.useMaxSizeValidation = false;
            var pu = new Common.FileUpload(c);
            pu.customId = tripId;
            var ud = null;
            pu.onProgressChanged = function (percent) {
                if (ud === null) {
                    ud = new Common.UploadDialog();
                    ud.create();
                }
                ud.update(percent);
            };
            pu.onUploadFinished = function (file, files) {
                $(".trip-menu").hide();
                if (isBig) {
                    $("#tripImg_" + tripId).attr("src", "/Trip/TripPictureSmall_s/" + tripId + "?d=" + _this.makeRandomString(10));
                }
                else {
                    $("#tripImg_" + tripId).attr("src", "/Trip/TripPictureSmall_xs/" + tripId + "?d=" + _this.makeRandomString(10));
                }
                ud.destroy();
            };
        };
        return TripListView;
    }(Views.ViewBase));
    Views.TripListView = TripListView;
})(Views || (Views = {}));
//# sourceMappingURL=TripListView.js.map