using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.ReqRes.Trip;
using MongoDB.Bson;
using Gloobster.Enums;

namespace Gloobster.Mappers
{
	public static class TripMappers
	{
		public static TripUsersResponse ToResponse(this PortalUserEntity entity)
		{
			var request = new TripUsersResponse
			{
				id = entity.id.ToString(),
				displayName = entity.DisplayName,
				photoUrl = entity.ProfileImage
			};

			return request;
		}
		

		public static ParticipantDO ToDO(this ParticipantRequest request, ParticipantState? state = null)
		{
			if (!state.HasValue)
			{
				state = ParticipantState.Invited;
			}

			return new ParticipantDO
			{
				UserId = request.userId,
				IsAdmin = request.isAdmin,
				State = state.Value
			};
		}

		public static ParticipantSE ToEntity(this ParticipantDO dObj)
		{
			var entity = new ParticipantSE
			{
				PortalUser_id = new ObjectId(dObj.UserId),
				State = dObj.State,
				IsAdmin = dObj.IsAdmin
			};

			return entity;
		}


		public static TripResponse ToResponse(this TripEntity entity)
		{
			var response = new TripResponse
			{
				tripId = entity.id.ToString(),
				name = entity.Name,
				createdDate = entity.CreatedDate,
				ownerId = entity.PortalUser_id.ToString()
			};

			if (entity.Comments != null)
			{
				response.comments = entity.Comments.Select(c => c.ToResponse()).ToList();
			}

			if (entity.Files != null)
			{
				response.files = entity.Files.Select(c => c.ToResponse()).ToList();
			}

			if (entity.Travels != null)
			{
				response.travels = entity.Travels.Select(t => t.ToResponse()).ToList();
			}

			if (entity.Places != null)
			{
				response.places = entity.Places.Select(t => t.ToResponse()).ToList();
			}

			return response;
		}

		public static TripPlaceResponse ToResponse(this TripPlaceSE e)
		{
			var r = new TripPlaceResponse
			{
				id = e.Id,
				description = e.Description,				
				arrivingId = e.ArrivingId,
				leavingId = e.LeavingId,
				orderNo = e.OrderNo,
				addressText = e.AddressText
			};

			if (e.Place != null)
			{
				 r.place = e.Place.ToResponse();
			}

			if (e.Address != null)
			{
				r.address = e.Address.ToResponse();
			}

			if (e.WantVisit != null)
			{
				r.wantVisit = e.WantVisit.Select(w => w.ToResponse()).ToList();
			}
			
			return r;
		}

		public static TripPlaceResponse ToResponse(this TripPlaceDO d)
		{
			var r = new TripPlaceResponse
			{
				id = d.Id,
				description = d.Description,
				arrivingId = d.ArrivingId,
				leavingId = d.LeavingId,
				orderNo = d.OrderNo,
				addressText = d.AddressText,				
			};

			if (d.Place != null)
			{
				r.place = d.Place.ToResponse();
			}

			if (d.Address != null)
			{
				r.address = d.Address.ToResponse();
			}

			if (d.WantVisit != null)
			{
				r.wantVisit = d.WantVisit.Select(w => w.ToResponse()).ToList();
			}

			return r;
		}

		public static PlaceIdResponse ToResponse(this PlaceIdDO d)
		{
			var r = new PlaceIdResponse
			{
				id = d.Id,
				selectedName = d.SelectedName,
				sourceId = d.SourceId,
				sourceType = d.SourceType				
			};
			return r;
		}

		public static PlaceIdResponse ToResponse(this PlaceIdSE e)
		{
			var r = new PlaceIdResponse
			{
				id = e.id,
				selectedName = e.SelectedName,
				sourceId = e.SourceId,
				sourceType = e.SourceType				
			};
			return r;
		}

		public static PlaceResponse ToResponse(this PlaceDO d)
		{
			var r = new PlaceResponse
			{
				selectedName = d.SelectedName,
				sourceId = d.SourceId,
				sourceType = d.SourceType,
				coordinates = d.Coordinates
			};
			return r;
		}

		public static PlaceResponse ToResponse(this PlaceSE e)
		{
			var r = new PlaceResponse
			{
				selectedName = e.SelectedName,
				sourceId = e.SourceId,
				sourceType = e.SourceType,
				coordinates = e.Coordinates
			};
			return r;
		}

		public static FlightResponse ToResponse(this FlightSE e)
		{
			var r = new FlightResponse
			{
				id = e.Airport_id.ToString(),
				selectedName = e.SelectedName
			};

			return r;
		}

		public static FlightResponse ToResponse(this FlightDO d)
		{
			var r = new FlightResponse
			{
				id = d.AirportId,
				selectedName = d.SelectedName
			};

			return r;
		}

		public static TripTravelResponse ToResponse(this TripTravelSE e)
		{
			var r = new TripTravelResponse
			{
				id = e.Id,
				type = e.Type,
				description = e.Description,
				leavingDateTime = e.LeavingDateTime,
				arrivingDateTime = e.ArrivingDateTime
			};
			
			if (e.FlightFrom != null)
			{
				r.flightFrom = e.FlightFrom.ToResponse();				
			}

			if (e.FlightTo != null)
			{			
				r.flightTo = e.FlightTo.ToResponse();
			}
			
			return r;
		}

		public static TripTravelResponse ToResponse(this TripTravelDO d)
		{
			var r = new TripTravelResponse
			{
				id = d.Id,
				type = d.Type,
				description = d.Description,
				leavingDateTime = d.LeavingDateTime,
				arrivingDateTime = d.ArrivingDateTime,				
			};



			if (d.FlightFrom != null)
			{
				r.flightFrom = d.FlightFrom.ToResponse();
			}

			if (d.FlightTo != null)
			{
				r.flightTo = d.FlightTo.ToResponse();
			}

			return r;
		}

		public static FileResponse ToResponse(this FileSE entity)
		{
			var response = new FileResponse
			{
				originalFileName = entity.OriginalFileName,
				savedFileName = entity.SavedFileName,
				ownerId = entity.PortalUser_id.ToString(),
				entityId = entity.EntityId
			};

			return response;
		}

		public static CommentResponse ToResponse(this CommentSE entity)
		{
			var request = new CommentResponse
			{
				userId = entity.PortalUser_id.ToString(),
				postDate = entity.PostDate,
				text = entity.Text
			};
			return request;
		}

		public static PlaceDO ToDO(this PlaceSE e)
		{
			var d = new PlaceDO
			{
				SourceType = e.SourceType,
				SourceId = e.SourceId,
				Coordinates = e.Coordinates,
				SelectedName = e.SelectedName
			};

			return d;
		}

		public static PlaceIdDO ToDO(this PlaceIdSE e)
		{
			var d = new PlaceIdDO
			{
				Id = e.id,
				SourceType = e.SourceType,
				SourceId = e.SourceId,				
				SelectedName = e.SelectedName				
			};

			return d;
		}

		public static FlightDO ToDO(this FlightSE e)
		{
			var d = new FlightDO
			{
				SelectedName = e.SelectedName,
				AirportId = e.Airport_id.ToString()
			};

			return d;
		}

		public static TripTravelDO ToDO(this TripTravelSE e)
		{
			var d = new TripTravelDO
			{
				Id = e.Id,
				LeavingDateTime = e.LeavingDateTime,
				ArrivingDateTime = e.ArrivingDateTime,
				Description = e.Description,				
				Type = e.Type
			};

			if (e.FlightTo != null)
			{
				d.FlightTo = e.FlightTo.ToDO();
			}

			if (e.FlightFrom != null)
			{
				d.FlightFrom = e.FlightFrom.ToDO();
			}

			return d;
		}

		public static TripPlaceDO ToDO(this TripPlaceSE e)
		{
			var d = new TripPlaceDO
			{
				AddressText = e.AddressText,
				ArrivingId = e.ArrivingId,
				Id = e.Id,
				Description = e.Description,
				LeavingId = e.LeavingId,
				OrderNo = e.OrderNo
			};

			if (e.Place != null)
			{
				d.Place = e.Place.ToDO();
			}

			if (e.WantVisit != null)
			{
				d.WantVisit = e.WantVisit.Select(w => w.ToDO()).ToList();
			}

			if (e.Address != null)
			{
				d.Address = e.Address.ToDO();
			}

			return d;
		}

	}
}