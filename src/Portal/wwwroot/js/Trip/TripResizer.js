var Trip;
(function (Trip) {
    var TripResizer = (function () {
        function TripResizer() {
            this.rootCont = ".scheduler";
            this.itemCont = ".block";
            this.initResize();
        }
        TripResizer.prototype.getLast = function (blockNo) {
            var $lastBlock;
            var can = true;
            var curBlockNo = blockNo;
            while (can) {
                var nextBlockNo = curBlockNo + 1;
                var $i = $(this.rootCont + " " + this.itemCont + "[data-no=\"" + curBlockNo + "\"]");
                var $ni = $(this.rootCont + " " + this.itemCont + "[data-no=\"" + (nextBlockNo) + "\"]");
                var hasNext = $ni.length > 0;
                if (hasNext) {
                    var currentTop = $i.offset().top;
                    var nextTop = $ni.offset().top;
                    if (currentTop < nextTop) {
                        $lastBlock = $i;
                        can = false;
                    }
                }
                else {
                    $lastBlock = $i;
                    can = false;
                }
                curBlockNo++;
            }
            return $lastBlock;
        };
        TripResizer.prototype.initResize = function () {
            var _this = this;
            $(window).resize(function () {
                if (_this.onBeforeResize) {
                    _this.onBeforeResize();
                }
                if (_this.timeout) {
                    window.clearTimeout(_this.timeout);
                }
                _this.timeout = setTimeout(function () {
                    if (_this.onAfterResize) {
                        _this.onAfterResize();
                    }
                }, 300);
            });
        };
        return TripResizer;
    }());
    Trip.TripResizer = TripResizer;
})(Trip || (Trip = {}));
//# sourceMappingURL=TripResizer.js.map