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
        //var self = this;
        this.planner = new Planner(this);
        this.files = new Files(this, true);
        this.getTrip(id);
    };
    TripDetailView.prototype.getTrip = function (id) {
        var _this = this;
        var prms = [["id", id]];
        _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
    };
    TripDetailView.prototype.onTripLoaded = function (request) {
        this.trip = request;
        this.files.setTrip(this.trip);
        this.registerPhotoUpload();
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