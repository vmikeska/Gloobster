﻿
//function getAllCountryCodes() {

//	var out = "";

//	for (var property in allCountryCodes) {

//		if (allCountryCodes.hasOwnProperty(property)) {

//			out += ',"' + allCountryCodes[property] + '"';
			
//		}

		
//	}
//	alert(out);
//}

//var allIso3CountryCodes = ["BGD", "BEL", "BFA", "BGR", "BIH", "BRB", "WLF", "BLM", "BMU", "BRN", "BOL", "BHR", "BDI", "BEN", "BTN", "JAM", "BVT", "BWA", "WSM", "BES", "BRA", "BHS", "JEY", "BLR", "BLZ", "RUS", "RWA", "SRB", "TLS", "REU", "TKM", "TJK", "ROU", "TKL", "GNB", "GUM", "GTM", "SGS", "GRC", "GNQ", "GLP", "JPN", "GUY", "GGY", "GUF", "GEO", "GRD", "GBR", "GAB", "SLV", "GIN", "GMB", "GRL", "GIB", "GHA", "OMN", "TUN", "JOR", "HRV", "HTI", "HUN", "HKG", "HND", "HMD", "VEN", "PRI", "PSE", "PLW", "PRT", "SJM", "PRY", "IRQ", "PAN", "PYF", "PNG", "PER", "PAK", "PHL", "PCN", "POL", "SPM", "ZMB", "ESH", "EST", "EGY", "ZAF", "ECU", "ITA", "VNM", "SLB", "ETH", "SOM", "ZWE", "SAU", "ESP", "ERI", "MNE", "MDA", "MDG", "MAF", "MAR", "MCO", "UZB", "MMR", "MLI", "MAC", "MNG", "MHL", "MKD", "MUS", "MLT", "MWI", "MDV", "MTQ", "MNP", "MSR", "MRT", "IMN", "UGA", "TZA", "MYS", "MEX", "ISR", "FRA", "IOT", "SHN", "FIN", "FJI", "FLK", "FSM", "FRO", "NIC", "NLD", "NOR", "NAM", "VUT", "NCL", "NER", "NFK", "NGA", "NZL", "NPL", "NRU", "NIU", "COK", "XKX", "CIV", "CHE", "COL", "CHN", "CMR", "CHL", "CCK", "CAN", "COG", "CAF", "COD", "CZE", "CYP", "CXR", "CRI", "CUW", "CPV", "CUB", "SWZ", "SYR", "SXM", "KGZ", "KEN", "SSD", "SUR", "KIR", "KHM", "KNA", "COM", "STP", "SVK", "KOR", "SVN", "PRK", "KWT", "SEN", "SMR", "SLE", "SYC", "KAZ", "CYM", "SGP", "SWE", "SDN", "DOM", "DMA", "DJI", "DNK", "VGB", "DEU", "YEM", "DZA", "USA", "URY", "MYT", "UMI", "LBN", "LCA", "LAO", "TUV", "TWN", "TTO", "TUR", "LKA", "LIE", "LVA", "TON", "LTU", "LUX", "LBR", "LSO", "THA", "ATF", "TGO", "TCD", "TCA", "LBY", "VAT", "ARE", "AND", "ATG", "AFG", "AIA", "VIR", "ISL", "IRN", "ARM", "ALB", "AGO", "ATA", "ASM", "ARG", "AUS", "AUT", "ABW", "IND", "ALA", "AZE", "IRL", "IDN", "UKR", "QAT", "MOZ"];

//var allCountryCodes = 
//{ "BD": "BGD", "BE": "BEL", "BF": "BFA", "BG": "BGR", "BA": "BIH", "BB": "BRB", "WF": "WLF", "BL": "BLM", "BM": "BMU", "BN": "BRN", "BO": "BOL", "BH": "BHR", "BI": "BDI", "BJ": "BEN", "BT": "BTN", "JM": "JAM", "BV": "BVT", "BW": "BWA", "WS": "WSM", "BQ": "BES", "BR": "BRA", "BS": "BHS", "JE": "JEY", "BY": "BLR", "BZ": "BLZ", "RU": "RUS", "RW": "RWA", "RS": "SRB", "TL": "TLS", "RE": "REU", "TM": "TKM", "TJ": "TJK", "RO": "ROU", "TK": "TKL", "GW": "GNB", "GU": "GUM", "GT": "GTM", "GS": "SGS", "GR": "GRC", "GQ": "GNQ", "GP": "GLP", "JP": "JPN", "GY": "GUY", "GG": "GGY", "GF": "GUF", "GE": "GEO", "GD": "GRD", "GB": "GBR", "GA": "GAB", "SV": "SLV", "GN": "GIN", "GM": "GMB", "GL": "GRL", "GI": "GIB", "GH": "GHA", "OM": "OMN", "TN": "TUN", "JO": "JOR", "HR": "HRV", "HT": "HTI", "HU": "HUN", "HK": "HKG", "HN": "HND", "HM": "HMD", "VE": "VEN", "PR": "PRI", "PS": "PSE", "PW": "PLW", "PT": "PRT", "SJ": "SJM", "PY": "PRY", "IQ": "IRQ", "PA": "PAN", "PF": "PYF", "PG": "PNG", "PE": "PER", "PK": "PAK", "PH": "PHL", "PN": "PCN", "PL": "POL", "PM": "SPM", "ZM": "ZMB", "EH": "ESH", "EE": "EST", "EG": "EGY", "ZA": "ZAF", "EC": "ECU", "IT": "ITA", "VN": "VNM", "SB": "SLB", "ET": "ETH", "SO": "SOM", "ZW": "ZWE", "SA": "SAU", "ES": "ESP", "ER": "ERI", "ME": "MNE", "MD": "MDA", "MG": "MDG", "MF": "MAF", "MA": "MAR", "MC": "MCO", "UZ": "UZB", "MM": "MMR", "ML": "MLI", "MO": "MAC", "MN": "MNG", "MH": "MHL", "MK": "MKD", "MU": "MUS", "MT": "MLT", "MW": "MWI", "MV": "MDV", "MQ": "MTQ", "MP": "MNP", "MS": "MSR", "MR": "MRT", "IM": "IMN", "UG": "UGA", "TZ": "TZA", "MY": "MYS", "MX": "MEX", "IL": "ISR", "FR": "FRA", "IO": "IOT", "SH": "SHN", "FI": "FIN", "FJ": "FJI", "FK": "FLK", "FM": "FSM", "FO": "FRO", "NI": "NIC", "NL": "NLD", "NO": "NOR", "NA": "NAM", "VU": "VUT", "NC": "NCL", "NE": "NER", "NF": "NFK", "NG": "NGA", "NZ": "NZL", "NP": "NPL", "NR": "NRU", "NU": "NIU", "CK": "COK", "XK": "XKX", "CI": "CIV", "CH": "CHE", "CO": "COL", "CN": "CHN", "CM": "CMR", "CL": "CHL", "CC": "CCK", "CA": "CAN", "CG": "COG", "CF": "CAF", "CD": "COD", "CZ": "CZE", "CY": "CYP", "CX": "CXR", "CR": "CRI", "CW": "CUW", "CV": "CPV", "CU": "CUB", "SZ": "SWZ", "SY": "SYR", "SX": "SXM", "KG": "KGZ", "KE": "KEN", "SS": "SSD", "SR": "SUR", "KI": "KIR", "KH": "KHM", "KN": "KNA", "KM": "COM", "ST": "STP", "SK": "SVK", "KR": "KOR", "SI": "SVN", "KP": "PRK", "KW": "KWT", "SN": "SEN", "SM": "SMR", "SL": "SLE", "SC": "SYC", "KZ": "KAZ", "KY": "CYM", "SG": "SGP", "SE": "SWE", "SD": "SDN", "DO": "DOM", "DM": "DMA", "DJ": "DJI", "DK": "DNK", "VG": "VGB", "DE": "DEU", "YE": "YEM", "DZ": "DZA", "US": "USA", "UY": "URY", "YT": "MYT", "UM": "UMI", "LB": "LBN", "LC": "LCA", "LA": "LAO", "TV": "TUV", "TW": "TWN", "TT": "TTO", "TR": "TUR", "LK": "LKA", "LI": "LIE", "LV": "LVA", "TO": "TON", "LT": "LTU", "LU": "LUX", "LR": "LBR", "LS": "LSO", "TH": "THA", "TF": "ATF", "TG": "TGO", "TD": "TCD", "TC": "TCA", "LY": "LBY", "VA": "VAT", "VC": "VCT", "AE": "ARE", "AD": "AND", "AG": "ATG", "AF": "AFG", "AI": "AIA", "VI": "VIR", "IS": "ISL", "IR": "IRN", "AM": "ARM", "AL": "ALB", "AO": "AGO", "AQ": "ATA", "AS": "ASM", "AR": "ARG", "AU": "AUS", "AT": "AUT", "AW": "ABW", "IN": "IND", "AX": "ALA", "AZ": "AZE", "IE": "IRL", "ID": "IDN", "UA": "UKR", "QA": "QAT", "MZ": "MOZ" }


var Gloobster = Gloobster || {};
Gloobster.Countries = Gloobster.Countries || {};

Gloobster.Countries.Operations = function() {

    this.getCountryCode2  = function(countryCode3) {
        	
    }

    this.getCountryCode3 = function (countryCode2) {

    }

    function findValue(valueToFind, propertyToFind, propertyToReturn) {
        for (var property in data) {
            if (allCountryCodes.hasOwnProperty(property)) {
                out += ',"' + allCountryCodes[property] + '"';
            }
        }
    }




    var data =
    [
        {
            "ISO 3166-2": "ISO 3166-2:AF",
            "Alpha-3 code": "AFG",
            "English short name lower case": "Afghanistan",
            "Alpha-2 code": "AF",
            "Numeric code": 4.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AX",
            "Alpha-3 code": "ALA",
            "English short name lower case": "Åland Islands",
            "Alpha-2 code": "AX",
            "Numeric code": 248
        },
        {
            "ISO 3166-2": "ISO 3166-2:AL",
            "Alpha-3 code": "ALB",
            "English short name lower case": "Albania",
            "Alpha-2 code": "AL",
            "Numeric code": 8.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:DZ",
            "Alpha-3 code": "DZA",
            "English short name lower case": "Algeria",
            "Alpha-2 code": "DZ",
            "Numeric code": 12.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AS",
            "Alpha-3 code": "ASM",
            "English short name lower case": "American Samoa",
            "Alpha-2 code": "AS",
            "Numeric code": 16.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AD",
            "Alpha-3 code": "AND",
            "English short name lower case": "Andorra",
            "Alpha-2 code": "AD",
            "Numeric code": 20.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AO",
            "Alpha-3 code": "AGO",
            "English short name lower case": "Angola",
            "Alpha-2 code": "AO",
            "Numeric code": 24.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AI",
            "Alpha-3 code": "AIA",
            "English short name lower case": "Anguilla",
            "Alpha-2 code": "AI",
            "Numeric code": 660
        },
        {
            "ISO 3166-2": "ISO 3166-2:AQ",
            "Alpha-3 code": "ATA",
            "English short name lower case": "Antarctica",
            "Alpha-2 code": "AQ",
            "Numeric code": 10.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AG",
            "Alpha-3 code": "ATG",
            "English short name lower case": "Antigua and Barbuda",
            "Alpha-2 code": "AG",
            "Numeric code": 28.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AR",
            "Alpha-3 code": "ARG",
            "English short name lower case": "Argentina",
            "Alpha-2 code": "AR",
            "Numeric code": 32.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AM",
            "Alpha-3 code": "ARM",
            "English short name lower case": "Armenia",
            "Alpha-2 code": "AM",
            "Numeric code": 51.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AW",
            "Alpha-3 code": "ABW",
            "English short name lower case": "Aruba",
            "Alpha-2 code": "AW",
            "Numeric code": 533
        },
        {
            "ISO 3166-2": "ISO 3166-2:AU",
            "Alpha-3 code": "AUS",
            "English short name lower case": "Australia",
            "Alpha-2 code": "AU",
            "Numeric code": 36.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AT",
            "Alpha-3 code": "AUT",
            "English short name lower case": "Austria",
            "Alpha-2 code": "AT",
            "Numeric code": 40.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:AZ",
            "Alpha-3 code": "AZE",
            "English short name lower case": "Azerbaijan",
            "Alpha-2 code": "AZ",
            "Numeric code": 31.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BS",
            "Alpha-3 code": "BHS",
            "English short name lower case": "Bahamas",
            "Alpha-2 code": "BS",
            "Numeric code": 44.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BH",
            "Alpha-3 code": "BHR",
            "English short name lower case": "Bahrain",
            "Alpha-2 code": "BH",
            "Numeric code": 48.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BD",
            "Alpha-3 code": "BGD",
            "English short name lower case": "Bangladesh",
            "Alpha-2 code": "BD",
            "Numeric code": 50.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BB",
            "Alpha-3 code": "BRB",
            "English short name lower case": "Barbados",
            "Alpha-2 code": "BB",
            "Numeric code": 52.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BY",
            "Alpha-3 code": "BLR",
            "English short name lower case": "Belarus",
            "Alpha-2 code": "BY",
            "Numeric code": 112
        },
        {
            "ISO 3166-2": "ISO 3166-2:BE",
            "Alpha-3 code": "BEL",
            "English short name lower case": "Belgium",
            "Alpha-2 code": "BE",
            "Numeric code": 56.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BZ",
            "Alpha-3 code": "BLZ",
            "English short name lower case": "Belize",
            "Alpha-2 code": "BZ",
            "Numeric code": 84.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BJ",
            "Alpha-3 code": "BEN",
            "English short name lower case": "Benin",
            "Alpha-2 code": "BJ",
            "Numeric code": 204
        },
        {
            "ISO 3166-2": "ISO 3166-2:BM",
            "Alpha-3 code": "BMU",
            "English short name lower case": "Bermuda",
            "Alpha-2 code": "BM",
            "Numeric code": 60.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BT",
            "Alpha-3 code": "BTN",
            "English short name lower case": "Bhutan",
            "Alpha-2 code": "BT",
            "Numeric code": 64.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BO",
            "Alpha-3 code": "BOL",
            "English short name lower case": "Bolivia, Plurinational State of",
            "Alpha-2 code": "BO",
            "Numeric code": 68.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BA",
            "Alpha-3 code": "BIH",
            "English short name lower case": "Bosnia and Herzegovina",
            "Alpha-2 code": "BA",
            "Numeric code": 70.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BW",
            "Alpha-3 code": "BWA",
            "English short name lower case": "Botswana",
            "Alpha-2 code": "BW",
            "Numeric code": 72.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BV",
            "Alpha-3 code": "BVT",
            "English short name lower case": "Bouvet Island",
            "Alpha-2 code": "BV",
            "Numeric code": 74.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BR",
            "Alpha-3 code": "BRA",
            "English short name lower case": "Brazil",
            "Alpha-2 code": "BR",
            "Numeric code": 76.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:IO",
            "Alpha-3 code": "IOT",
            "English short name lower case": "British Indian Ocean Territory",
            "Alpha-2 code": "IO",
            "Numeric code": 86.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BN",
            "Alpha-3 code": "BRN",
            "English short name lower case": "Brunei Darussalam",
            "Alpha-2 code": "BN",
            "Numeric code": 96.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:BG",
            "Alpha-3 code": "BGR",
            "English short name lower case": "Bulgaria",
            "Alpha-2 code": "BG",
            "Numeric code": 100
        },
        {
            "ISO 3166-2": "ISO 3166-2:BF",
            "Alpha-3 code": "BFA",
            "English short name lower case": "Burkina Faso",
            "Alpha-2 code": "BF",
            "Numeric code": 854
        },
        {
            "ISO 3166-2": "ISO 3166-2:BI",
            "Alpha-3 code": "BDI",
            "English short name lower case": "Burundi",
            "Alpha-2 code": "BI",
            "Numeric code": 108
        },
        {
            "ISO 3166-2": "ISO 3166-2:KH",
            "Alpha-3 code": "KHM",
            "English short name lower case": "Cambodia",
            "Alpha-2 code": "KH",
            "Numeric code": 116
        },
        {
            "ISO 3166-2": "ISO 3166-2:CM",
            "Alpha-3 code": "CMR",
            "English short name lower case": "Cameroon",
            "Alpha-2 code": "CM",
            "Numeric code": 120
        },
        {
            "ISO 3166-2": "ISO 3166-2:CA",
            "Alpha-3 code": "CAN",
            "English short name lower case": "Canada",
            "Alpha-2 code": "CA",
            "Numeric code": 124
        },
        {
            "ISO 3166-2": "ISO 3166-2:CV",
            "Alpha-3 code": "CPV",
            "English short name lower case": "Cape Verde",
            "Alpha-2 code": "CV",
            "Numeric code": 132
        },
        {
            "ISO 3166-2": "ISO 3166-2:KY",
            "Alpha-3 code": "CYM",
            "English short name lower case": "Cayman Islands",
            "Alpha-2 code": "KY",
            "Numeric code": 136
        },
        {
            "ISO 3166-2": "ISO 3166-2:CF",
            "Alpha-3 code": "CAF",
            "English short name lower case": "Central African Republic",
            "Alpha-2 code": "CF",
            "Numeric code": 140
        },
        {
            "ISO 3166-2": "ISO 3166-2:TD",
            "Alpha-3 code": "TCD",
            "English short name lower case": "Chad",
            "Alpha-2 code": "TD",
            "Numeric code": 148
        },
        {
            "ISO 3166-2": "ISO 3166-2:CL",
            "Alpha-3 code": "CHL",
            "English short name lower case": "Chile",
            "Alpha-2 code": "CL",
            "Numeric code": 152
        },
        {
            "ISO 3166-2": "ISO 3166-2:CN",
            "Alpha-3 code": "CHN",
            "English short name lower case": "China",
            "Alpha-2 code": "CN",
            "Numeric code": 156
        },
        {
            "ISO 3166-2": "ISO 3166-2:CX",
            "Alpha-3 code": "CXR",
            "English short name lower case": "Christmas Island",
            "Alpha-2 code": "CX",
            "Numeric code": 162
        },
        {
            "ISO 3166-2": "ISO 3166-2:CC",
            "Alpha-3 code": "CCK",
            "English short name lower case": "Cocos (Keeling) Islands",
            "Alpha-2 code": "CC",
            "Numeric code": 166
        },
        {
            "ISO 3166-2": "ISO 3166-2:CO",
            "Alpha-3 code": "COL",
            "English short name lower case": "Colombia",
            "Alpha-2 code": "CO",
            "Numeric code": 170
        },
        {
            "ISO 3166-2": "ISO 3166-2:KM",
            "Alpha-3 code": "COM",
            "English short name lower case": "Comoros",
            "Alpha-2 code": "KM",
            "Numeric code": 174
        },
        {
            "ISO 3166-2": "ISO 3166-2:CG",
            "Alpha-3 code": "COG",
            "English short name lower case": "Congo",
            "Alpha-2 code": "CG",
            "Numeric code": 178
        },
        {
            "ISO 3166-2": "ISO 3166-2:CD",
            "Alpha-3 code": "COD",
            "English short name lower case": "Congo, the Democratic Republic of the",
            "Alpha-2 code": "CD",
            "Numeric code": 180
        },
        {
            "ISO 3166-2": "ISO 3166-2:CK",
            "Alpha-3 code": "COK",
            "English short name lower case": "Cook Islands",
            "Alpha-2 code": "CK",
            "Numeric code": 184
        },
        {
            "ISO 3166-2": "ISO 3166-2:CR",
            "Alpha-3 code": "CRI",
            "English short name lower case": "Costa Rica",
            "Alpha-2 code": "CR",
            "Numeric code": 188
        },
        {
            "ISO 3166-2": "ISO 3166-2:CI",
            "Alpha-3 code": "CIV",
            "English short name lower case": "Côte d'Ivoire",
            "Alpha-2 code": "CI",
            "Numeric code": 384
        },
        {
            "ISO 3166-2": "ISO 3166-2:HR",
            "Alpha-3 code": "HRV",
            "English short name lower case": "Croatia",
            "Alpha-2 code": "HR",
            "Numeric code": 191
        },
        {
            "ISO 3166-2": "ISO 3166-2:CU",
            "Alpha-3 code": "CUB",
            "English short name lower case": "Cuba",
            "Alpha-2 code": "CU",
            "Numeric code": 192
        },
        {
            "ISO 3166-2": "ISO 3166-2:CY",
            "Alpha-3 code": "CYP",
            "English short name lower case": "Cyprus",
            "Alpha-2 code": "CY",
            "Numeric code": 196
        },
        {
            "ISO 3166-2": "ISO 3166-2:CZ",
            "Alpha-3 code": "CZE",
            "English short name lower case": "Czech Republic",
            "Alpha-2 code": "CZ",
            "Numeric code": 203
        },
        {
            "ISO 3166-2": "ISO 3166-2:DK",
            "Alpha-3 code": "DNK",
            "English short name lower case": "Denmark",
            "Alpha-2 code": "DK",
            "Numeric code": 208
        },
        {
            "ISO 3166-2": "ISO 3166-2:DJ",
            "Alpha-3 code": "DJI",
            "English short name lower case": "Djibouti",
            "Alpha-2 code": "DJ",
            "Numeric code": 262
        },
        {
            "ISO 3166-2": "ISO 3166-2:DM",
            "Alpha-3 code": "DMA",
            "English short name lower case": "Dominica",
            "Alpha-2 code": "DM",
            "Numeric code": 212
        },
        {
            "ISO 3166-2": "ISO 3166-2:DO",
            "Alpha-3 code": "DOM",
            "English short name lower case": "Dominican Republic",
            "Alpha-2 code": "DO",
            "Numeric code": 214
        },
        {
            "ISO 3166-2": "ISO 3166-2:EC",
            "Alpha-3 code": "ECU",
            "English short name lower case": "Ecuador",
            "Alpha-2 code": "EC",
            "Numeric code": 218
        },
        {
            "ISO 3166-2": "ISO 3166-2:EG",
            "Alpha-3 code": "EGY",
            "English short name lower case": "Egypt",
            "Alpha-2 code": "EG",
            "Numeric code": 818
        },
        {
            "ISO 3166-2": "ISO 3166-2:SV",
            "Alpha-3 code": "SLV",
            "English short name lower case": "El Salvador",
            "Alpha-2 code": "SV",
            "Numeric code": 222
        },
        {
            "ISO 3166-2": "ISO 3166-2:GQ",
            "Alpha-3 code": "GNQ",
            "English short name lower case": "Equatorial Guinea",
            "Alpha-2 code": "GQ",
            "Numeric code": 226
        },
        {
            "ISO 3166-2": "ISO 3166-2:ER",
            "Alpha-3 code": "ERI",
            "English short name lower case": "Eritrea",
            "Alpha-2 code": "ER",
            "Numeric code": 232
        },
        {
            "ISO 3166-2": "ISO 3166-2:EE",
            "Alpha-3 code": "EST",
            "English short name lower case": "Estonia",
            "Alpha-2 code": "EE",
            "Numeric code": 233
        },
        {
            "ISO 3166-2": "ISO 3166-2:ET",
            "Alpha-3 code": "ETH",
            "English short name lower case": "Ethiopia",
            "Alpha-2 code": "ET",
            "Numeric code": 231
        },
        {
            "ISO 3166-2": "ISO 3166-2:FK",
            "Alpha-3 code": "FLK",
            "English short name lower case": "Falkland Islands (Malvinas)",
            "Alpha-2 code": "FK",
            "Numeric code": 238
        },
        {
            "ISO 3166-2": "ISO 3166-2:FO",
            "Alpha-3 code": "FRO",
            "English short name lower case": "Faroe Islands",
            "Alpha-2 code": "FO",
            "Numeric code": 234
        },
        {
            "ISO 3166-2": "ISO 3166-2:FJ",
            "Alpha-3 code": "FJI",
            "English short name lower case": "Fiji",
            "Alpha-2 code": "FJ",
            "Numeric code": 242
        },
        {
            "ISO 3166-2": "ISO 3166-2:FI",
            "Alpha-3 code": "FIN",
            "English short name lower case": "Finland",
            "Alpha-2 code": "FI",
            "Numeric code": 246
        },
        {
            "ISO 3166-2": "ISO 3166-2:FR",
            "Alpha-3 code": "FRA",
            "English short name lower case": "France",
            "Alpha-2 code": "FR",
            "Numeric code": 250
        },
        {
            "ISO 3166-2": "ISO 3166-2:GF",
            "Alpha-3 code": "GUF",
            "English short name lower case": "French Guiana",
            "Alpha-2 code": "GF",
            "Numeric code": 254
        },
        {
            "ISO 3166-2": "ISO 3166-2:PF",
            "Alpha-3 code": "PYF",
            "English short name lower case": "French Polynesia",
            "Alpha-2 code": "PF",
            "Numeric code": 258
        },
        {
            "ISO 3166-2": "ISO 3166-2:TF",
            "Alpha-3 code": "ATF",
            "English short name lower case": "French Southern Territories",
            "Alpha-2 code": "TF",
            "Numeric code": 260
        },
        {
            "ISO 3166-2": "ISO 3166-2:GA",
            "Alpha-3 code": "GAB",
            "English short name lower case": "Gabon",
            "Alpha-2 code": "GA",
            "Numeric code": 266
        },
        {
            "ISO 3166-2": "ISO 3166-2:GM",
            "Alpha-3 code": "GMB",
            "English short name lower case": "Gambia",
            "Alpha-2 code": "GM",
            "Numeric code": 270
        },
        {
            "ISO 3166-2": "ISO 3166-2:GE",
            "Alpha-3 code": "GEO",
            "English short name lower case": "Georgia",
            "Alpha-2 code": "GE",
            "Numeric code": 268
        },
        {
            "ISO 3166-2": "ISO 3166-2:DE",
            "Alpha-3 code": "DEU",
            "English short name lower case": "Germany",
            "Alpha-2 code": "DE",
            "Numeric code": 276
        },
        {
            "ISO 3166-2": "ISO 3166-2:GH",
            "Alpha-3 code": "GHA",
            "English short name lower case": "Ghana",
            "Alpha-2 code": "GH",
            "Numeric code": 288
        },
        {
            "ISO 3166-2": "ISO 3166-2:GI",
            "Alpha-3 code": "GIB",
            "English short name lower case": "Gibraltar",
            "Alpha-2 code": "GI",
            "Numeric code": 292
        },
        {
            "ISO 3166-2": "ISO 3166-2:GR",
            "Alpha-3 code": "GRC",
            "English short name lower case": "Greece",
            "Alpha-2 code": "GR",
            "Numeric code": 300
        },
        {
            "ISO 3166-2": "ISO 3166-2:GL",
            "Alpha-3 code": "GRL",
            "English short name lower case": "Greenland",
            "Alpha-2 code": "GL",
            "Numeric code": 304
        },
        {
            "ISO 3166-2": "ISO 3166-2:GD",
            "Alpha-3 code": "GRD",
            "English short name lower case": "Grenada",
            "Alpha-2 code": "GD",
            "Numeric code": 308
        },
        {
            "ISO 3166-2": "ISO 3166-2:GP",
            "Alpha-3 code": "GLP",
            "English short name lower case": "Guadeloupe",
            "Alpha-2 code": "GP",
            "Numeric code": 312
        },
        {
            "ISO 3166-2": "ISO 3166-2:GU",
            "Alpha-3 code": "GUM",
            "English short name lower case": "Guam",
            "Alpha-2 code": "GU",
            "Numeric code": 316
        },
        {
            "ISO 3166-2": "ISO 3166-2:GT",
            "Alpha-3 code": "GTM",
            "English short name lower case": "Guatemala",
            "Alpha-2 code": "GT",
            "Numeric code": 320
        },
        {
            "ISO 3166-2": "ISO 3166-2:GG",
            "Alpha-3 code": "GGY",
            "English short name lower case": "Guernsey",
            "Alpha-2 code": "GG",
            "Numeric code": 831
        },
        {
            "ISO 3166-2": "ISO 3166-2:GN",
            "Alpha-3 code": "GIN",
            "English short name lower case": "Guinea",
            "Alpha-2 code": "GN",
            "Numeric code": 324
        },
        {
            "ISO 3166-2": "ISO 3166-2:GW",
            "Alpha-3 code": "GNB",
            "English short name lower case": "Guinea-Bissau",
            "Alpha-2 code": "GW",
            "Numeric code": 624
        },
        {
            "ISO 3166-2": "ISO 3166-2:GY",
            "Alpha-3 code": "GUY",
            "English short name lower case": "Guyana",
            "Alpha-2 code": "GY",
            "Numeric code": 328
        },
        {
            "ISO 3166-2": "ISO 3166-2:HT",
            "Alpha-3 code": "HTI",
            "English short name lower case": "Haiti",
            "Alpha-2 code": "HT",
            "Numeric code": 332
        },
        {
            "ISO 3166-2": "ISO 3166-2:HM",
            "Alpha-3 code": "HMD",
            "English short name lower case": "Heard Island and McDonald Islands",
            "Alpha-2 code": "HM",
            "Numeric code": 334
        },
        {
            "ISO 3166-2": "ISO 3166-2:VA",
            "Alpha-3 code": "VAT",
            "English short name lower case": "Holy See (Vatican City State)",
            "Alpha-2 code": "VA",
            "Numeric code": 336
        },
        {
            "ISO 3166-2": "ISO 3166-2:HN",
            "Alpha-3 code": "HND",
            "English short name lower case": "Honduras",
            "Alpha-2 code": "HN",
            "Numeric code": 340
        },
        {
            "ISO 3166-2": "ISO 3166-2:HK",
            "Alpha-3 code": "HKG",
            "English short name lower case": "Hong Kong",
            "Alpha-2 code": "HK",
            "Numeric code": 344
        },
        {
            "ISO 3166-2": "ISO 3166-2:HU",
            "Alpha-3 code": "HUN",
            "English short name lower case": "Hungary",
            "Alpha-2 code": "HU",
            "Numeric code": 348
        },
        {
            "ISO 3166-2": "ISO 3166-2:IS",
            "Alpha-3 code": "ISL",
            "English short name lower case": "Iceland",
            "Alpha-2 code": "IS",
            "Numeric code": 352
        },
        {
            "ISO 3166-2": "ISO 3166-2:IN",
            "Alpha-3 code": "IND",
            "English short name lower case": "India",
            "Alpha-2 code": "IN",
            "Numeric code": 356
        },
        {
            "ISO 3166-2": "ISO 3166-2:ID",
            "Alpha-3 code": "IDN",
            "English short name lower case": "Indonesia",
            "Alpha-2 code": "ID",
            "Numeric code": 360
        },
        {
            "ISO 3166-2": "ISO 3166-2:IR",
            "Alpha-3 code": "IRN",
            "English short name lower case": "Iran, Islamic Republic of",
            "Alpha-2 code": "IR",
            "Numeric code": 364
        },
        {
            "ISO 3166-2": "ISO 3166-2:IQ",
            "Alpha-3 code": "IRQ",
            "English short name lower case": "Iraq",
            "Alpha-2 code": "IQ",
            "Numeric code": 368
        },
        {
            "ISO 3166-2": "ISO 3166-2:IE",
            "Alpha-3 code": "IRL",
            "English short name lower case": "Ireland",
            "Alpha-2 code": "IE",
            "Numeric code": 372
        },
        {
            "ISO 3166-2": "ISO 3166-2:IM",
            "Alpha-3 code": "IMN",
            "English short name lower case": "Isle of Man",
            "Alpha-2 code": "IM",
            "Numeric code": 833
        },
        {
            "ISO 3166-2": "ISO 3166-2:IL",
            "Alpha-3 code": "ISR",
            "English short name lower case": "Israel",
            "Alpha-2 code": "IL",
            "Numeric code": 376
        },
        {
            "ISO 3166-2": "ISO 3166-2:IT",
            "Alpha-3 code": "ITA",
            "English short name lower case": "Italy",
            "Alpha-2 code": "IT",
            "Numeric code": 380
        },
        {
            "ISO 3166-2": "ISO 3166-2:JM",
            "Alpha-3 code": "JAM",
            "English short name lower case": "Jamaica",
            "Alpha-2 code": "JM",
            "Numeric code": 388
        },
        {
            "ISO 3166-2": "ISO 3166-2:JP",
            "Alpha-3 code": "JPN",
            "English short name lower case": "Japan",
            "Alpha-2 code": "JP",
            "Numeric code": 392
        },
        {
            "ISO 3166-2": "ISO 3166-2:JE",
            "Alpha-3 code": "JEY",
            "English short name lower case": "Jersey",
            "Alpha-2 code": "JE",
            "Numeric code": 832
        },
        {
            "ISO 3166-2": "ISO 3166-2:JO",
            "Alpha-3 code": "JOR",
            "English short name lower case": "Jordan",
            "Alpha-2 code": "JO",
            "Numeric code": 400
        },
        {
            "ISO 3166-2": "ISO 3166-2:KZ",
            "Alpha-3 code": "KAZ",
            "English short name lower case": "Kazakhstan",
            "Alpha-2 code": "KZ",
            "Numeric code": 398
        },
        {
            "ISO 3166-2": "ISO 3166-2:KE",
            "Alpha-3 code": "KEN",
            "English short name lower case": "Kenya",
            "Alpha-2 code": "KE",
            "Numeric code": 404
        },
        {
            "ISO 3166-2": "ISO 3166-2:KI",
            "Alpha-3 code": "KIR",
            "English short name lower case": "Kiribati",
            "Alpha-2 code": "KI",
            "Numeric code": 296
        },
        {
            "ISO 3166-2": "ISO 3166-2:KP",
            "Alpha-3 code": "PRK",
            "English short name lower case": "Korea, Democratic People's Republic of",
            "Alpha-2 code": "KP",
            "Numeric code": 408
        },
        {
            "ISO 3166-2": "ISO 3166-2:KR",
            "Alpha-3 code": "KOR",
            "English short name lower case": "Korea, Republic of",
            "Alpha-2 code": "KR",
            "Numeric code": 410
        },
        {
            "ISO 3166-2": "ISO 3166-2:KW",
            "Alpha-3 code": "KWT",
            "English short name lower case": "Kuwait",
            "Alpha-2 code": "KW",
            "Numeric code": 414
        },
        {
            "ISO 3166-2": "ISO 3166-2:KG",
            "Alpha-3 code": "KGZ",
            "English short name lower case": "Kyrgyzstan",
            "Alpha-2 code": "KG",
            "Numeric code": 417
        },
        {
            "ISO 3166-2": "ISO 3166-2:LA",
            "Alpha-3 code": "LAO",
            "English short name lower case": "Lao People's Democratic Republic",
            "Alpha-2 code": "LA",
            "Numeric code": 418
        },
        {
            "ISO 3166-2": "ISO 3166-2:LV",
            "Alpha-3 code": "LVA",
            "English short name lower case": "Latvia",
            "Alpha-2 code": "LV",
            "Numeric code": 428
        },
        {
            "ISO 3166-2": "ISO 3166-2:LB",
            "Alpha-3 code": "LBN",
            "English short name lower case": "Lebanon",
            "Alpha-2 code": "LB",
            "Numeric code": 422
        },
        {
            "ISO 3166-2": "ISO 3166-2:LS",
            "Alpha-3 code": "LSO",
            "English short name lower case": "Lesotho",
            "Alpha-2 code": "LS",
            "Numeric code": 426
        },
        {
            "ISO 3166-2": "ISO 3166-2:LR",
            "Alpha-3 code": "LBR",
            "English short name lower case": "Liberia",
            "Alpha-2 code": "LR",
            "Numeric code": 430
        },
        {
            "ISO 3166-2": "ISO 3166-2:LY",
            "Alpha-3 code": "LBY",
            "English short name lower case": "Libyan Arab Jamahiriya",
            "Alpha-2 code": "LY",
            "Numeric code": 434
        },
        {
            "ISO 3166-2": "ISO 3166-2:LI",
            "Alpha-3 code": "LIE",
            "English short name lower case": "Liechtenstein",
            "Alpha-2 code": "LI",
            "Numeric code": 438
        },
        {
            "ISO 3166-2": "ISO 3166-2:LT",
            "Alpha-3 code": "LTU",
            "English short name lower case": "Lithuania",
            "Alpha-2 code": "LT",
            "Numeric code": 440
        },
        {
            "ISO 3166-2": "ISO 3166-2:LU",
            "Alpha-3 code": "LUX",
            "English short name lower case": "Luxembourg",
            "Alpha-2 code": "LU",
            "Numeric code": 442
        },
        {
            "ISO 3166-2": "ISO 3166-2:MO",
            "Alpha-3 code": "MAC",
            "English short name lower case": "Macao",
            "Alpha-2 code": "MO",
            "Numeric code": 446
        },
        {
            "ISO 3166-2": "ISO 3166-2:MK",
            "Alpha-3 code": "MKD",
            "English short name lower case": "Macedonia, the former Yugoslav Republic of",
            "Alpha-2 code": "MK",
            "Numeric code": 807
        },
        {
            "ISO 3166-2": "ISO 3166-2:MG",
            "Alpha-3 code": "MDG",
            "English short name lower case": "Madagascar",
            "Alpha-2 code": "MG",
            "Numeric code": 450
        },
        {
            "ISO 3166-2": "ISO 3166-2:MW",
            "Alpha-3 code": "MWI",
            "English short name lower case": "Malawi",
            "Alpha-2 code": "MW",
            "Numeric code": 454
        },
        {
            "ISO 3166-2": "ISO 3166-2:MY",
            "Alpha-3 code": "MYS",
            "English short name lower case": "Malaysia",
            "Alpha-2 code": "MY",
            "Numeric code": 458
        },
        {
            "ISO 3166-2": "ISO 3166-2:MV",
            "Alpha-3 code": "MDV",
            "English short name lower case": "Maldives",
            "Alpha-2 code": "MV",
            "Numeric code": 462
        },
        {
            "ISO 3166-2": "ISO 3166-2:ML",
            "Alpha-3 code": "MLI",
            "English short name lower case": "Mali",
            "Alpha-2 code": "ML",
            "Numeric code": 466
        },
        {
            "ISO 3166-2": "ISO 3166-2:MT",
            "Alpha-3 code": "MLT",
            "English short name lower case": "Malta",
            "Alpha-2 code": "MT",
            "Numeric code": 470
        },
        {
            "ISO 3166-2": "ISO 3166-2:MH",
            "Alpha-3 code": "MHL",
            "English short name lower case": "Marshall Islands",
            "Alpha-2 code": "MH",
            "Numeric code": 584
        },
        {
            "ISO 3166-2": "ISO 3166-2:MQ",
            "Alpha-3 code": "MTQ",
            "English short name lower case": "Martinique",
            "Alpha-2 code": "MQ",
            "Numeric code": 474
        },
        {
            "ISO 3166-2": "ISO 3166-2:MR",
            "Alpha-3 code": "MRT",
            "English short name lower case": "Mauritania",
            "Alpha-2 code": "MR",
            "Numeric code": 478
        },
        {
            "ISO 3166-2": "ISO 3166-2:MU",
            "Alpha-3 code": "MUS",
            "English short name lower case": "Mauritius",
            "Alpha-2 code": "MU",
            "Numeric code": 480
        },
        {
            "ISO 3166-2": "ISO 3166-2:YT",
            "Alpha-3 code": "MYT",
            "English short name lower case": "Mayotte",
            "Alpha-2 code": "YT",
            "Numeric code": 175
        },
        {
            "ISO 3166-2": "ISO 3166-2:MX",
            "Alpha-3 code": "MEX",
            "English short name lower case": "Mexico",
            "Alpha-2 code": "MX",
            "Numeric code": 484
        },
        {
            "ISO 3166-2": "ISO 3166-2:FM",
            "Alpha-3 code": "FSM",
            "English short name lower case": "Micronesia, Federated States of",
            "Alpha-2 code": "FM",
            "Numeric code": 583
        },
        {
            "ISO 3166-2": "ISO 3166-2:MD",
            "Alpha-3 code": "MDA",
            "English short name lower case": "Moldova, Republic of",
            "Alpha-2 code": "MD",
            "Numeric code": 498
        },
        {
            "ISO 3166-2": "ISO 3166-2:MC",
            "Alpha-3 code": "MCO",
            "English short name lower case": "Monaco",
            "Alpha-2 code": "MC",
            "Numeric code": 492
        },
        {
            "ISO 3166-2": "ISO 3166-2:MN",
            "Alpha-3 code": "MNG",
            "English short name lower case": "Mongolia",
            "Alpha-2 code": "MN",
            "Numeric code": 496
        },
        {
            "ISO 3166-2": "ISO 3166-2:ME",
            "Alpha-3 code": "MNE",
            "English short name lower case": "Montenegro",
            "Alpha-2 code": "ME",
            "Numeric code": 499
        },
        {
            "ISO 3166-2": "ISO 3166-2:MS",
            "Alpha-3 code": "MSR",
            "English short name lower case": "Montserrat",
            "Alpha-2 code": "MS",
            "Numeric code": 500
        },
        {
            "ISO 3166-2": "ISO 3166-2:MA",
            "Alpha-3 code": "MAR",
            "English short name lower case": "Morocco",
            "Alpha-2 code": "MA",
            "Numeric code": 504
        },
        {
            "ISO 3166-2": "ISO 3166-2:MZ",
            "Alpha-3 code": "MOZ",
            "English short name lower case": "Mozambique",
            "Alpha-2 code": "MZ",
            "Numeric code": 508
        },
        {
            "ISO 3166-2": "ISO 3166-2:MM",
            "Alpha-3 code": "MMR",
            "English short name lower case": "Myanmar",
            "Alpha-2 code": "MM",
            "Numeric code": 104
        },
        {
            "ISO 3166-2": "ISO 3166-2:NA",
            "Alpha-3 code": "NAM",
            "English short name lower case": "Namibia",
            "Alpha-2 code": "NA",
            "Numeric code": 516
        },
        {
            "ISO 3166-2": "ISO 3166-2:NR",
            "Alpha-3 code": "NRU",
            "English short name lower case": "Nauru",
            "Alpha-2 code": "NR",
            "Numeric code": 520
        },
        {
            "ISO 3166-2": "ISO 3166-2:NP",
            "Alpha-3 code": "NPL",
            "English short name lower case": "Nepal",
            "Alpha-2 code": "NP",
            "Numeric code": 524
        },
        {
            "ISO 3166-2": "ISO 3166-2:NL",
            "Alpha-3 code": "NLD",
            "English short name lower case": "Netherlands",
            "Alpha-2 code": "NL",
            "Numeric code": 528
        },
        {
            "ISO 3166-2": "ISO 3166-2:AN",
            "Alpha-3 code": "ANT",
            "English short name lower case": "Netherlands Antilles",
            "Alpha-2 code": "AN",
            "Numeric code": 530
        },
        {
            "ISO 3166-2": "ISO 3166-2:NC",
            "Alpha-3 code": "NCL",
            "English short name lower case": "New Caledonia",
            "Alpha-2 code": "NC",
            "Numeric code": 540
        },
        {
            "ISO 3166-2": "ISO 3166-2:NZ",
            "Alpha-3 code": "NZL",
            "English short name lower case": "New Zealand",
            "Alpha-2 code": "NZ",
            "Numeric code": 554
        },
        {
            "ISO 3166-2": "ISO 3166-2:NI",
            "Alpha-3 code": "NIC",
            "English short name lower case": "Nicaragua",
            "Alpha-2 code": "NI",
            "Numeric code": 558
        },
        {
            "ISO 3166-2": "ISO 3166-2:NE",
            "Alpha-3 code": "NER",
            "English short name lower case": "Niger",
            "Alpha-2 code": "NE",
            "Numeric code": 562
        },
        {
            "ISO 3166-2": "ISO 3166-2:NG",
            "Alpha-3 code": "NGA",
            "English short name lower case": "Nigeria",
            "Alpha-2 code": "NG",
            "Numeric code": 566
        },
        {
            "ISO 3166-2": "ISO 3166-2:NU",
            "Alpha-3 code": "NIU",
            "English short name lower case": "Niue",
            "Alpha-2 code": "NU",
            "Numeric code": 570
        },
        {
            "ISO 3166-2": "ISO 3166-2:NF",
            "Alpha-3 code": "NFK",
            "English short name lower case": "Norfolk Island",
            "Alpha-2 code": "NF",
            "Numeric code": 574
        },
        {
            "ISO 3166-2": "ISO 3166-2:MP",
            "Alpha-3 code": "MNP",
            "English short name lower case": "Northern Mariana Islands",
            "Alpha-2 code": "MP",
            "Numeric code": 580
        },
        {
            "ISO 3166-2": "ISO 3166-2:NO",
            "Alpha-3 code": "NOR",
            "English short name lower case": "Norway",
            "Alpha-2 code": "NO",
            "Numeric code": 578
        },
        {
            "ISO 3166-2": "ISO 3166-2:OM",
            "Alpha-3 code": "OMN",
            "English short name lower case": "Oman",
            "Alpha-2 code": "OM",
            "Numeric code": 512
        },
        {
            "ISO 3166-2": "ISO 3166-2:PK",
            "Alpha-3 code": "PAK",
            "English short name lower case": "Pakistan",
            "Alpha-2 code": "PK",
            "Numeric code": 586
        },
        {
            "ISO 3166-2": "ISO 3166-2:PW",
            "Alpha-3 code": "PLW",
            "English short name lower case": "Palau",
            "Alpha-2 code": "PW",
            "Numeric code": 585
        },
        {
            "ISO 3166-2": "ISO 3166-2:PS",
            "Alpha-3 code": "PSE",
            "English short name lower case": "Palestinian Territory, Occupied",
            "Alpha-2 code": "PS",
            "Numeric code": 275
        },
        {
            "ISO 3166-2": "ISO 3166-2:PA",
            "Alpha-3 code": "PAN",
            "English short name lower case": "Panama",
            "Alpha-2 code": "PA",
            "Numeric code": 591
        },
        {
            "ISO 3166-2": "ISO 3166-2:PG",
            "Alpha-3 code": "PNG",
            "English short name lower case": "Papua New Guinea",
            "Alpha-2 code": "PG",
            "Numeric code": 598
        },
        {
            "ISO 3166-2": "ISO 3166-2:PY",
            "Alpha-3 code": "PRY",
            "English short name lower case": "Paraguay",
            "Alpha-2 code": "PY",
            "Numeric code": 600
        },
        {
            "ISO 3166-2": "ISO 3166-2:PE",
            "Alpha-3 code": "PER",
            "English short name lower case": "Peru",
            "Alpha-2 code": "PE",
            "Numeric code": 604
        },
        {
            "ISO 3166-2": "ISO 3166-2:PH",
            "Alpha-3 code": "PHL",
            "English short name lower case": "Philippines",
            "Alpha-2 code": "PH",
            "Numeric code": 608
        },
        {
            "ISO 3166-2": "ISO 3166-2:PN",
            "Alpha-3 code": "PCN",
            "English short name lower case": "Pitcairn",
            "Alpha-2 code": "PN",
            "Numeric code": 612
        },
        {
            "ISO 3166-2": "ISO 3166-2:PL",
            "Alpha-3 code": "POL",
            "English short name lower case": "Poland",
            "Alpha-2 code": "PL",
            "Numeric code": 616
        },
        {
            "ISO 3166-2": "ISO 3166-2:PT",
            "Alpha-3 code": "PRT",
            "English short name lower case": "Portugal",
            "Alpha-2 code": "PT",
            "Numeric code": 620
        },
        {
            "ISO 3166-2": "ISO 3166-2:PR",
            "Alpha-3 code": "PRI",
            "English short name lower case": "Puerto Rico",
            "Alpha-2 code": "PR",
            "Numeric code": 630
        },
        {
            "ISO 3166-2": "ISO 3166-2:QA",
            "Alpha-3 code": "QAT",
            "English short name lower case": "Qatar",
            "Alpha-2 code": "QA",
            "Numeric code": 634
        },
        {
            "ISO 3166-2": "ISO 3166-2:RE",
            "Alpha-3 code": "REU",
            "English short name lower case": "Réunion",
            "Alpha-2 code": "RE",
            "Numeric code": 638
        },
        {
            "ISO 3166-2": "ISO 3166-2:RO",
            "Alpha-3 code": "ROU",
            "English short name lower case": "Romania",
            "Alpha-2 code": "RO",
            "Numeric code": 642
        },
        {
            "ISO 3166-2": "ISO 3166-2:RU",
            "Alpha-3 code": "RUS",
            "English short name lower case": "Russian Federation",
            "Alpha-2 code": "RU",
            "Numeric code": 643
        },
        {
            "ISO 3166-2": "ISO 3166-2:RW",
            "Alpha-3 code": "RWA",
            "English short name lower case": "Rwanda",
            "Alpha-2 code": "RW",
            "Numeric code": 646
        },
        {
            "ISO 3166-2": "ISO 3166-2:BL",
            "Alpha-3 code": "BLM",
            "English short name lower case": "Saint Barthélemy",
            "Alpha-2 code": "BL",
            "Numeric code": 652
        },
        {
            "ISO 3166-2": "ISO 3166-2:SH",
            "Alpha-3 code": "SHN",
            "English short name lower case": "Saint Helena, Ascension and Tristan da Cunha",
            "Alpha-2 code": "SH",
            "Numeric code": 654
        },
        {
            "ISO 3166-2": "ISO 3166-2:KN",
            "Alpha-3 code": "KNA",
            "English short name lower case": "Saint Kitts and Nevis",
            "Alpha-2 code": "KN",
            "Numeric code": 659
        },
        {
            "ISO 3166-2": "ISO 3166-2:LC",
            "Alpha-3 code": "LCA",
            "English short name lower case": "Saint Lucia",
            "Alpha-2 code": "LC",
            "Numeric code": 662
        },
        {
            "ISO 3166-2": "ISO 3166-2:MF",
            "Alpha-3 code": "MAF",
            "English short name lower case": "Saint Martin (French part)",
            "Alpha-2 code": "MF",
            "Numeric code": 663
        },
        {
            "ISO 3166-2": "ISO 3166-2:PM",
            "Alpha-3 code": "SPM",
            "English short name lower case": "Saint Pierre and Miquelon",
            "Alpha-2 code": "PM",
            "Numeric code": 666
        },
        {
            "ISO 3166-2": "ISO 3166-2:VC",
            "Alpha-3 code": "VCT",
            "English short name lower case": "Saint Vincent and the Grenadines",
            "Alpha-2 code": "VC",
            "Numeric code": 670
        },
        {
            "ISO 3166-2": "ISO 3166-2:WS",
            "Alpha-3 code": "WSM",
            "English short name lower case": "Samoa",
            "Alpha-2 code": "WS",
            "Numeric code": 882
        },
        {
            "ISO 3166-2": "ISO 3166-2:SM",
            "Alpha-3 code": "SMR",
            "English short name lower case": "San Marino",
            "Alpha-2 code": "SM",
            "Numeric code": 674
        },
        {
            "ISO 3166-2": "ISO 3166-2:ST",
            "Alpha-3 code": "STP",
            "English short name lower case": "Sao Tome and Principe",
            "Alpha-2 code": "ST",
            "Numeric code": 678
        },
        {
            "ISO 3166-2": "ISO 3166-2:SA",
            "Alpha-3 code": "SAU",
            "English short name lower case": "Saudi Arabia",
            "Alpha-2 code": "SA",
            "Numeric code": 682
        },
        {
            "ISO 3166-2": "ISO 3166-2:SN",
            "Alpha-3 code": "SEN",
            "English short name lower case": "Senegal",
            "Alpha-2 code": "SN",
            "Numeric code": 686
        },
        {
            "ISO 3166-2": "ISO 3166-2:RS",
            "Alpha-3 code": "SRB",
            "English short name lower case": "Serbia",
            "Alpha-2 code": "RS",
            "Numeric code": 688
        },
        {
            "ISO 3166-2": "ISO 3166-2:SC",
            "Alpha-3 code": "SYC",
            "English short name lower case": "Seychelles",
            "Alpha-2 code": "SC",
            "Numeric code": 690
        },
        {
            "ISO 3166-2": "ISO 3166-2:SL",
            "Alpha-3 code": "SLE",
            "English short name lower case": "Sierra Leone",
            "Alpha-2 code": "SL",
            "Numeric code": 694
        },
        {
            "ISO 3166-2": "ISO 3166-2:SG",
            "Alpha-3 code": "SGP",
            "English short name lower case": "Singapore",
            "Alpha-2 code": "SG",
            "Numeric code": 702
        },
        {
            "ISO 3166-2": "ISO 3166-2:SK",
            "Alpha-3 code": "SVK",
            "English short name lower case": "Slovakia",
            "Alpha-2 code": "SK",
            "Numeric code": 703
        },
        {
            "ISO 3166-2": "ISO 3166-2:SI",
            "Alpha-3 code": "SVN",
            "English short name lower case": "Slovenia",
            "Alpha-2 code": "SI",
            "Numeric code": 705
        },
        {
            "ISO 3166-2": "ISO 3166-2:SB",
            "Alpha-3 code": "SLB",
            "English short name lower case": "Solomon Islands",
            "Alpha-2 code": "SB",
            "Numeric code": 90.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:SO",
            "Alpha-3 code": "SOM",
            "English short name lower case": "Somalia",
            "Alpha-2 code": "SO",
            "Numeric code": 706
        },
        {
            "ISO 3166-2": "ISO 3166-2:ZA",
            "Alpha-3 code": "ZAF",
            "English short name lower case": "South Africa",
            "Alpha-2 code": "ZA",
            "Numeric code": 710
        },
        {
            "ISO 3166-2": "ISO 3166-2:GS",
            "Alpha-3 code": "SGS",
            "English short name lower case": "South Georgia and the South Sandwich Islands",
            "Alpha-2 code": "GS",
            "Numeric code": 239
        },
        {
            "ISO 3166-2": "ISO 3166-2:ES",
            "Alpha-3 code": "ESP",
            "English short name lower case": "Spain",
            "Alpha-2 code": "ES",
            "Numeric code": 724
        },
        {
            "ISO 3166-2": "ISO 3166-2:LK",
            "Alpha-3 code": "LKA",
            "English short name lower case": "Sri Lanka",
            "Alpha-2 code": "LK",
            "Numeric code": 144
        },
        {
            "ISO 3166-2": "ISO 3166-2:SD",
            "Alpha-3 code": "SDN",
            "English short name lower case": "Sudan",
            "Alpha-2 code": "SD",
            "Numeric code": 736
        },
        {
            "ISO 3166-2": "ISO 3166-2:SR",
            "Alpha-3 code": "SUR",
            "English short name lower case": "Suriname",
            "Alpha-2 code": "SR",
            "Numeric code": 740
        },
        {
            "ISO 3166-2": "ISO 3166-2:SJ",
            "Alpha-3 code": "SJM",
            "English short name lower case": "Svalbard and Jan Mayen",
            "Alpha-2 code": "SJ",
            "Numeric code": 744
        },
        {
            "ISO 3166-2": "ISO 3166-2:SZ",
            "Alpha-3 code": "SWZ",
            "English short name lower case": "Swaziland",
            "Alpha-2 code": "SZ",
            "Numeric code": 748
        },
        {
            "ISO 3166-2": "ISO 3166-2:SE",
            "Alpha-3 code": "SWE",
            "English short name lower case": "Sweden",
            "Alpha-2 code": "SE",
            "Numeric code": 752
        },
        {
            "ISO 3166-2": "ISO 3166-2:CH",
            "Alpha-3 code": "CHE",
            "English short name lower case": "Switzerland",
            "Alpha-2 code": "CH",
            "Numeric code": 756
        },
        {
            "ISO 3166-2": "ISO 3166-2:SY",
            "Alpha-3 code": "SYR",
            "English short name lower case": "Syrian Arab Republic",
            "Alpha-2 code": "SY",
            "Numeric code": 760
        },
        {
            "ISO 3166-2": "ISO 3166-2:TW",
            "Alpha-3 code": "TWN",
            "English short name lower case": "Taiwan, Province of China",
            "Alpha-2 code": "TW",
            "Numeric code": 158
        },
        {
            "ISO 3166-2": "ISO 3166-2:TJ",
            "Alpha-3 code": "TJK",
            "English short name lower case": "Tajikistan",
            "Alpha-2 code": "TJ",
            "Numeric code": 762
        },
        {
            "ISO 3166-2": "ISO 3166-2:TZ",
            "Alpha-3 code": "TZA",
            "English short name lower case": "Tanzania, United Republic of",
            "Alpha-2 code": "TZ",
            "Numeric code": 834
        },
        {
            "ISO 3166-2": "ISO 3166-2:TH",
            "Alpha-3 code": "THA",
            "English short name lower case": "Thailand",
            "Alpha-2 code": "TH",
            "Numeric code": 764
        },
        {
            "ISO 3166-2": "ISO 3166-2:TL",
            "Alpha-3 code": "TLS",
            "English short name lower case": "Timor-Leste",
            "Alpha-2 code": "TL",
            "Numeric code": 626
        },
        {
            "ISO 3166-2": "ISO 3166-2:TG",
            "Alpha-3 code": "TGO",
            "English short name lower case": "Togo",
            "Alpha-2 code": "TG",
            "Numeric code": 768
        },
        {
            "ISO 3166-2": "ISO 3166-2:TK",
            "Alpha-3 code": "TKL",
            "English short name lower case": "Tokelau",
            "Alpha-2 code": "TK",
            "Numeric code": 772
        },
        {
            "ISO 3166-2": "ISO 3166-2:TO",
            "Alpha-3 code": "TON",
            "English short name lower case": "Tonga",
            "Alpha-2 code": "TO",
            "Numeric code": 776
        },
        {
            "ISO 3166-2": "ISO 3166-2:TT",
            "Alpha-3 code": "TTO",
            "English short name lower case": "Trinidad and Tobago",
            "Alpha-2 code": "TT",
            "Numeric code": 780
        },
        {
            "ISO 3166-2": "ISO 3166-2:TN",
            "Alpha-3 code": "TUN",
            "English short name lower case": "Tunisia",
            "Alpha-2 code": "TN",
            "Numeric code": 788
        },
        {
            "ISO 3166-2": "ISO 3166-2:TR",
            "Alpha-3 code": "TUR",
            "English short name lower case": "Turkey",
            "Alpha-2 code": "TR",
            "Numeric code": 792
        },
        {
            "ISO 3166-2": "ISO 3166-2:TM",
            "Alpha-3 code": "TKM",
            "English short name lower case": "Turkmenistan",
            "Alpha-2 code": "TM",
            "Numeric code": 795
        },
        {
            "ISO 3166-2": "ISO 3166-2:TC",
            "Alpha-3 code": "TCA",
            "English short name lower case": "Turks and Caicos Islands",
            "Alpha-2 code": "TC",
            "Numeric code": 796
        },
        {
            "ISO 3166-2": "ISO 3166-2:TV",
            "Alpha-3 code": "TUV",
            "English short name lower case": "Tuvalu",
            "Alpha-2 code": "TV",
            "Numeric code": 798
        },
        {
            "ISO 3166-2": "ISO 3166-2:UG",
            "Alpha-3 code": "UGA",
            "English short name lower case": "Uganda",
            "Alpha-2 code": "UG",
            "Numeric code": 800
        },
        {
            "ISO 3166-2": "ISO 3166-2:UA",
            "Alpha-3 code": "UKR",
            "English short name lower case": "Ukraine",
            "Alpha-2 code": "UA",
            "Numeric code": 804
        },
        {
            "ISO 3166-2": "ISO 3166-2:AE",
            "Alpha-3 code": "ARE",
            "English short name lower case": "United Arab Emirates",
            "Alpha-2 code": "AE",
            "Numeric code": 784
        },
        {
            "ISO 3166-2": "ISO 3166-2:GB",
            "Alpha-3 code": "GBR",
            "English short name lower case": "United Kingdom",
            "Alpha-2 code": "GB",
            "Numeric code": 826
        },
        {
            "ISO 3166-2": "ISO 3166-2:US",
            "Alpha-3 code": "USA",
            "English short name lower case": "United States",
            "Alpha-2 code": "US",
            "Numeric code": 840
        },
        {
            "ISO 3166-2": "ISO 3166-2:UM",
            "Alpha-3 code": "UMI",
            "English short name lower case": "United States Minor Outlying Islands",
            "Alpha-2 code": "UM",
            "Numeric code": 581
        },
        {
            "ISO 3166-2": "ISO 3166-2:UY",
            "Alpha-3 code": "URY",
            "English short name lower case": "Uruguay",
            "Alpha-2 code": "UY",
            "Numeric code": 858
        },
        {
            "ISO 3166-2": "ISO 3166-2:UZ",
            "Alpha-3 code": "UZB",
            "English short name lower case": "Uzbekistan",
            "Alpha-2 code": "UZ",
            "Numeric code": 860
        },
        {
            "ISO 3166-2": "ISO 3166-2:VU",
            "Alpha-3 code": "VUT",
            "English short name lower case": "Vanuatu",
            "Alpha-2 code": "VU",
            "Numeric code": 548
        },
        {
            "ISO 3166-2": "ISO 3166-2:VE",
            "Alpha-3 code": "VEN",
            "English short name lower case": "Venezuela, Bolivarian Republic of",
            "Alpha-2 code": "VE",
            "Numeric code": 862
        },
        {
            "ISO 3166-2": "ISO 3166-2:VN",
            "Alpha-3 code": "VNM",
            "English short name lower case": "Viet Nam",
            "Alpha-2 code": "VN",
            "Numeric code": 704
        },
        {
            "ISO 3166-2": "ISO 3166-2:VG",
            "Alpha-3 code": "VGB",
            "English short name lower case": "Virgin Islands, British",
            "Alpha-2 code": "VG",
            "Numeric code": 92.0
        },
        {
            "ISO 3166-2": "ISO 3166-2:VI",
            "Alpha-3 code": "VIR",
            "English short name lower case": "Virgin Islands, U.S.",
            "Alpha-2 code": "VI",
            "Numeric code": 850
        },
        {
            "ISO 3166-2": "ISO 3166-2:WF",
            "Alpha-3 code": "WLF",
            "English short name lower case": "Wallis and Futuna",
            "Alpha-2 code": "WF",
            "Numeric code": 876
        },
        {
            "ISO 3166-2": "ISO 3166-2:EH",
            "Alpha-3 code": "ESH",
            "English short name lower case": "Western Sahara",
            "Alpha-2 code": "EH",
            "Numeric code": 732
        },
        {
            "ISO 3166-2": "ISO 3166-2:YE",
            "Alpha-3 code": "YEM",
            "English short name lower case": "Yemen",
            "Alpha-2 code": "YE",
            "Numeric code": 887
        },
        {
            "ISO 3166-2": "ISO 3166-2:ZM",
            "Alpha-3 code": "ZMB",
            "English short name lower case": "Zambia",
            "Alpha-2 code": "ZM",
            "Numeric code": 894
        },
        {
            "ISO 3166-2": "ISO 3166-2:ZW",
            "Alpha-3 code": "ZWE",
            "English short name lower case": "Zimbabwe",
            "Alpha-2 code": "ZW",
            "Numeric code": 716
        }
    ];

}