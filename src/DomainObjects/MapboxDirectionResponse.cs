using System.Collections.Generic;

namespace Gloobster.DomainObjects.Mapbox
{    
    public class Geometry
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class Properties
    {
        public string name { get; set; }
    }

    public class Origin
    {
        public string type { get; set; }
        public Geometry geometry { get; set; }
        public Properties properties { get; set; }
    }

    public class Geometry2
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class Properties2
    {
        public string name { get; set; }
    }

    public class Destination
    {
        public string type { get; set; }
        public Geometry2 geometry { get; set; }
        public Properties2 properties { get; set; }
    }

    public class Geometry3
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class Properties3
    {
        public string name { get; set; }
    }

    public class Waypoint
    {
        public string type { get; set; }
        public Geometry3 geometry { get; set; }
        public Properties3 properties { get; set; }
    }

    public class Location
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class Maneuver
    {
        public string instruction { get; set; }
        public string type { get; set; }
        public Location location { get; set; }
    }

    public class Step
    {
        public int distance { get; set; }
        public int duration { get; set; }
        public string way_name { get; set; }
        public string mode { get; set; }
        public string direction { get; set; }
        public int heading { get; set; }
        public Maneuver maneuver { get; set; }
    }

    public class Geometry4
    {
        public string type { get; set; }
        public List<List<double>> coordinates { get; set; }
    }

    public class Route
    {
        public int distance { get; set; }
        public int duration { get; set; }
        public List<Step> steps { get; set; }
        public Geometry4 geometry { get; set; }
        public string summary { get; set; }
    }

    public class MapboxDirectionResponse
    {
        public Origin origin { get; set; }
        public Destination destination { get; set; }
        public List<Waypoint> waypoints { get; set; }
        public List<Route> routes { get; set; }
    }
}
