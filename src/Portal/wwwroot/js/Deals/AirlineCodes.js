var Planning;
(function (Planning) {
    var AirlineCodes = (function () {
        function AirlineCodes() {
        }
        AirlineCodes.getName = function (code) {
            var obj = _.find(this.codes, function (i) {
                return i.code === code;
            });
            if (!obj) {
                return code;
            }
            return obj.name;
        };
        AirlineCodes.codes = [
            {
                "code": "ZY",
                "name": "Sky Airlines"
            },
            {
                "code": "ZX",
                "name": "Air BC"
            },
            {
                "code": "ZX",
                "name": "Air Georgian"
            },
            {
                "code": "ZW",
                "name": "Air Wisconsin"
            },
            {
                "code": "ZV",
                "name": "Air Midwest"
            },
            {
                "code": "ZU",
                "name": "Helios Airways"
            },
            {
                "code": "ZT",
                "name": "Titan Airways"
            },
            {
                "code": "ZS",
                "name": "Azzurra Air614"
            },
            {
                "code": "ZS",
                "name": "Sama Airlines"
            },
            {
                "code": "ZP",
                "name": "Silk Way Airlines"
            },
            {
                "code": "ZL",
                "name": "Regional Express"
            },
            {
                "code": "ZK",
                "name": "Great Lakes Airlines"
            },
            {
                "code": "ZI",
                "name": "Aigle Azur"
            },
            {
                "code": "ZH",
                "name": "Shenzhen Airlines"
            },
            {
                "code": "ZG",
                "name": "Viva Macau"
            },
            {
                "code": "ZE",
                "name": "Arcus-Air Logistic"
            },
            {
                "code": "ZE",
                "name": "Eastar Jet"
            },
            {
                "code": "ZE",
                "name": "Líneas Aéreas Azteca"
            },
            {
                "code": "ZB",
                "name": "Air Bourbon"
            },
            {
                "code": "ZB",
                "name": "Monarch Airlines"
            },
            {
                "code": "ZA",
                "name": "AccessAir"
            },
            {
                "code": "ZA",
                "name": "Interavia Airlines"
            },
            {
                "code": "Z8",
                "name": "Línea Aérea Amaszonas"
            },
            {
                "code": "Z7",
                "name": "ADC Airlines"
            },
            {
                "code": "Z5",
                "name": "GMG Airlines"
            },
            {
                "code": "Z4",
                "name": "Zoom Airlines"
            },
            {
                "code": "Z3",
                "name": "Avient Aviation"
            },
            {
                "code": "YX",
                "name": "Midwest Airlines"
            },
            {
                "code": "YW",
                "name": "Air Nostrum"
            },
            {
                "code": "YV",
                "name": "Mesa Airlines"
            },
            {
                "code": "YU",
                "name": "Dominair"
            },
            {
                "code": "YT",
                "name": "Air Togo"
            },
            {
                "code": "YS",
                "name": "Régional Compagnie Aérienne Européenne"
            },
            {
                "code": "YQ",
                "name": "TAR Aerolineas"
            },
            {
                "code": "YM",
                "name": "Montenegro Airlines"
            },
            {
                "code": "YL",
                "name": "Yamal Airlines"
            },
            {
                "code": "YK",
                "name": "Cyprus Turkish Airlines"
            },
            {
                "code": "YH",
                "name": "West Caribbean Airways"
            },
            {
                "code": "YE",
                "name": "Aryan Cargo Express"
            },
            {
                "code": "YD",
                "name": "Cologne Air Transport GmbH"
            },
            {
                "code": "Y9",
                "name": "Kish Air"
            },
            {
                "code": "Y8",
                "name": "Yangtze River Express"
            },
            {
                "code": "Y6",
                "name": "Batavia Air"
            },
            {
                "code": "Y5",
                "name": "Golden Myanmar Airlines"
            },
            {
                "code": "Y5",
                "name": "Pace Airlines"
            },
            {
                "code": "Y4",
                "name": "Volaris"
            },
            {
                "code": "Y2",
                "name": "Alliance Air"
            },
            {
                "code": "Y2",
                "name": "Flyglobespan"
            },
            {
                "code": "Y0",
                "name": "Yellow Air Taxi/Friendship Airways"
            },
            {
                "code": "XT",
                "name": "Air Exel"
            },
            {
                "code": "XT",
                "name": "SkyStar Airways"
            },
            {
                "code": "XS",
                "name": "SITA"
            },
            {
                "code": "XQ",
                "name": "SunExpress"
            },
            {
                "code": "XP",
                "name": "Western"
            },
            {
                "code": "XP",
                "name": "Xtra Airways"
            },
            {
                "code": "XO",
                "name": "China Xinhua Airlines"
            },
            {
                "code": "XO",
                "name": "LTE International Airways"
            },
            {
                "code": "XM",
                "name": "J-Air"
            },
            {
                "code": "XL",
                "name": "Aerolane"
            },
            {
                "code": "XK",
                "name": "Corse Méditerranée"
            },
            {
                "code": "XJ",
                "name": "Mesaba Airlines"
            },
            {
                "code": "XJ",
                "name": "Thai Airasia X"
            },
            {
                "code": "XF",
                "name": "Vladivostok Air"
            },
            {
                "code": "XC",
                "name": "Corendon Airlines"
            },
            {
                "code": "X9",
                "name": "Avion Express"
            },
            {
                "code": "X7",
                "name": "Chitaavia"
            },
            {
                "code": "X3",
                "name": "Hapag-Lloyd Express (TUIfly)"
            },
            {
                "code": "WZ",
                "name": "West African Airlines"
            },
            {
                "code": "WY",
                "name": "Oman Air"
            },
            {
                "code": "WX",
                "name": "CityJet"
            },
            {
                "code": "WX",
                "name": "CityJet"
            },
            {
                "code": "WW",
                "name": "Bmibaby"
            },
            {
                "code": "WW",
                "name": "WOW air"
            },
            {
                "code": "WV",
                "name": "Swe Fly"
            },
            {
                "code": "WT",
                "name": "Wasaya Airways"
            },
            {
                "code": "WS",
                "name": "WestJet"
            },
            {
                "code": "WS",
                "name": "WestJet Encore"
            },
            {
                "code": "WR",
                "name": "Royal Tongan Airlines"
            },
            {
                "code": "WO",
                "name": "World Airways"
            },
            {
                "code": "WN",
                "name": "Southwest Airlines"
            },
            {
                "code": "WK",
                "name": "American Falcon"
            },
            {
                "code": "WK",
                "name": "Edelweiss Air"
            },
            {
                "code": "WH",
                "name": "China Northwest Airlines"
            },
            {
                "code": "WH",
                "name": "WebJet Linhas Aéreas"
            },
            {
                "code": "WG",
                "name": "Sunwing Airlines"
            },
            {
                "code": "WF",
                "name": "Widerøe"
            },
            {
                "code": "WE",
                "name": "Centurion Air Cargo"
            },
            {
                "code": "WE",
                "name": "Thai Smile Airways"
            },
            {
                "code": "WDK",
                "name": "WOODSTOCK"
            },
            {
                "code": "WD*",
                "name": "Amsterdam Airlines"
            },
            {
                "code": "WD",
                "name": "DAS Air Cargo"
            },
            {
                "code": "WC",
                "name": "Islena De Inversiones"
            },
            {
                "code": "WB",
                "name": "Rwandair Express"
            },
            {
                "code": "WA",
                "name": "KLM Cityhopper"
            },
            {
                "code": "WA",
                "name": "Western Airlines"
            },
            {
                "code": "W9",
                "name": "Abelag Aviation"
            },
            {
                "code": "W9",
                "name": "Air Bagan"
            },
            {
                "code": "W9",
                "name": "Eastwind Airlines"
            },
            {
                "code": "W8",
                "name": "Cargojet Airways"
            },
            {
                "code": "W7",
                "name": "Sayakhat Airlines"
            },
            {
                "code": "W7",
                "name": "Western Pacific Airlines"
            },
            {
                "code": "W6",
                "name": "Wizz Air"
            },
            {
                "code": "W5",
                "name": "Mahan Air"
            },
            {
                "code": "W4",
                "name": "Aero Services Executive"
            },
            {
                "code": "W3",
                "name": "Flyhy Cargo Airlines"
            },
            {
                "code": "W3",
                "name": "Switfair Cargo"
            },
            {
                "code": "W2",
                "name": "Canadian Western Airlines"
            },
            {
                "code": "W1",
                "name": "WDL Aviation"
            },
            {
                "code": "VZ",
                "name": "MyTravel Airways"
            },
            {
                "code": "VY",
                "name": "Formosa Airlines"
            },
            {
                "code": "VY",
                "name": "Vueling Airlines"
            },
            {
                "code": "VX",
                "name": "ACES Colombia"
            },
            {
                "code": "VX",
                "name": "Virgin America"
            },
            {
                "code": "VW",
                "name": "Aeromar"
            },
            {
                "code": "VV",
                "name": "Aerosvit Airlines"
            },
            {
                "code": "VU",
                "name": "Air Ivoire"
            },
            {
                "code": "VT",
                "name": "Air Tahiti"
            },
            {
                "code": "VS",
                "name": "Virgin Atlantic Airways"
            },
            {
                "code": "VR",
                "name": "TACV"
            },
            {
                "code": "VQ",
                "name": "Novo Air"
            },
            {
                "code": "VP",
                "name": "VASP"
            },
            {
                "code": "VO",
                "name": "Tyrolean Airways"
            },
            {
                "code": "VN",
                "name": "Vietnam Airlines"
            },
            {
                "code": "VM",
                "name": "Viaggio Air"
            },
            {
                "code": "VL",
                "name": "Air VIA"
            },
            {
                "code": "VK",
                "name": "Virgin Nigeria Airways"
            },
            {
                "code": "VJ",
                "name": "Africa Airways"
            },
            {
                "code": "VJ",
                "name": "Jatayu Airlines"
            },
            {
                "code": "VJ",
                "name": "Thai Vietjet Air"
            },
            {
                "code": "VJ",
                "name": "Vietjet Air"
            },
            {
                "code": "VI",
                "name": "Volga-Dnepr Airlines"
            },
            {
                "code": "VH",
                "name": "Aeropostal Alas de Venezuela"
            },
            {
                "code": "VG",
                "name": "VLM Airlines"
            },
            {
                "code": "VF",
                "name": "Valuair"
            },
            {
                "code": "VE",
                "name": "Avensa"
            },
            {
                "code": "VE",
                "name": "EUjet"
            },
            {
                "code": "VE",
                "name": "C.A.I. Second"
            },
            {
                "code": "VD",
                "name": "Air Liberté"
            },
            {
                "code": "VD",
                "name": "Kunpeng Airlines"
            },
            {
                "code": "VD",
                "name": "SwedJet Airways"
            },
            {
                "code": "VC",
                "name": "Ocean Airlines"
            },
            {
                "code": "VC",
                "name": "Voyageur Airways"
            },
            {
                "code": "VB",
                "name": "Aeroenlaces Nacionales"
            },
            {
                "code": "VB",
                "name": "VIVA Aerobus"
            },
            {
                "code": "VA",
                "name": "Virgin Australia Airlines"
            },
            {
                "code": "VA",
                "name": "Viasa"
            },
            {
                "code": "V9",
                "name": "BAL Bashkirian Airlines"
            },
            {
                "code": "V9",
                "name": "Star1 Airlines"
            },
            {
                "code": "V8",
                "name": "ATRAN Cargo Airlines"
            },
            {
                "code": "V8",
                "name": "Iliamna Air Taxi"
            },
            {
                "code": "V7",
                "name": "Air Senegal International"
            },
            {
                "code": "V7",
                "name": "Volotea"
            },
            {
                "code": "V5",
                "name": "Avolar Aerolíneas"
            },
            {
                "code": "V5",
                "name": "DanubeWings"
            },
            {
                "code": "V5",
                "name": "Royal Aruban Airlines"
            },
            {
                "code": "V4",
                "name": "Reem Air"
            },
            {
                "code": "V4",
                "name": "Vieques Air Link"
            },
            {
                "code": "V3",
                "name": "Carpatair"
            },
            {
                "code": "V2",
                "name": "Karat"
            },
            {
                "code": "V2",
                "name": "Vision Airlines"
            },
            {
                "code": "V0",
                "name": "Conviasa"
            },
            {
                "code": "UZ",
                "name": "El-Buraq Air Transport"
            },
            {
                "code": "UY",
                "name": "Cameroon Airlines"
            },
            {
                "code": "UX",
                "name": "Air Europa"
            },
            {
                "code": "UU",
                "name": "Air Austral"
            },
            {
                "code": "UT",
                "name": "UTair Aviation"
            },
            {
                "code": "US",
                "name": "US Airways"
            },
            {
                "code": "US",
                "name": "Unavia Suisse"
            },
            {
                "code": "US",
                "name": "US Airways"
            },
            {
                "code": "UQ",
                "name": "O'Connor Airlines"
            },
            {
                "code": "UP",
                "name": "Bahamasair"
            },
            {
                "code": "UO",
                "name": "Hong Kong Express Airways"
            },
            {
                "code": "UN",
                "name": "Transaero Airlines"
            },
            {
                "code": "UM",
                "name": "Air Zimbabwe"
            },
            {
                "code": "UL",
                "name": "SriLankan Airlines"
            },
            {
                "code": "UI",
                "name": "Eurocypria Airlines"
            },
            {
                "code": "UH",
                "name": "US Helicopter"
            },
            {
                "code": "UH",
                "name": "US Helicopter Corporation"
            },
            {
                "code": "UG",
                "name": "SevenAir"
            },
            {
                "code": "UG",
                "name": "Tuninter"
            },
            {
                "code": "UF",
                "name": "UM Airlines"
            },
            {
                "code": "UE",
                "name": "Nasair"
            },
            {
                "code": "UE",
                "name": "Transeuropean Airlines"
            },
            {
                "code": "UD",
                "name": "Hex'Air"
            },
            {
                "code": "UB",
                "name": "Myanma Airways"
            },
            {
                "code": "UA",
                "name": "United Airlines"
            },
            {
                "code": "U8",
                "name": "Armavia"
            },
            {
                "code": "U7",
                "name": "Air Uganda"
            },
            {
                "code": "U7",
                "name": "Northern Dene Airways"
            },
            {
                "code": "U7",
                "name": "USA Jet Airlines"
            },
            {
                "code": "U6",
                "name": "Ural Airlines"
            },
            {
                "code": "U5",
                "name": "USA3000 Airlines"
            },
            {
                "code": "U4",
                "name": "PMTair"
            },
            {
                "code": "U3",
                "name": "Avies"
            },
            {
                "code": "U2",
                "name": "easyJet"
            },
            {
                "code": "U2",
                "name": "United Feeder Service"
            },
            {
                "code": "TZ",
                "name": "air-taxi Europe"
            },
            {
                "code": "TZ",
                "name": "ATA Airlines"
            },
            {
                "code": "TZ",
                "name": "Scoot"
            },
            {
                "code": "TY",
                "name": "Air Calédonie"
            },
            {
                "code": "TY",
                "name": "Iberworld"
            },
            {
                "code": "TX",
                "name": "Air Caraïbes"
            },
            {
                "code": "TX",
                "name": "Transportes Aéreos Nacionales"
            },
            {
                "code": "TW",
                "name": "T'way Air"
            },
            {
                "code": "TV",
                "name": "Virgin Express"
            },
            {
                "code": "TU",
                "name": "Tunisair"
            },
            {
                "code": "TT",
                "name": "Air Lithuania"
            },
            {
                "code": "TT",
                "name": "Tigerair Australia"
            },
            {
                "code": "TS",
                "name": "Air Transat"
            },
            {
                "code": "TR",
                "name": "Transbrasil"
            },
            {
                "code": "TR",
                "name": "Tigerair Singapore"
            },
            {
                "code": "TQ",
                "name": "Tandem Aero"
            },
            {
                "code": "TP",
                "name": "TAP Portugal"
            },
            {
                "code": "TO",
                "name": "President Airlines"
            },
            {
                "code": "TO",
                "name": "Transavia France"
            },
            {
                "code": "TN",
                "name": "Air Tahiti Nui"
            },
            {
                "code": "TM",
                "name": "Linhas Aéreas de Moçambique"
            },
            {
                "code": "TL",
                "name": "Airnorth"
            },
            {
                "code": "TL",
                "name": "Trans Mediterranean Airlines"
            },
            {
                "code": "TK",
                "name": "Turkish Airlines"
            },
            {
                "code": "TJ",
                "name": "Tradewind Aviation"
            },
            {
                "code": "TI",
                "name": "Tol-Air Services"
            },
            {
                "code": "TH",
                "name": "BA Connect"
            },
            {
                "code": "TH",
                "name": "Transmile Air Services"
            },
            {
                "code": "TG",
                "name": "Thai Airways International"
            },
            {
                "code": "TF",
                "name": "Malmö Aviation"
            },
            {
                "code": "TE",
                "name": "FlyLal"
            },
            {
                "code": "TE",
                "name": "Skytaxi"
            },
            {
                "code": "TD",
                "name": "Atlantis European Airways"
            },
            {
                "code": "TD",
                "name": "Tulip Air"
            },
            {
                "code": "TC",
                "name": "Air Tanzania"
            },
            {
                "code": "T9",
                "name": "TransMeridian Airlines"
            },
            {
                "code": "T9",
                "name": "Thai Star Airlines"
            },
            {
                "code": "T7",
                "name": "Twin Jet"
            },
            {
                "code": "T6",
                "name": "Tavrey Airlines"
            },
            {
                "code": "T4",
                "name": "TRIP Linhas Aéreas"
            },
            {
                "code": "T3",
                "name": "Eastern Airways"
            },
            {
                "code": "T2",
                "name": "Thai Air Cargo"
            },
            {
                "code": "SZ",
                "name": "Air Southwest"
            },
            {
                "code": "SY",
                "name": "Sun Country Airlines"
            },
            {
                "code": "SX",
                "name": "Sky Work Airlines"
            },
            {
                "code": "SX",
                "name": "Skybus Airlines"
            },
            {
                "code": "SW",
                "name": "Air Namibia"
            },
            {
                "code": "SV",
                "name": "Saudia"
            },
            {
                "code": "SU",
                "name": "Aeroflot Russian Airlines"
            },
            {
                "code": "ST",
                "name": "Germania"
            },
            {
                "code": "SS",
                "name": "Corsairfly"
            },
            {
                "code": "SR",
                "name": "Swissair"
            },
            {
                "code": "SQ",
                "name": "Singapore Airlines"
            },
            {
                "code": "SQ",
                "name": "Singapore Airlines Cargo"
            },
            {
                "code": "SP",
                "name": "SATA Air Acores"
            },
            {
                "code": "SO",
                "name": "Superior Aviation"
            },
            {
                "code": "SO",
                "name": "Sosoliso Airlines"
            },
            {
                "code": "SO",
                "name": "Sunshine Airlines"
            },
            {
                "code": "SN",
                "name": "Brussels International Airlines"
            },
            {
                "code": "SN",
                "name": "Brussels Airlines"
            },
            {
                "code": "SM",
                "name": "Aberdeen Airways"
            },
            {
                "code": "SM",
                "name": "Swedline Express"
            },
            {
                "code": "SL",
                "name": "Rio Sul Serviços Aéreos Regionais"
            },
            {
                "code": "SL",
                "name": "Thai Lion Mentari"
            },
            {
                "code": "SK",
                "name": "Scandinavian Airlines"
            },
            {
                "code": "SK",
                "name": "SAS Braathens"
            },
            {
                "code": "SJ",
                "name": "Freedom Air"
            },
            {
                "code": "SI",
                "name": "Skynet Airlines"
            },
            {
                "code": "SH",
                "name": "Fly Me Sweden"
            },
            {
                "code": "SG",
                "name": "JetsGo"
            },
            {
                "code": "SG",
                "name": "Spicejet"
            },
            {
                "code": "SF",
                "name": "Tassili Airlines"
            },
            {
                "code": "SE",
                "name": "XL Airways France"
            },
            {
                "code": "SD",
                "name": "Sudan Airways"
            },
            {
                "code": "SC",
                "name": "Shandong Airlines"
            },
            {
                "code": "SB",
                "name": "Air Caledonie International"
            },
            {
                "code": "SA",
                "name": "South African Airways"
            },
            {
                "code": "S9",
                "name": "East African Safari Air"
            },
            {
                "code": "S8",
                "name": "Chari Aviation Services"
            },
            {
                "code": "S8",
                "name": "Shovkoviy Shlyah"
            },
            {
                "code": "S8",
                "name": "Skywise Airline"
            },
            {
                "code": "S7",
                "name": "S7 Airlines"
            },
            {
                "code": "S6",
                "name": "Star Air"
            },
            {
                "code": "S6",
                "name": "Star Air"
            },
            {
                "code": "S5",
                "name": "Shuttle America"
            },
            {
                "code": "S5",
                "name": "Trast Aero"
            },
            {
                "code": "S4",
                "name": "SATA International"
            },
            {
                "code": "S3",
                "name": "Santa Barbara Airlines"
            },
            {
                "code": "S2",
                "name": "Air Sahara"
            },
            {
                "code": "S0",
                "name": "Slok Air Gambia"
            },
            {
                "code": "RZ",
                "name": "Euro Exec Express"
            },
            {
                "code": "RX",
                "name": "Aviaexpress"
            },
            {
                "code": "RW",
                "name": "Republic Airlines"
            },
            {
                "code": "RV*",
                "name": "Africaone"
            },
            {
                "code": "RV",
                "name": "Air Canada Rouge"
            },
            {
                "code": "RV",
                "name": "Caspian Airlines"
            },
            {
                "code": "RU",
                "name": "AirBridge Cargo"
            },
            {
                "code": "RU",
                "name": "SkyKing Turks and Caicos Airways"
            },
            {
                "code": "RS",
                "name": "Intercontinental de Aviación"
            },
            {
                "code": "RS",
                "name": "Royal Air Force of Oman"
            },
            {
                "code": "RS",
                "name": "Sky Regional Airlines"
            },
            {
                "code": "RR",
                "name": "Royal Air Force"
            },
            {
                "code": "RQ",
                "name": "Kam Air"
            },
            {
                "code": "RP",
                "name": "Chautauqua Airlines"
            },
            {
                "code": "RO",
                "name": "Tarom"
            },
            {
                "code": "RL",
                "name": "Rio Linhas Aéreas"
            },
            {
                "code": "RL",
                "name": "Royal Phnom Penh Airways"
            },
            {
                "code": "RK",
                "name": "Skyview Airways"
            },
            {
                "code": "RJ",
                "name": "Royal Jordanian"
            },
            {
                "code": "RI",
                "name": "Mandala Airlines"
            },
            {
                "code": "RH",
                "name": "Republic Express Airlines"
            },
            {
                "code": "RG",
                "name": "VRG Linhas Aéreas"
            },
            {
                "code": "RF",
                "name": "Florida West International Airways"
            },
            {
                "code": "RE",
                "name": "Aer Arann"
            },
            {
                "code": "RE",
                "name": "Stobart Air"
            },
            {
                "code": "RD",
                "name": "Ryan International Airlines"
            },
            {
                "code": "RC",
                "name": "Atlantic Airways"
            },
            {
                "code": "RB",
                "name": "Air Srpska"
            },
            {
                "code": "RB",
                "name": "Syrian Arab Airlines"
            },
            {
                "code": "RA",
                "name": "Nepal Airlines"
            },
            {
                "code": "R9",
                "name": "Camai Air"
            },
            {
                "code": "R8",
                "name": "Kyrgyzstan Airlines"
            },
            {
                "code": "R7",
                "name": "Aserca Airlines"
            },
            {
                "code": "R6",
                "name": "RACSA"
            },
            {
                "code": "R5",
                "name": "Jordan Aviation"
            },
            {
                "code": "R5",
                "name": "Malta Air Charter"
            },
            {
                "code": "R3",
                "name": "Armenian Airlines"
            },
            {
                "code": "R3",
                "name": "Aircompany Yakutia"
            },
            {
                "code": "R3",
                "name": "Yakutia Airlines"
            },
            {
                "code": "R2",
                "name": "Orenburg Airlines"
            },
            {
                "code": "R1",
                "name": "Sirin"
            },
            {
                "code": "R0",
                "name": "Royal Airlines"
            },
            {
                "code": "QZ",
                "name": "Indonesia AirAsia"
            },
            {
                "code": "QY",
                "name": "European Air Transport"
            },
            {
                "code": "QX",
                "name": "Horizon Air"
            },
            {
                "code": "QW",
                "name": "Blue Wings"
            },
            {
                "code": "QV",
                "name": "Lao Airlines"
            },
            {
                "code": "QU",
                "name": "UTair-Ukraine"
            },
            {
                "code": "QU",
                "name": "Uganda Airlines"
            },
            {
                "code": "QT",
                "name": "TAMPA"
            },
            {
                "code": "QS",
                "name": "African Safari Airways"
            },
            {
                "code": "QS",
                "name": "Travel Service"
            },
            {
                "code": "QR",
                "name": "Qatar Airways"
            },
            {
                "code": "QQ",
                "name": "Alliance Airlines"
            },
            {
                "code": "QQ",
                "name": "Reno Air"
            },
            {
                "code": "QO",
                "name": "Aeromexpress"
            },
            {
                "code": "QO",
                "name": "Origin Pacific Airways"
            },
            {
                "code": "QN",
                "name": "Air Armenia"
            },
            {
                "code": "QM",
                "name": "Air Malawi"
            },
            {
                "code": "QL",
                "name": "Aero Lanka"
            },
            {
                "code": "QL",
                "name": "Lankan Cargo"
            },
            {
                "code": "QL",
                "name": "Línea Aérea de Servicio Ejecutivo Regional"
            },
            {
                "code": "QK",
                "name": "Air Canada Jazz"
            },
            {
                "code": "QJ",
                "name": "Jet Airways"
            },
            {
                "code": "QI",
                "name": "Cimber Sterling"
            },
            {
                "code": "QH",
                "name": "Air Kyrgyzstan"
            },
            {
                "code": "QH",
                "name": "Aero Leasing"
            },
            {
                "code": "QH",
                "name": "Air Florida"
            },
            {
                "code": "QH",
                "name": "Kyrgyzstan"
            },
            {
                "code": "QF",
                "name": "Eastern Australia Airlines"
            },
            {
                "code": "QF",
                "name": "Qantas"
            },
            {
                "code": "QF",
                "name": "Qantaslink"
            },
            {
                "code": "QF",
                "name": "Qantaslink"
            },
            {
                "code": "QF",
                "name": "Sunstate Airlines"
            },
            {
                "code": "QE",
                "name": "Crossair Europe"
            },
            {
                "code": "QD",
                "name": "Air Class Líneas Aéreas"
            },
            {
                "code": "QC",
                "name": "Air Corridor"
            },
            {
                "code": "QB",
                "name": "Air Alma"
            },
            {
                "code": "QB",
                "name": "Georgian National Airlines"
            },
            {
                "code": "Q9",
                "name": "Afrinat International Airlines"
            },
            {
                "code": "Q8",
                "name": "Pacific East Asia Cargo Airlines"
            },
            {
                "code": "Q6",
                "name": "Aero Condor Peru"
            },
            {
                "code": "Q5",
                "name": "40-Mile Air"
            },
            {
                "code": "Q4",
                "name": "Mastertop Linhas Aéreas"
            },
            {
                "code": "Q4",
                "name": "Swazi Express Airways"
            },
            {
                "code": "Q4",
                "name": "Starlink Aviation"
            },
            {
                "code": "Q3",
                "name": "Zambian Airways"
            },
            {
                "code": "PZ",
                "name": "TAM Mercosur"
            },
            {
                "code": "PY",
                "name": "Surinam Airways"
            },
            {
                "code": "PX",
                "name": "Air Niugini"
            },
            {
                "code": "PW",
                "name": "Precision Air"
            },
            {
                "code": "PV",
                "name": "PAN Air"
            },
            {
                "code": "PV",
                "name": "St Barth Commuter"
            },
            {
                "code": "PU",
                "name": "PLUNA"
            },
            {
                "code": "PT",
                "name": "Capital Cargo International Airlines"
            },
            {
                "code": "PT",
                "name": "West Air Sweden"
            },
            {
                "code": "PS",
                "name": "Ukraine International Airlines"
            },
            {
                "code": "PR",
                "name": "Philippine Airlines"
            },
            {
                "code": "PQ",
                "name": "AirAsia Philippines"
            },
            {
                "code": "PP",
                "name": "Jet Aviation"
            },
            {
                "code": "PO",
                "name": "Polar Air Cargo"
            },
            {
                "code": "PN",
                "name": "Pan American Airways"
            },
            {
                "code": "PM",
                "name": "Tropic Air"
            },
            {
                "code": "PL",
                "name": "Aeroperú"
            },
            {
                "code": "PL",
                "name": "Airstars"
            },
            {
                "code": "PK",
                "name": "Pakistan International Airlines"
            },
            {
                "code": "PJ",
                "name": "Air Saint Pierre"
            },
            {
                "code": "PI",
                "name": "Piedmont Airlines (1948-1989)"
            },
            {
                "code": "PI",
                "name": "Sun Air (Fiji)"
            },
            {
                "code": "PH",
                "name": "Polynesian Airlines"
            },
            {
                "code": "PG",
                "name": "Bangkok Airways"
            },
            {
                "code": "PF",
                "name": "Palestinian Airlines"
            },
            {
                "code": "PE",
                "name": "Air Europe Italy"
            },
            {
                "code": "PE",
                "name": "People's Viennaline"
            },
            {
                "code": "PD",
                "name": "Porter Airlines"
            },
            {
                "code": "PC",
                "name": "Air Fiji"
            },
            {
                "code": "PC",
                "name": "Continental Airways"
            },
            {
                "code": "PC",
                "name": "Pegasus Airlines"
            },
            {
                "code": "PA",
                "name": "Florida Coastal Airlines"
            },
            {
                "code": "PA",
                "name": "Pan American Airways"
            },
            {
                "code": "PA",
                "name": "Pan American World Airways"
            },
            {
                "code": "P9",
                "name": "Nas Air"
            },
            {
                "code": "P9",
                "name": "Perm Airlines"
            },
            {
                "code": "P9",
                "name": "Peruvian Airlines"
            },
            {
                "code": "P8",
                "name": "Air Mekong"
            },
            {
                "code": "P8",
                "name": "Pantanal Linhas Aéreas"
            },
            {
                "code": "P7",
                "name": "Russian Sky Airlines"
            },
            {
                "code": "P6",
                "name": "Privilege Style Líneas Aéreas"
            },
            {
                "code": "P5",
                "name": "AeroRepública"
            },
            {
                "code": "P3",
                "name": "Passaredo Transportes Aéreos"
            },
            {
                "code": "P0",
                "name": "Proflight Zambia"
            },
            {
                "code": "OZ",
                "name": "Asiana Airlines"
            },
            {
                "code": "OZ",
                "name": "Ozark Air Lines"
            },
            {
                "code": "OY",
                "name": "Andes Líneas Aéreas"
            },
            {
                "code": "OY",
                "name": "Omni Air International"
            },
            {
                "code": "OX",
                "name": "Orient Thai Airlines"
            },
            {
                "code": "OW",
                "name": "Executive Airlines"
            },
            {
                "code": "OV",
                "name": "Estonian Air"
            },
            {
                "code": "OU",
                "name": "Croatia Airlines"
            },
            {
                "code": "OT",
                "name": "Aeropelican Air Services"
            },
            {
                "code": "OS",
                "name": "Austrian Airlines"
            },
            {
                "code": "OR",
                "name": "Arkefly"
            },
            {
                "code": "OP",
                "name": "Chalk's International Airlines"
            },
            {
                "code": "OO",
                "name": "SkyWest Airlines"
            },
            {
                "code": "ON",
                "name": "Our Airline"
            },
            {
                "code": "OM",
                "name": "MIAT Mongolian Airlines"
            },
            {
                "code": "OL",
                "name": "OLT Express Germany"
            },
            {
                "code": "OK",
                "name": "Czech Airlines"
            },
            {
                "code": "OJ",
                "name": "Fly Jamaica Airways"
            },
            {
                "code": "OJ",
                "name": "Overland Airways"
            },
            {
                "code": "OH",
                "name": "Comair"
            },
            {
                "code": "OF",
                "name": "Air Finland"
            },
            {
                "code": "OF",
                "name": "Enter Air"
            },
            {
                "code": "OF",
                "name": "Transports et Travaux Aériens de Madagascar"
            },
            {
                "code": "OE",
                "name": "Asia Overnight Express"
            },
            {
                "code": "OD",
                "name": "Malindo Airways"
            },
            {
                "code": "OB",
                "name": "Astrakhan Airlines"
            },
            {
                "code": "OB",
                "name": "Austrian Airtransport"
            },
            {
                "code": "OB",
                "name": "Oasis International Airlines"
            },
            {
                "code": "OA",
                "name": "Olympic Air"
            },
            {
                "code": "OA",
                "name": "Olympic Airlines"
            },
            {
                "code": "O9",
                "name": "Nova Airline"
            },
            {
                "code": "O8",
                "name": "Oasis Hong Kong Airlines"
            },
            {
                "code": "O7",
                "name": "Ozjet Airlines"
            },
            {
                "code": "O6",
                "name": "Avianca Brazil"
            },
            {
                "code": "O4",
                "name": "Antrak Air"
            },
            {
                "code": "O2",
                "name": "Oceanic Airlines"
            },
            {
                "code": "NZ",
                "name": "Air New Zealand"
            },
            {
                "code": "NZ",
                "name": "Eagle Airways"
            },
            {
                "code": "NY",
                "name": "Air Iceland"
            },
            {
                "code": "NX",
                "name": "Air Macau"
            },
            {
                "code": "NW",
                "name": "Northwest Airlines"
            },
            {
                "code": "NV",
                "name": "Air Central"
            },
            {
                "code": "NU",
                "name": "Japan Transocean Air"
            },
            {
                "code": "NT",
                "name": "Binter Canarias"
            },
            {
                "code": "NR",
                "name": "Pamir Airways"
            },
            {
                "code": "NQ",
                "name": "Air Japan"
            },
            {
                "code": "NO",
                "name": "Aus-Air"
            },
            {
                "code": "NO",
                "name": "Neos"
            },
            {
                "code": "NN",
                "name": "VIM Airlines"
            },
            {
                "code": "NM",
                "name": "Air Madrid"
            },
            {
                "code": "NM",
                "name": "Mount Cook Airlines"
            },
            {
                "code": "NL",
                "name": "Shaheen Air International"
            },
            {
                "code": "NK",
                "name": "Spirit Airlines"
            },
            {
                "code": "NI",
                "name": "LANICA"
            },
            {
                "code": "NI",
                "name": "Portugalia"
            },
            {
                "code": "NH",
                "name": "All Nippon Airways"
            },
            {
                "code": "NG",
                "name": "Lauda Air"
            },
            {
                "code": "NF",
                "name": "Air Vanuatu"
            },
            {
                "code": "NE",
                "name": "SkyEurope"
            },
            {
                "code": "NC",
                "name": "National Jet Systems"
            },
            {
                "code": "NC",
                "name": "Northern Air Cargo"
            },
            {
                "code": "NB",
                "name": "Sterling Airlines"
            },
            {
                "code": "NA",
                "name": "National Airlines"
            },
            {
                "code": "NA",
                "name": "North American Airlines"
            },
            {
                "code": "N9",
                "name": "North Coast Aviation"
            },
            {
                "code": "N8",
                "name": "Fika Salaama Airlines"
            },
            {
                "code": "N8",
                "name": "National Air Cargo dba National Airlines"
            },
            {
                "code": "N7",
                "name": "National Airlines"
            },
            {
                "code": "N6",
                "name": "Lagun Air"
            },
            {
                "code": "N6",
                "name": "Nuevo Continente"
            },
            {
                "code": "N5",
                "name": "Kyrgyz Airlines"
            },
            {
                "code": "N5",
                "name": "Norfolk Air"
            },
            {
                "code": "N5",
                "name": "Skagway Air Service"
            },
            {
                "code": "N4",
                "name": "Mountain Air Company"
            },
            {
                "code": "N4",
                "name": "National Airlines"
            },
            {
                "code": "N4",
                "name": "Nordwind Airlines"
            },
            {
                "code": "N3",
                "name": "Omskavia Airline"
            },
            {
                "code": "N2",
                "name": "Dagestan Airlines"
            },
            {
                "code": "N2",
                "name": "Kabo Air"
            },
            {
                "code": "MZ",
                "name": "Merpati Nusantara Airlines"
            },
            {
                "code": "MY",
                "name": "Maxjet Airways"
            },
            {
                "code": "MY",
                "name": "Midwest Airlines (Egypt)"
            },
            {
                "code": "MX",
                "name": "Mexicana de Aviación"
            },
            {
                "code": "MW",
                "name": "Maya Island Air"
            },
            {
                "code": "MW",
                "name": "Mokulele Airlines"
            },
            {
                "code": "MV",
                "name": "Armenian International Airways"
            },
            {
                "code": "MU",
                "name": "China Eastern Airlines"
            },
            {
                "code": "MT",
                "name": "JMC Airlines"
            },
            {
                "code": "MT",
                "name": "Thomas Cook Airlines"
            },
            {
                "code": "MS",
                "name": "Egyptair"
            },
            {
                "code": "MR",
                "name": "Air Mauritanie"
            },
            {
                "code": "MQ",
                "name": "American Eagle Airlines"
            },
            {
                "code": "MP",
                "name": "Martinair"
            },
            {
                "code": "MO",
                "name": "Abu Dhabi Amiri Flight"
            },
            {
                "code": "MO",
                "name": "Calm Air"
            },
            {
                "code": "MN",
                "name": "Comair"
            },
            {
                "code": "MM",
                "name": "EuroAtlantic Airways"
            },
            {
                "code": "MM",
                "name": "SAM Colombia"
            },
            {
                "code": "ML",
                "name": "Air Mediterranee"
            },
            {
                "code": "ML",
                "name": "African Transport Trading and Investment Company"
            },
            {
                "code": "ML",
                "name": "Midway Airlines (1976–1991)"
            },
            {
                "code": "MK",
                "name": "Air Mauritius"
            },
            {
                "code": "MJ",
                "name": "Líneas Aéreas Privadas Argentinas"
            },
            {
                "code": "MJ",
                "name": "Mihin Lanka"
            },
            {
                "code": "MI",
                "name": "SilkAir"
            },
            {
                "code": "MH",
                "name": "MASwings"
            },
            {
                "code": "MH",
                "name": "Malaysia Airlines"
            },
            {
                "code": "MG",
                "name": "Champion Air"
            },
            {
                "code": "MF",
                "name": "Xiamen Airlines"
            },
            {
                "code": "ME",
                "name": "Middle East Airlines"
            },
            {
                "code": "MD",
                "name": "Air Madagascar"
            },
            {
                "code": "MC",
                "name": "Air Mobility Command"
            },
            {
                "code": "MB",
                "name": "Execair Aviation"
            },
            {
                "code": "MB",
                "name": "MNG Airlines"
            },
            {
                "code": "MA",
                "name": "Malév Hungarian Airlines"
            },
            {
                "code": "M9",
                "name": "Motor Sich"
            },
            {
                "code": "M8",
                "name": "Mekong Airlines"
            },
            {
                "code": "M7",
                "name": "MasAir"
            },
            {
                "code": "M7",
                "name": "Marsland Aviation"
            },
            {
                "code": "M7",
                "name": "Tropical Airways"
            },
            {
                "code": "M6",
                "name": "Amerijet International"
            },
            {
                "code": "M5",
                "name": "Kenmore Air"
            },
            {
                "code": "M3",
                "name": "ABSA Cargo"
            },
            {
                "code": "M3",
                "name": "Air Service"
            },
            {
                "code": "M3",
                "name": "North Flying"
            },
            {
                "code": "M2",
                "name": "Mahfooz Aviation"
            },
            {
                "code": "LZ",
                "name": "Balkan Bulgarian Airlines"
            },
            {
                "code": "LY",
                "name": "El Al Israel Airlines"
            },
            {
                "code": "LX",
                "name": "Swiss International Air Lines"
            },
            {
                "code": "LX",
                "name": "Swiss European Air Lines"
            },
            {
                "code": "LW",
                "name": "Pacific Wings"
            },
            {
                "code": "LW",
                "name": "Sun Air International"
            },
            {
                "code": "LV",
                "name": "Albanian Airlines"
            },
            {
                "code": "LU",
                "name": "LAN Express"
            },
            {
                "code": "LT",
                "name": "LTU International"
            },
            {
                "code": "LS",
                "name": "Jet2.com"
            },
            {
                "code": "LR",
                "name": "LACSA"
            },
            {
                "code": "LQ",
                "name": "Lebanese Air Transport"
            },
            {
                "code": "LP",
                "name": "LAN Peru"
            },
            {
                "code": "LO",
                "name": "LOT Polish Airlines"
            },
            {
                "code": "LN",
                "name": "Libyan Arab Airlines"
            },
            {
                "code": "LM",
                "name": "Livingston"
            },
            {
                "code": "LL",
                "name": "Allegro"
            },
            {
                "code": "LK",
                "name": "Air Luxor"
            },
            {
                "code": "LJ",
                "name": "Sierra National Airlines"
            },
            {
                "code": "LI",
                "name": "Leeward Islands Air Transport"
            },
            {
                "code": "LH",
                "name": "Lufthansa"
            },
            {
                "code": "LH",
                "name": "Lufthansa Cargo"
            },
            {
                "code": "LG",
                "name": "Luxair"
            },
            {
                "code": "LF",
                "name": "FlyNordic"
            },
            {
                "code": "LD",
                "name": "Air Hong Kong"
            },
            {
                "code": "LC",
                "name": "Loganair"
            },
            {
                "code": "LC",
                "name": "Varig Logística"
            },
            {
                "code": "LB",
                "name": "Lloyd Aéreo Boliviano"
            },
            {
                "code": "LA",
                "name": "LAN Airlines"
            },
            {
                "code": "L9",
                "name": "Air Mali"
            },
            {
                "code": "L9",
                "name": "Bristow U.S. LLC"
            },
            {
                "code": "L9",
                "name": "Teamline Air"
            },
            {
                "code": "L8",
                "name": "Air Luxor GB"
            },
            {
                "code": "L7",
                "name": "Laoag International Airlines"
            },
            {
                "code": "L7",
                "name": "Línea Aérea SAPSA"
            },
            {
                "code": "L6",
                "name": "Tbilaviamsheni"
            },
            {
                "code": "L5",
                "name": "Línea Aérea Cuencana"
            },
            {
                "code": "L5",
                "name": "Lufttransport"
            },
            {
                "code": "L4",
                "name": "Lynx Aviation"
            },
            {
                "code": "L3",
                "name": "DHL de Guatemala"
            },
            {
                "code": "L3",
                "name": "LTU Austria"
            },
            {
                "code": "L2",
                "name": "Lynden Air Cargo"
            },
            {
                "code": "L1",
                "name": "Lufthansa Systems"
            },
            {
                "code": "KZ",
                "name": "Nippon Cargo Airlines"
            },
            {
                "code": "KY",
                "name": "Air São Tomé and Príncipe"
            },
            {
                "code": "KX",
                "name": "Cayman Airways"
            },
            {
                "code": "KW",
                "name": "Kharkiv Airlines"
            },
            {
                "code": "KW",
                "name": "Wataniya Airways"
            },
            {
                "code": "KV",
                "name": "Kavminvodyavia"
            },
            {
                "code": "KU",
                "name": "Kuwait Airways"
            },
            {
                "code": "KS",
                "name": "Peninsula Airways"
            },
            {
                "code": "KR",
                "name": "Comores Airlines"
            },
            {
                "code": "KQ",
                "name": "Kenya Airways"
            },
            {
                "code": "KP",
                "name": "Kiwi International Air Lines"
            },
            {
                "code": "KO",
                "name": "Alaska Central Express"
            },
            {
                "code": "KN",
                "name": "China United Airlines"
            },
            {
                "code": "KM",
                "name": "Air Malta"
            },
            {
                "code": "KL",
                "name": "KLM"
            },
            {
                "code": "KK",
                "name": "Atlasjet"
            },
            {
                "code": "KJ",
                "name": "Asian Air"
            },
            {
                "code": "KJ",
                "name": "British Mediterranean Airways"
            },
            {
                "code": "KI",
                "name": "Air Atlantique"
            },
            {
                "code": "KI",
                "name": "Adam Air"
            },
            {
                "code": "KH",
                "name": "Aloha Air Cargo"
            },
            {
                "code": "KG",
                "name": "LAI - Línea Aérea IAACA"
            },
            {
                "code": "KF",
                "name": "Blue1"
            },
            {
                "code": "KE",
                "name": "Korean Air"
            },
            {
                "code": "KD",
                "name": "Air Enterprise"
            },
            {
                "code": "KD",
                "name": "Kalstar Aviation"
            },
            {
                "code": "KD",
                "name": "KD Avia"
            },
            {
                "code": "KC",
                "name": "Air Astana"
            },
            {
                "code": "KB",
                "name": "Druk Air"
            },
            {
                "code": "KA",
                "name": "Dragonair"
            },
            {
                "code": "K9",
                "name": "Kalitta Charters"
            },
            {
                "code": "K9",
                "name": "Krylo Airlines"
            },
            {
                "code": "K8",
                "name": "Airlink Zambia"
            },
            {
                "code": "K6",
                "name": "Angkor Air"
            },
            {
                "code": "K6",
                "name": "Cambodia Angkor Air"
            },
            {
                "code": "K6",
                "name": "Khalifa Airways"
            },
            {
                "code": "K5",
                "name": "SeaPort Airlines"
            },
            {
                "code": "K4",
                "name": "Kalitta Air"
            },
            {
                "code": "K2",
                "name": "Eurolot"
            },
            {
                "code": "JZ",
                "name": "Avia Express"
            },
            {
                "code": "JZ",
                "name": "Skyways Express"
            },
            {
                "code": "JY",
                "name": "Air Turks and Caicos"
            },
            {
                "code": "JY",
                "name": "Air Turks and Caicos"
            },
            {
                "code": "JX",
                "name": "Jett8 Airlines Cargo"
            },
            {
                "code": "JW",
                "name": "Arrow Air"
            },
            {
                "code": "JW",
                "name": "Vanilla Air"
            },
            {
                "code": "JV",
                "name": "Bearskin Lake Air Service"
            },
            {
                "code": "JU",
                "name": "Air Serbia"
            },
            {
                "code": "JU",
                "name": "Jat Airways"
            },
            {
                "code": "JT",
                "name": "Lion Mentari Airlines"
            },
            {
                "code": "JS",
                "name": "Air Koryo"
            },
            {
                "code": "JR",
                "name": "Aero California"
            },
            {
                "code": "JQ",
                "name": "Jetstar Airways"
            },
            {
                "code": "JP",
                "name": "Adria Airways"
            },
            {
                "code": "JO",
                "name": "JALways"
            },
            {
                "code": "JO",
                "name": "Jettime"
            },
            {
                "code": "JN",
                "name": "Excel Airways"
            },
            {
                "code": "JM",
                "name": "Air Jamaica"
            },
            {
                "code": "JM",
                "name": "Jetstar Hong Kong Airways"
            },
            {
                "code": "JL",
                "name": "Japan Airlines"
            },
            {
                "code": "JL",
                "name": "Japan Airlines Domestic"
            },
            {
                "code": "JK",
                "name": "Spanair"
            },
            {
                "code": "JJ",
                "name": "Aviogenex"
            },
            {
                "code": "JJ",
                "name": "LATAM Brasil"
            },
            {
                "code": "JI",
                "name": "Jade Cargo International"
            },
            {
                "code": "JI",
                "name": "Midway Airlines (1993–2003)"
            },
            {
                "code": "JH",
                "name": "Nordeste Linhas Aéreas Regionais"
            },
            {
                "code": "JF",
                "name": "Jet Asia Airways"
            },
            {
                "code": "JF",
                "name": "L.A.B. Flying Service"
            },
            {
                "code": "JE",
                "name": "Mango"
            },
            {
                "code": "JD",
                "name": "Beijing Capital Airlines"
            },
            {
                "code": "JC",
                "name": "JAL Express"
            },
            {
                "code": "JB",
                "name": "Helijet"
            },
            {
                "code": "JA",
                "name": "B&H Airlines"
            },
            {
                "code": "J9",
                "name": "Guinee Airlines"
            },
            {
                "code": "J9",
                "name": "Jazeera Airways"
            },
            {
                "code": "J8",
                "name": "Berjaya Air"
            },
            {
                "code": "J7",
                "name": "Centre-Avia"
            },
            {
                "code": "J7",
                "name": "Denim Air"
            },
            {
                "code": "J7",
                "name": "ValuJet Airlines"
            },
            {
                "code": "J6",
                "name": "AVCOM"
            },
            {
                "code": "J4",
                "name": "Buffalo Airways"
            },
            {
                "code": "J4",
                "name": "Jordan International Air Cargo"
            },
            {
                "code": "J3",
                "name": "Northwestern Air"
            },
            {
                "code": "J2",
                "name": "Azerbaijan Airlines"
            },
            {
                "code": "IZ",
                "name": "Arkia Israel Airlines"
            },
            {
                "code": "IY",
                "name": "Yemenia"
            },
            {
                "code": "IX",
                "name": "Air India Express"
            },
            {
                "code": "IW",
                "name": "AOM French Airlines"
            },
            {
                "code": "IW",
                "name": "Wings Air"
            },
            {
                "code": "IV",
                "name": "Wind Jet"
            },
            {
                "code": "IT",
                "name": "Kingfisher Airlines"
            },
            {
                "code": "IT",
                "name": "Tigerair Taiwan"
            },
            {
                "code": "IR",
                "name": "Iran Air"
            },
            {
                "code": "IQ",
                "name": "Augsburg Airways"
            },
            {
                "code": "IP",
                "name": "Atyrau Air Ways"
            },
            {
                "code": "IO",
                "name": "Indonesian Airlines"
            },
            {
                "code": "IN",
                "name": "MAT Macedonian Airlines"
            },
            {
                "code": "IN",
                "name": "NAM Air"
            },
            {
                "code": "IM",
                "name": "Menajet"
            },
            {
                "code": "IK",
                "name": "Ikar"
            },
            {
                "code": "IK",
                "name": "Lankair"
            },
            {
                "code": "IJ",
                "name": "Great Wall Airlines"
            },
            {
                "code": "IJ",
                "name": "Spring Airlines Japan"
            },
            {
                "code": "II",
                "name": "IBC Airways"
            },
            {
                "code": "IH",
                "name": "Falcon Aviation"
            },
            {
                "code": "IH",
                "name": "Irtysh Air"
            },
            {
                "code": "IG",
                "name": "Meridiana"
            },
            {
                "code": "IF",
                "name": "Islas Airways"
            },
            {
                "code": "IE",
                "name": "Solomon Airlines"
            },
            {
                "code": "ID",
                "name": "Batik Air"
            },
            {
                "code": "ID",
                "name": "Interlink Airlines"
            },
            {
                "code": "IC",
                "name": "Indian Airlines"
            },
            {
                "code": "IB",
                "name": "Iberia Airlines"
            },
            {
                "code": "IA",
                "name": "Iraqi Airways"
            },
            {
                "code": "I9*",
                "name": "Air Italy"
            },
            {
                "code": "I9",
                "name": "Indigo"
            },
            {
                "code": "I7",
                "name": "Paramount Airways"
            },
            {
                "code": "I6",
                "name": "Sky Eyes"
            },
            {
                "code": "I5",
                "name": "AirAsia India"
            },
            {
                "code": "I4",
                "name": "Interstate Airlines"
            },
            {
                "code": "I2",
                "name": "Iberia Express"
            },
            {
                "code": "HZ",
                "name": "Sakhalinskie Aviatrassy (SAT)"
            },
            {
                "code": "HZ",
                "name": "Sat Airlines"
            },
            {
                "code": "HY",
                "name": "Uzbekistan Airways"
            },
            {
                "code": "HX",
                "name": "Hong Kong Airlines"
            },
            {
                "code": "HW",
                "name": "Hello"
            },
            {
                "code": "HW",
                "name": "North-Wright Airways"
            },
            {
                "code": "HV",
                "name": "Transavia Holland"
            },
            {
                "code": "HU",
                "name": "Hainan Airlines"
            },
            {
                "code": "HT",
                "name": "Aeromist-Kharkiv"
            },
            {
                "code": "HR",
                "name": "Hahn Air"
            },
            {
                "code": "HQ",
                "name": "Harmony Airways"
            },
            {
                "code": "HQ",
                "name": "Thomas Cook Airlines"
            },
            {
                "code": "HP",
                "name": "America West Airlines"
            },
            {
                "code": "HP",
                "name": "Hawaiian Pacific Airlines"
            },
            {
                "code": "HP",
                "name": "Pearl Airways"
            },
            {
                "code": "HP",
                "name": "Phoenix Airways"
            },
            {
                "code": "HO",
                "name": "Antinea Airlines"
            },
            {
                "code": "HO",
                "name": "Juneyao Airlines"
            },
            {
                "code": "HN",
                "name": "Heavylift Cargo Airlines"
            },
            {
                "code": "HM",
                "name": "Air Seychelles"
            },
            {
                "code": "HK",
                "name": "Four Star Aviation / Four Star Cargo"
            },
            {
                "code": "HJ",
                "name": "Asian Express Airlines"
            },
            {
                "code": "HJ",
                "name": "Hellas Jet"
            },
            {
                "code": "HH",
                "name": "Hope Air"
            },
            {
                "code": "HG",
                "name": "Niki"
            },
            {
                "code": "HF",
                "name": "Hapagfly"
            },
            {
                "code": "HE",
                "name": "Luftfahrtgesellschaft Walter"
            },
            {
                "code": "HD",
                "name": "Air Holland"
            },
            {
                "code": "HD",
                "name": "AIRDO"
            },
            {
                "code": "HC",
                "name": "Aero-Tropics Air Services"
            },
            {
                "code": "HC",
                "name": "Holidays Czech Airlines"
            },
            {
                "code": "HC",
                "name": "Iceland Express"
            },
            {
                "code": "HB",
                "name": "Harbor Airlines"
            },
            {
                "code": "HA",
                "name": "Hawaiian Airlines"
            },
            {
                "code": "H9",
                "name": "Air d'Ayiti"
            },
            {
                "code": "H9",
                "name": "Izair"
            },
            {
                "code": "H8",
                "name": "Dalavia"
            },
            {
                "code": "H7",
                "name": "Eagle Air"
            },
            {
                "code": "H6",
                "name": "Hageland Aviation Services"
            },
            {
                "code": "H5",
                "name": "Hola Airlines"
            },
            {
                "code": "H5",
                "name": "Mavial Magadan Airlines"
            },
            {
                "code": "H4",
                "name": "Héli Sécurité Helicopter Airlines"
            },
            {
                "code": "H4",
                "name": "Inter Island Airways"
            },
            {
                "code": "H2",
                "name": "Sky Airline"
            },
            {
                "code": "GZ",
                "name": "Air Rarotonga"
            },
            {
                "code": "GY",
                "name": "Guyana Airways 2000"
            },
            {
                "code": "GY",
                "name": "Tri-MG Intra Asia Airlines"
            },
            {
                "code": "GX",
                "name": "Guangxi Beibu Gulf Airlines"
            },
            {
                "code": "GX",
                "name": "JetX Airlines"
            },
            {
                "code": "GX",
                "name": "Pacificair"
            },
            {
                "code": "GW",
                "name": "Kuban Airlines"
            },
            {
                "code": "GW",
                "name": "SkyGreece Airlines"
            },
            {
                "code": "GV",
                "name": "Aero Flight"
            },
            {
                "code": "GT",
                "name": "GB Airways"
            },
            {
                "code": "GS",
                "name": "Air Foyle"
            },
            {
                "code": "GS",
                "name": "Grant Aviation"
            },
            {
                "code": "GR",
                "name": "Aurigny Air Services"
            },
            {
                "code": "GR",
                "name": "Gemini Air Cargo"
            },
            {
                "code": "GQ",
                "name": "Big Sky Airlines"
            },
            {
                "code": "GP",
                "name": "Gestair"
            },
            {
                "code": "GP",
                "name": "Palau Trans Pacific Airlines"
            },
            {
                "code": "GO",
                "name": "Kuzu Airlines Cargo"
            },
            {
                "code": "GN",
                "name": "Air Gabon"
            },
            {
                "code": "GM",
                "name": "Air Slovakia"
            },
            {
                "code": "GL",
                "name": "Air Greenland"
            },
            {
                "code": "GL",
                "name": "Air Greenland"
            },
            {
                "code": "GL",
                "name": "Miami Air International"
            },
            {
                "code": "GK",
                "name": "Go One Airways"
            },
            {
                "code": "GK",
                "name": "JetStar Japan"
            },
            {
                "code": "GJ",
                "name": "Compania Mexicargo"
            },
            {
                "code": "GJ",
                "name": "CDI Cargo Airlines"
            },
            {
                "code": "GJ",
                "name": "Eurofly"
            },
            {
                "code": "GI",
                "name": "Itek Air"
            },
            {
                "code": "GH",
                "name": "Ghana Airways"
            },
            {
                "code": "GG",
                "name": "Air Guyane"
            },
            {
                "code": "GG",
                "name": "Air Comores International"
            },
            {
                "code": "GG",
                "name": "Cargo 360"
            },
            {
                "code": "GF",
                "name": "Gulf Air Bahrain"
            },
            {
                "code": "GE",
                "name": "TransAsia Airways"
            },
            {
                "code": "GD",
                "name": "Air Alpha Greenland"
            },
            {
                "code": "GC",
                "name": "Gambia International Airlines"
            },
            {
                "code": "GB",
                "name": "Airborne Express"
            },
            {
                "code": "GB",
                "name": "ABX Air"
            },
            {
                "code": "GA",
                "name": "Garuda Indonesia"
            },
            {
                "code": "G9",
                "name": "Air Arabia"
            },
            {
                "code": "G8",
                "name": "Air Service Gabon"
            },
            {
                "code": "G8",
                "name": "Enkor JSC"
            },
            {
                "code": "G8",
                "name": "GoAir"
            },
            {
                "code": "G8",
                "name": "Gujarat Airways"
            },
            {
                "code": "G7",
                "name": "Gandalf Airlines"
            },
            {
                "code": "G7",
                "name": "GoJet Airlines"
            },
            {
                "code": "G6",
                "name": "Guine Bissaur Airlines"
            },
            {
                "code": "G6",
                "name": "Air Volga"
            },
            {
                "code": "G5",
                "name": "China Express Airlines"
            },
            {
                "code": "G4",
                "name": "Allegiant Air"
            },
            {
                "code": "G3",
                "name": "City Connexion Airlines"
            },
            {
                "code": "G3",
                "name": "Gol Transportes Aéreos"
            },
            {
                "code": "G2",
                "name": "Avirex"
            },
            {
                "code": "G1",
                "name": "Gorkha Airlines"
            },
            {
                "code": "G0",
                "name": "Ghana International Airlines"
            },
            {
                "code": "FZ",
                "name": "Flydubai"
            },
            {
                "code": "FY",
                "name": "Firefly"
            },
            {
                "code": "FY",
                "name": "Northwest Regional Airlines"
            },
            {
                "code": "FX",
                "name": "Federal Express"
            },
            {
                "code": "FW",
                "name": "Ibex Airlines"
            },
            {
                "code": "FV",
                "name": "Pulkovo Aviation Enterprise"
            },
            {
                "code": "FV",
                "name": "Rossiya"
            },
            {
                "code": "FT",
                "name": "Siem Reap Airways"
            },
            {
                "code": "FS",
                "name": "Itali Airlines"
            },
            {
                "code": "FS",
                "name": "Servicios de Transportes Aéreos Fueguinos"
            },
            {
                "code": "FR",
                "name": "Ryanair"
            },
            {
                "code": "FP",
                "name": "Freedom Air"
            },
            {
                "code": "FP",
                "name": "Servicios Aéreos de los Andes"
            },
            {
                "code": "FO",
                "name": "Airlines of Tasmania"
            },
            {
                "code": "FN",
                "name": "Regional Air Lines"
            },
            {
                "code": "FM",
                "name": "Shanghai Airlines"
            },
            {
                "code": "FL",
                "name": "AirTran Airways"
            },
            {
                "code": "FK",
                "name": "Africa West"
            },
            {
                "code": "FK",
                "name": "Keewatin Air"
            },
            {
                "code": "FJ",
                "name": "Fiji Airways"
            },
            {
                "code": "FI",
                "name": "Icelandair"
            },
            {
                "code": "FH",
                "name": "Freebird Airlines"
            },
            {
                "code": "FH",
                "name": "Futura International Airways"
            },
            {
                "code": "FG",
                "name": "Ariana Afghan Airlines"
            },
            {
                "code": "FF",
                "name": "Airshop"
            },
            {
                "code": "FE",
                "name": "Primaris Airlines"
            },
            {
                "code": "FD",
                "name": "Royal Flying Doctor Service"
            },
            {
                "code": "FD",
                "name": "Thai AirAsia"
            },
            {
                "code": "FC",
                "name": "Finncomm Airlines"
            },
            {
                "code": "FB",
                "name": "Bulgaria Air"
            },
            {
                "code": "FA",
                "name": "Safair"
            },
            {
                "code": "F9",
                "name": "Frontier Airlines"
            },
            {
                "code": "F7",
                "name": "Flybaboo"
            },
            {
                "code": "F6",
                "name": "Faroejet"
            },
            {
                "code": "F5",
                "name": "Cosmic Air"
            },
            {
                "code": "F4",
                "name": "Albarka Air"
            },
            {
                "code": "F3",
                "name": "Faso Airways"
            },
            {
                "code": "F2",
                "name": "Fly Air"
            },
            {
                "code": "EZ",
                "name": "Evergreen International Airlines"
            },
            {
                "code": "EZ",
                "name": "Sun Air of Scandinavia"
            },
            {
                "code": "EY",
                "name": "Eagle Air"
            },
            {
                "code": "EY",
                "name": "Etihad Airways"
            },
            {
                "code": "EX",
                "name": "Atlantic Airlines"
            },
            {
                "code": "EX",
                "name": "Air Santo Domingo"
            },
            {
                "code": "EW",
                "name": "Eurowings"
            },
            {
                "code": "EV",
                "name": "Atlantic Southeast Airlines"
            },
            {
                "code": "EV",
                "name": "ExpressJet"
            },
            {
                "code": "EU",
                "name": "Empresa Ecuatoriana De Aviación"
            },
            {
                "code": "ET",
                "name": "Ethiopian Airlines"
            },
            {
                "code": "ES",
                "name": "DHL International"
            },
            {
                "code": "ER",
                "name": "Astar Air Cargo"
            },
            {
                "code": "EQ",
                "name": "TAME"
            },
            {
                "code": "EP",
                "name": "Iran Aseman Airlines"
            },
            {
                "code": "EO",
                "name": "Express One International"
            },
            {
                "code": "EO",
                "name": "Hewa Bora Airways"
            },
            {
                "code": "EN",
                "name": "Air Dolomiti"
            },
            {
                "code": "EM",
                "name": "Aero Benin"
            },
            {
                "code": "EM",
                "name": "Empire Airlines"
            },
            {
                "code": "EL",
                "name": "Air Nippon"
            },
            {
                "code": "EL",
                "name": "Ellinair"
            },
            {
                "code": "EK",
                "name": "Emirates Airline"
            },
            {
                "code": "EJ",
                "name": "New England Airlines"
            },
            {
                "code": "EI",
                "name": "Aer Lingus"
            },
            {
                "code": "EH",
                "name": "Air Nippon Network Co. Ltd."
            },
            {
                "code": "EH",
                "name": "SAETA"
            },
            {
                "code": "EG",
                "name": "Japan Asia Airways"
            },
            {
                "code": "EF",
                "name": "Far Eastern Air Transport"
            },
            {
                "code": "EE",
                "name": "Aero Airlines"
            },
            {
                "code": "ED",
                "name": "Airblue"
            },
            {
                "code": "EC",
                "name": "Avialeasing Aviation Company"
            },
            {
                "code": "EA",
                "name": "Eastern Air Lines"
            },
            {
                "code": "EA",
                "name": "European Air Express"
            },
            {
                "code": "E9",
                "name": "Boston-Maine Airways"
            },
            {
                "code": "E8",
                "name": "Alpi Eagles"
            },
            {
                "code": "E7",
                "name": "Estafeta Carga Aérea"
            },
            {
                "code": "E7",
                "name": "European Aviation Air Charter"
            },
            {
                "code": "E6",
                "name": "Bringer Air Cargo Taxi Aéreo"
            },
            {
                "code": "E5",
                "name": "Samara Airlines"
            },
            {
                "code": "E4",
                "name": "Aero Asia International"
            },
            {
                "code": "E3",
                "name": "Domodedovo Airlines"
            },
            {
                "code": "E2",
                "name": "Kampuchea Airlines"
            },
            {
                "code": "E2",
                "name": "Rio Grande Air"
            },
            {
                "code": "E1",
                "name": "Everbread"
            },
            {
                "code": "E0",
                "name": "Eos Airlines"
            },
            {
                "code": "DY",
                "name": "Norwegian Air Shuttle"
            },
            {
                "code": "DX",
                "name": "DAT Danish Air Transport"
            },
            {
                "code": "DW",
                "name": "Aero-Charter Ukraine"
            },
            {
                "code": "DV",
                "name": "Lufttaxi Fluggesellschaft"
            },
            {
                "code": "DV",
                "name": "Nantucket Airlines"
            },
            {
                "code": "DU",
                "name": "Norwegian Long Haul"
            },
            {
                "code": "DT",
                "name": "TAAG Angola Airlines"
            },
            {
                "code": "DS",
                "name": "easyJet Switzerland"
            },
            {
                "code": "DQ",
                "name": "Coastal Air"
            },
            {
                "code": "DP",
                "name": "First Choice Airways"
            },
            {
                "code": "DO",
                "name": "Dominicana de Aviación"
            },
            {
                "code": "DM",
                "name": "Maersk"
            },
            {
                "code": "DL",
                "name": "Delta Air Lines"
            },
            {
                "code": "DK",
                "name": "Eastland Air"
            },
            {
                "code": "DJ",
                "name": "Pacific Blue"
            },
            {
                "code": "DJ",
                "name": "Polynesian Blue"
            },
            {
                "code": "DJ",
                "name": "Virgin Australia"
            },
            {
                "code": "DJ",
                "name": "Virgin Blue Holdings"
            },
            {
                "code": "DI",
                "name": "Dba"
            },
            {
                "code": "DH",
                "name": "Discovery Airways"
            },
            {
                "code": "DH",
                "name": "Independence Air"
            },
            {
                "code": "DG",
                "name": "Tigerair Philippines"
            },
            {
                "code": "DE",
                "name": "Condor Flugdienst"
            },
            {
                "code": "DD",
                "name": "Nok Air"
            },
            {
                "code": "DC",
                "name": "Golden Air"
            },
            {
                "code": "DB",
                "name": "Brit Air"
            },
            {
                "code": "DA",
                "name": "Air Georgia"
            },
            {
                "code": "D9",
                "name": "Donavia"
            },
            {
                "code": "D8",
                "name": "Norwegian Air International"
            },
            {
                "code": "D7",
                "name": "AirAsia X"
            },
            {
                "code": "D7",
                "name": "FlyAsianXpress"
            },
            {
                "code": "D6",
                "name": "Interair South Africa"
            },
            {
                "code": "D5",
                "name": "Dauair"
            },
            {
                "code": "D4",
                "name": "Alidaunia"
            },
            {
                "code": "D3",
                "name": "Daallo Airlines"
            },
            {
                "code": "D2",
                "name": "Severstal Air Company"
            },
            {
                "code": "CZ",
                "name": "China Southern Airlines"
            },
            {
                "code": "CY",
                "name": "Cyprus Airways"
            },
            {
                "code": "CX",
                "name": "Cathay Pacific"
            },
            {
                "code": "CW",
                "name": "Air Marshall Islands"
            },
            {
                "code": "CV",
                "name": "Air Chathams"
            },
            {
                "code": "CV",
                "name": "Cargolux"
            },
            {
                "code": "CU",
                "name": "Cubana de Aviación"
            },
            {
                "code": "CT",
                "name": "Civil Air Transport"
            },
            {
                "code": "CS",
                "name": "Continental Micronesia"
            },
            {
                "code": "CR",
                "name": "OAG"
            },
            {
                "code": "CQ",
                "name": "Central Charter"
            },
            {
                "code": "CQ",
                "name": "Sunshine Express Airlines"
            },
            {
                "code": "CP",
                "name": "Canadian Airlines"
            },
            {
                "code": "CP",
                "name": "Canadian Pacific Airlines"
            },
            {
                "code": "CP",
                "name": "Compass Airlines"
            },
            {
                "code": "CO",
                "name": "Continental Airlines"
            },
            {
                "code": "CO",
                "name": "Continental Express"
            },
            {
                "code": "CN",
                "name": "Islands Nationair"
            },
            {
                "code": "CN",
                "name": "Westward Airways"
            },
            {
                "code": "CM",
                "name": "Copa Airlines"
            },
            {
                "code": "CL",
                "name": "Lufthansa CityLine"
            },
            {
                "code": "CK",
                "name": "China Cargo Airlines"
            },
            {
                "code": "CJ",
                "name": "China Northern Airlines"
            },
            {
                "code": "CJ",
                "name": "CityFlyer Express"
            },
            {
                "code": "CI",
                "name": "China Airlines"
            },
            {
                "code": "CH",
                "name": "Bemidji Airlines"
            },
            {
                "code": "CG",
                "name": "Airlines PNG"
            },
            {
                "code": "CF",
                "name": "City Airline"
            },
            {
                "code": "CE",
                "name": "Nationwide Airlines"
            },
            {
                "code": "CD",
                "name": "Alliance Air"
            },
            {
                "code": "CD",
                "name": "Corendon Dutch Airlines"
            },
            {
                "code": "CC",
                "name": "Air Atlanta Icelandic"
            },
            {
                "code": "CC",
                "name": "Macair Airlines"
            },
            {
                "code": "CB*",
                "name": "Kalitta Charters II"
            },
            {
                "code": "CA",
                "name": "Air China"
            },
            {
                "code": "C9",
                "name": "Cirrus Airlines"
            },
            {
                "code": "C8",
                "name": "Cargolux Italia"
            },
            {
                "code": "C8",
                "name": "Chicago Express Airlines"
            },
            {
                "code": "C7",
                "name": "Cinnamon Air"
            },
            {
                "code": "C7",
                "name": "Rico Linhas Aéreas"
            },
            {
                "code": "C6",
                "name": "CanJet"
            },
            {
                "code": "C5",
                "name": "CommutAir"
            },
            {
                "code": "C4",
                "name": "Zimex Aviation"
            },
            {
                "code": "C3",
                "name": "Independent Carrier (ICAR)"
            },
            {
                "code": "BZ",
                "name": "Blue Dart Aviation"
            },
            {
                "code": "BZ",
                "name": "Keystone Air Service"
            },
            {
                "code": "BY",
                "name": "Thomson Airways"
            },
            {
                "code": "BX",
                "name": "Air Busan"
            },
            {
                "code": "BX",
                "name": "Coast Air"
            },
            {
                "code": "BW",
                "name": "Caribbean Airlines"
            },
            {
                "code": "BV",
                "name": "Blue Panorama Airlines"
            },
            {
                "code": "BU",
                "name": "Buryat Airlines Aircompany"
            },
            {
                "code": "BT",
                "name": "Air Baltic"
            },
            {
                "code": "BS",
                "name": "British International Helicopters"
            },
            {
                "code": "BR",
                "name": "EVA Air"
            },
            {
                "code": "BQ",
                "name": "Aeromar Lineas Aereas Dominicanas"
            },
            {
                "code": "BQ",
                "name": "Baltia Air Lines"
            },
            {
                "code": "BP",
                "name": "Air Botswana"
            },
            {
                "code": "BO",
                "name": "Bouraq Indonesia Airlines"
            },
            {
                "code": "BN",
                "name": "Braniff International Airways"
            },
            {
                "code": "BN",
                "name": "Forward Air International Airlines"
            },
            {
                "code": "BN",
                "name": "Horizon Airlines"
            },
            {
                "code": "BM",
                "name": "Air Sicilia"
            },
            {
                "code": "BM",
                "name": "BMI Regional"
            },
            {
                "code": "BL",
                "name": "Pacific Airlines"
            },
            {
                "code": "BK",
                "name": "Potomac Air"
            },
            {
                "code": "BJ",
                "name": "Nouvel Air Tunisie"
            },
            {
                "code": "BI",
                "name": "Royal Brunei Airlines"
            },
            {
                "code": "BH",
                "name": "Hawkair"
            },
            {
                "code": "BG",
                "name": "Biman Bangladesh Airlines"
            },
            {
                "code": "BF",
                "name": "Aero-Service"
            },
            {
                "code": "BF",
                "name": "Bluebird Cargo"
            },
            {
                "code": "BE",
                "name": "Flybe"
            },
            {
                "code": "BD",
                "name": "BMI"
            },
            {
                "code": "BC",
                "name": "Skymark Airlines"
            },
            {
                "code": "BB",
                "name": "Seaborne Airlines"
            },
            {
                "code": "BA",
                "name": "British Airways"
            },
            {
                "code": "B9",
                "name": "Air Bangladesh"
            },
            {
                "code": "B8",
                "name": "Eritrean Airlines"
            },
            {
                "code": "B6",
                "name": "JetBlue Airways"
            },
            {
                "code": "B5",
                "name": "Flightline"
            },
            {
                "code": "B4",
                "name": "BACH Flugbetriebsges"
            },
            {
                "code": "B4",
                "name": "Bankair"
            },
            {
                "code": "B3",
                "name": "Bellview Airlines"
            },
            {
                "code": "B2",
                "name": "Belavia Belarusian Airlines"
            },
            {
                "code": "AZ",
                "name": "Alitalia"
            },
            {
                "code": "AY",
                "name": "Finnair"
            },
            {
                "code": "AX",
                "name": "AmericanConnection[5]"
            },
            {
                "code": "AX",
                "name": "Trans States Airlines"
            },
            {
                "code": "AW",
                "name": "Africa World Airlines"
            },
            {
                "code": "AW",
                "name": "CHC Airways"
            },
            {
                "code": "AW",
                "name": "Dirgantara Air Service"
            },
            {
                "code": "AV",
                "name": "Avianca - Aerovías del Continente Americano S.A."
            },
            {
                "code": "AU",
                "name": "Austral Líneas Aéreas"
            },
            {
                "code": "AT",
                "name": "Royal Air Maroc"
            },
            {
                "code": "AS",
                "name": "Alaska Airlines"
            },
            {
                "code": "AR",
                "name": "Aerolíneas Argentinas"
            },
            {
                "code": "AQ",
                "name": "Aloha Airlines"
            },
            {
                "code": "AQ",
                "name": "MAP-Management and Planung"
            },
            {
                "code": "AP",
                "name": "Air One"
            },
            {
                "code": "AO",
                "name": "Australian Airlines"
            },
            {
                "code": "AN",
                "name": "Ansett Australia"
            },
            {
                "code": "AM",
                "name": "Aeroméxico"
            },
            {
                "code": "AL",
                "name": "Skywalk Airlines"
            },
            {
                "code": "AL",
                "name": "TransAVIAexport Airlines"
            },
            {
                "code": "AK",
                "name": "AirAsia"
            },
            {
                "code": "AK",
                "name": "Air Bridge Carriers"
            },
            {
                "code": "AJ",
                "name": "Aero Contractors"
            },
            {
                "code": "AI",
                "name": "Air India Limited"
            },
            {
                "code": "AH",
                "name": "Air Algérie"
            },
            {
                "code": "AF",
                "name": "Air France"
            },
            {
                "code": "AE",
                "name": "Air Ceylon"
            },
            {
                "code": "AE",
                "name": "Mandarin Airlines"
            },
            {
                "code": "AD",
                "name": "Air Paradise International"
            },
            {
                "code": "AD",
                "name": "Azul Linhas Aéreas Brasileiras"
            },
            {
                "code": "AC",
                "name": "Air Canada"
            },
            {
                "code": "AB",
                "name": "Air Berlin"
            },
            {
                "code": "AA",
                "name": "American Airlines"
            },
            {
                "code": "A9",
                "name": "Georgian Airways"
            },
            {
                "code": "A8",
                "name": "Aerolink Uganda"
            },
            {
                "code": "A8",
                "name": "Benin Golf Air"
            },
            {
                "code": "A7",
                "name": "Air Plus Comet"
            },
            {
                "code": "A6",
                "name": "Air Alps Aviation"
            },
            {
                "code": "A5",
                "name": "Airlinair"
            },
            {
                "code": "A5",
                "name": "Hop!"
            },
            {
                "code": "A4",
                "name": "Southern Winds Airlines"
            },
            {
                "code": "A3",
                "name": "Aegean Airlines"
            },
            {
                "code": "A2",
                "name": "Astra Airlines"
            },
            {
                "code": "A2",
                "name": "Cielos Airlines"
            },
            {
                "code": "9Y",
                "name": "Fly Georgia"
            },
            {
                "code": "9W",
                "name": "Jet Airways"
            },
            {
                "code": "9V",
                "name": "Vipair Airlines"
            },
            {
                "code": "9U",
                "name": "Air Moldova"
            },
            {
                "code": "9T",
                "name": "Transwest Air"
            },
            {
                "code": "9R",
                "name": "Phuket Air"
            },
            {
                "code": "9Q",
                "name": "PB Air"
            },
            {
                "code": "9O",
                "name": "National Airways Cameroon"
            },
            {
                "code": "9M",
                "name": "Central Mountain Air"
            },
            {
                "code": "9L",
                "name": "Colgan Air"
            },
            {
                "code": "9K",
                "name": "Cape Air"
            },
            {
                "code": "9I",
                "name": "Helitrans"
            },
            {
                "code": "9I",
                "name": "Thai Sky Airlines"
            },
            {
                "code": "9E",
                "name": "Pinnacle Airlines"
            },
            {
                "code": "9C",
                "name": "Spring Airlines"
            },
            {
                "code": "9A",
                "name": "Eagle Express Air Charter"
            },
            {
                "code": "8Z",
                "name": "Wizz Air Bulgaria"
            },
            {
                "code": "8Y",
                "name": "Air Burundi"
            },
            {
                "code": "8Y",
                "name": "China Postal Airlines"
            },
            {
                "code": "8W?",
                "name": "BAX Global"
            },
            {
                "code": "8W",
                "name": "Private Wings Flugcharter"
            },
            {
                "code": "8V",
                "name": "Astral Aviation"
            },
            {
                "code": "8V",
                "name": "Wright Air Service"
            },
            {
                "code": "8U",
                "name": "Afriqiyah Airways"
            },
            {
                "code": "8T",
                "name": "Air Tindi"
            },
            {
                "code": "8S",
                "name": "Scorpio Aviation"
            },
            {
                "code": "8Q",
                "name": "Baker Aviation"
            },
            {
                "code": "8Q",
                "name": "Princess Air"
            },
            {
                "code": "8P",
                "name": "Pacific Coastal Airlines"
            },
            {
                "code": "8O",
                "name": "West Coast Air"
            },
            {
                "code": "8N",
                "name": "Barents AirLink"
            },
            {
                "code": "8M",
                "name": "Maxair"
            },
            {
                "code": "8M",
                "name": "Myanmar Airways International"
            },
            {
                "code": "8L",
                "name": "Cargo Plus Aviation"
            },
            {
                "code": "8L",
                "name": "Redhill Aviation"
            },
            {
                "code": "8J",
                "name": "Komiinteravia"
            },
            {
                "code": "8I",
                "name": "Myway Airlines"
            },
            {
                "code": "8H",
                "name": "Heli France"
            },
            {
                "code": "8F",
                "name": "Fischer Air"
            },
            {
                "code": "8E",
                "name": "Bering Air"
            },
            {
                "code": "8D*",
                "name": "Astair"
            },
            {
                "code": "8D",
                "name": "FitsAir"
            },
            {
                "code": "8D",
                "name": "Servant Air"
            },
            {
                "code": "8C",
                "name": "Air Transport International"
            },
            {
                "code": "8C",
                "name": "Air Horizon"
            },
            {
                "code": "8C",
                "name": "Shanxi Airlines"
            },
            {
                "code": "8B",
                "name": "Caribbean Star Airlines"
            },
            {
                "code": "8A",
                "name": "Atlas Blue"
            },
            {
                "code": "7W",
                "name": "Wayraperú"
            },
            {
                "code": "7T",
                "name": "Air Glaciers"
            },
            {
                "code": "7T",
                "name": "Tobruk Air"
            },
            {
                "code": "7S",
                "name": "Ryan Air Service"
            },
            {
                "code": "7R",
                "name": "BRA-Transportes Aéreos"
            },
            {
                "code": "7O[30]",
                "name": "Travel Service"
            },
            {
                "code": "7O",
                "name": "Galaxy Air"
            },
            {
                "code": "7N",
                "name": "Centavia"
            },
            {
                "code": "7N",
                "name": "PAWA Dominicana"
            },
            {
                "code": "7M",
                "name": "Mistral Air"
            },
            {
                "code": "7L",
                "name": "Sun D'Or"
            },
            {
                "code": "7K",
                "name": "Kogalymavia Air Company"
            },
            {
                "code": "7G",
                "name": "Star Flyer"
            },
            {
                "code": "7F",
                "name": "First Air"
            },
            {
                "code": "7E",
                "name": "Sylt Air GmbH"
            },
            {
                "code": "7C",
                "name": "Coyne Aviation"
            },
            {
                "code": "7C",
                "name": "Jeju Air"
            },
            {
                "code": "7B",
                "name": "Krasnojarsky Airlines"
            },
            {
                "code": "7A",
                "name": "Express Air Cargo"
            },
            {
                "code": "7A",
                "name": "Aztec Worldwide Airlines"
            },
            {
                "code": "7A",
                "name": "Express Air Cargo"
            },
            {
                "code": "6Z",
                "name": "Ukrainian Cargo Airways"
            },
            {
                "code": "6Y",
                "name": "Smartlynx Airlines"
            },
            {
                "code": "6W",
                "name": "Saratov Airlines Joint Stock Company"
            },
            {
                "code": "6V",
                "name": "Air Vegas"
            },
            {
                "code": "6V",
                "name": "Axis Airways"
            },
            {
                "code": "6V",
                "name": "Mars RK"
            },
            {
                "code": "6U",
                "name": "Air Cargo Germany"
            },
            {
                "code": "6U",
                "name": "Air Ukraine"
            },
            {
                "code": "6R",
                "name": "Alrosa Air Company"
            },
            {
                "code": "6Q",
                "name": "Slovak Airlines"
            },
            {
                "code": "6P",
                "name": "Club Air"
            },
            {
                "code": "6N",
                "name": "Nordic Regional"
            },
            {
                "code": "6K",
                "name": "Asian Spirit"
            },
            {
                "code": "6J",
                "name": "Jubba Airways"
            },
            {
                "code": "6J",
                "name": "Skynet Asia Airways"
            },
            {
                "code": "6I",
                "name": "International Business Air"
            },
            {
                "code": "6H",
                "name": "Israir"
            },
            {
                "code": "6G",
                "name": "Air Wales"
            },
            {
                "code": "6E",
                "name": "IndiGo Airlines"
            },
            {
                "code": "6B",
                "name": "TUIfly Nordic"
            },
            {
                "code": "6A",
                "name": "Aviacsa"
            },
            {
                "code": "5Z",
                "name": "Airfreight Express"
            },
            {
                "code": "5Z",
                "name": "Bismillah Airlines"
            },
            {
                "code": "5Z",
                "name": "VivaColombia"
            },
            {
                "code": "5Y",
                "name": "Atlas Air"
            },
            {
                "code": "5X",
                "name": "United Parcel Service"
            },
            {
                "code": "5W",
                "name": "Astraeus"
            },
            {
                "code": "5V",
                "name": "Lviv Airlines"
            },
            {
                "code": "5T",
                "name": "Canadian North"
            },
            {
                "code": "5O",
                "name": "Europe Airpost"
            },
            {
                "code": "5N",
                "name": "Nordavia"
            },
            {
                "code": "5M",
                "name": "Montserrat Airways"
            },
            {
                "code": "5M",
                "name": "Sibaviatrans"
            },
            {
                "code": "5L",
                "name": "AeroSur"
            },
            {
                "code": "5K",
                "name": "Hi Fly"
            },
            {
                "code": "5J",
                "name": "Cebu Pacific"
            },
            {
                "code": "5G",
                "name": "Skyservice Airlines"
            },
            {
                "code": "5F",
                "name": "Arctic Circle Air Service"
            },
            {
                "code": "5F",
                "name": "Fly One"
            },
            {
                "code": "5D",
                "name": "Aerolitoral"
            },
            {
                "code": "5D",
                "name": "DonbassAero"
            },
            {
                "code": "5C",
                "name": "CAL Cargo Air Lines"
            },
            {
                "code": "5A",
                "name": "Alpine Air Express"
            },
            {
                "code": "4Y",
                "name": "Airbus Industrie"
            },
            {
                "code": "4Y",
                "name": "Airbus Transport International"
            },
            {
                "code": "4Y",
                "name": "Airbus France"
            },
            {
                "code": "4Y",
                "name": "Yute Air Alaska"
            },
            {
                "code": "4U",
                "name": "Germanwings"
            },
            {
                "code": "4T",
                "name": "Belair Airlines"
            },
            {
                "code": "4S",
                "name": "Finalair Congo"
            },
            {
                "code": "4R",
                "name": "Hamburg International"
            },
            {
                "code": "4O",
                "name": "Interjet"
            },
            {
                "code": "4N",
                "name": "Air North Charter - Canada"
            },
            {
                "code": "4M",
                "name": "Aero 2000"
            },
            {
                "code": "4K",
                "name": "Askari Aviation"
            },
            {
                "code": "4H",
                "name": "United Airways"
            },
            {
                "code": "4G",
                "name": "Gazpromavia"
            },
            {
                "code": "4F",
                "name": "Air City"
            },
            {
                "code": "4D",
                "name": "Air Sinai"
            },
            {
                "code": "4C",
                "name": "Aires"
            },
            {
                "code": "4A",
                "name": "Air Kiribati"
            },
            {
                "code": "3X",
                "name": "Japan Air Commuter"
            },
            {
                "code": "3W",
                "name": "Wan Air"
            },
            {
                "code": "3V",
                "name": "TNT Airways"
            },
            {
                "code": "3U",
                "name": "Sichuan Airlines"
            },
            {
                "code": "3T",
                "name": "Turan Air"
            },
            {
                "code": "3S",
                "name": "Aerologic"
            },
            {
                "code": "3R",
                "name": "Moskovia Airlines"
            },
            {
                "code": "3Q",
                "name": "China Yunnan Airlines"
            },
            {
                "code": "3P",
                "name": "Tiara Air"
            },
            {
                "code": "3O",
                "name": "Air Arabia Maroc"
            },
            {
                "code": "3N",
                "name": "Air Urga"
            },
            {
                "code": "3L",
                "name": "Intersky"
            },
            {
                "code": "3K",
                "name": "Jetstar Asia Airways"
            },
            {
                "code": "3J",
                "name": "Air Alliance"
            },
            {
                "code": "3J",
                "name": "Zip"
            },
            {
                "code": "3G",
                "name": "Atlant-Soyuz Airlines"
            },
            {
                "code": "3C",
                "name": "Calima Aviación"
            },
            {
                "code": "3C",
                "name": "RegionsAir"
            },
            {
                "code": "3B",
                "name": "Central Connect Airlines"
            },
            {
                "code": "2Z",
                "name": "Chang An Airlines"
            },
            {
                "code": "2W",
                "name": "Welcome Air"
            },
            {
                "code": "2U",
                "name": "Air Guinee Express"
            },
            {
                "code": "2T",
                "name": "Haiti Ambassador Airlines"
            },
            {
                "code": "2S",
                "name": "Island Express"
            },
            {
                "code": "2S",
                "name": "Star Equatorial Airlines"
            },
            {
                "code": "2S",
                "name": "Satgur Air Transport"
            },
            {
                "code": "2R",
                "name": "Via Rail Canada"
            },
            {
                "code": "2Q",
                "name": "Air Cargo Carriers"
            },
            {
                "code": "2P",
                "name": "Air Philippines"
            },
            {
                "code": "2O",
                "name": "Air Salone"
            },
            {
                "code": "2N",
                "name": "NextJet"
            },
            {
                "code": "2N",
                "name": "Yuzhmashavia"
            },
            {
                "code": "2M",
                "name": "Moldavian Airlines"
            },
            {
                "code": "2L",
                "name": "Helvetic Airways"
            },
            {
                "code": "2K",
                "name": "Aerogal"
            },
            {
                "code": "2J",
                "name": "Air Burkina"
            },
            {
                "code": "2H",
                "name": "Thalys"
            },
            {
                "code": "2G",
                "name": "San Juan Airlines"
            },
            {
                "code": "2G",
                "name": "Cargoitalia"
            },
            {
                "code": "2F",
                "name": "Frontier Flying Service"
            },
            {
                "code": "2D",
                "name": "Aero VIP"
            },
            {
                "code": "2C",
                "name": "SNCF"
            },
            {
                "code": "2B",
                "name": "Aerocondor"
            },
            {
                "code": "2A",
                "name": "Deutsche Bahn"
            },
            {
                "code": "1Z",
                "name": "Sabre Pacific"
            },
            {
                "code": "1Y",
                "name": "Electronic Data Systems"
            },
            {
                "code": "1U",
                "name": "ITA Software"
            },
            {
                "code": "1U",
                "name": "Polyot Sirena"
            },
            {
                "code": "1T",
                "name": "1Time Airline"
            },
            {
                "code": "1T",
                "name": "Bulgarian Air Charter"
            },
            {
                "code": "1S",
                "name": "Sabre"
            },
            {
                "code": "1R",
                "name": "Hainan Phoenix Information Systems"
            },
            {
                "code": "1Q",
                "name": "Sirena"
            },
            {
                "code": "1P",
                "name": "Worldspan"
            },
            {
                "code": "1N",
                "name": "Navitaire"
            },
            {
                "code": "1M",
                "name": "JSC Transport Automated Information Systems"
            },
            {
                "code": "1L",
                "name": "Open Skies Consultative Commission"
            },
            {
                "code": "1K",
                "name": "Southern Cross Distribution"
            },
            {
                "code": "1K",
                "name": "Sutra"
            },
            {
                "code": "1I",
                "name": "Deutsche Rettungsflugwacht"
            },
            {
                "code": "1I",
                "name": "NetJets"
            },
            {
                "code": "1I",
                "name": "Novair"
            },
            {
                "code": "1I",
                "name": "Pegasus Hava Tasimaciligi"
            },
            {
                "code": "1I",
                "name": "Sierra Nevada Airlines"
            },
            {
                "code": "1I",
                "name": "Sky Trek International Airlines"
            },
            {
                "code": "1H",
                "name": "Siren-Travel"
            },
            {
                "code": "1G",
                "name": "Galileo International"
            },
            {
                "code": "1F",
                "name": "INFINI Travel Information"
            },
            {
                "code": "1E",
                "name": "Travelsky Technology"
            },
            {
                "code": "1D",
                "name": "Radixx Solutions International"
            },
            {
                "code": "1C",
                "name": "Electronic Data Systems"
            },
            {
                "code": "1B",
                "name": "Abacus International"
            },
            {
                "code": "1A",
                "name": "Amadeus Global Travel Distribution"
            },
            {
                "code": "0V",
                "name": "Vietnam Air Services Company (VASCO)"
            },
            {
                "code": "0J",
                "name": "Jetclub"
            },
            {
                "code": "0D",
                "name": "Darwin Airline"
            },
            {
                "code": "0C",
                "name": "IBL Aviation"
            },
            {
                "code": "0B",
                "name": "Blue Air"
            },
            {
                "code": "0A",
                "name": "Amber Air"
            }
        ];
        return AirlineCodes;
    }());
    Planning.AirlineCodes = AirlineCodes;
})(Planning || (Planning = {}));
//# sourceMappingURL=AirlineCodes.js.map