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
                TravelBUtils.i(1001, "Travels"),
                TravelBUtils.i(1002, "Hitchhike"),
                TravelBUtils.i(1003, "Backpacking"),
                TravelBUtils.i(1004, "Camping"),
                TravelBUtils.i(1005, "Sports"),
                TravelBUtils.i(1006, "Books"),
                TravelBUtils.i(1007, "Movies"),
                TravelBUtils.i(1008, "Anime"),
                TravelBUtils.i(1009, "Politics"),
                TravelBUtils.i(1010, "Motors"),
                TravelBUtils.i(1011, "Bio"),
                TravelBUtils.i(1012, "Environment"),
                TravelBUtils.i(1013, "Animals"),
                TravelBUtils.i(1014, "Fitness"),
                TravelBUtils.i(1015, "Games"),
                TravelBUtils.i(1016, "Hipster"),
                TravelBUtils.i(1017, "Naturism"),
                TravelBUtils.i(1018, "Gay"),
                TravelBUtils.i(1019, "Ultras"),
                TravelBUtils.i(1020, "Science"),
                TravelBUtils.i(1021, "Arts"),
                TravelBUtils.i(1022, "Volunteering"),
                TravelBUtils.i(1023, "Vegan"),
                TravelBUtils.i(1024, "Vegetarian"),
                TravelBUtils.i(1025, "Religion"),
                TravelBUtils.i(1026, "Party animal"),
                TravelBUtils.i(1027, "Writing"),
                TravelBUtils.i(1028, "Food lover"),
                TravelBUtils.i(1029, "Alchool"),
                TravelBUtils.i(1030, "Globe trotter"),
                TravelBUtils.i(1031, "Dating"),
                TravelBUtils.i(1032, "Clubbing"),
                TravelBUtils.i(1033, "Pub"),
                TravelBUtils.i(1034, "Fashion"),
                TravelBUtils.i(1035, "IT guy")
            ];
        };
        TravelBUtils.intMusic = function () {
            return [
                TravelBUtils.i(2001, "Classic"),
                TravelBUtils.i(2002, "Electronic"),
                TravelBUtils.i(2003, "Dance"),
                TravelBUtils.i(2004, "Rock"),
                TravelBUtils.i(2005, "Techno"),
                TravelBUtils.i(2006, "Hip hop"),
                TravelBUtils.i(2007, "Folk"),
                TravelBUtils.i(2008, "Pop"),
                TravelBUtils.i(2009, "Blues"),
                TravelBUtils.i(2010, "Jazz"),
                TravelBUtils.i(2011, "Latin"),
                TravelBUtils.i(2012, "Reggae"),
                TravelBUtils.i(2013, "R & B"),
                TravelBUtils.i(2014, "Alternative"),
                TravelBUtils.i(2015, "Grunge"),
                TravelBUtils.i(2016, "Indie"),
                TravelBUtils.i(2017, "Punk"),
                TravelBUtils.i(2018, "Metal"),
                TravelBUtils.i(2019, "Industrial"),
                TravelBUtils.i(2020, "Progressive"),
                TravelBUtils.i(2021, "Rock & Roll"),
                TravelBUtils.i(2022, "Ska"),
                TravelBUtils.i(2023, "Soul"),
                TravelBUtils.i(2024, "Funky"),
                TravelBUtils.i(2025, "Rockabilly"),
                TravelBUtils.i(2026, "Rave")
            ];
        };
        TravelBUtils.intCharacteristic = function () {
            return [
                TravelBUtils.i(3001, "Adventurous"),
                TravelBUtils.i(3002, "Listener"),
                TravelBUtils.i(3003, "Cultured"),
                TravelBUtils.i(3004, "Fair"),
                TravelBUtils.i(3005, "Independent"),
                TravelBUtils.i(3006, "Optimistic"),
                TravelBUtils.i(3007, "Precise"),
                TravelBUtils.i(3008, "Humble"),
                TravelBUtils.i(3009, "Open mind"),
                TravelBUtils.i(3010, "Talkative"),
                TravelBUtils.i(3011, "Extravagant"),
                TravelBUtils.i(3012, "Money"),
                TravelBUtils.i(3013, "Success"),
                TravelBUtils.i(3014, "Love"),
                TravelBUtils.i(3015, "Family"),
                TravelBUtils.i(3016, "Work"),
                TravelBUtils.i(3017, "Career"),
                TravelBUtils.i(3018, "Friends"),
                TravelBUtils.i(3019, "Fun"),
                TravelBUtils.i(3020, "Education")
            ];
        };
        TravelBUtils.interestsDB = function () {
            var all = [];
            all = all.concat(this.intLifestyle(), this.intMusic(), this.intCharacteristic());
            return all;
        };
        TravelBUtils.getInterestsTaggerData = function () {
            var data = [
                { k: "Lifestyle", id: 1000, items: TravelBUtils.intLifestyle() },
                { k: "Music", id: 2000, items: TravelBUtils.intMusic() },
                { k: "Characteristic", id: 3000, items: TravelBUtils.intCharacteristic() }
            ];
            return data;
        };
        TravelBUtils.langsDB = function () {
            return [
                TravelBUtils.i("aa", "Afar"),
                TravelBUtils.i("ab", "Abkhazian"),
                TravelBUtils.i("af", "Afrikaans"),
                TravelBUtils.i("ak", "Akan"),
                TravelBUtils.i("sq", "Albanian"),
                TravelBUtils.i("am", "Amharic"),
                TravelBUtils.i("ar", "Arabic"),
                TravelBUtils.i("an", "Aragonese"),
                TravelBUtils.i("hy", "Armenian"),
                TravelBUtils.i("as", "Assamese"),
                TravelBUtils.i("av", "Avaric"),
                TravelBUtils.i("ae", "Avestan"),
                TravelBUtils.i("ay", "Aymara"),
                TravelBUtils.i("az", "Azerbaijani"),
                TravelBUtils.i("ba", "Bashkir"),
                TravelBUtils.i("bm", "Bambara"),
                TravelBUtils.i("eu", "Basque"),
                TravelBUtils.i("be", "Belarusian"),
                TravelBUtils.i("bn", "Bengali"),
                TravelBUtils.i("bh", "Bihari languages"),
                TravelBUtils.i("bi", "Bislama"),
                TravelBUtils.i("bo", "Tibetan"),
                TravelBUtils.i("bs", "Bosnian"),
                TravelBUtils.i("br", "Breton"),
                TravelBUtils.i("bg", "Bulgarian"),
                TravelBUtils.i("my", "Burmese"),
                TravelBUtils.i("ca", "Catalan"),
                TravelBUtils.i("ch", "Chamorro"),
                TravelBUtils.i("ce", "Chechen"),
                TravelBUtils.i("zh", "Chinese"),
                TravelBUtils.i("cv", "Chuvash"),
                TravelBUtils.i("kw", "Cornish"),
                TravelBUtils.i("co", "Corsican"),
                TravelBUtils.i("cr", "Cree"),
                TravelBUtils.i("cy", "Welsh"),
                TravelBUtils.i("cs", "Czech"),
                TravelBUtils.i("da", "Danish"),
                TravelBUtils.i("de", "German"),
                TravelBUtils.i("dv", "Maldivian"),
                TravelBUtils.i("nl", "Dutch"),
                TravelBUtils.i("dz", "Dzongkha"),
                TravelBUtils.i("el", "Greek"),
                TravelBUtils.i("en", "English"),
                TravelBUtils.i("eo", "Esperanto"),
                TravelBUtils.i("et", "Estonian"),
                TravelBUtils.i("eu", "Basque"),
                TravelBUtils.i("ee", "Ewe"),
                TravelBUtils.i("fo", "Faroese"),
                TravelBUtils.i("fa", "Persian"),
                TravelBUtils.i("fj", "Fijian"),
                TravelBUtils.i("fi", "Finnish"),
                TravelBUtils.i("fr", "French"),
                TravelBUtils.i("fy", "Western Frisian"),
                TravelBUtils.i("ff", "Fulah"),
                TravelBUtils.i("ka", "Georgian"),
                TravelBUtils.i("de", "German"),
                TravelBUtils.i("ga", "Irish"),
                TravelBUtils.i("gl", "Galician"),
                TravelBUtils.i("gv", "Manx"),
                TravelBUtils.i("el", "Greek"),
                TravelBUtils.i("gn", "Guarani"),
                TravelBUtils.i("gu", "Gujarati"),
                TravelBUtils.i("ht", "Haitian"),
                TravelBUtils.i("ha", "Hausa"),
                TravelBUtils.i("he", "Hebrew"),
                TravelBUtils.i("hz", "Herero"),
                TravelBUtils.i("hi", "Hindi"),
                TravelBUtils.i("ho", "Hiri Motu"),
                TravelBUtils.i("hr", "Croatian"),
                TravelBUtils.i("hu", "Hungarian"),
                TravelBUtils.i("hy", "Armenian"),
                TravelBUtils.i("ig", "Igbo"),
                TravelBUtils.i("is", "Icelandic"),
                TravelBUtils.i("io", "Ido"),
                TravelBUtils.i("ii", "Sichuan Yi"),
                TravelBUtils.i("iu", "Inuktitut"),
                TravelBUtils.i("id", "Indonesian"),
                TravelBUtils.i("ik", "Inupiaq"),
                TravelBUtils.i("is", "Icelandic"),
                TravelBUtils.i("it", "Italian"),
                TravelBUtils.i("jv", "Javanese"),
                TravelBUtils.i("ja", "Japanese"),
                TravelBUtils.i("kn", "Kannada"),
                TravelBUtils.i("ks", "Kashmiri"),
                TravelBUtils.i("ka", "Georgian"),
                TravelBUtils.i("kr", "Kanuri"),
                TravelBUtils.i("kk", "Kazakh"),
                TravelBUtils.i("km", "Central Khmer"),
                TravelBUtils.i("ki", "Kikuyu"),
                TravelBUtils.i("rw", "Kinyarwanda"),
                TravelBUtils.i("ky", "Kirghiz"),
                TravelBUtils.i("kv", "Komi"),
                TravelBUtils.i("kg", "Kongo"),
                TravelBUtils.i("ko", "Korean"),
                TravelBUtils.i("kj", "Kuanyama"),
                TravelBUtils.i("ku", "Kurdish"),
                TravelBUtils.i("lo", "Lao"),
                TravelBUtils.i("la", "Latin"),
                TravelBUtils.i("lv", "Latvian"),
                TravelBUtils.i("ln", "Lingala"),
                TravelBUtils.i("lt", "Lithuanian"),
                TravelBUtils.i("lb", "Luxembourgish"),
                TravelBUtils.i("lu", "Luba-Katanga"),
                TravelBUtils.i("lg", "Ganda"),
                TravelBUtils.i("mk", "Macedonian"),
                TravelBUtils.i("mh", "Marshallese"),
                TravelBUtils.i("ml", "Malayalam"),
                TravelBUtils.i("mi", "Maori"),
                TravelBUtils.i("mr", "Marathi"),
                TravelBUtils.i("ms", "Malay"),
                TravelBUtils.i("mk", "Macedonian"),
                TravelBUtils.i("mg", "Malagasy"),
                TravelBUtils.i("mt", "Maltese"),
                TravelBUtils.i("mn", "Mongolian"),
                TravelBUtils.i("mi", "Maori"),
                TravelBUtils.i("ms", "Malay"),
                TravelBUtils.i("my", "Burmese"),
                TravelBUtils.i("na", "Nauru"),
                TravelBUtils.i("nv", "Navajo"),
                TravelBUtils.i("nr", "Ndebele"),
                TravelBUtils.i("nd", "Ndebele"),
                TravelBUtils.i("ng", "Ndonga"),
                TravelBUtils.i("ne", "Nepali"),
                TravelBUtils.i("nl", "Dutch"),
                TravelBUtils.i("no", "Norwegian"),
                TravelBUtils.i("ny", "Chichewa"),
                TravelBUtils.i("oj", "Ojibwa"),
                TravelBUtils.i("or", "Oriya"),
                TravelBUtils.i("om", "Oromo"),
                TravelBUtils.i("pa", "Panjabi"),
                TravelBUtils.i("fa", "Persian"),
                TravelBUtils.i("pi", "Pali"),
                TravelBUtils.i("pl", "Polish"),
                TravelBUtils.i("pt", "Portuguese"),
                TravelBUtils.i("ps", "Pushto"),
                TravelBUtils.i("qu", "Quechua"),
                TravelBUtils.i("rm", "Romansh"),
                TravelBUtils.i("ro", "Romanian"),
                TravelBUtils.i("rn", "Rundi"),
                TravelBUtils.i("ru", "Russian"),
                TravelBUtils.i("sg", "Sango"),
                TravelBUtils.i("sa", "Sanskrit"),
                TravelBUtils.i("si", "Sinhala"),
                TravelBUtils.i("sk", "Slovak"),
                TravelBUtils.i("sl", "Slovenian"),
                TravelBUtils.i("se", "Northern Sami"),
                TravelBUtils.i("sm", "Samoan"),
                TravelBUtils.i("sn", "Shona"),
                TravelBUtils.i("sd", "Sindhi"),
                TravelBUtils.i("so", "Somali"),
                TravelBUtils.i("st", "Sotho"),
                TravelBUtils.i("es", "Spanish"),
                TravelBUtils.i("sq", "Albanian"),
                TravelBUtils.i("sr", "Serbian"),
                TravelBUtils.i("ss", "Swati"),
                TravelBUtils.i("su", "Sundanese"),
                TravelBUtils.i("sw", "Swahili"),
                TravelBUtils.i("sv", "Swedish"),
                TravelBUtils.i("ty", "Tahitian"),
                TravelBUtils.i("ta", "Tamil"),
                TravelBUtils.i("tt", "Tatar"),
                TravelBUtils.i("te", "Telugu"),
                TravelBUtils.i("tg", "Tajik"),
                TravelBUtils.i("tl", "Tagalog"),
                TravelBUtils.i("th", "Thai"),
                TravelBUtils.i("bo", "Tibetan"),
                TravelBUtils.i("ti", "Tigrinya"),
                TravelBUtils.i("to", "Tonga"),
                TravelBUtils.i("tn", "Tswana"),
                TravelBUtils.i("ts", "Tsonga"),
                TravelBUtils.i("tk", "Turkmen"),
                TravelBUtils.i("tr", "Turkish"),
                TravelBUtils.i("tw", "Twi"),
                TravelBUtils.i("ug", "Uighur"),
                TravelBUtils.i("uk", "Ukrainian"),
                TravelBUtils.i("ur", "Urdu"),
                TravelBUtils.i("uz", "Uzbek"),
                TravelBUtils.i("ve", "Venda"),
                TravelBUtils.i("vi", "Vietnamese"),
                TravelBUtils.i("vo", "Volapük"),
                TravelBUtils.i("cy", "Welsh"),
                TravelBUtils.i("wa", "Walloon"),
                TravelBUtils.i("wo", "Wolof"),
                TravelBUtils.i("xh", "Xhosa"),
                TravelBUtils.i("yi", "Yiddish"),
                TravelBUtils.i("yo", "Yoruba"),
                TravelBUtils.i("za", "Zhuang"),
                TravelBUtils.i("zh", "Chinese"),
                TravelBUtils.i("zu", "Zulu")
            ];
        };
        return TravelBUtils;
    }());
    TravelB.TravelBUtils = TravelBUtils;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=TravelBUtils.js.map