var MapsDisplayer;
(function (MapsDisplayer) {
    var PolygonConfig = (function () {
        function PolygonConfig() {
            var defaultColor = '#2F81DE';
            this.borderColor = defaultColor;
            this.borderOpacity = 1;
            this.borderWeight = 1;
            this.fillColor = defaultColor;
            this.fillOpacity = 0.5;
        }
        return PolygonConfig;
    })();
    MapsDisplayer.PolygonConfig = PolygonConfig;
})(MapsDisplayer || (MapsDisplayer = {}));
//# sourceMappingURL=MapDisplayerInts.js.map