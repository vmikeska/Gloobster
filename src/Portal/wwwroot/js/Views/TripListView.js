var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TripListView = (function (_super) {
        __extends(TripListView, _super);
        function TripListView() {
            var _this = this;
            _super.call(this);
            this.registerUploads();
            $(".menuClose").click(function (e) {
                e.preventDefault();
                $(".trip-menu").hide();
            });
            this.registerTripDeletion();
            $("#newTrip").keypress(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    _this.createNewTrip();
                }
            });
        }
        TripListView.prototype.registerTripDeletion = function () {
            var _this = this;
            $("#deleteTripConfirm").click(function (e) {
                e.preventDefault();
                _this.apiDelete("Trip", [["id", _this.tripIdToDelete]], function (r) {
                    $("#popup-delete").hide();
                    $("#" + _this.tripIdToDelete).remove();
                });
            });
            $(".deleteTrip").click(function (e) {
                e.preventDefault();
                var $a = $(e.target);
                var tid = $a.data("tid");
                _this.tripIdToDelete = tid;
                $("#popup-delete").show();
            });
        };
        TripListView.prototype.registerUploads = function () {
            var _this = this;
            var $i = $(".inputs");
            var inputs = $i.toArray();
            inputs.forEach(function (input) {
                var $input = $(input);
                _this.registerPhotoUpload($input.data("tid"), $input.attr("id"));
            });
        };
        TripListView.prototype.createNewTrip = function () {
            var tripName = $("#newTrip").val();
            if (tripName === "") {
                return;
            }
            window.location.href = "/Trip/CreateNewTrip/" + tripName;
        };
        TripListView.prototype.registerPhotoUpload = function (tripId, inputId) {
            var _this = this;
            var c = new Common.FileUploadConfig();
            c.inputId = inputId;
            c.endpoint = "TripPhotoSmall";
            c.maxFileSize = 5500000;
            c.useMaxSizeValidation = false;
            var pu = new Common.FileUpload(c);
            pu.customId = tripId;
            pu.onProgressChanged = function (percent) {
                var $pb = $("#progressBar");
                $pb.show();
                var pt = percent + "%";
                $(".progress").css("width", pt);
                $pb.find("span").text(pt);
            };
            pu.onUploadFinished = function (file, files) {
                //var d = new Date();
                $(".trip-menu").hide();
                $("#tripImg_" + tripId).attr("src", "/Trip/TripPictureSmall_s/" + tripId + "?d=" + _this.makeRandomString(10));
                var $pb = $("#progressBar");
                $pb.hide();
            };
        };
        return TripListView;
    })(Views.ViewBase);
    Views.TripListView = TripListView;
})(Views || (Views = {}));
//# sourceMappingURL=TripListView.js.map