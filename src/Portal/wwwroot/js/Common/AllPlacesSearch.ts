module Common {
		

	export class AllPlacesSearch {

		public onPlaceSelected: Function;

		private baseProviders = this.provToStr([SourceType.City, SourceType.Country]);
		private socProv = [SourceType.FB, SourceType.S4, SourceType.Yelp];
		private socNetProviders = this.provToStr(this.socProv);

		private itemTmp = Views.ViewBase.currentView.registerTemplate("place-tag-template");

		private coordinates: any;
		private lastQuery: string;
		private searchOnSoc = false;

		private $root;
		private $input;
		private $cities;
		private $countries;
		private $socials;
		private $results;
			
		private delayedCallback: Common.DelayedCallback;

		private v: Views.ViewBase;
			
		constructor($root, v: Views.ViewBase) {
			this.v = v;
			this.$root = $root;
			this.$input = $root.find(".inputed");
			this.$cities = $root.find(".sect-cities");
			this.$countries = $root.find(".sect-countries");
			this.$socials = $root.find(".sect-social");
			this.$results = $root.find(".place-search-results");

			this.regCallback();
			this.regSearchSoc();

			this.$root.find(".close").click((e) => {
					e.preventDefault();

					this.show(false);
					this.clear();

			});
		}
			
		private shouldCreateCheckin() {
			return this.$root.find("#cbCreateCheckin").prop("checked");
		}

		private regSearchSoc() {
			var $btn = this.$root.find("#socSearchBtn");

			$btn.click((e) => {
						e.preventDefault();

						this.$socials.toggleClass("hidden");

						this.searchSoc();

				this.searchOnSoc = true;

				$btn.hide();
			});

		}

		private searchSoc() {
			
			this.search(this.lastQuery, false, (places) => {

					this.fillContent(places, this.$socials, false);
				
			});
		}
			
		private getByType(places, type: SourceType) {
			return _.filter(places, (p) => { return p.SourceType === type; });
		}
			
		private regCallback() {
			this.delayedCallback = new Common.DelayedCallback(this.$input);
			this.delayedCallback.callback = (query) => {
				this.lastQuery = query;

				this.search(query, true, (places) => {
						var cities = this.getByType(places, SourceType.City);

						this.fillContent(cities, this.$cities, true);

						var countries = this.getByType(places, SourceType.Country);

						this.fillContent(countries, this.$countries, false);

						this.show(true);

						if (this.searchOnSoc) {
								this.searchSoc();
						}
				});
			};
		}

		private show(state) {
			if (state) {
				this.$results.removeClass("hidden");
			} else {
				this.$results.addClass("hidden");
			}
		}

		private fillContent(items, $section, showCC: boolean) {

				if (!any(items)) {
					$section.addClass("hidden");
				}
				
			var $cont = $section.find(".content");

				var lg = Common.ListGenerator.init($cont, "place-tag-template");
			 lg.clearCont = true;

				lg.customMapping = (item) => {
					var r = {
						id: item.SourceId,
						type: item.SourceType,
						icon: this.getIcon(item.SourceType),
						name: item.Name,
						showCC: showCC,
						cc: item.CountryCode
						};
						
					return r;
			 }

			lg.evnt(null, (e, $item, $target, item) => {					

					this.show(false);
					this.clear();

					if (this.onPlaceSelected) {
							var req = { SourceType: item.SourceType, SourceId: item.SourceId, CheckToSoc: this.shouldCreateCheckin() };
						this.onPlaceSelected(req);
					}
					
				});

				lg.generateList(items);

				if (any(items)) {
						$section.removeClass("hidden");
				}

		}

			private clear() {
					this.$input.val("");
			}





		public search(query: string, isBase: boolean, callback) {
			this.loader(true);

			if (query) {
				this.show(true);
			} else {
				this.show(false);
				this.loader(false);
				return;
			}

			var provs = isBase ? this.baseProviders : this.socNetProviders;

			var params = [["placeName", query], ["types", provs]];
			if (this.coordinates) {
				params.push(["lat", this.coordinates.lat]);
				params.push(["lng", this.coordinates.lng]);
			}

			if (Views.ViewBase.fbt) {
					params.push(["fbt", Views.ViewBase.fbt]);
			}

			Views.ViewBase.currentView.apiGet("place", params, (places) => {
				callback(places);
				this.loader(false);
			});
		}

		public setCoordinates(lat, lng) {
			this.coordinates = { lat: lat, lng: lng };
		}
			
		//		countryCode: item.CountryCode

		private getIcon(sourceType: SourceType) {
			switch (sourceType) {
			case SourceType.FB:
				return "facebook2";
			case SourceType.City:
				return "city";
			case SourceType.Country:
				return "country";
			case SourceType.S4:
				return "foursquare";
			case SourceType.Yelp:
				return "yelp";
			}
			return "";
		}

		private loader(state: boolean) {
			if (state) {
				this.$root.find(".loader").show();
			} else {
				this.$root.find(".loader").hide();
			}

		}

		private provToStr(itms) {
			var res = _.map(itms, (i) => { return i.toString(); });
			return res.join();
		}
	}

	

}