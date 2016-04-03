﻿using System;
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
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Serilog;
using Gloobster.Portal.Controllers.Api.Trip;

namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public IFilesDomain FileDomain { get; set; }
		public ITripPlannerDomain TripPlanner { get; set; }
		public ISharedMapImageDomain SharedImgDomain { get; set; }
        public IEntitiesDemandor Demandor { get; set; }

		public TripController(IEntitiesDemandor demandor, ISharedMapImageDomain sharedImgDomain, ITripPlannerDomain tripPlanner, IFilesDomain filesDomain,
            ILogger log, IDbOperations db) : base(log, db)
		{
			FileDomain = filesDomain;
			TripPlanner = tripPlanner;
			SharedImgDomain = sharedImgDomain;
		    Demandor = demandor;
		}

        [CreateAccount]
        public async Task<IActionResult> List(string id)
        {
            var viewModel = CreateViewModelInstance<ViewModelTrips>();
            viewModel.Trips = new List<TripItemViewModel>();
            viewModel.DisplayType = string.IsNullOrEmpty(id) || (id == "grid");

            if (IsUserLogged)
            {
                var trips = DB.List<TripEntity>(t => t.PortalUser_id == UserIdObj);

                var query = $"{{ 'Participants.PortalUser_id': ObjectId('{UserId}')}}";
                var invitedTrips = await DB.FindAsync<TripEntity>(query);

                var myTripsVM = new List<TripItemViewModel>();
                foreach (var t in trips)
                {
                    var tc = await TripToViewModel(t);
                    myTripsVM.Add(tc);
                }

                var invitedTripsVM = new List<TripItemViewModel>();
                foreach (var t in invitedTrips)
                {
                    var tc = await TripToViewModel(t);
                    invitedTripsVM.Add(tc);
                }
                
                viewModel.Trips.AddRange(myTripsVM);
                viewModel.Trips.AddRange(invitedTripsVM);
            }
            
            return View(viewModel);
        }

        [CreateAccount]
        public IActionResult Detail(string id)
        {
            var tripIdObj = new ObjectId(id);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
            
            //permissions part            
            bool isOwner = trip.PortalUser_id == UserIdObj;
            if (isOwner)
            {
                var vm = CreateDetailVM(trip);
                return View(vm);
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
            bool thisUserIsAdmin = (thisUserParticipant != null) && thisUserParticipant.IsAdmin;
            if (thisUserIsAdmin)
            {
                var vm = CreateDetailVM(trip);
                return View(vm);
            }

            //user has no admin righs
            return RedirectToAction("NoAdminRights", "Trip");
        }

        [CreateAccount]
        public async Task<IActionResult> Overview(OverviewRequest req)
        {
            var tripIdObj = new ObjectId(req.id);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
            var owner = DB.FOD<UserEntity>(u => u.User_id == trip.PortalUser_id);
            
            //permissions part
            if (trip.FriendsPublic)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            bool isOwner = trip.PortalUser_id == UserIdObj;
            if (isOwner)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
            bool thisUserInvited = thisUserParticipant != null;
            if (thisUserInvited)
            {
                var vm = CretateOverviewVM(trip, owner);
                return View(vm);
            }

            bool sharingByCodeAllowed = !string.IsNullOrEmpty(trip.SharingCode);
            if (sharingByCodeAllowed)
            {
                bool codeMatch = trip.SharingCode == req.sc;
                if (codeMatch)
                {
                    var vm = CretateOverviewVM(trip, owner);
                    return View(vm);
                }
            }

            if (trip.AllowToRequestJoin)
            {
                return RedirectToAction("RequestJoin", "Trip", req.id);
            }

            //trip is completly private
            return RedirectToAction("PrivateTrip", "Trip");
        }

        

        public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetMap(id);			
			return new FileStreamResult(mapStream, "image/png");		
		}

		public IActionResult Share(string id)
		{
		    var tripIdObj = new ObjectId(id);            
		    var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

		    var tripFromTo = GetTripFromTo(trip);
            var fromDate = tripFromTo.Item1;
            var toDate = tripFromTo.Item2;

		    var dateStr = $"{fromDate.Day}.{fromDate.Month}. to {toDate.Day}.{toDate.Month}. {toDate.Year}";

            var owner = DB.C<UserEntity>().FirstOrDefault(u => u.id == trip.PortalUser_id);

            var viewModel = CreateViewModelInstance<ViewModelShareTrip>();
		    viewModel.Id = id;
            viewModel.Participants = GetParticipantsView(trip.Participants, trip.PortalUser_id);
		    viewModel.OwnerId = trip.PortalUser_id.ToString();
		    viewModel.OwnerDisplayName = owner.DisplayName;
		    viewModel.DateRangeStr = dateStr;
            return View(viewModel);
		}
        
		public async Task<IActionResult> CreateNewTrip(string id)
		{
		    if (IsUserLogged)
		    {
		        var tripEntity = await Demandor.CreateNewTripEntity(id, UserIdObj.Value);
		        //var userEntity = DB.FOD<UserEntity>(u => u.User_id == UserIdObj.Value);

		        return RedirectToAction("Detail", "Trip", new {id = tripEntity.id.ToString()});
		    }
		    
            return RedirectToAction("List", "Trip");            
		}
        
        public IActionResult NoAdminRights()
        {
            var viewModel = CreateViewModelInstance<ViewModelNoAdminRights>();
            return View(viewModel);
        }

        public IActionResult PrivateTrip()
	    {
            var viewModel = CreateViewModelInstance<ViewModelTripPrivate>();
            return View(viewModel);            
        }

        public IActionResult RequestJoin(string id)
        {
            var viewModel = CreateViewModelInstance<ViewModelTripRequestJoin>();
            return View(viewModel);
        }
        
        public IActionResult TripPicture(string id)
        {
            var stream = GetPicture(id, TripFileConstants.BigPicNameExt);
            return stream;
        }

        public IActionResult TripPictureSmall_s(string id)
        {
            var stream = GetPicture(id, TripFileConstants.SmallPicNameExt_s);
            return stream;            
        }

        public IActionResult TripPictureSmall_xs(string id)
        {
            var stream = GetPicture(id, TripFileConstants.SmallPicNameExt_xs);
            return stream;
        }




        private FileStreamResult GetPicture(string tripId, string picName)
	    {
            //var tripIdObj = new ObjectId(tripId);
            //var trip = DB.C<TripEntity>().FirstOrDefault(u => u.id == tripIdObj);
            var tripDir = FileDomain.Storage.Combine(TripFileConstants.FileLocation, tripId);
            
            var filePath = FileDomain.Storage.Combine(tripDir, picName);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(tripDir, picName);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
	    }

        private ParticipantSE GetParticipant(TripEntity trip, ObjectId userId)
		{
			if (trip.Participants == null)
			{
				return null;
			}

			var participant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
			return participant;
		}
	
		private bool IsUserAdmin(TripEntity trip)
		{
			bool isOwner = trip.PortalUser_id == UserIdObj;
			if (isOwner)
			{
				return true;
			}

			var participant = GetParticipant(trip, UserIdObj.Value);
			if (participant == null)
			{
				return false;
			}

			return participant.IsAdmin;
		}
		
		public IActionResult GetFile(string fileId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
            var fileIdObj = new ObjectId(fileId);
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
			var fileToReturn = trip.Files.FirstOrDefault(f => f.id == fileIdObj);

			if (fileToReturn == null)
			{
				//thorw not found
				throw new Exception();
			}

			var dir = Path.Combine("trips", tripId);
			var fileStream = FileDomain.GetFile(dir, fileToReturn.SavedFileName);


			return File(fileStream, fileToReturn.Type, fileToReturn.OriginalFileName);
		}

        private ViewModelTripDetail CretateOverviewVM(TripEntity trip, UserEntity owner)
        {
            var ownerId = trip.PortalUser_id.ToString();
            var ownerIdObj = new ObjectId(ownerId);

            var viewModel = CreateViewModelInstance<ViewModelTripDetail>();
            viewModel.Name = trip.Name;
            viewModel.IsUserAdmin = IsUserAdmin(trip);
            viewModel.OwnerDisplayName = owner.DisplayName;
            viewModel.OwnerId = ownerId;
            viewModel.TripId = trip.id.ToString();
            viewModel.Description = trip.Description;
            viewModel.Notes = trip.Notes;
            viewModel.NotesPublic = trip.NotesPublic;
            viewModel.IsOwner = (trip.PortalUser_id == UserIdObj);
            viewModel.HasBigPicture = trip.HasBigPicture;
            viewModel.Participants = GetParticipantsView(trip.Participants, ownerIdObj);
            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == UserIdObj);
            viewModel.ThisUserInvited = thisUserParticipant != null;

            return viewModel;
        }
        
        private List<UserViewModel> GetParticipantsView(List<ParticipantSE> participants, ObjectId ownerId)
        {
            var participantIds = participants.Where(p => p.State == ParticipantState.Accepted).Select(p => p.PortalUser_id).ToList();
            participantIds.Add(ownerId);
            var participantUsers = DB.C<UserEntity>().Where(u => participantIds.Contains(u.id)).ToList();

            var prtcs = participantUsers.Select(p => new UserViewModel
            {
                Name = p.DisplayName,
                Id = p.id.ToString()
            }).ToList();

            return prtcs;
        }

        private ViewModelTripDetail CreateDetailVM(TripEntity trip)
        {
            var viewModel = CreateViewModelInstance<ViewModelTripDetail>();
            viewModel.Name = trip.Name;
            viewModel.TripId = trip.id.ToString();
            viewModel.Description = trip.Description;
            viewModel.Notes = trip.Notes;
            viewModel.NotesPublic = trip.NotesPublic;

            return viewModel;
        }

        private async Task<TripItemViewModel> TripToViewModel(TripEntity trip)
		{
            var tripFromTo = GetTripFromTo(trip);
            var fromDate = tripFromTo.Item1;
            var toDate = tripFromTo.Item2;

            var owner = DB.FOD<UserEntity>(u => u.User_id == trip.PortalUser_id);
            
            var vm = new TripItemViewModel
			{
				Id = trip.id.ToString(),
                FromDate = fromDate,
                ToDate = toDate,                
				Name = trip.Name,
                Participants = GetParticipantsView(trip.Participants, trip.PortalUser_id),
                HasSmallPicture = trip.HasSmallPicture,

                IsOwner = trip.PortalUser_id == UserIdObj.Value,
                OwnerName = owner.DisplayName,
                OwnerId = trip.PortalUser_id.ToString(),

				IsLocked = true
			};
			return vm;
		}
        private Tuple<DateTime, DateTime> GetTripFromTo(TripEntity trip)
        {
            var ordredPlaces = trip.Places.OrderBy(t => t.OrderNo);
            var firstPlace = ordredPlaces.First();
            var lastPlace = ordredPlaces.Last();
            var firstTravel = trip.Travels.FirstOrDefault(t => t.id == firstPlace.LeavingId);
            var lastTravel = trip.Travels.FirstOrDefault(t => t.id == lastPlace.ArrivingId);
            var fromDate = firstTravel.LeavingDateTime.Value;
            var toDate = lastTravel.ArrivingDateTime.Value;

            return new Tuple<DateTime, DateTime>(fromDate, toDate);
        }
    }

    public class OverviewRequest
    {
        public string id { get; set; }
        public string sc { get; set; }
    }

}