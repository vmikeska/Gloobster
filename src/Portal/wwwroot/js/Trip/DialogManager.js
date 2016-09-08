var Trip;
(function (Trip) {
    var DialogManager = (function () {
        function DialogManager(planner) {
            this.planner = planner;
            this.placeDetailTemplate = Views.ViewBase.currentView.registerTemplate("placeDetail-template");
            this.placeDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("placeDetailView-template");
            this.travelDetailTemplate = Views.ViewBase.currentView.registerTemplate("travelDetail-template");
            this.travelDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("travelDetailView-template");
            this.visitedItemTemplate = Views.ViewBase.currentView.registerTemplate("visitItem-template");
            this.travelDetailViewFriends = Views.ViewBase.currentView.registerTemplate("travelDetailViewFriends-template");
            this.placeDetailViewFriends = Views.ViewBase.currentView.registerTemplate("placeDetailViewFriends-template");
        }
        DialogManager.prototype.createFilesInstanceView = function (entityId, entityType) {
            var filesConfig = new Trip.FilesConfig();
            filesConfig.containerId = "entityDocs";
            filesConfig.templateId = "fileView-template";
            filesConfig.editable = false;
            filesConfig.addAdder = false;
            filesConfig.entityId = entityId;
            var files = new Trip.TripFiles(filesConfig);
            return files;
        };
        DialogManager.prototype.createFilesInstance = function (entityId, entityType) {
            var c = new Trip.FilesConfig();
            c.mainContainerId = "dialogUpload";
            c.containerId = "entityDocs";
            c.inputId = "entityFileInput";
            c.templateId = "fileItem-template";
            c.editable = true;
            c.addAdder = true;
            c.adderTemplate = "fileCreate-template";
            c.entityId = entityId;
            var cc = new Common.TripFileCustom();
            cc.tripId = this.planner.trip.tripId;
            cc.entityId = entityId;
            cc.entityType = entityType;
            var files = new Trip.TripFiles(c, cc);
            return files;
        };
        DialogManager.prototype.initDescription = function (text, entityType) {
            var _this = this;
            $("#dialogDescription").val(text);
            var d = new Common.DelayedCallback("dialogDescription");
            d.callback = function (description) {
                var data = _this.getPropRequest("description", {
                    entityType: entityType,
                    description: description
                });
                _this.updateProp(data, function (response) { });
            };
        };
        DialogManager.prototype.getDialogData = function (dialogType, callback) {
            var prms = [["dialogType", dialogType], ["tripId", this.planner.trip.tripId], ["id", this.selectedId]];
            Views.ViewBase.currentView.apiGet("TripPlannerProperty", prms, function (response) {
                callback(response);
            });
        };
        DialogManager.prototype.closeDialog = function () {
            $(".details").remove();
        };
        DialogManager.prototype.regClose = function ($html) {
            var _this = this;
            $html.find(".close").click(function (e) {
                e.preventDefault();
                _this.closeDialog();
                _this.deactivate();
            });
        };
        DialogManager.prototype.deactivate = function () {
            $(".destination.active").removeClass("active");
            var $trans = $(".transport.active");
            $trans.removeClass("active");
            $trans.find(".tab").remove();
        };
        DialogManager.prototype.getPropRequest = function (propName, customValues) {
            var data = {
                propertyName: propName,
                values: {
                    tripId: this.planner.trip.tripId,
                    entityId: this.selectedId
                }
            };
            data.values = $.extend(data.values, customValues);
            return data;
        };
        DialogManager.prototype.updateProp = function (data, callback) {
            Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, function (response) { return callback(response); });
        };
        return DialogManager;
    }());
    Trip.DialogManager = DialogManager;
})(Trip || (Trip = {}));
//# sourceMappingURL=DialogManager.js.map