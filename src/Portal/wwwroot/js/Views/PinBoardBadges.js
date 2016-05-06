var Views;
(function (Views) {
    var PinBoardBadges = (function () {
        function PinBoardBadges() {
            this.visitedTotal = 0;
            this.europeCities = [
                { i: "london.png", n: "London", g: 2643743 },
                { i: "barcelona.png", n: "Barcelona", g: 3128760 },
                { i: "paris.png", n: "Paris", g: 2988507 },
                { i: "rome.png", n: "Rome", g: 3169070 },
                { i: "prague.png", n: "Prague", g: 3067696 },
                { i: "amsterdam.png", n: "Amsterdam", g: 2759794 },
                { i: "berlin.png", n: "Berlin", g: 2950159 },
                { i: "budapest.png", n: "Budapest", g: 3054643 },
                { i: "istanbul.png", n: "Istanbul", g: 745044 }
            ];
            this.asiaCities = [
                { i: "bangkok.png", n: "Bangkok", g: 1609350 },
                { i: "tokyo.png", n: "Tokyo", g: 1850147 },
                { i: "dubai.png", n: "Dubai", g: 292223 },
                { i: "hong-kong.png", n: "Hong Kong", g: 1819729 },
                { i: "seoul.png", n: "Seoul", g: 1835848 },
                { i: "kuala-lumpur.png", n: "Kuala Lumpur", g: 1735161 },
                { i: "singapore.png", n: "Singapore", g: 1880252 },
                { i: "shanghai.png", n: "Shanghai", g: 1796236 },
                { i: "taipei.png", n: "Taipei", g: 1668341 }
            ];
            this.naCities = [
                { i: "new-york.png", n: "New York", g: 5128581 },
                { i: "miami.png", n: "Miami", g: 4164138 },
                { i: "los-angeles.png", n: "Los Angeles", g: 5368361 },
                { i: "orlando.png", n: "Orlando", g: 4167147 },
                { i: "san-francisco.png", n: "San Francisco", g: 5391959 },
                { i: "las-vegas.png", n: "Las Vegas", g: 5506956 },
                { i: "honolulu.png", n: "Honolulu", g: 5856195 },
                { i: "washington.png", n: "Washington", g: 4140963 },
                { i: "chicago.png", n: "Chicago", g: 4887398 }
            ];
            this.saCities = [
                { i: "mexico-city.png", n: "Mexico City", g: 3530597 },
                { i: "buenos-aires.png", n: "Buenos Aires", g: 3435910 },
                { i: "sao-paulo.png", n: "Sao Paulo", g: 3448439 },
                { i: "lima.png", n: "Lima", g: 3936456 },
                { i: "san-jose.png", n: "San Jose", g: 3621849 },
                { i: "bogota.png", n: "Bogota", g: 3688689 },
                { i: "montevideo.png", n: "Montevideo", g: 3441575 },
                { i: "rio-de-janeiro.png", n: "Rio de Janeiro", g: 3451190 },
                { i: "santiago-de-chile.png", n: "Santiago de Chile", g: 3871336 }
            ];
            this.afCities = [
                { i: "johannesburg.png", n: "Johannesburg", g: 993800 },
                { i: "cape-town.png", n: "Cape Town", g: 3369157 },
                { i: "cairo.png", n: "Cairo", g: 360630 },
                { i: "casablanca.png", n: "Casablanca", g: 2553604 },
                { i: "tunis.png", n: "Tunis", g: 2464470 },
                { i: "durban.png", n: "Durban", g: 1007311 },
                { i: "lagos.png", n: "Lagos", g: 2332459 },
                { i: "nairobi.png", n: "Nairobi", g: 184745 },
                { i: "accra.png", n: "Accra", g: 2306104 }
            ];
            this.australiaCities = [
                { i: "sydney.png", n: "Sydney", g: 2147714 },
                { i: "melbourne.png", n: "Melbourne", g: 2158177 },
                { i: "perth.png", n: "Perth", g: 2063523 },
                { i: "darwin.png", n: "Darwin", g: 2073124 },
                { i: "goldcoast.png", n: "Gold coast", g: 2165087 },
                { i: "canberra.png", n: "Canberra", g: 2172517 },
                { i: "cairns.png", n: "Cairns", g: 2172797 },
                { i: "brisbane.png", n: "Brisbane", g: 2174003 },
                { i: "adelaide.png", n: "Adelaide", g: 2078025 }
            ];
        }
        Object.defineProperty(PinBoardBadges.prototype, "mapsDataLoader", {
            get: function () {
                var mdl = Views.ViewBase.currentView["mapsManager"].mapsDataLoader;
                return mdl;
            },
            enumerable: true,
            configurable: true
        });
        PinBoardBadges.prototype.refresh = function () {
            $("#bdgs").html("");
            this.aggregateCountries();
            var $overview = this.generateOverview();
            $("#bdgs").append($overview);
            var $cities = this.generateCities();
            $("#bdgs").append($cities);
        };
        PinBoardBadges.prototype.aggregateCountries = function () {
            this.aggegatedCountries = new Views.AggregatedCountries();
            this.aggegatedCountries.aggregate(this.countries);
            this.aggegatedCountries.aggregateUs(this.states);
        };
        PinBoardBadges.prototype.generateOverview = function () {
            var afrHtml = this.genOverviewItem("africa.png", this.aggegatedCountries.africaVisited, this.aggegatedCountries.africaTotal, Views.ViewBase.currentView.t("Africa", "jsPins"));
            var eurHtml = this.genOverviewItem("europe.png", this.aggegatedCountries.europeVisited, this.aggegatedCountries.europeTotal, Views.ViewBase.currentView.t("Europe", "jsPins"));
            var asiHtml = this.genOverviewItem("asia.png", this.aggegatedCountries.asiaVisited, this.aggegatedCountries.asiaTotal, Views.ViewBase.currentView.t("Asia", "jsPins"));
            var ausHtml = this.genOverviewItem("australia.png", this.aggegatedCountries.australiaVisited, this.aggegatedCountries.australiaTotal, Views.ViewBase.currentView.t("Australia", "jsPins"));
            var naHtml = this.genOverviewItem("north-amecica.png", this.aggegatedCountries.northAmericaVisited, this.aggegatedCountries.northAmericaTotal, Views.ViewBase.currentView.t("NorthAmerica", "jsPins"));
            var saHtml = this.genOverviewItem("south-america.png", this.aggegatedCountries.southAmericaVisited, this.aggegatedCountries.southAmericaTotal, Views.ViewBase.currentView.t("LatinAmerica", "jsPins"));
            var euHtml = this.genOverviewItem("states-eu.png", this.aggegatedCountries.euVisited, this.aggegatedCountries.euTotal, "EU");
            var usHtml = this.genOverviewItem("states-us.png", this.aggegatedCountries.usVisited, this.aggegatedCountries.usTotal, "US");
            var html = afrHtml + eurHtml + asiHtml + ausHtml + naHtml + saHtml + euHtml + usHtml;
            var allHtml = "<div class=\"badges grid margin2 citiesCont\" style=\"text-align: center\">" + html + "</div>";
            return $(allHtml);
        };
        PinBoardBadges.prototype.generateCities = function () {
            var $html = $("<div class=\"grid col3\"></div>");
            var $naHtml = this.genContCitiesSection(Views.ViewBase.currentView.t("NorthAmerica", "jsPins"), this.naCities);
            $html.append($naHtml);
            var $eurHtml = this.genContCitiesSection(Views.ViewBase.currentView.t("Europe", "jsPins"), this.europeCities);
            $html.append($eurHtml);
            var $auHtml = this.genContCitiesSection(Views.ViewBase.currentView.t("Australia", "jsPins"), this.australiaCities);
            $html.append($auHtml);
            var $asiHtml = this.genContCitiesSection(Views.ViewBase.currentView.t("Asia", "jsPins"), this.asiaCities);
            $html.append($asiHtml);
            var $saHtml = this.genContCitiesSection(Views.ViewBase.currentView.t("LatinAmerica", "jsPins"), this.saCities);
            $html.append($saHtml);
            var $afHtml = this.genContCitiesSection(Views.ViewBase.currentView.t("Africa", "jsPins"), this.afCities);
            $html.append($afHtml);
            return $html;
        };
        PinBoardBadges.prototype.genContCitiesSection = function (continentName, cities) {
            var _this = this;
            var $html = $("<div class=\"cell\"><h3>" + continentName + "</h3><div class=\"badges b3x3 grid\"></div>");
            cities.forEach(function (city) {
                var name = "";
                var title = _this.gidToTitle[city.g.toString()];
                if (title) {
                    name = "<a href=\"/wiki/" + title + "\">" + city.n + "</a>";
                }
                else {
                    name = city.n;
                }
                var $badge = $("<div class=\"cell\" data-gid=\"" + city.g + "\"> <span class=\"badge\"> <span class=\"thumbnail\"> <img src=\"../images/badges/" + city.i + "\"> </span>" + name + "</span> </div>");
                $html.find(".badges").append($badge);
                var visited = _.contains(_this.cities, city.g);
                var $b = $badge.find(".badge");
                if (visited) {
                    $b.addClass("active");
                    $b.attr("title", Views.ViewBase.currentView.t("ClickDelete", "jsPins"));
                }
                else {
                    $badge.find("img").css("opacity", 0.5);
                    $b.attr("title", Views.ViewBase.currentView.t("ClickCheck", "jsPins"));
                }
                $badge.find(".thumbnail").click(function (e) { return _this.badgeClick(e); });
            });
            return $html;
        };
        PinBoardBadges.prototype.badgeClick = function (e) {
            var $t = $(e.target);
            var $cont = $t.closest(".cell");
            var $badge = $cont.find(".badge");
            var gid = $cont.data("gid");
            var view = Views.ViewBase.currentView;
            if ($badge.hasClass("active")) {
                view.deletePin(gid);
            }
            else {
                var req = { SourceType: SourceType.City, SourceId: gid };
                view.saveNewPlace(req);
            }
        };
        PinBoardBadges.prototype.genOverviewItem = function (img, visitedCnt, totalCnt, name) {
            var imgLink = "../images/badges/" + img;
            return "<div class=\"cell\"><span class=\"badge\" style=\"cursor: default\"><span class=\"thumbnail\"><img src=\"" + imgLink + "\"></span>" + visitedCnt + "/" + totalCnt + " <b>" + name + "</b></span></div>";
        };
        return PinBoardBadges;
    })();
    Views.PinBoardBadges = PinBoardBadges;
})(Views || (Views = {}));
//# sourceMappingURL=PinBoardBadges.js.map