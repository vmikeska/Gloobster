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
            this.regSettings();
        }
        TripListView.prototype.regSettings = function () {
            $(".setting").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                $t.closest(".trip-holder").find(".trip-menu").slideToggle();
            });
        };
        TripListView.prototype.registerTripDeletion = function () {
            var _this = this;
            $(".deleteTrip").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var tid = $target.closest(".trip-menu").data("tid");
                var dialog = new Common.ConfirmDialog();
                dialog.create(_this.t("TripDelTitle", "jsTrip"), _this.t("TripDelMessage", "jsTrip"), _this.t("Cancel", "jsLayout"), _this.t("Ok", "jsLayout"), function () {
                    _this.apiDelete("Trip", [["id", tid]], function (r) {
                        $("#popup-delete").hide();
                        $("#" + tid).remove();
                    });
                });
            });
        };
        TripListView.prototype.registerUploads = function () {
            var _this = this;
            var $i = $(".photo-link input");
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
                $(".trip-menu").hide();
                $("#tripImg_" + tripId).attr("src", "/Trip/TripPictureSmall_s/" + tripId + "?d=" + _this.makeRandomString(10));
                var $pb = $("#progressBar");
                $pb.hide();
            };
        };
        return TripListView;
    }(Views.ViewBase));
    Views.TripListView = TripListView;
})(Views || (Views = {}));
//# sourceMappingURL=TripListView.js.map