using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Globalization;
using Gloobster.Common;
using Gloobster.Mappers;

namespace Gloobster.DomainModels
{
    public class TripPlannerDomain: ITripPlannerDomain
	{
		public IDbOperations DB { get; set; }
        public ITripPermissionsDomain Perms { get; set; }

        public string TripId { get; set; }
		public string UserId { get; set; }

		public TripEntity Trip { get; set; }
        
        public void Initialize(string tripId, string userId)
        {
            Perms.HasEditPermissions(tripId, userId, true);
            
            TripId = tripId;
			UserId = userId;

			LoadTrip();						
		}
		

		public async Task<object> UpdateProperty(string propertyName, Dictionary<string, string> values)
		{
			object result = null;

			var tripId = values["tripId"];
			var tripIdObj = new ObjectId(tripId);
			var entityId = values["entityId"];
		    var entityIdObj = new ObjectId(entityId);
			
			if (propertyName == "place")
			{
				var place = new PlaceSE
				{
					SourceType = (SourceType) int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};

				if (values.ContainsKey("lat") && values.ContainsKey("lng"))
				{
					place.Coordinates = new LatLng
					{
						Lat = float.Parse(values["lat"], CultureInfo.InvariantCulture),
						Lng = float.Parse(values["lng"], CultureInfo.InvariantCulture)
					};
				}
				
				await UpdatePlaceProperty(tripIdObj, entityIdObj, "Place", place);
			}

		    if (propertyName == "useCustomAddress")
		    {
		        bool state = bool.Parse(values["state"]);

		        await UpdatePlaceProperty(tripIdObj, entityIdObj, "UseCustomAddress", state);                
		    }

			if (propertyName == "flightFrom")
			{
				var airportId = values["id"];
				var airportName = values["name"];

				var flight = new FlightSE
				{
					Airport_id = new ObjectId(airportId),
					SelectedName = airportName
				};

				await UpdateTravelProperty(tripIdObj, entityIdObj, "FlightFrom", flight);
			}

			if (propertyName == "flightTo")
			{
				var airportId = values["id"];
				var airportName = values["name"];

				var flight = new FlightSE
				{
					Airport_id = new ObjectId(airportId),
					SelectedName = airportName
				};

				await UpdateTravelProperty(tripIdObj, entityIdObj, "FlightTo", flight);
			}

			if (propertyName == "leavingDateTime")
			{
				var travel = Trip.Travels.FirstOrDefault(t => t.id == new ObjectId(entityId));
				UpdateDate(travel.LeavingDateTime, "LeavingDateTime", tripIdObj, entityIdObj, values);				
			}

            if (propertyName == "useTime")
            {
                bool state = bool.Parse(values["state"]);
                var entityType = (TripEntityType)int.Parse(values["entityType"]);

                if (entityType == TripEntityType.Travel)
                {
                    await UpdateTravelProperty(tripIdObj, entityIdObj, "UseTime", state);
                }

                if (entityType == TripEntityType.Place)
                {
                    await UpdatePlaceProperty(tripIdObj, entityIdObj, "UseTime", state);
                }
            }

            if (propertyName == "addressText")
            {
                string text = values["text"];
                await UpdatePlaceProperty(tripIdObj, entityIdObj, "AddressText", text);
            }

            if (propertyName == "arrivingDateTime")
			{
				var travel = Trip.Travels.FirstOrDefault(t => t.id == new ObjectId(entityId));
				UpdateDate(travel.ArrivingDateTime, "ArrivingDateTime", tripIdObj, entityIdObj, values);
			}
			
			if (propertyName == "travelType")
			{
				var travelType = (TravelType) int.Parse(values["travelType"]);
				await UpdateTravelProperty(tripIdObj, entityIdObj, "Type", travelType);
			}

			if (propertyName == "address")
			{
				var address = new PlaceSE
				{
					SourceType = (SourceType)int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};

				if (values.ContainsKey("lat") && values.ContainsKey("lng"))
				{
					address.Coordinates = new LatLng
					{
						Lat = float.Parse(values["lat"], CultureInfo.InvariantCulture),
						Lng = float.Parse(values["lng"], CultureInfo.InvariantCulture)
					};
				}
				
				var addressText = values["address"];				

				await UpdatePlaceProperty(tripIdObj, entityIdObj, "Address", address);
				await UpdatePlaceProperty(tripIdObj, entityIdObj, "AddressText", addressText);				
            }

			if (propertyName == "description")
			{
				//var entityId = values["entityId"];
				var description = values["description"];
				var entityType = (TripEntityType)int.Parse(values["entityType"]);

				if (entityType == TripEntityType.Travel)
				{
					await UpdateTravelProperty(tripIdObj, entityIdObj, "Description", description);
				}
				if (entityType == TripEntityType.Place)
				{
					await UpdatePlaceProperty(tripIdObj, entityIdObj, "Description", description);
				}				
			}

			if (propertyName == "placeToVisit")
			{
				var place = new PlaceIdSE
				{
					id = NewId(),
					SourceType = (SourceType)int.Parse(values["sourceType"]),
					SourceId = values["sourceId"],
					SelectedName = values["selectedName"]
				};
				
				await PushPlaceProperty(tripIdObj, entityIdObj, "WantVisit", place);
				result = place.id;
			}

			if (propertyName == "placeToVisitRemove")
			{				
				var id = values["id"];				
				result = await DeletePlaceToVisit(tripIdObj, entityIdObj, id);				
			}

			return result;			
		}

		private async void UpdateDate(DateTime? oldDate, string propName, ObjectId tripIdObj, ObjectId entityIdObj, Dictionary<string, string> values)
		{
			int day = 0, month = 0, year = 0, hour = 0, minute = 0;

			if (oldDate.HasValue)
			{
				day = oldDate.Value.Day;
				month = oldDate.Value.Month;
				year = oldDate.Value.Year;
				hour = oldDate.Value.Hour;
				minute = oldDate.Value.Minute;
			}
			
			if (values.ContainsKey("day") && values.ContainsKey("month") && values.ContainsKey("year"))
			{
				day = int.Parse(values["day"]);
				month = int.Parse(values["month"]);
				year = int.Parse(values["year"]);				
			}

			if (values.ContainsKey("hour") && values.ContainsKey("minute"))
			{
				hour = int.Parse(values["hour"]);
				minute = int.Parse(values["minute"]);				
			}

			//it's actually not UTC time, but rough. If it's not UTC set, DB recalculates it.
			var newDate = new DateTime(year, month, day, hour, minute, 0, DateTimeKind.Utc);

			await UpdateTravelProperty(tripIdObj, entityIdObj, propName, newDate);
		}
		
		private async Task<bool> PushPlaceProperty(ObjectId tripIdObj, ObjectId placeId, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeId);
			var update = DB.U<TripEntity>().Push("Places.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		private async Task<bool> UpdatePlaceProperty(ObjectId tripIdObj, ObjectId placeIdObj, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeIdObj);
			var update = DB.U<TripEntity>().Set("Places.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;			
		}

		private async Task<bool> UpdateTravelProperty(ObjectId tripIdObj, ObjectId travelIdObj, string propName, object value)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Travels._id", travelIdObj);
			var update = DB.U<TripEntity>().Set("Travels.$." + propName, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		private async Task<bool> DeletePlaceToVisit(ObjectId tripIdObj, ObjectId placeId, string id)
		{
			 var placeToVisit = DB.C<TripEntity>().First(t => t.id == tripIdObj)
				.Places.First(p => p.id == placeId)
				.WantVisit.First(w => w.id == id);

			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Places._id", placeId);
			var update = DB.U<TripEntity>().Pull("Places.$.WantVisit", placeToVisit);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

        public async Task<RemovedPlaceDO> RemoveLastPlace()
        {
            if (Trip.Places.Count <= 2)
            {
                return null;
            }

            TripPlaceSE lastPlace = GetLastPlace();
            TripTravelSE travelToLastPlace = Trip.Travels.First(t => t.id == lastPlace.ArrivingId);

            bool placeRemoved = await RemovePlace(lastPlace.id);
            if (placeRemoved)
            {
                bool travelRemoved = await RemoveTravel(travelToLastPlace.id);
                if (travelRemoved)
                {
                    LoadTrip();

                    var newlastPlace = GetLastPlace();

                    bool updated = await UpdatePlaceProperty(Trip.id, newlastPlace.id, "LeavingId", ObjectId.Empty);
                    if (updated)
                    {
                        return new RemovedPlaceDO
                        {
                            PlaceId = lastPlace.id.ToString(),
                            TravelId = travelToLastPlace.id.ToString()
                        };
                    }
                }                
            }

            return null;
        }

		public async Task<AddPlaceResultDO> AddPlace(NewPlaceDO newPlace)
		{
			TripPlaceSE lastPlace = GetLastPlace();
			var travelToLastPlace = Trip.Travels.First(t => t.id == lastPlace.ArrivingId);
			
			bool addAtTheEnd = (lastPlace.id == new ObjectId(newPlace.SelectorId)) && newPlace.Position == NewPlacePosition.ToRight;
			if (addAtTheEnd)
			{
				var travel = new TripTravelSE
				{
					id = ObjectId.GenerateNewId(),
					Type = TravelType.Walk,
					LeavingDateTime = travelToLastPlace.ArrivingDateTime.Value.AddDays(1),
					ArrivingDateTime = travelToLastPlace.ArrivingDateTime.Value.AddDays(2)
				};
				PushTravel(travel);
				
				var tripIdObj = new ObjectId(TripId);
				await UpdatePlaceProperty(tripIdObj, lastPlace.id, "LeavingId", travel.id);
				
				var place = new TripPlaceSE
				{
					id = ObjectId.GenerateNewId(),
					ArrivingId = travel.id,
					LeavingId = ObjectId.Empty,
					OrderNo =  lastPlace.OrderNo + 1,
					WantVisit = new List<PlaceIdSE>()					
				};
				PushPlace(place);

				var result = new AddPlaceResultDO
				{
					Position = newPlace.Position,
					Place = place.ToDO(),
					Travel = travel.ToDO()
				};

				return result;
			}

			return null;
		}
		


		private void LoadTrip()
		{
			var tripIdObj = new ObjectId(TripId);
			Trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
		}

		private async void PushTravel(TripTravelSE travel)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, Trip.id);
			var update = DB.U<TripEntity>().Push(p => p.Travels, travel);
			var result = await DB.UpdateAsync(filter, update);			
		}

		private async void PushPlace(TripPlaceSE place)
		{
			var filter = DB.F<TripEntity>().Eq(p => p.id, Trip.id);
			var update = DB.U<TripEntity>().Push(p => p.Places, place);
			UpdateResult result = await DB.UpdateAsync(filter, update);			
		}

        private async Task<bool> RemovePlace(ObjectId id)
        {            
            var f = DB.F<TripEntity>().Eq(p => p.id, Trip.id);
            var u = DB.PF<TripEntity, TripPlaceSE>(t => t.Places, c => c.id == id);
            var result = await DB.UpdateAsync(f, u);
            return result.ModifiedCount > 0;
        }

        private async Task<bool> RemoveTravel(ObjectId id)
        {
            var f = DB.F<TripEntity>().Eq(p => p.id, Trip.id);
            var u = DB.PF<TripEntity, TripTravelSE>(t => t.Travels, c => c.id == id);            
            var result = await DB.UpdateAsync(f, u);
            return result.ModifiedCount > 0;
        }

        private TripPlaceSE GetLastPlace()
		{
			if (Trip.Places == null || !Trip.Places.Any())
			{
				return null;
			}

			if (Trip.Places.Count == 1)
			{
				return Trip.Places.First();
			}

			TripPlaceSE result = Trip.Places.First();
			foreach (var place in Trip.Places)
			{
				if (place.OrderNo > result.OrderNo)
				{
					result = place;
				}
			}

			return result;
		}
        
		private string NewId()
		{
			return Guid.NewGuid().ToString().Replace("-", string.Empty);
		}
	}

	
}