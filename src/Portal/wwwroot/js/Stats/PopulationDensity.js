var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Stats;
(function (Stats) {
    var PopulationDensity = (function (_super) {
        __extends(PopulationDensity, _super);
        function PopulationDensity() {
            _super.apply(this, arguments);
        }
        PopulationDensity.prototype.customExe = function () {
            var _this = this;
            this.getData(10000, function (items) {
                console.log(items.length);
                var data = _.map(items, function (i) {
                    var pi = _this.getPopIndex(i.pop);
                    return [i.lat, i.lng, i.pop];
                });
                var heat = L.heatLayer(data, { max: 300 }).addTo(_this.mapObj);
                $(".leaflet-heatmap-layer").css("z-index", 1000);
            });
        };
        PopulationDensity.prototype.heatMapColorForValue = function (value) {
            var h = (1.0 - value) * 240;
            return "hsl(" + h + ", 100%, 50%)";
        };
        PopulationDensity.prototype.getPopIndex = function (pop) {
            if (pop >= 500000) {
                return 1;
            }
            var i = (1.0 / 500000.0) * pop;
            return i;
        };
        PopulationDensity.prototype.getCircleWidth = function (pop) {
            if (pop > 2000000) {
                return 2500;
            }
            if (pop > 1500000) {
                return 2000;
            }
            if (pop > 1000000) {
                return 1500;
            }
            if (pop > 800000) {
                return 1000;
            }
            if (pop > 600000) {
                return 800;
            }
            if (pop > 300000) {
                return 500;
            }
            return 300;
        };
        PopulationDensity.prototype.getData = function (minPopulation, callback) {
            var url = "http://citiesservice1.azurewebsites.net/api/city/mpc/" + minPopulation;
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);
                    callback(data);
                }
                else {
                    alert("error2");
                }
            };
            request.onerror = function () {
                alert("error");
            };
            request.send();
        };
        PopulationDensity.prototype.getCountryStyle = function (cc) {
            return {
                color: "#E02327",
                weight: 1,
                opacity: 1,
                fillColor: "#BCB3B8",
                fillOpacity: 1
            };
        };
        return PopulationDensity;
    }(Stats.CountriesPlugin));
    Stats.PopulationDensity = PopulationDensity;
})(Stats || (Stats = {}));
//# sourceMappingURL=PopulationDensity.js.map