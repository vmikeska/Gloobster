var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TripViewView = (function (_super) {
        __extends(TripViewView, _super);
        function TripViewView() {
            _super.apply(this, arguments);
        }
        TripViewView.prototype.initialize = function (id) {
            var self = this;
            this.createFilesConfig();
            this.getTrip(id);
            $("#commentSubmit").click(function (e) {
                e.preventDefault();
                self.comments.postComment(self.trip.tripId);
            });
            this.tripMenu = new Views.TripMenu();
        };
        TripViewView.prototype.createFilesConfig = function () {
            var c = new Trip.FilesConfig();
            c.containerId = "filesContainer";
            c.inputId = "fileInput";
            c.editable = false;
            c.addAdder = true;
            c.templateId = "fileView-template";
            this.files = new Trip.TripFiles(c);
        };
        TripViewView.prototype.registerPhotoUpload = function () {
            var _this = this;
            var c = new Common.FileUploadConfig();
            c.inputId = "photoInput";
            c.endpoint = "TripPhoto";
            c.maxFileSize = 7500000;
            c.useMaxSizeValidation = false;
            this.pictureUpload = new Common.FileUpload(c);
            this.pictureUpload.customId = this.trip.tripId;
            var ud = new Common.UploadDialog();
            this.pictureUpload.onProgressChanged = function (percent) {
                if (!ud) {
                    ud.create();
                }
                ud.update(percent);
            };
            this.pictureUpload.onUploadFinished = function (file, files) {
                _this.refreshBackground(_this.trip.tripId);
                ud.destroy();
            };
        };
        TripViewView.prototype.refreshBackground = function (tripId) {
            $("#bckPhoto").css("background", "");
            $("#bckPhoto").css("background", "transparent url('/Trip/TripPicture/" + tripId + "?asdf=" + this.makeRandomString(10) + "') center top no-repeat");
        };
        TripViewView.prototype.getTrip = function (id) {
            var _this = this;
            var prms = [["id", id]];
            _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
        };
        TripViewView.prototype.setFilesCustomConfig = function (tripId) {
            var customData = new Common.TripFileCustom();
            customData.tripId = tripId;
            this.files.fileUpload.customConfig = customData;
        };
        TripViewView.prototype.initAcceptCombo = function () {
            var isOwner = this.trip.ownerId === Views.ViewBase.currentUserId;
            if (!isOwner) {
                var thisParticipant = _.find(this.trip.participants, function (p) {
                    return p.userId === Views.ViewBase.currentUserId;
                });
                var wasInvited = thisParticipant != null;
                if (wasInvited) {
                    var acConfig = {
                        comboId: "invitationState",
                        initialState: thisParticipant.state,
                        tripId: this.trip.tripId
                    };
                    this.acceptCombo = new Trip.AcceptCombo(acConfig);
                    $("#invitationState").show();
                }
            }
        };
        TripViewView.prototype.onTripLoaded = function (request) {
            this.trip = request;
            this.initAcceptCombo();
            this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);
            this.comments = new Trip.Comments();
            this.comments.comments = this.trip.comments;
            this.comments.users = this.trip.users;
            this.comments.displayComments();
            this.planner = new Trip.Planner(this.trip, false);
            this.registerPhotoUpload();
        };
        return TripViewView;
    }(Views.ViewBase));
    Views.TripViewView = TripViewView;
})(Views || (Views = {}));
//# sourceMappingURL=TripViewView.js.map