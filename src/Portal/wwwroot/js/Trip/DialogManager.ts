module Trip {

	export class DialogManager {
		public placeDetailTemplate: any;
		public placeDetailViewTemplate: any;
		public travelDetailTemplate: any;
		public visitedItemTemplate: any;
		public placeDisplayItemTemplate: any;
		public travelDetailViewTemplate: any;
		public travelDetailViewFriends: any;
		public placeDetailViewFriends: any;

		public selectedId: string;

		public planner: Planner;

		constructor(planner: Planner) {
			this.planner = planner;

			this.placeDetailTemplate = Views.ViewBase.currentView.registerTemplate("placeDetail-template");
			this.placeDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("placeDetailView-template");

			this.travelDetailTemplate = Views.ViewBase.currentView.registerTemplate("travelDetail-template");
			this.travelDetailViewTemplate = Views.ViewBase.currentView.registerTemplate("travelDetailView-template");

			this.visitedItemTemplate = Views.ViewBase.currentView.registerTemplate("visitItem-template");
			this.travelDetailViewFriends = Views.ViewBase.currentView.registerTemplate("travelDetailViewFriends-template");

			this.placeDetailViewFriends = Views.ViewBase.currentView.registerTemplate("placeDetailViewFriends-template");
		}

		public $lastBlockOnRow;

		public insertDialog($html) {				
				var $detail = $(".details");
				$detail.remove();				
				this.$lastBlockOnRow.after($html);
		}


		public createFilesInstanceView(entityId: string, entityType: TripEntityType): TripFiles {
			var filesConfig = new FilesConfig();
			filesConfig.containerId = "entityDocs";
			filesConfig.templateId = "fileView-template";
			filesConfig.editable = false;
			filesConfig.addAdder = false;
			filesConfig.entityId = entityId;
			var files = new TripFiles(filesConfig);

			return files;
		}

		public createFilesInstance(entityId: string, entityType: TripEntityType): TripFiles {
		 var c = new FilesConfig();
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

			var files = new TripFiles(c, cc);
		 
			return files;
		}

		public initDescription(text: string, entityType: TripEntityType) {
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

		public getDialogData(dialogType: TripEntityType, callback: Function) {
			var prms = [["dialogType", dialogType], ["tripId", this.planner.trip.tripId], ["id", this.selectedId]];
			Views.ViewBase.currentView.apiGet("TripPlannerProperty", prms, (response) => {
				callback(response);
			});
		}


		public closeDialog() {
				$(".details").remove();
		}

		public regClose($html) {
			$html.find(".close").click((e) => {
				e.preventDefault();
				this.closeDialog();
				this.deactivate();
			});
		}

		public deactivate() {
			var $place = $(".destination.active");
			$place.removeClass("active");
			$place.closest(".placeCont").find(".tab-cont").empty();

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