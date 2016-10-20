module Trip {
		export class PlaceDialog {
				
		public dialogManager: DialogManager;
		private placeSearch: Common.PlaceSearchBox;
		private addressSearch: Common.PlaceSearchBox;
		private placeToVisitSearch: Common.PlaceSearchBox;

		private files: TripFiles;
			
		constructor(dialogManager: DialogManager) {
			this.dialogManager = dialogManager;
		}

		public display() {
				
				this.dialogManager.getDialogData(TripEntityType.Place, (data) => {
					
					if (this.dialogManager.planner.editable) {
							this.createEdit(data);
					} else {
						this.createView(data);
					}
					
				});
			}

			private createView(data) {
				this.buildTemplateView(data);

				this.files = this.dialogManager.createFilesInstanceView(data.id, TripEntityType.Place);
				this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);					
			}

			private createEdit(data) {

					this.buildTemplateEdit(data);

				this.createNameSearch(data);

				$("#stayAddress").val(data.addressText);

				this.createAddressSearch(data);
				this.regAddressText();

				this.createPlaceToVisitSearch(data);
				this.dialogManager.initDescription(data.description, TripEntityType.Place);

				if (data.wantVisit) {
					data.wantVisit.forEach((place) => {
						this.addPlaceToVisit(place.id, place.selectedName, place.sourceType, place.sourceId);
					});
				}

				this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Place);
				this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);
			}

			private createNameSearch(data) {

				var $c = $("#cities");
					var c = new Common.PlaceSearchConfig();
			c.providers = "0,1,2,3,4";
			c.selOjb = $c;
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;
			c.customSelectedFormat = (place) => this.placeNameCustom(place);

			this.placeSearch = new Common.PlaceSearchBox(c);
			$c.change((e, req, place) => this.onPlaceSelected(req, place));

			if (data.place) {
				this.placeSearch.setText(data.place.selectedName);
			}
		}

		private placeNameCustom(place) {
			var name = "";

			var isSocNetworkPlace = _.contains([SourceType.FB, SourceType.S4, SourceType.Yelp], place.SourceType);
			if (isSocNetworkPlace) {
				name = `${this.takeMaxChars(place.Name, 19)}`;
			}

			if (place.SourceType === SourceType.Country) {
				name = place.CountryCode;
			}

			if (place.SourceType === SourceType.City) {
				name = this.takeMaxChars(place.City, 19) + ", " + place.CountryCode;
			}

			return name;
		}

		private takeMaxChars(str, cnt) {
			if (str.length <= cnt) {
				return str;
			}

			return str.substring(0, cnt - 1) + ".";
		}

		private createPlaceToVisitSearch(data) {
			var $p = $("#placeToVisit");
			var c = new Common.PlaceSearchConfig();
			c.providers = "1,0,4";
			c.selOjb = $p;
			c.minCharsToSearch = 1;
			c.clearAfterSearch = true;

			this.placeToVisitSearch = new Common.PlaceSearchBox(c);
			$p.change((e, req, place) => this.onPlaceToVisitSelected(req, place));

			if (data.place && data.place.coordinates) {
				this.placeToVisitSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
			}
		}

		private createAddressSearch(data) {
			var $p = $("#stayPlace");
			var c = new Common.PlaceSearchConfig();
			c.providers = "1,0,4";
			c.selOjb = $p;
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;
			c.customSelectedFormat = (place) => {
				return place.Name;
			}

			this.addressSearch = new Common.PlaceSearchBox(c);
			$p.change((e, req, place) => this.onAddressSelected(req, place));

			var addressName = "";
			if (data.address) {
				addressName = data.address.selectedName;
			}
			this.addressSearch.setText(addressName);

			if (data.place && data.place.coordinates) {
				this.addressSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
			}				
		}

		private regAddressText() {
				var d = new Common.DelayedCallback("stayAddress");
				d.callback = (text) => {
						var data = this.dialogManager.getPropRequest("addressText", {
								text: text
						});
						this.dialogManager.updateProp(data, (r) => { });
				}
		}

		private buildTemplateView(data) {
			var html = "";
			var context = {
				name: Views.ViewBase.currentView.t("Unnamed", "jsTrip"),
				wantVisit: [],
				hasNoWantVisit: true
			}

			context.wantVisit = _.map(data.wantVisit, (item) => {
				return {
					name: item.selectedName,
					icon: this.getIcon(item.sourceType),
					link: Common.GlobalUtils.getSocLink(item.sourceType, item.sourceId)
				};
			});

			context.hasNoWantVisit = (context.wantVisit.length === 0);

			if (data.place) {
				context.name = data.place.selectedName;
			}

			if (this.dialogManager.planner.isInvited || this.dialogManager.planner.isOwner) {
				var stayName = "";
				if (data.address) {
					stayName = data.address.selectedName;
				}

				context = $.extend(context, {
					stayAddress: data.addressText,
					description: data.description,
					stayName: stayName
				});

				if (data.address) {
					context = $.extend(context, {
						stayIco: this.getIcon(data.address.sourceType),
						stayLink: Common.GlobalUtils.getSocLink(data.address.sourceType, data.address.sourceId),
						hasAddress: true
					});
				}

				html = this.dialogManager.placeDetailViewTemplate(context);
			} else {
				html = this.dialogManager.placeDetailViewFriends(context);
			}

			var $html = $(html);
			this.dialogManager.regClose($html);

			this.dialogManager.insertDialog($html);
		}

		

		private buildTemplateEdit(data) {

			var context = {
				showDelButton: (data.isLastPlace && data.placesCount > 2)
			};

			var $html = $(this.dialogManager.placeDetailTemplate(context));

			var ptt = new PlaceTravelTime(this.dialogManager, data);
			var $time = ptt.create(TripEntityType.Place);
			$html.find(".the-first").after($time);

			$html.find(".delete").click((e) => {
					e.preventDefault();

					var v = Views.ViewBase.currentView;

					var cd = new Common.ConfirmDialog();
					cd.create(v.t("PlaceRemovelDialogTitle", "jsTrip"), v.t("PlaceRemovelDialogBody", "jsTrip"), v.t("Cancel", "jsLayout"), v.t("Delete", "jsLayout"), () => {
							Views.ViewBase.currentView.apiDelete("TripPlanner", [["tripId", data.tripId]], (r) => {
									this.deletePlace(r.placeId, r.travelId);
							});		
					});
					
			});

			this.dialogManager.regClose($html);

			this.dialogManager.insertDialog($html);
		}

		private deletePlace(placeId, travelId) {
			$(`#${placeId}`).remove();
			$(`#${travelId}`).remove();
			this.dialogManager.closeDialog();

			var pm = this.dialogManager.planner.placesMgr;

			pm.removePlaceById(placeId);
			pm.removeTravelById(travelId);			
		}

		private onPlaceToVisitSelected(req, place) {

			var data = this.dialogManager.getPropRequest("placeToVisit", {
				sourceId: req.SourceId,
				sourceType: req.SourceType,
				selectedName: place.Name
			});

			this.dialogManager.updateProp(data, (response) => {
				var id = response.Result;
				this.addPlaceToVisit(id, place.Name, req.SourceType, req.SourceId);
			});
		}

		private onAddressSelected(req, place) {

			$("#stayAddress").val(place.Address);

			var data = this.dialogManager.getPropRequest("address", {
				sourceId: req.SourceId,
				sourceType: req.SourceType,
				selectedName: place.Name,
				address: place.Address,
				lat: place.Coordinates.Lat,
				lng: place.Coordinates.Lng
			});

			this.dialogManager.updateProp(data, (response) => {});
		}

		private onPlaceSelected(req, place) {
			$(".active .name").text(this.placeSearch.lastText);

			var data = this.dialogManager.getPropRequest("place", {
				sourceId: req.SourceId,
				sourceType: req.SourceType,
				selectedName: this.placeSearch.lastText
			});

			var coord = place.Coordinates;
			if (coord) {
				this.addressSearch.setCoordinates(coord.Lat, coord.Lng);
				this.placeToVisitSearch.setCoordinates(coord.Lat, coord.Lng);

				data.values["lat"] = coord.Lat;
				data.values["lng"] = coord.Lng;
			}
				
			this.dialogManager.updateProp(data, (response) => {});
		}

		private addPlaceToVisit(id: string, name: string, sourceType: SourceType, sourceId: string) {
			var iconClass = this.getIcon(sourceType);

			var context = {
				id: id,
				icon: iconClass,
				name: this.takeMaxChars(name, 33),
				link: Common.GlobalUtils.getSocLink(sourceType, sourceId)
			};

			var html = this.dialogManager.visitedItemTemplate(context);
			var $html = $(html);

			$html.find(".delete").click((e) => {
				e.preventDefault();
				var $item = $(e.target);

				var data = this.dialogManager.getPropRequest("placeToVisitRemove", {
					id: $item.closest(".place").data("id")
				});

				this.dialogManager.updateProp(data, (response) => {});
				$html.remove();
			});

			$("#placeToVisit").before($html);
		}

		private getIcon(sourceType: SourceType) {

			switch (sourceType) {
			case SourceType.FB:
				return "icon-facebook";
			case SourceType.S4:
				return "icon-foursquare";
			case SourceType.Yelp:
				return "icon-yelp";
			}

			return "";
		}

	}
}