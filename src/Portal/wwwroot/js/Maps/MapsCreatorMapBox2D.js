var Maps;
(function (Maps) {
    var MapsCreatorMapBox2D = (function () {
        function MapsCreatorMapBox2D() {
            this.options = {
                tileLayer: {
                    continuousWorld: false,
                    noWrap: true
                },
                maxBounds: null,
                maxZoom: 19,
                minZoom: 2,
                zoom: 2,
                zoomControl: false,
                center: new L.LatLng(34.5133, -94.1629)
            };
        }
        MapsCreatorMapBox2D.prototype.setRootElement = function (rootElement) {
            this.rootElement = rootElement;
        };
        MapsCreatorMapBox2D.prototype.show = function (mapsLoadedCallback) {
            var self = this;
            self.loadMap();
            mapsLoadedCallback(this.mapObj);
        };
        MapsCreatorMapBox2D.prototype.loadMap = function () {
            var _this = this;
            L.mapbox.accessToken = "pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            this.options.maxBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
            this.mapObj = new L.Map(this.rootElement, this.options);
            $.ajax({
                dataType: "json",
                url: "/geo/custom.geo.json",
                success: function (data) {
                    var myStyle = {
                        "color": "#ff7800",
                        "weight": 1,
                        "opacity": 0.65
                    };
                    $(data.features).each(function (key, data) {
                        var l = new L.GeoJSON(data, { style: myStyle });
                        l.addTo(_this.mapObj);
                    });
                    setTimeout(function () {
                        var mapLayer = L
                            .tileLayer("https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ");
                        _this.mapObj.addLayer(mapLayer);
                        mapLayer.bringToFront();
                    }, 5000);
                }
            }).error(function () { alert("error voe"); });
            this.mapObj.on("move", function (e) {
                if (_this.onCenterChanged) {
                    var c = _this.mapObj.getCenter();
                    _this.onCenterChanged(c);
                }
            });
        };
        MapsCreatorMapBox2D.prototype.loadScript = function (scriptUrl, callback) {
            $.getScript(scriptUrl, function (data, textStatus, jqxhr) {
                callback();
            });
        };
        MapsCreatorMapBox2D.prototype.hide = function () {
            this.mapObj.remove();
        };
        return MapsCreatorMapBox2D;
    }());
    Maps.MapsCreatorMapBox2D = MapsCreatorMapBox2D;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsCreatorMapBox2D.js.map