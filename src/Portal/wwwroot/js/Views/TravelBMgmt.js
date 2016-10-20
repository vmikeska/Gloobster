var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TravelBMgmt = (function (_super) {
        __extends(TravelBMgmt, _super);
        function TravelBMgmt() {
            _super.call(this);
            this.initCityCombo();
            this.initPlaceCombo();
            this.genMP();
        }
        TravelBMgmt.prototype.genMP = function () {
            var $mp = $("#mPoints");
            this.apiGet("meetingPoint", [["all", "true"]], function (mps) {
                mps.forEach(function (mp) {
                    $mp.append("<div>" + mp.text + "</div>");
                });
            });
        };
        TravelBMgmt.prototype.initCityCombo = function () {
            var _this = this;
            var $c = $("#city");
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.selOjb = $c;
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            var combo = new Common.PlaceSearchBox(c);
            $c.change(function (newPlaceRequest, clickedPlaceObj) {
                var c = clickedPlaceObj.Coordinates;
                _this.placeCombo.setCoordinates(c.Lat, c.Lng);
            });
        };
        TravelBMgmt.prototype.initPlaceCombo = function () {
            var _this = this;
            var $p = $("#place");
            var c = new Common.PlaceSearchConfig();
            c.providers = "1,4";
            c.selOjb = $("#place");
            c.minCharsToSearch = 1;
            c.clearAfterSearch = true;
            this.placeCombo = new Common.PlaceSearchBox(c);
            $p.change(function (newPlaceRequest, clickedPlaceObj) {
                _this.addMeetingPoint(clickedPlaceObj.SourceId, clickedPlaceObj.SourceType, clickedPlaceObj.Name, clickedPlaceObj.Coordinates);
            });
        };
        TravelBMgmt.prototype.addMeetingPoint = function (id, type, text, coord) {
            var data = { sourceId: id, type: type, text: text, coord: coord };
            this.apiPost("meetingPoint", data, function (r) {
            });
        };
        return TravelBMgmt;
    }(Views.ViewBase));
    Views.TravelBMgmt = TravelBMgmt;
})(Views || (Views = {}));
//# sourceMappingURL=TravelBMgmt.js.map