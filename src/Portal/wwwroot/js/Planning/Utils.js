var Planning;
(function (Planning) {
    var DelayedCallbackMap = (function () {
        function DelayedCallbackMap() {
            this.delay = 600;
            this.timeoutId = null;
        }
        DelayedCallbackMap.prototype.receiveEvent = function () {
            var _this = this;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = null;
                _this.callback();
            }, this.delay);
        };
        return DelayedCallbackMap;
    }());
    Planning.DelayedCallbackMap = DelayedCallbackMap;
    var GraphicConfig = (function () {
        function GraphicConfig() {
            this.cityIcon = this.getCityIcon();
            this.focusIcon = this.getCityIconFocus();
            this.selectedIcon = this.getSelectedIcon();
        }
        GraphicConfig.prototype.getCityIcon = function () {
            var icon = L.icon({
                iconUrl: '../../images/MapIcons/CityNormal.png',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
            });
            return icon;
        };
        GraphicConfig.prototype.getSelectedIcon = function () {
            var icon = L.icon({
                iconUrl: '../../images/MapIcons/CitySelected.png',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            return icon;
        };
        GraphicConfig.prototype.getCityIconFocus = function () {
            var icon = L.icon({
                iconUrl: '../../images/MapIcons/CityFocus.png',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            return icon;
        };
        return GraphicConfig;
    }());
    Planning.GraphicConfig = GraphicConfig;
    var PolygonConfig = (function () {
        function PolygonConfig() {
            var defaultColor = '#2F81DE';
            this.borderColor = defaultColor;
            this.borderOpacity = 1;
            this.borderWeight = 1;
            this.fillColor = defaultColor;
            this.fillOpacity = 0.5;
        }
        PolygonConfig.prototype.convert = function () {
            return {
                color: this.borderColor,
                opacity: this.borderOpacity,
                weight: this.borderWeight,
                fillColor: this.fillColor,
                fillOpacity: this.fillOpacity
            };
        };
        return PolygonConfig;
    }());
    Planning.PolygonConfig = PolygonConfig;
    var PlanningSender = (function () {
        function PlanningSender() {
        }
        PlanningSender.updateProp = function (data, callback) {
            Views.ViewBase.currentView.apiPut("PlanningProperty", data, function (response) {
                callback(response);
            });
        };
        PlanningSender.pushProp = function (data, callback) {
            Views.ViewBase.currentView.apiPost("PlanningProperty", data, function (response) {
                callback(response);
            });
        };
        PlanningSender.createRequest = function (planningType, propertyName, values) {
            var request = { planningType: planningType, propertyName: propertyName, values: values };
            return request;
        };
        return PlanningSender;
    }());
    Planning.PlanningSender = PlanningSender;
})(Planning || (Planning = {}));
//# sourceMappingURL=Utils.js.map