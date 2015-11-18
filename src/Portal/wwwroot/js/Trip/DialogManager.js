var DialogManager = (function () {
    function DialogManager(planner) {
        this.planner = planner;
        this.placeDetailTemplate = Views.ViewBase.currentView.registerTemplate("placeDetail-template");
        this.travelDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("travelDetailView-template");
        this.travelDetailTemplate = Views.ViewBase.currentView.registerTemplate("travelDetail-template");
        this.visitedItemTemplate = Views.ViewBase.currentView.registerTemplate("visitItem-template");
    }
    DialogManager.prototype.createFilesInstanceView = function (entityId, entityType) {
        var filesConfig = new FilesConfig();
        filesConfig.containerId = "entityDocs";
        filesConfig.templateId = "fileItem-template";
        filesConfig.editable = false;
        filesConfig.addAdder = false;
        filesConfig.entityId = entityId;
        var files = new Files(filesConfig);
        return files;
    };
    DialogManager.prototype.createFilesInstance = function (entityId, entityType) {
        var filesConfig = new FilesConfig();
        filesConfig.containerId = "entityDocs";
        filesConfig.inputId = "entityFileInput";
        filesConfig.templateId = "fileItem-template";
        filesConfig.editable = true;
        filesConfig.addAdder = true;
        filesConfig.entityId = entityId;
        var customData = new TripFileCustom();
        customData.tripId = this.planner.trip.tripId;
        customData.entityId = entityId;
        customData.entityType = entityType;
        var files = new Files(filesConfig);
        files.fileUpload.customConfig = customData;
        return files;
    };
    DialogManager.prototype.initDescription = function (text, entityType) {
        var _this = this;
        $("#dialogDescription").val(text);
        var d = new DelayedCallback("dialogDescription");
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
        $(".daybyday-form").remove();
        $(".daybyday-view").remove();
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
})();
//# sourceMappingURL=DialogManager.js.map