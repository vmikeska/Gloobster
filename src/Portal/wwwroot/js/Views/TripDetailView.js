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
        var self = this;
        this.files = new Files(this);
        this.getTrip(id);
        $("#commentSubmit").click(function () {
            self.comments.postComment(self.trip.tripId);
        });
    };
    TripDetailView.prototype.getTrip = function (id) {
        var _this = this;
        var prms = [["id", id]];
        _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
    };
    TripDetailView.prototype.onTripLoaded = function (request) {
        this.trip = request;
        this.files.setTrip(this.trip);
        this.comments = new Comments(this);
        this.comments.comments = this.trip.comments;
        this.comments.users = this.trip.users;
        this.comments.displayComments();
    };
    return TripDetailView;
})(Views.ViewBase);
//# sourceMappingURL=TripDetailView.js.map