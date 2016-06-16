var TravelB;
(function (TravelB) {
    var TravelBMap = (function () {
        function TravelBMap() {
        }
        TravelBMap.prototype.create = function (mapId) {
            var _this = this;
            this.mapCreator = new Maps.MapsCreatorMapBox2D();
            this.mapCreator.onCenterChanged = function (c) {
                if (_this.onCenterChanged) {
                    _this.mapMoved(function () {
                        _this.onCenterChanged(c);
                    });
                }
            };
            this.mapCreator.setRootElement(mapId);
            this.mapCreator.show(function (mapObj) {
                _this.mapObj = mapObj;
                _this.onMapCreated(mapObj);
            });
        };
        TravelBMap.prototype.mapMoved = function (callback) {
            var _this = this;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = null;
                callback();
            }, 200);
        };
        return TravelBMap;
    }());
    TravelB.TravelBMap = TravelBMap;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=TravelBMap.js.map