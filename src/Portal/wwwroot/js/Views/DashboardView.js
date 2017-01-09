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
            this.anytimeFinished = false;
            this.weekendFinished = false;
            this.blocksCnt = 0;
            this.lastWidth = 0;
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
            this.initMap();
            this.initCalendar();
            this.initDeals();
            this.regFriendsRecomm();
        };
        DashboardView.prototype.regFriendsRecomm = function () {
            var _this = this;
            var $form = $(".joined-friends");
            $form.find(".form-close").click(function (e) {
                e.preventDefault();
                $form.hide();
            });
            $form.find(".request").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $item = $t.closest(".item-all");
                var uid = $item.data("uid");
                var data = { "friendId": uid, "action": FriendActionType.Request };
                _this.apiPost("Friends", data, function (response) {
                    $item.remove();
                    var anyItems = $form.find(".item-all").length > 0;
                    if (!anyItems) {
                        $form.hide();
                    }
                });
            });
        };
        DashboardView.prototype.initDeals = function () {
            var _this = this;
            Views.AirLoc.registerLocationCombo($("#currentCity"), function (place) {
                window.location.href = "/deals";
            });
            if (this.canQueryResults) {
                this.startResMgr(PlanningType.Anytime, function (res) {
                    _this.anytimeRes = res;
                    _this.displayResults();
                }, function () {
                    _this.anytimeFinished = true;
                    _this.canHidePreload();
                });
                this.startResMgr(PlanningType.Weekend, function (res) {
                    _this.weekendRes = res;
                    _this.displayResults();
                }, function () {
                    _this.weekendFinished = true;
                    _this.canHidePreload();
                });
            }
        };
        DashboardView.prototype.canHidePreload = function () {
            if (this.anytimeFinished && this.weekendFinished) {
                $(".your-deals-result-all .preload-all").hide();
            }
        };
        DashboardView.prototype.displayResults = function () {
            var res = { Excellent: 0, Good: 0, Standard: 0 };
            if (this.anytimeRes) {
                res.Excellent += this.anytimeRes.Excellent;
                res.Good += this.anytimeRes.Good;
                res.Standard += this.anytimeRes.Standard;
            }
            if (this.weekendRes) {
                res.Excellent += this.weekendRes.Excellent;
                res.Good += this.weekendRes.Good;
                res.Standard += this.weekendRes.Standard;
            }
            $("#res5").html(res.Excellent);
            $("#res3").html(res.Good);
            $("#res1").html(res.Standard);
        };
        DashboardView.prototype.startResMgr = function (pt, onChange, onQueueFinished) {
            var rm = new Planning.ResultsManager(this);
            rm.onDrawQueue = function () {
                if (!any(rm.queue)) {
                    onQueueFinished();
                }
            };
            rm.onResultsChanged = function (queries) {
                var de = new Planning.DelasEval(rm.timeType, queries);
                de.countDeals();
                onChange(de.res);
            };
            rm.initalCall(pt);
        };
        DashboardView.prototype.initMap = function () {
            this.ccs.forEach(function (cc) {
                var cg = $(".your-map-all [cc=\"" + cc.toLowerCase() + "\"]");
                cg.css("fill", "#005476");
            });
        };
        DashboardView.prototype.initCalendar = function () {
            var _this = this;
            this.createCalendar();
            var fromTo = Dashboard.CalendarUtils.getCalRange(this.$calendar);
            var from = TravelB.DateUtils.momentDateToTrans(fromTo.from);
            var to = TravelB.DateUtils.momentDateToTrans(fromTo.to);
            var prms = [["from", from], ["to", to]];
            this.apiGet("FriendsEvents", prms, function (events) {
                var evnts = _.map(events, function (event) { return Dashboard.CalendarUtils.convertEvent(event); });
                evnts.forEach(function (evnt) {
                    _this.$calendar.fullCalendar("renderEvent", evnt);
                });
            });
        };
        DashboardView.prototype.createCalendar = function () {
            this.$calendar = $("#calendar").fullCalendar({
                header: false,
                footer: false,
                navLinks: false,
                editable: false,
                eventLimit: true,
                fixedWeekCount: false,
                height: "auto",
                eventClick: function (evnt) {
                    window.open("/trip/" + evnt.tripId);
                }
            });
        };
        DashboardView.prototype.initTabs = function () {
            var _this = this;
            this.tabs = new Common.Tabs($("#menuCont"), "main");
            this.tabs.initCall = false;
            this.tabs.onBeforeSwitch = function () {
            };
            var tab1 = { id: "tabFriends", text: this.t("TabFriends", "jsDashboard"), cls: "hidden" };
            this.tabs.addTabConf(tab1, function () {
                _this.setConts(_this.$tbFriends);
            });
            var tab2 = { id: "tabPortal", text: this.t("TabPortal", "jsDashboard"), cls: "hidden" };
            this.tabs.addTabConf(tab2, function () {
                _this.setConts(_this.$tbPortal);
            });
            var tab3 = { id: "tabWebNavi", text: this.t("TabWeb", "jsDashboard"), cls: "hidden" };
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