var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TripDetailView = (function (_super) {
    __extends(TripDetailView, _super);
    function TripDetailView() {
        _super.apply(this, arguments);
    }
    TripDetailView.prototype.initialize = function (id) {
        var filesConfig = new FilesConfig();
        filesConfig.containerId = "filesContainer";
        filesConfig.inputId = "fileInput";
        filesConfig.templateId = "file-template";
        filesConfig.editable = true;
        filesConfig.addAdder = true;
        filesConfig.isMasterFile = true;
        this.files = new Files(this, filesConfig);
        //this.planner.masterFiles = this.files;
        this.setFilesCustomConfig(id);
        this.getTrip(id);
    };
    TripDetailView.prototype.setFilesCustomConfig = function (tripId) {
        var customData = new TripFileCustom();
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
        this.files.setFiles(this.trip.files, this.trip.tripId);
        this.registerPhotoUpload();
        this.planner = new Planner(this, this.trip);
    };
    TripDetailView.prototype.registerPhotoUpload = function () {
        var config = new FileUploadConfig();
        config.inputId = "photoInput";
        config.owner = this;
        config.endpoint = "TripPhoto";
        this.pictureUpload = new FileUpload(config);
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
//# sourceMappingURL=TripDetailView.js.map