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
            this.inviteDialogView = new Views.InviteDialogView();
            var filesConfig = new Trip.FilesConfig();
            filesConfig.containerId = "filesContainer";
            filesConfig.inputId = "fileInput";
            filesConfig.templateId = "file-template";
            filesConfig.editable = true;
            filesConfig.addAdder = true;
            filesConfig.isMasterFile = true;
            filesConfig.adderContainer = "filesPickerBox";
            this.files = new Trip.Files(filesConfig);
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
        };
        TripDetailView.prototype.setFilesCustomConfig = function (tripId) {
            var customData = new Common.TripFileCustom();
            customData.tripId = tripId;
            this.files.fileUpload.customConfig = customData;
        };
        TripDetailView.prototype.getTrip = function (id) {
            var _this = this;
            var prms = [["id", id]];
            _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
        };
        TripDetailView.prototype.onTripLoaded = function (request) {
            this.trip = request;
            this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);
            this.registerPhotoUpload();
            this.planner = new Trip.Planner(this.trip, true);
        };
        TripDetailView.prototype.registerPhotoUpload = function () {
            var config = new Common.FileUploadConfig();
            config.inputId = "photoInput";
            config.endpoint = "TripPhoto";
            this.pictureUpload = new Common.FileUpload(config);
            this.pictureUpload.customId = this.trip.tripId;
            this.pictureUpload.onProgressChanged = function (percent) {
                //$("#progressBar").text(percent);
            };
            this.pictureUpload.onUploadFinished = function (file, files) {
                //this.files = files;
                //this.displayFiles();
            };
        };
        return TripDetailView;
    })(Views.ViewBase);
    Views.TripDetailView = TripDetailView;
})(Views || (Views = {}));
//# sourceMappingURL=TripDetailView.js.map