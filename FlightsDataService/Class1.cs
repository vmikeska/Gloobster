namespace Gloobster.SearchEngine.FlightsDataService
{
    public class ExecClass
    {
        public void Execute()
        {
            var query = GetConnectionQuery();

            var offersDB = new OffersDB();

            offersDB.GetConnection(query);
        }

        public ConnectionQuery GetConnectionQuery()
        {
            var query = new ConnectionQuery
            {
                FromAirport = "FRA",
                ToAirport = "VIE"
            };
            return query;
        }
    }


    public class OffersDB
    {
        public QueryService QS { get; set; }

        public Connection GetConnection(ConnectionQuery query)
        {
            bool exists = QS.ConnectionAlreadyExists(query);
            if (exists)
            {
                //return
            }
            else
            {
                //create
            }

            return null;
        }

        public void CreateEmptyConnection()
        {
            
        }


    }


    public class ConnectionQuery
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
    }

    public class Connection
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
    }

    public class QueryService
    {
        
        public bool ConnectionAlreadyExists(ConnectionQuery query)
        {
            //todo: check if conneciton exists
            return false;
        }


        private Connection GetOfferObject()
        {
            //return obj if exists, if not, create
            return null;
        }

        
    }
}
