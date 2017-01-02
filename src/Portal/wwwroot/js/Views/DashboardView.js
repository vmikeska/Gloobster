var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var DashboardView = (function (_super) {
        __extends(DashboardView, _super);
        function DashboardView() {
            _super.call(this);
            this.blocksCnt = 0;
            this.lastWidth = 0;
            this.init();
        }
        DashboardView.prototype.init = function () {
            this.initTabs();
            this.$tbFriends = $(".tb-friends");
            this.$tbPortal = $(".tb-portal");
            this.$tbWebNavi = $(".tb-web");
            this.$tabFriends = $("#tabFriends").parent();
            this.$tabPortal = $("#tabPortal").parent();
            this.$tabWebNavi = $("#tabWebNavi").parent();
            this.$titles = $(".topic-block .title");
            this.initResize();
        };
        DashboardView.prototype.initTabs = function () {
            var _this = this;
            this.tabs = new Common.Tabs($("#menuCont"), "main");
            this.tabs.initCall = false;
            this.tabs.onBeforeSwitch = function () {
            };
            var tab1 = { id: "tabFriends", text: "Friend's feed", cls: "hidden" };
            this.tabs.addTabConf(tab1, function () {
                _this.setConts(_this.$tbFriends);
            });
            var tab2 = { id: "tabPortal", text: "Portal feed", cls: "hidden" };
            this.tabs.addTabConf(tab2, function () {
                _this.setConts(_this.$tbPortal);
            });
            var tab3 = { id: "tabWebNavi", text: "Web navigation", cls: "hidden" };
            this.tabs.addTabConf(tab3, function () {
                _this.setConts(_this.$tbWebNavi);
            });
            this.tabs.create();
        };
        DashboardView.prototype.initResize = function () {
            var _this = this;
            $(window).resize(function () {
                _this.resize();
            });
            this.resize();
        };
        DashboardView.prototype.resize = function () {
            var width = $(window).width();
            this.setPage(width);
        };
        DashboardView.prototype.setPage = function (width) {
            if (this.lastWidth === width) {
                return;
            }
            this.lastWidth = width;
            console.log(width);
            var w1 = 1100;
            var w2 = 750;
            this.$tbFriends.addClass("hidden");
            this.$tbPortal.addClass("hidden");
            this.$tbWebNavi.addClass("hidden");
            this.$tabFriends.addClass("hidden");
            this.$tabPortal.addClass("hidden");
            this.$tabWebNavi.addClass("hidden");
            this.$titles.addClass("hidden");
            if (width > w1) {
                this.$tbFriends.removeClass("hidden");
                this.$tbPortal.removeClass("hidden");
                this.$tbWebNavi.removeClass("hidden");
                this.blocksCnt = 3;
                this.$titles.removeClass("hidden");
            }
            else if (width > w2) {
                this.$tbPortal.removeClass("hidden");
                this.$tbWebNavi.removeClass("hidden");
                this.$tabFriends.removeClass("hidden");
                this.$tabPortal.removeClass("hidden");
                this.blocksCnt = 2;
                this.tabs.activateTab(this.$tabPortal.find(".btn"));
                this.$titles.removeClass("hidden");
            }
            else {
                this.$tbWebNavi.removeClass("hidden");
                this.$tabFriends.removeClass("hidden");
                this.$tabPortal.removeClass("hidden");
                this.$tabWebNavi.removeClass("hidden");
                this.blocksCnt = 1;
                this.tabs.activateTab(this.$tabWebNavi.find(".btn"));
            }
        };
        DashboardView.prototype.setConts = function ($block) {
            this.$tbFriends.addClass("hidden");
            this.$tbPortal.addClass("hidden");
            if (this.blocksCnt === 1) {
                this.$tbWebNavi.addClass("hidden");
            }
            $block.removeClass("hidden");
        };
        return DashboardView;
    }(Views.ViewBase));
    Views.DashboardView = DashboardView;
})(Views || (Views = {}));
//# sourceMappingURL=DashboardView.js.map