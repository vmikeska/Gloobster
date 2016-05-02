var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TripDetailView = (function (_super) {
        __extends(TripDetailView, _super);
        function TripDetailView() {
            _super.apply(this, arguments);
        }
        TripDetailView.prototype.initialize = function (id) {
            var _this = this;
            this.createFilesConfig();
            this.setFilesCustomConfig(id);
            this.getTrip(id);
            var ndc = new Common.DelayedCallback("nameInput");
            ndc.callback = function (name) {
                var data = { propertyName: "Name", values: { id: _this.trip.tripId, name: name } };
                _this.apiPut("tripProperty", data, function () { });
            };
            var ddc = new Common.DelayedCallback("description");
            ddc.callback = function (description) {
                var data = { propertyName: "Description", values: { id: _this.trip.tripId, description: description } };
                _this.apiPut("tripProperty", data, function () { });
            };
            var ntdc = new Common.DelayedCallback("notes");
            ntdc.callback = function (notes) {
                var data = { propertyName: "Notes", values: { id: _this.trip.tripId, notes: notes } };
                _this.apiPut("tripProperty", data, function () { });
            };
            $("#public").change(function (e) {
                var isPublic = $(e.target).prop("checked");
                var data = { propertyName: "NotesPublic", values: { id: _this.trip.tripId, isPublic: isPublic } };
                _this.apiPut("tripProperty", data, function () { });
            });
            this.tripMenu = new Views.TripMenu();
        };
        TripDetailView.prototype.createFilesConfig = function () {
            var filesConfig = new Trip.FilesConfig();
            filesConfig.containerId = "filesContainer";
            filesConfig.inputId = "fileInput";
            filesConfig.templateId = "file-template";
            filesConfig.isMasterFile = true;
            filesConfig.editable = true;
            this.files = new Trip.TripFiles(filesConfig);
        };
        TripDetailView.prototype.setFilesCustomConfig = function (tripId) {
            if (this.files.fileUpload) {
                var customData = new Common.TripFileCustom();
                customData.tripId = tripId;
                this.files.fileUpload.customConfig = customData;
            }
        };
        TripDetailView.prototype.getTrip = function (id) {
            var _this = this;
            var prms = [["id", id]];
            _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
        };
        TripDetailView.prototype.onTripLoaded = function (request) {
            this.trip = request;
            this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);
            this.planner = new Trip.Planner(this.trip, true);
        };
        return TripDetailView;
    }(Views.ViewBase));
    Views.TripDetailView = TripDetailView;
})(Views || (Views = {}));
//# sourceMappingURL=TripDetailView.js.map