var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TripViewView = (function (_super) {
    __extends(TripViewView, _super);
    function TripViewView() {
        _super.apply(this, arguments);
    }
    TripViewView.prototype.initialize = function (id) {
        var self = this;
        var filesConfig = new FilesConfig();
        filesConfig.containerId = "filesContainer";
        filesConfig.inputId = "fileInput";
        filesConfig.editable = false;
        filesConfig.addAdder = true;
        filesConfig.templateId = "file-template";
        this.files = new Files(filesConfig);
        this.getTrip(id);
        $("#commentSubmit").click(function () {
            self.comments.postComment(self.trip.tripId);
        });
    };
    TripViewView.prototype.getTrip = function (id) {
        var _this = this;
        var prms = [["id", id]];
        _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
    };
    TripViewView.prototype.setFilesCustomConfig = function (tripId) {
        var customData = new TripFileCustom();
        customData.tripId = tripId;
        this.files.fileUpload.customConfig = customData;
    };
    TripViewView.prototype.onTripLoaded = function (request) {
        this.trip = request;
        this.files.setFiles(this.trip.files, this.trip.tripId);
        this.comments = new Comments();
        this.comments.comments = this.trip.comments;
        this.comments.users = this.trip.users;
        this.comments.displayComments();
        this.planner = new Planner(this.trip);
        this.planner.editable = false;
    };
    TripViewView.prototype.generateButtons = function () {
    };
    return TripViewView;
})(Views.ViewBase);
//# sourceMappingURL=TripViewView.js.map