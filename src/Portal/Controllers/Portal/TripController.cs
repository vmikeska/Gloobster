using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.IO;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.Entities.Trip;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public IFilesDomain FileDomain { get; set; }
		public ITripPlannerDomain TripPlanner { get; set; }

		public ISharedMapImageDomain SharedImgDomain { get; set; }

		public TripController(ISharedMapImageDomain sharedImgDomain, ITripPlannerDomain tripPlanner, IFilesDomain filesDomain, 
			IDbOperations db) : base(db)
		{
			FileDomain = filesDomain;
			TripPlanner = tripPlanner;
			SharedImgDomain = sharedImgDomain;
		}

		public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetMap(id);			
			return new FileStreamResult(mapStream, "image/png");		
		}

		public IActionResult Share()
		{
			var viewModel = CreateViewModelInstance<ViewModelShareTrip>();
			return View(viewModel);
		}

		public IActionResult List()
		{
			var viewModel = CreateViewModelInstance<ViewModelTrips>();

			var trips = DB.C<TripEntity>().Where(t => t.PortalUser_id == DBUserId).ToList();

			viewModel.Trips = trips.Select(TripToViewModel).ToList();

			return View(viewModel);
		}
		public async Task<IActionResult> CreateNewTrip(string id)
		{

			var travel = new TripTravelSE
			{
				Id = NewId(),
				Type = TravelType.Plane,
				LeavingDateTime = DateTime.UtcNow,
				ArrivingDateTime = DateTime.UtcNow.AddDays(1),
				Description = "Here you can place notes for your travel"				
			};

			var firstPlace = new TripPlaceSE
			{
				Id = NewId(),
				ArrivingId = null,
				LeavingId = travel.Id,
				OrderNo = 1,
				Place = new PlaceSE
				{
					SourceType = SourceType.City,
					SourceId = "2643743",
					SelectedName = "London, GB",
					Coordinates = new LatLng { Lat = 51.50853, Lng = -0.12574 }
				},
				Description = "",
				WantVisit = new List<PlaceIdSE>()
			};

			var secondPlace = new TripPlaceSE
			{
				Id = NewId(),
				ArrivingId = travel.Id,
				LeavingId = null,
				OrderNo = 2,
				Place = new PlaceSE
				{ 
					SourceType = SourceType.City,
					SourceId = "5128581",
					SelectedName = "New York, US",
					Coordinates = new LatLng { Lat = 40.71427, Lng = -74.00597 }
				},
				Description = "",
				WantVisit = new List<PlaceIdSE>(),
			};

			var tripEntity = new TripEntity
			{
				id = ObjectId.GenerateNewId(),
				CreatedDate = DateTime.UtcNow,
				Name = id,
				PortalUser_id = DBUserId,
				Comments = new List<CommentSE>(),
				Files = new List<FileSE>(),
				Travels = new List<TripTravelSE> { travel},
				Places = new List<TripPlaceSE> { firstPlace, secondPlace},
				Participants = new List<ParticipantSE>(),
                FilesPublic = new List<FilePublicSE>()
			};



			await DB.SaveAsync(tripEntity);

			return RedirectToAction("Detail", "Trip", new {id = tripEntity.id.ToString() } );
		}

		//todo: change to normal ObjectId
		private string NewId()
		{
			return Guid.NewGuid().ToString().Replace("-", string.Empty);
		}

		public IActionResult Detail(string id)
		{			
			var tripIdObj = new ObjectId(id);

			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);
			
			var viewModel = CreateViewModelInstance<ViewModelTripDetail>();
			viewModel.Name = trip.Name;			
            viewModel.TripId = trip.id.ToString();
			viewModel.Description = trip.Description;
			viewModel.Notes = trip.Notes;
			viewModel.NotesPublic = trip.NotesPublic;
			
			return View(viewModel);
		}

		public IActionResult Overview(string id)
		{
			var tripIdObj = new ObjectId(id);
			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			var owner = DB.C<PortalUserEntity>().First(u => u.id == trip.PortalUser_id);

			var viewModel = CreateViewModelInstance<ViewModelTripDetail>();
			viewModel.Name = trip.Name;
			viewModel.IsUserAdmin = IsUserAdmin(trip);
			viewModel.OwnerDisplayName = owner.DisplayName;
		    viewModel.OwnerId = owner.id.ToString();
			viewModel.TripId = trip.id.ToString();
			viewModel.Description = trip.Description;
			viewModel.Notes = trip.Notes;
			viewModel.NotesPublic = trip.NotesPublic;
			viewModel.IsOwner = (trip.PortalUser_id == DBUserId);
		    viewModel.Photo = trip.Picture;

			if (trip.Participants != null)
			{
				var participantIds = trip.Participants.Select(p => p.PortalUser_id).ToList();
			    participantIds.Add(DBUserId);
                var participantUsers = DB.C<PortalUserEntity>().Where(u => participantIds.Contains(u.id)).ToList();

				viewModel.Participants = participantUsers.Select(p => new TripParticipantViewModel
				{
					DisplayName = p.DisplayName,
					PhotoUrl = "/PortalUser/ProfilePicture/" + p.id
                }).ToList();
			}

			return View(viewModel);
		}

        public IActionResult TripPicture(string id = null)
        {
            var fileLocation = "tpf";
            var tripIdObj = new ObjectId(id);
            var trip = DB.C<TripEntity>().FirstOrDefault(u => u.id == tripIdObj);

            if (trip.Picture == null)
            {
                return new ObjectResult("");
            }

            var filePath = FileDomain.Storage.Combine(fileLocation, trip.Picture);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(fileLocation, trip.Picture);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return new ObjectResult("");
        }

        private ParticipantSE GetParticipant(TripEntity trip, ObjectId userId)
		{
			if (trip.Participants == null)
			{
				return null;
			}

			var participant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == DBUserId);
			return participant;
		}
	
		private bool IsUserAdmin(TripEntity trip)
		{
			bool isOwner = trip.PortalUser_id == DBUserId;
			if (isOwner)
			{
				return true;
			}

			var participant = GetParticipant(trip, DBUserId);
			if (participant == null)
			{
				return false;
			}

			return participant.IsAdmin;
		}
		
		public IActionResult GetFile(string fileId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw not exists
				throw new Exception();
			}

			if (trip.Files == null)
			{
				//throw not exists
				throw new Exception();
			}

			//todo: check rights				
			var fileToReturn = trip.Files.FirstOrDefault(f => f.SavedFileName == fileId);

			if (fileToReturn == null)
			{
				//thorw not found
				throw new Exception();
			}

			var dir = Path.Combine("trips", tripId);
			var fileStream = FileDomain.GetFile(dir, fileToReturn.SavedFileName);


			return File(fileStream, fileToReturn.Type, fileToReturn.OriginalFileName);
		}
		

		private TripItemViewModel TripToViewModel(TripEntity trip)
		{
			var vm = new TripItemViewModel
			{
				Id = trip.id.ToString(),
				Date = trip.CreatedDate,
				Name = trip.Name,

				ImageBig = "~/images/samples/sample05.jpg",
				IsLocked = true
			};
			return vm;
		}		
	}

	

}