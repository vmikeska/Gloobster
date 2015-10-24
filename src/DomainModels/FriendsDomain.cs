using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class FriendsDomain: IFriendsDomain
	{
		public IDbOperations DB { get; set; }

		public async Task<bool> Unfriend(string myDbUserId, string friendDbUserId)
		{
			var myId = new ObjectId(myDbUserId);
			var friendsId = new ObjectId(friendDbUserId);
			var myEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == myId);
			var friendEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == friendsId);
			
			friendEntity.Friends.Remove(myId);
			await DB.ReplaceOneAsync(friendEntity);

			myEntity.Friends.Remove(friendsId);
			await DB.ReplaceOneAsync(myEntity);

			return true;
		}

		public async Task<bool> RequestFriendship(string myDbUserId, string friendDbUserId)
		{
			var myId = new ObjectId(myDbUserId);
			var friendsId = new ObjectId(friendDbUserId);
			var myEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == myId);
			var friendEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == friendsId);
			
			bool blocked = friendEntity.Blocked.Contains(myEntity.PortalUser_id);
			if (blocked)
			{
				return false;
			}

			bool isAlreadyRequested = friendEntity.Proposed.Contains(myEntity.PortalUser_id);
			if (isAlreadyRequested)
			{
				return true;
			}

			friendEntity.AwaitingConfirmation.Add(myId);
			await DB.ReplaceOneAsync(friendEntity);

			myEntity.Proposed.Add(friendsId);
			await DB.ReplaceOneAsync(myEntity);

			return true;
		}

		public async Task<bool> ConfirmFriendship(string myDbUserId, string friendDbUserId)
		{
			var myId = new ObjectId(myDbUserId);
			var friendsId = new ObjectId(friendDbUserId);
			var myEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == myId);
			var friendEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == friendsId);

			bool blocked = friendEntity.Blocked.Contains(myEntity.PortalUser_id);
			if (blocked)
			{
				return false;
			}

			bool areAlreadyFriends = friendEntity.Friends.Contains(myEntity.PortalUser_id);
			if (areAlreadyFriends)
			{
				return true;
			}

			bool wasProposed = myEntity.AwaitingConfirmation.Contains(friendsId) && friendEntity.Proposed.Contains(myId);
			if (!wasProposed)
			{
				return false;
			}

			friendEntity.Proposed.Remove(myId);
			friendEntity.Friends.Add(myId);
			await DB.ReplaceOneAsync(friendEntity);

			myEntity.AwaitingConfirmation.Remove(friendsId);
			myEntity.Friends.Add(friendsId);
			await DB.ReplaceOneAsync(myEntity);

			return true;
		}

		public async Task<FriendsDO> CreateFriendsObj(string dbUserId)
		{
			var friendsObj = new FriendsEntity
			{
				id = new ObjectId(),
				PortalUser_id = new ObjectId(dbUserId),
				Friends = new List<ObjectId>(),
				AwaitingConfirmation = new List<ObjectId>(),
				Blocked = new List<ObjectId>(),
				Proposed = new List<ObjectId>()
			};
			await DB.SaveAsync(friendsObj);
			var friendsDo = friendsObj.ToDO();
			return friendsDo;
		}



		public async Task<bool> AddEverbodyToMyFriends(string dbUserId)
	    {
			var myId = new ObjectId(dbUserId);
			var myEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == myId);

			if (myEntity == null)
			{
				myEntity = (await CreateFriendsObj(dbUserId)).ToEntity();
			}
					
			var allUsers = await DB.FindAsync<PortalUserEntity>();
			var allUsersExceptMe = allUsers.Where(u => u.id != myEntity.PortalUser_id).ToList();

		    foreach (var user in allUsersExceptMe)
		    {				
			    if (!myEntity.Friends.Contains(user.id))
			    {
					myEntity.Friends.Add(user.id);
			    }
		    }

		    await DB.ReplaceOneAsync(myEntity);
		    return true;
	    }
    }
}
