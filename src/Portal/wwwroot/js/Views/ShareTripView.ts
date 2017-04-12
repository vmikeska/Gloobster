module Views {
		export class ShareTripView extends ViewBase {

				private maps: Maps.MapsCreatorMapBox2D;

				private tripId: string;
				private trip: any;

				private cityMarkers = [];
				private cityPopupTemp;
				private travelPopupTemp;
				private map: any;

				constructor(tripId) {
						super();
						this.cityPopupTemp = this.registerTemplate("cityPopup-template");
						this.travelPopupTemp = this.registerTemplate("travelPopup-template");

						this.initialize(tripId);
				}

				private initialize(tripId) {
						this.tripId = tripId;

						this.maps = new Maps.MapsCreatorMapBox2D();
						this.maps.setRootElement("map");
						this.maps.show((map) => {
								this.map = map;

								this.getData((trip) => {
										this.trip = trip;
										this.draw(trip);
								});

						});
				}

				private getTravel(trip, id) {
						return _.find(trip.travels, (t) => { return t.id === id });
				}

				private drawTravelType(coord, type, number, fromPlace, toPlace) {
						var marker =
								L.marker([coord.lat, coord.lng], { icon: this.getIcon(type) })
										.addTo(this.maps.mapObj);

						var context = {
								number: number,
								fromCity: fromPlace.place.selectedName,
								toCity: toPlace.place.selectedName
						};

						this.drawTravelPopUp(marker, context);

						return marker;
				}

				private drawCity(actPlace) {
						var coord = actPlace.place.coordinates;

						var marker = L.marker([coord.Lat, coord.Lng])
								.addTo(this.maps.mapObj);

						var context = {
								cityName: actPlace.place.selectedName,
								bothDates: true,
								fromDate: "",
								toDate: ""
						};

						if (actPlace.leavingDateTime) {
								context.toDate = moment.utc(actPlace.leavingDateTime).format("lll");
						} else {
								context.bothDates = false;
						}

						if (actPlace.arrivingDateTime) {
								context.fromDate = moment.utc(actPlace.arrivingDateTime).format("lll");
						} else {
								context.bothDates = false;
						}

						this.drawCityPopUp(marker, context);

						this.cityMarkers.push(marker);
						return marker;
				}

				private drawCityPopUp(marker, context) {
						var popupContent = this.cityPopupTemp(context);

						marker.bindPopup(popupContent, {
								closeButton: true,
								minWidth: 200
						});
				}

				private drawTravelPopUp(marker, context) {
						var popupContent = this.travelPopupTemp(context);

						marker.bindPopup(popupContent, {
								closeButton: true,
								minWidth: 200
						});
				}

				private getIcon(type) {

						var iconBase = {
								iconUrl: "",
								iconSize: [22, 22], // size of the icon			
								iconAnchor: [11, 11], // point of the icon which will correspond to marker's location			
								//popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
						};

						switch (type) {
								case TravelType.Bus:
										iconBase.iconUrl = this.icoUrl("bus");
										break;
								case TravelType.Car:
										iconBase.iconUrl = this.icoUrl("car");
										break;
								case TravelType.Plane:
										iconBase.iconUrl = this.icoUrl("plane");
										break;
								case TravelType.Ship:
										iconBase.iconUrl = this.icoUrl("ship");
										break;
								case TravelType.Walk:
										iconBase.iconUrl = this.icoUrl("walk");
										break;
								case TravelType.Bike:
										iconBase.iconUrl = this.icoUrl("bike");
										break;
								case TravelType.Train:
										iconBase.iconUrl = this.icoUrl("train");
										break;
						}

						return L.icon(iconBase);
				}

				private icoUrl(type) {
						return `/images/sm/${type}.png`;
				}

				private getCenter(p1, p2) {
						return { lat: (p1.lat + p2.lat) / 2, lng: (p1.lng + p2.lng) / 2 };
				}

				private draw(trip) {

						for (var p = 0; p <= trip.places.length - 1; p++) {

								var actPlace = trip.places[p];

								this.drawCity(actPlace);

								if (actPlace.leavingId) {
										var travel = this.getTravel(trip, actPlace.leavingId);

										var pointList = _.map(travel.waypoints, (p) => { return new L.LatLng(p.Lat, p.Lng); });

										var center = null;
										if (pointList.length === 2) {
												center = this.getCenter(pointList[0], pointList[1]);
										} else if (pointList.length > 2) {
												var ci = Math.floor(pointList.length / 2);
												center = pointList[ci];
										}

										var nextPlace = trip.places[p + 1];
										var no = p + 1;
										this.drawTravelType(center, travel.type, no, actPlace, nextPlace);

										var c = {
												color: "#550000",
												weight: 5,
												opacity: 0.5,
												smoothFactor: 1
										};

										if (_.contains([TravelType.Ship, TravelType.Plane, TravelType.Train], travel.type)) {
												$.extend(c, { dashArray: [5, 5] });
										}

										var firstpolyline = new L.polyline(pointList, c);
										firstpolyline.addTo(this.map);
								}
						}

						var cities = new L.featureGroup(this.cityMarkers);

						this.map.fitBounds(cities.getBounds());
				}

				private getData(callback) {
						var prms = [["tripId", this.tripId]];
						ViewBase.currentView.apiGet("tripShare", prms, (trip) => callback(trip));
				}


		}
}