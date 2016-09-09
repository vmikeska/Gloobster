module Views {

		export class TripResizer {
				public onBeforeResize: Function;
				public onAfterResize: Function;

			private rootCont = ".scheduler";
			private itemCont = ".block";
			private lastClass = "last-block";
			private itemsSelector = `${this.rootCont} > ${this.itemCont}`;

			private timeout;
			private $active;
			
			constructor() {					
					this.markLasts();
					this.initResize();
			}

			private markLasts(callback = null) {
					var $is = $(this.itemsSelector);

					console.log("Removing lasts");

					$is.removeClass(this.lastClass);
					$is.last().addClass(this.lastClass);

					if (this.timeout) {
							window.clearTimeout(this.timeout);
					}

					this.timeout = setTimeout(() => {
							console.clear();
							$is.each((index, i) => {
									var $i = $(i);

									var txt = "travel";
									var placeName = $i.find(".name");
									if (placeName.length > 0) {
										txt = placeName.text();
									}
									
								  var $nextItem = $i.next(this.itemCont);
									var hasNext = $nextItem.length > 0;
									if (hasNext) {
											var currentTop = $i.offset().top;
											var nextTop = $nextItem.offset().top;

											console.log(`${txt}: ${currentTop} - ${nextTop}`);

											if (currentTop < nextTop) {
													$i.addClass(this.lastClass);	
											}								
									}
							});

							if (callback) {
									callback();
							}

					}, 1000);
			}
			
			public getLast($displayed) {

					var $lastInRow;

					if ($displayed.hasClass(this.lastClass)) {
							$lastInRow = $displayed;
					} else {
							var $is = $(this.itemsSelector);

							var isArray = $is.toArray();
							isArray = _.sortBy(isArray, (index, item) => {
									var $i = $(item);
									return $i.data("no");
							});

							var $last = $(_.last(isArray));

							var clickedNo = $displayed.data("no");
							var foundStart = false;

							isArray.some((i) => {
									var $i = $(i);
									var txt = $i.html();

									var hasLast = $i.hasClass(this.lastClass);

									if (foundStart && hasLast) {
											$lastInRow = $i;
											return true;
									}

									if ($last.data("no") === $i.data("no")) {
											return true;
									}

									if (clickedNo === $i.data("no")) {
											foundStart = true;
									}
							});
					}

					return $lastInRow;
			}
			
			private initResize() {
					
					$(window).resize(() => {						
							if (this.onBeforeResize) {
								this.onBeforeResize();
							}
							
							this.markLasts(() => {
									if (this.onAfterResize) {
											this.onAfterResize();
									}									
							});

					});
			}
	}

	export class TripDetailView extends ViewBase {
		trip: any;
		files: Trip.TripFiles;
		pictureUpload: Common.FileUpload;

		tripMenu: TripMenu;
		
		planner: Trip.Planner;
		
		initialize(id: string) {

			this.createFilesConfig();
			this.setFilesCustomConfig(id);
			this.getTrip(id);

			var ndc = new Common.DelayedCallback("nameInput");
			ndc.callback = (name) => {
				var data = { propertyName: "Name", values: { id: this.trip.tripId, name: name } };
				this.apiPut("tripProperty", data, () => {});
			}

			var ddc = new Common.DelayedCallback("description");
			ddc.callback = (description) => {
				var data = { propertyName: "Description", values: { id: this.trip.tripId, description: description } };
				this.apiPut("tripProperty", data, () => {});
			}

			var ntdc = new Common.DelayedCallback("notes");
			ntdc.callback = (notes) => {
				var data = { propertyName: "Notes", values: { id: this.trip.tripId, notes: notes } };
				this.apiPut("tripProperty", data, () => {});
			}

			$("#public").change((e) => {
				var isPublic = $(e.target).prop("checked");
				var data = { propertyName: "NotesPublic", values: { id: this.trip.tripId, isPublic: isPublic } };
				this.apiPut("tripProperty", data, () => {});
			});

			this.tripMenu = new TripMenu();
				
		}

	 private createFilesConfig() {
		var filesConfig = new Trip.FilesConfig();
		filesConfig.containerId = "filesContainer";		
		filesConfig.inputId = "fileInput";		
		filesConfig.templateId = "fileItem-template";			 
		filesConfig.isMasterFile = true;
		
		//finish DnD functionality ?
		filesConfig.editable = true;
		//filesConfig.mainContainerId = "filesContainer";
		//filesConfig.addAdder = true;
		//filesConfig.adderTemplate = "fileCreateGeneral-template";

		this.files = new Trip.TripFiles(filesConfig);
	 }

		private setFilesCustomConfig(tripId: string) {
			if (this.files.fileUpload) {
				var customData = new Common.TripFileCustom();
				customData.tripId = tripId;
				this.files.fileUpload.customConfig = customData;
			}
		}

		private getTrip(id: string) {
			var prms = [["id", id]];
			super.apiGet("trip", prms, (request) => this.onTripLoaded(request));
		}

		private onTripLoaded(request) {
			this.trip = request;

			this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);			
			this.planner = new Trip.Planner(this.trip, true);
		}
	 
	}
}