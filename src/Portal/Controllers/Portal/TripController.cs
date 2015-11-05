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
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Portal
{
	public class TripController : PortalBaseController
	{
		public FilesDomain FileDomain { get; set; }

		public TripController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{
			FileDomain = (FilesDomain)filesDomain;
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
			var tripEntity = new TripEntity
			{
				id = ObjectId.GenerateNewId(),
				CreatedDate = DateTime.UtcNow,
				Name = id,
				PortalUser_id = DBUserId
			};

			await DB.SaveAsync(tripEntity);

			return RedirectToAction("Detail", "Trip", tripEntity.id);
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
			viewModel.TripId = trip.id.ToString();
			viewModel.Description = trip.Description;
			viewModel.Notes = trip.Notes;
			viewModel.NotesPublic = trip.NotesPublic;

			if (trip.Participants != null)
			{
				var participantIds = trip.Participants.Select(p => p.PortalUser_id);
				var participantUsers = DB.C<PortalUserEntity>().Where(u => participantIds.Contains(u.id)).ToList();

				viewModel.Participants = participantUsers.Select(p => new TripParticipantViewModel
				{
					DisplayName = p.DisplayName,
					PhotoUrl = "~/images/samples/sample12.jpg"
				}).ToList();
			}

			return View(viewModel);
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

		private bool AlreadyJoined(TripEntity trip, ObjectId userId)
		{
			if (IsUserAdmin(trip))
			{
				return true;
			}

			var participant = GetParticipant(trip, DBUserId);
			return participant.State == ParticipantState.Joined;
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

			var dir = Path.Combine("Trips", tripId);
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

	public class CommentsRequest
	{
		
	}

	

}