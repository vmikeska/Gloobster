module Planning {
	export class PlanningTags {

		public get v(): Views.ViewBase {
			return Views.ViewBase.currentView;
		}

		private $cont;
		private type: PlanningType;
		private customId;

		constructor($cont, type, customId) {
			this.$cont = $cont;
			this.type = type;
			this.customId = customId;
		}

		public init() {
			this.getPlaces((places) => {
				this.genPlaces(places);
			});


			var placeSearch = new Common.AllPlacesSearch(this.$cont.find(".place-search"), this.v);
			placeSearch.onPlaceSelected = (r) => {
				if (r.SourceType === SourceType.City) {
					this.changeCitySel(r.SourceId, true, () => {
						this.getPlaces((places) => {
							this.genPlaces(places);
						});
					});
				}

				if (r.SourceType === SourceType.Country) {
					this.changeCountrySel(r.SourceId, true, () => {
						this.getPlaces((places) => {
							this.genPlaces(places);
						});
					});
				}
			};
		}

		private changeCountrySel(cc: string, state: boolean, callback: Function = null) {
			var data = {
				type: this.type,
				cc: cc,
				selected: state,
				customId: null
			};

			this.v.apiPut("SelCountry", data, () => {
				callback();
			});
		}
				
		private changeCitySel(gid, state: boolean, callback: Function = null) {
			var data = {
				type: this.type,
				gid: gid,
				selected: state,
				customId: null
			};

			this.v.apiPut("SelCity", data, () => {
				callback();
			});
		}

		private getPlaces(callback: Function) {
				var data = [["type", this.type.toString()], ["customId", this.customId]];

			this.v.apiGet("DealsPlaces", data, (places) => {
				callback(places);
			});
		}

		private genPlaces(places) {

			var lgc = Common.ListGenerator.init(this.$cont.find(".places-cont"), "map-place-item");
			lgc.clearCont = true;
			lgc.customMapping = (item) => {
				return {
					id: item.code,
					name: item.name,
					type: item.type
				};
			}

			lgc.evnt(".close", (e, $item, $target, item) => {
				if (item.type === FlightCacheRecordType.City) {
					this.changeCitySel(item.code, false, () => {
						$item.remove();
					});	
				}

				if (item.type === FlightCacheRecordType.Country) {
					this.changeCountrySel(item.code, false, () => {
						$item.remove();
					});
				}

							
			});

			lgc.generateList(places);
		}


	}
}