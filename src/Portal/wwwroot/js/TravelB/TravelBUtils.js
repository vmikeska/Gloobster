var TravelB;
(function (TravelB) {
    var TravelBUtils = (function () {
        function TravelBUtils() {
        }
        TravelBUtils.waitingMins = function (waitingUntil) {
            var now = new Date();
            var untilDate = new Date(waitingUntil);
            var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            var untilUtc = new Date(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate(), untilDate.getUTCHours(), untilDate.getUTCMinutes(), untilDate.getUTCSeconds());
            var dd = Math.abs(nowUtc.getTime() - untilUtc.getTime());
            var diffMins = Math.ceil(dd / (1000 * 60));
            return diffMins;
        };
        TravelBUtils.minsToTimeStr = function (mins) {
            var h = Math.floor(mins / 60);
            var m = mins % 60;
            return h + "h " + m + "m";
        };
        TravelBUtils.i = function (id, text) {
            return { id: id, text: text };
        };
        TravelBUtils.wdSightseeing = function () {
            return [
                TravelBUtils.i(101, "WalkingTour"),
                TravelBUtils.i(102, "BikeTour"),
                TravelBUtils.i(103, "Trip"),
                TravelBUtils.i(104, "ExhibitionMuseum")
            ];
        };
        TravelBUtils.wdNightlife = function () {
            return [
                TravelBUtils.i(201, "Pub"),
                TravelBUtils.i(202, "Bar"),
                TravelBUtils.i(203, "Club"),
                TravelBUtils.i(204, "Outside")
            ];
        };
        TravelBUtils.wdSport = function () {
            return [
                TravelBUtils.i(301, "Football"),
                TravelBUtils.i(302, "Running"),
                TravelBUtils.i(303, "Basketball"),
                TravelBUtils.i(304, "Tennis"),
                TravelBUtils.i(305, "Squash"),
                TravelBUtils.i(306, "Golf"),
                TravelBUtils.i(307, "Biking"),
                TravelBUtils.i(308, "Baseball"),
                TravelBUtils.i(309, "Hockey")
            ];
        };
        TravelBUtils.wdDate = function () {
            return [
                TravelBUtils.i(401, "OneToOne"),
                TravelBUtils.i(402, "Pairs"),
                TravelBUtils.i(403, "Group")
            ];
        };
        TravelBUtils.wdDining = function () {
            return [
                TravelBUtils.i(501, "Vegan"),
                TravelBUtils.i(502, "International"),
                TravelBUtils.i(503, "DiningAdventure")
            ];
        };
        TravelBUtils.wdEvents = function () {
            return [
                TravelBUtils.i(601, "Cinema"),
                TravelBUtils.i(602, "Concert"),
                TravelBUtils.i(603, "SportMatch")
            ];
        };
        TravelBUtils.getWantDoTaggerData = function () {
            var data = [
                { k: "Sightseeing", id: 100, items: TravelBUtils.wdSightseeing() },
                { k: "Nightlife", id: 200, items: TravelBUtils.wdNightlife() },
                { k: "Sport", id: 300, items: TravelBUtils.wdSport() },
                { k: "Date", id: 400, items: TravelBUtils.wdDate() },
                { k: "Dining", id: 500, items: TravelBUtils.wdDining() },
                { k: "Events", id: 600, items: TravelBUtils.wdEvents() }
            ];
            return data;
        };
        TravelBUtils.wantDoDB = function () {
            var all = [];
            all = all.concat(this.wdSightseeing(), this.wdNightlife(), this.wdSport(), this.wdDate(), this.wdDining(), this.wdEvents());
            return all;
        };
        TravelBUtils.intLifestyle = function () {
            return [
                TravelBUtils.i(101, "Hipster"),
                TravelBUtils.i(102, "ItGuy"),
                TravelBUtils.i(103, "Traveler"),
                TravelBUtils.i(104, "Artist"),
                TravelBUtils.i(105, "SportGuy"),
                TravelBUtils.i(106, "PartyGuy"),
                TravelBUtils.i(107, "Talker"),
                TravelBUtils.i(108, "Listener")
            ];
        };
        TravelBUtils.intMusic = function () {
            return [
                TravelBUtils.i(201, "Rock"),
                TravelBUtils.i(202, "Jazz"),
                TravelBUtils.i(203, "Electro"),
                TravelBUtils.i(204, "DnB"),
                TravelBUtils.i(205, "Techno"),
                TravelBUtils.i(206, "Funk")
            ];
        };
        TravelBUtils.intSomething = function () {
            return [
                TravelBUtils.i(301, "Somthing1"),
                TravelBUtils.i(302, "Somthing2"),
                TravelBUtils.i(303, "Somthing3")
            ];
        };
        TravelBUtils.interestsDB = function () {
            var all = [];
            all = all.concat(this.intLifestyle(), this.intMusic(), this.intSomething());
            return all;
        };
        TravelBUtils.getInterestsTaggerData = function () {
            var data = [
                { k: "Lifestyle", id: 100, items: TravelBUtils.intLifestyle() },
                { k: "Music", id: 200, items: TravelBUtils.intMusic() },
                { k: "Something", id: 300, items: TravelBUtils.intSomething() }
            ];
            return data;
        };
        TravelBUtils.langsDB = function () {
            return [
                TravelBUtils.i("en", "English"),
                TravelBUtils.i("de", "German"),
                TravelBUtils.i("cz", "Czech"),
                TravelBUtils.i("es", "Spanish"),
                TravelBUtils.i("pt", "Portuguese"),
                TravelBUtils.i("fr", "French")
            ];
        };
        return TravelBUtils;
    }());
    TravelB.TravelBUtils = TravelBUtils;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=TravelBUtils.js.map