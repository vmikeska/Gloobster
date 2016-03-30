using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using MongoDB.Bson;
using Nito.AsyncEx;

namespace Gloobster.Portal
{
    public class AccountCreator
    {
        private static readonly AsyncLock Lock = new AsyncLock();

        public DbOperations DB;

        public AccountCreator()
        {
            DB = new DbOperations();
        }

        public async Task<AccountEntity> CreateOrReturnAccount(string secret, string userId)
        {
            var accoutExisting1 = DB.FOD<AccountEntity>(e => e.Secret == secret);
            bool accountExists1 = accoutExisting1 != null;
            if (accountExists1)
            {
                return accoutExisting1;
            }

            using (await Lock.LockAsync())
            {
                var accoutExisting = DB.FOD<AccountEntity>(e => e.Secret == secret);
                bool accountExists = accoutExisting != null;
                if (accountExists)
                {
                    return accoutExisting;
                }
                
                var newAccount = new AccountEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Secret = secret,
                    User_id = new ObjectId(userId)                    
                };
                await DB.SaveAsync(newAccount);
                return newAccount;
            }
        }
    }
}