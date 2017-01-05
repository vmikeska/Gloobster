using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class FriendsDomain: IFriendsDomain
	{
		public IDbOperations DB { get; set; }
        public ITripDomain Demandor { get; set; }

		public INotificationsDomain Notification { get; set; }

		public async Task<bool> Unfriend(string myDbUserId, string friendDbUserId)
		{
			var myId = new ObjectId(myDbUserId);
			var friendsId = new ObjectId(friendDbUserId);
			
            bool f1 = await PullId(myId, friendsId, f => f.Friends);
            bool f2 = await PullId(friendsId, myId, f => f.Friends);
            
			return f1 && f2;
		}

        public async Task<bool> Block(string myDbUserId, string friendDbUserId)
        {
            var myId = new ObjectId(myDbUserId);
            var friendsId = new ObjectId(friendDbUserId);

            bool unfriend = await Unfriend(myDbUserId, friendDbUserId);
            bool block = await AddId(myId, friendsId, f => f.Blocked);

            return unfriend && block;
        }

        public async Task<bool> CancelRequest(string myDbUserId, string friendDbUserId)
	    {
            var myId = new ObjectId(myDbUserId);
            var friendsId = new ObjectId(friendDbUserId);

            bool propRes = await PullId(myId, friendsId, f => f.Proposed);
            bool awRes = await PullId(friendsId, myId, f => f.AwaitingConfirmation);

	        return propRes && awRes;
	    }

        public async Task<bool> RequestFriendship(string myDbUserId, string friendDbUserId)
		{
			var myId = new ObjectId(myDbUserId);
			var friendsId = new ObjectId(friendDbUserId);
            var myEntity = DB.FOD<FriendsEntity>(f => f.User_id == myId);
			var friendEntity = DB.FOD<FriendsEntity>(f => f.User_id == friendsId);
			
			bool blocked = friendEntity.Blocked.Contains(myEntity.User_id);
			if (blocked)
			{
				return false;
			}

			bool isAlreadyRequestedFromMe = myEntity.Proposed.Contains(friendEntity.User_id);
			if (isAlreadyRequestedFromMe)
			{
				return true;
			}

            bool isAlreadyRequestedFromFriend = friendEntity.Proposed.Contains(myEntity.User_id);
            if (isAlreadyRequestedFromFriend)
            {
                bool res = await ConfirmFriendship(myDbUserId, friendDbUserId);
                return res;                
            }

            bool awRes = await AddId(friendsId, myId, f => f.AwaitingConfirmation);
            bool propRes = await AddId(myId, friendsId, f => f.Proposed);
            
			var msg = await Notification.Messages.FriendshipRequested(myDbUserId, friendDbUserId);
			Notification.AddNotification(msg);

			return awRes && propRes;
		}

		public async Task<bool> ConfirmFriendship(string myDbUserId, string friendDbUserId)
		{
			var myId = new ObjectId(myDbUserId);
			var friendsId = new ObjectId(friendDbUserId);
			var myEntity = DB.FOD<FriendsEntity>(f => f.User_id == myId);
			var friendEntity = DB.FOD<FriendsEntity>(f => f.User_id == friendsId);

			bool blocked = friendEntity.Blocked.Contains(myEntity.User_id);
			if (blocked)
			{
				return false;
			}

			bool areAlreadyFriends = friendEntity.Friends.Contains(myEntity.User_id);
			if (areAlreadyFriends)
			{
				return true;
			}

			bool wasProposed = myEntity.AwaitingConfirmation.Contains(friendsId) && friendEntity.Proposed.Contains(myId);
			if (!wasProposed)
			{
				return false;
			}

		    bool f1 = await PullId(myId, friendsId, f => f.AwaitingConfirmation);            
            bool f3 = await PullId(friendsId, myId, f => f.Proposed);

            bool f2 = await AddId(myId, friendsId, f => f.Friends);
            bool f4 = await AddId(friendsId, myId, f => f.Friends);
            
			return f1 && f2 && f3 && f4;
		}

	    private async Task<bool> PullId(ObjectId userId, ObjectId friendId, Expression<Func<FriendsEntity, IEnumerable<ObjectId>>> field)
	    {
            var filter = DB.F<FriendsEntity>().Eq(f => f.User_id, userId);
            var update = DB.U<FriendsEntity>().Pull(field, friendId);
            var res = await DB.UpdateAsync(filter, update);
	        bool successful = res.ModifiedCount == 1;
	        return successful;
	    }
        
        private async Task<bool> AddId(ObjectId userId, ObjectId friendId, Expression<Func<FriendsEntity, IEnumerable<ObjectId>>> field)
        {
            var filter = DB.F<FriendsEntity>().Eq(f => f.User_id, userId);
            var update = DB.U<FriendsEntity>().Push(field, friendId);
            var res = await DB.UpdateAsync(filter, update);
            bool successful = res.ModifiedCount == 1;
            return successful;
        }
    }
}
