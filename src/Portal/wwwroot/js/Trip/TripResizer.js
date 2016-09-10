var Trip;
(function (Trip) {
    var TripResizer = (function () {
        function TripResizer() {
            this.rootCont = ".scheduler";
            this.itemCont = ".block";
            this.lastClass = "last-block";
            this.itemsSelector = this.rootCont + " > " + this.itemCont;
            this.markLasts();
            this.initResize();
        }
        TripResizer.prototype.markLasts = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var $is = $(this.itemsSelector);
            console.log("Removing lasts");
            $is.removeClass(this.lastClass);
            $is.last().addClass(this.lastClass);
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(function () {
                console.clear();
                $is.each(function (index, i) {
                    var $i = $(i);
                    var txt = "travel";
                    var placeName = $i.find(".name");
                    if (placeName.length > 0) {
                        txt = placeName.text();
                    }
                    var $nextItem = $i.next(_this.itemCont);
                    var hasNext = $nextItem.length > 0;
                    if (hasNext) {
                        var currentTop = $i.offset().top;
                        var nextTop = $nextItem.offset().top;
                        console.log(txt + ": " + currentTop + " - " + nextTop);
                        if (currentTop < nextTop) {
                            $i.addClass(_this.lastClass);
                        }
                    }
                });
                if (callback) {
                    callback();
                }
            }, 1000);
        };
        TripResizer.prototype.getLast = function ($displayed) {
            var _this = this;
            var $lastInRow;
            if ($displayed.hasClass(this.lastClass)) {
                $lastInRow = $displayed;
            }
            else {
                var $is = $(this.itemsSelector);
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
                    var hasLast = $i.hasClass(_this.lastClass);
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
        TripResizer.prototype.initResize = function () {
            var _this = this;
            $(window).resize(function () {
                if (_this.onBeforeResize) {
                    _this.onBeforeResize();
                }
                _this.markLasts(function () {
                    if (_this.onAfterResize) {
                        _this.onAfterResize();
                    }
                });
            });
        };
        return TripResizer;
    }());
    Trip.TripResizer = TripResizer;
})(Trip || (Trip = {}));
//# sourceMappingURL=TripResizer.js.map