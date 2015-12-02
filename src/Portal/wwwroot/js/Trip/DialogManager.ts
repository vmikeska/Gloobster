module Trip {

	export class DialogManager {
		public placeDetailTemplate: any;
		public placeDetailViewTemplate: any;
		public travelDetailTemplate: any;
		public visitedItemTemplate: any;
		public placeDisplayItemTemplate: any;
		public travelDetailViewTemplate: any;

		public selectedId: string;

		public planner: Planner;

		constructor(planner: Planner) {
			this.planner = planner;

			this.placeDetailTemplate = Views.ViewBase.currentView.registerTemplate("placeDetail-template");
			this.placeDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("placeDetailView-template");

			this.travelDetailTemplate = Views.ViewBase.currentView.registerTemplate("travelDetail-template");
			this.travelDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("travelDetailView-template");

			this.visitedItemTemplate = Views.ViewBase.currentView.registerTemplate("visitItem-template");
		}

		public createFilesInstanceView(entityId: string, entityType: Common.TripEntityType): Files {
			var filesConfig = new FilesConfig();
			filesConfig.containerId = "entityDocs";
			filesConfig.templateId = "fileItem-template";
			filesConfig.editable = false;
			filesConfig.addAdder = false;
			filesConfig.entityId = entityId;
			var files = new Files(filesConfig);

			return files;
		}

		public createFilesInstance(entityId: string, entityType: Common.TripEntityType): Files {
			var filesConfig = new FilesConfig();
			filesConfig.containerId = "entityDocs";
			filesConfig.inputId = "entityFileInput";
			filesConfig.templateId = "fileItem-template";
			filesConfig.editable = true;
			filesConfig.addAdder = true;
			filesConfig.entityId = entityId;

			var customData = new Common.TripFileCustom();
			customData.tripId = this.planner.trip.tripId;
			customData.entityId = entityId;
			customData.entityType = entityType;

			var files = new Files(filesConfig);

			files.fileUpload.customConfig = customData;

			return files;
		}

		public initDescription(text: string, entityType: Common.TripEntityType) {
			$("#dialogDescription").val(text);

			var d = new Common.DelayedCallback("dialogDescription");
			d.callback = (description) => {
				var data = this.getPropRequest("description", {
					entityType: entityType,
					description: description
				});
				this.updateProp(data, (response) => {});
			}
		}

		public getDialogData(dialogType: Common.TripEntityType, callback: Function) {
			var prms = [["dialogType", dialogType], ["tripId", this.planner.trip.tripId], ["id", this.selectedId]];
			Views.ViewBase.currentView.apiGet("TripPlannerProperty", prms, (response) => {
				callback(response);
			});
		}


		public closeDialog() {
			$(".daybyday-form").remove();
			$(".daybyday-view").remove();
		}

		public regClose($html) {
			$html.find(".close").click((e) => {
				e.preventDefault();
				this.closeDialog();
				this.deactivate();
			});
		}

		public deactivate() {
			$(".destination.active").removeClass("active");

			var $trans = $(".transport.active");
			$trans.removeClass("active");
			$trans.find(".tab").remove();
		}

		public getPropRequest(propName: string, customValues) {
			var data = {
				propertyName: propName,
				values: {
					tripId: this.planner.trip.tripId,
					entityId: this.selectedId
				}
			};
			data.values = $.extend(data.values, customValues);
			return data;
		}

		public updateProp(data, callback) {
			Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => callback(response));
		}
	}
}