var TravelB;
(function (TravelB) {
    var CheckinMenu = (function () {
        function CheckinMenu(view) {
            this.$menuCont = $(".checkin-row");
            this.$win = $(".checkin-win");
            this.$wcont = this.$win.find(".cont");
            this.lastStatusVisibility = false;
            this.view = view;
            this.cityCheckins = new TravelB.CityCheckinsMgmt(view);
            this.init();
        }
        CheckinMenu.prototype.init = function () {
            var _this = this;
            var $as = this.$menuCont.find("a");
            $as.click(function (e) {
                e.preventDefault();
                $as.removeClass("active");
                var $t = $(e.delegateTarget);
                $t.addClass("active");
                var bt = $t.data("t");
                _this.activateTab(bt);
            });
            this.$win.find(".close").click(function (e) {
                e.preventDefault();
                _this.hideWin();
            });
        };
        CheckinMenu.prototype.hideWin = function () {
            var _this = this;
            var $as = this.$menuCont.find("a");
            this.$win.slideUp(function () {
                $as.removeClass("active");
                _this.$wcont.empty();
            });
        };
        CheckinMenu.prototype.setCheckinByTab = function (type) {
            this.deactivateTopMenu();
            if (type === this.view.nowTabConst) {
                $(".checkin-row").show();
                if (this.lastStatusVisibility) {
                    $(".status-row").show();
                    $(".checkin-row").hide();
                }
                else {
                    $(".status-row").hide();
                    $(".checkin-row").show();
                }
            }
            if (type === this.view.cityTabConst) {
                this.lastStatusVisibility = $(".status-row").is(":visible");
                $(".checkin-row").show();
                $(".status-row").hide();
            }
        };
        CheckinMenu.prototype.activateTab = function (bt, id) {
            var _this = this;
            if (id === void 0) { id = null; }
            if (bt === "check") {
                if (this.view.tabs.activeTabId === this.view.nowTabConst) {
                    this.view.checkinWin.showNowCheckin(function () {
                        _this.fillAndShow(_this.view.checkinWin.$html);
                    });
                }
                else {
                    this.view.checkinWin.showCityCheckin(id, function () {
                        _this.fillAndShow(_this.view.checkinWin.$html);
                    });
                }
            }
            if (bt === "manage") {
                this.cityCheckins.genCheckins(function () {
                    _this.$win.slideDown();
                });
            }
        };
        CheckinMenu.prototype.fillAndShow = function ($html) {
            this.$wcont.html(this.view.checkinWin.$html);
            this.$win.slideDown();
        };
        CheckinMenu.prototype.deactivateTopMenu = function () {
            var $as = this.$menuCont.find("a");
            $as.removeClass("active");
            this.$win.hide();
        };
        return CheckinMenu;
    }());
    TravelB.CheckinMenu = CheckinMenu;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinMenu.js.map