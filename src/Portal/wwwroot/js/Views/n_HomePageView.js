var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var NHomePageView = (function (_super) {
        __extends(NHomePageView, _super);
        function NHomePageView() {
            _super.call(this);
            Views.SettingsUtils.registerLocationCombo("currentCity", "CurrentLocation", function () {
                window.location.href = "/Destination/planning";
            });
            this.markLasts();
            this.initResize();
        }
        NHomePageView.prototype.markLasts = function (callback) {
            if (callback === void 0) { callback = null; }
            var $is = $(".mdiv > .i");
            $is.removeClass("last");
            $is.last().addClass("last");
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(function () {
                $is.each(function (index, i) {
                    var $i = $(i);
                    if ($i.next().length && $i.offset().top < $i.next().offset().top) {
                        $i.addClass("last");
                    }
                });
                if (callback) {
                    callback();
                }
            }, 100);
        };
        NHomePageView.prototype.printLast = function () {
            var dbg = _.map($(".last").toArray(), function (i) {
                return i.innerHTML + "";
            }).join();
            console.log(dbg);
        };
        NHomePageView.prototype.getLast = function ($displayed) {
            var $lastInRow;
            if ($displayed.hasClass("last")) {
                $lastInRow = $displayed;
            }
            else {
                var $is = $(".mdiv > .i");
                var isArray = $is.toArray();
                isArray = _.sortBy(isArray, function (index, item) {
                    var $i = $(item);
                    return $i.data("no");
                });
                var $last = $(_.last(isArray));
                var clickedNo = $displayed.data("no");
                var foundStart = false;
                isArray.some(function (i) {
                    var $i = $(i);
                    var txt = $i.html();
                    var hasLast = $i.hasClass("last");
                    if (foundStart && hasLast) {
                        $lastInRow = $i;
                        return true;
                    }
                    if ($last.data("no") === $i.data("no")) {
                        return true;
                    }
                    if (clickedNo === $i.data("no")) {
                        foundStart = true;
                    }
                });
            }
            return $lastInRow;
        };
        NHomePageView.prototype.initResize = function () {
            var _this = this;
            var $is = $(".mdiv > .i");
            $is.click(function (e) {
                if (_this.$currentDetail) {
                    _this.$currentDetail.remove();
                    _this.$currentDetail = null;
                }
                var $t = $(e.target);
                _this.$active = $t;
                var txt = $t.html();
                var $lastInRow = _this.getLast($t);
                _this.$currentDetail = $("<div class=\"b\">" + txt + "</div>");
                $lastInRow.after(_this.$currentDetail);
            });
            $(window).resize(function () {
                if (_this.$currentDetail) {
                    _this.$currentDetail.hide();
                }
                _this.markLasts(function () {
                    if (_this.$currentDetail && _this.$active) {
                        _this.printLast();
                        var $lastInRow = _this.getLast(_this.$active);
                        $lastInRow.after(_this.$currentDetail);
                        _this.$currentDetail.show();
                    }
                });
            });
        };
        Object.defineProperty(NHomePageView.prototype, "pageType", {
            get: function () { return Views.PageType.HomePage; },
            enumerable: true,
            configurable: true
        });
        return NHomePageView;
    }(Views.ViewBase));
    Views.NHomePageView = NHomePageView;
})(Views || (Views = {}));
//# sourceMappingURL=n_HomePageView.js.map