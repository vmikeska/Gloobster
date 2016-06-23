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
            this.initCombo();
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
        TravelBMgmt.prototype.initCombo = function () {
            var _this = this;
            var c = new Common.PlaceSearchConfig();
            c.providers = "1,0,4";
            c.selOjb = $("#place");
            c.minCharsToSearch = 1;
            c.clearAfterSearch = true;
            var combo = new Common.PlaceSearchBox(c);
            combo.onPlaceSelected = function (newPlaceRequest, clickedPlaceObj) {
                _this.addMeetingPoint(clickedPlaceObj.SourceId, clickedPlaceObj.SourceType, clickedPlaceObj.Name, clickedPlaceObj.Coordinates);
            };
        };
        TravelBMgmt.prototype.addMeetingPoint = function (id, type, text, coords) {
            var data = { sourceId: id, type: type, text: text, coords: coords };
            this.apiPost("meetingPoint", data, function (r) {
            });
        };
        return TravelBMgmt;
    }(Views.ViewBase));
    Views.TravelBMgmt = TravelBMgmt;
})(Views || (Views = {}));
//# sourceMappingURL=TravelBMgmt.js.map