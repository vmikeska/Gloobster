module Stats {
		
		export class CountriesDriving extends CountriesPlugin {

				private static data = [
						{
								country: "Afghanistan",
								cc: "AF",
								isRight: true
						},
						{
								country: "Albania",
								cc: "AL",
								isRight: true
						},
						{
								country: "Algeria",
								cc: "DZ",
								isRight: true
						},
						{
								country: "Andorra",
								cc: "AD",
								isRight: true
						},
						{
								country: "Angola",
								cc: "AO",
								isRight: true
						},
						{
								country: "Antigua and Barbuda",
								cc: "AG",
								isRight: false
						},
						{
								country: "Argentina",
								cc: "AR",
								isRight: true
						},
						{
								country: "Armenia",
								cc: "AM",
								isRight: true
						},
						{
								country: "Australia",
								cc: "AU",
								isRight: false
						},
						{
								country: "Austria",
								cc: "AT",
								isRight: true
						},
						{
								country: "Azerbaijan",
								cc: "AZ",
								isRight: true
						},
						{
								country: "Bahamas",
								cc: "BS",
								isRight: false
						},
						{
								country: "Bahrain",
								cc: "BH",
								isRight: true
						},
						{
								country: "Bangladesh",
								cc: "BD",
								isRight: false
						},
						{
								country: "Barbados",
								cc: "BB",
								isRight: false
						},
						{
								country: "Belgium",
								cc: "BE",
								isRight: true
						},
						{
								country: "Belarus",
								cc: "BY",
								isRight: true
						},
						{
								country: "Belize",
								cc: "BZ",
								isRight: true
						},
						{
								country: "Benin",
								cc: "BJ",
								isRight: true
						},
						{
								country: "Bhutan",
								cc: "BT",
								isRight: false
						},
						{
								country: "Bolivia",
								cc: "BO",
								isRight: true
						},
						{
								country: "Botswana",
								cc: "BW",
								isRight: false
						},
						{
								country: "Brazil",
								cc: "BR",
								isRight: true
						},
						{
								country: "Brunei",
								cc: "BN",
								isRight: false
						},
						{
								country: "Bosnia and Herzegovina",
								cc: "BA",
								isRight: true
						},
						{
								country: "Bulgaria",
								cc: "BG",
								isRight: true
						},
						{
								country: "Burkina Faso",
								cc: "BF",
								isRight: true
						},
						{
								country: "Burundi",
								cc: "BI",
								isRight: true
						},
						{
								country: "Cambodia",
								cc: "KH",
								isRight: true
						},
						{
								country: "Cameroon",
								cc: "CM",
								isRight: true
						},
						{
								country: "Canada",
								cc: "CA",
								isRight: true
						},
						{
								country: "Cape Verde",
								cc: "CV",
								isRight: true
						},
						{
								country: "Central African Republic",
								cc: "CF",
								isRight: true
						},
						{
								country: "Chad",
								cc: "TD",
								isRight: true
						},
						{
								country: "Chile",
								cc: "CL",
								isRight: true
						},
						{
								country: "China",
								cc: "CN",
								isRight: false
						},
						{
								country: "Colombia",
								cc: "CO",
								isRight: true
						},
						{
								country: "Comoros",
								cc: "KM",
								isRight: true
						},
						{
								country: "Congo",
								cc: "CG",
								isRight: true
						},
						{
								country: "Democratic Republic of Congo",
								cc: "CD",
								isRight: true
						},
						{
								country: "Costa Rica",
								cc: "CR",
								isRight: true
						},
						{
								country: "Ivory Cost",
								cc: "CI",
								isRight: true
						},
						{
								country: "Croatia",
								cc: "HR",
								isRight: true
						},
						{
								country: "Cuba",
								cc: "CU",
								isRight: true
						},
						{
								country: "Cyprus",
								cc: "CY",
								isRight: false
						},
						{
								country: "Czech Republic",
								cc: "CZ",
								isRight: true
						},
						{
								country: "Denmark",
								cc: "DK",
								isRight: true
						},
						{
								country: "Djibouti",
								cc: "DJ",
								isRight: true
						},
						{
								country: "Dominica",
								cc: "DM",
								isRight: false
						},
						{
								country: "Dominican Republic",
								cc: "DO",
								isRight: true
						},
						{
								country: "East Timor",
								cc: "TL",
								isRight: false
						},
						{
								country: "Ecuador",
								cc: "EC",
								isRight: true
						},
						{
								country: "Egypt",
								cc: "EG",
								isRight: true
						},
						{
								country: "El Salvador",
								cc: "SV",
								isRight: true
						},
						{
								country: "Equatorial Guinea",
								cc: "GQ",
								isRight: true
						},
						{
								country: "Eritrea",
								cc: "ER",
								isRight: true
						},
						{
								country: "Estonia",
								cc: "EE",
								isRight: true
						},
						{
								country: "Ethiopia",
								cc: "ET",
								isRight: true
						},
						{
								country: "Fiji",
								cc: "FJ",
								isRight: false
						},
						{
								country: "Finland",
								cc: "FI",
								isRight: true
						},
						{
								country: "France",
								cc: "FR",
								isRight: true
						},
						{
								country: "Gabon",
								cc: "GA",
								isRight: true
						},
						{
								country: "Gambia",
								cc: "GM",
								isRight: false
						},
						{
								country: "Georgia",
								cc: "GE",
								isRight: true
						},
						{
								country: "Germany",
								cc: "DE",
								isRight: true
						},
						{
								country: "Ghana",
								cc: "GH",
								isRight: true
						},
						{
								country: "Greece",
								cc: "GR",
								isRight: true
						},
						{
								country: "Grenada",
								cc: "GD",
								isRight: false
						},
						{
								country: "Guatemala",
								cc: "GT",
								isRight: true
						},
						{
								country: "Guinea",
								cc: "GN",
								isRight: true
						},
						{
								country: "Guinea-Bissau",
								cc: "GW",
								isRight: true
						},
						{
								country: "Guyana",
								cc: "GY",
								isRight: false
						},
						{
								country: "Haiti",
								cc: "HT",
								isRight: true
						},
						{
								country: "Honduras",
								cc: "HN",
								isRight: true
						},
						{
								country: "Hungary",
								cc: "HU",
								isRight: true
						},
						{
								country: "Iceland",
								cc: "IS",
								isRight: true
						},
						{
								country: "Iran",
								cc: "IR",
								isRight: true
						},
						{
								country: "Iraq",
								cc: "IQ",
								isRight: true
						},
						{
								country: "India",
								cc: "IN",
								isRight: false
						},
						{
								country: "Indonesia",
								cc: "ID",
								isRight: false
						},
						{
								country: "Ireland",
								cc: "IE",
								isRight: false
						},
						{
								country: "Israel",
								cc: "IL",
								isRight: true
						},
						{
								country: "Italy",
								cc: "IT",
								isRight: true
						},
						{
								country: "Jamaica",
								cc: "JM",
								isRight: false
						},
						{
								country: "Japan",
								cc: "JP",
								isRight: false
						},
						{
								country: "Jordan",
								cc: "JO",
								isRight: true
						},
						{
								country: "Kazakhstan",
								cc: "KZ",
								isRight: true
						},
						{
								country: "Kenya",
								cc: "KE",
								isRight: false
						},
						{
								country: "Kiribati",
								cc: "KI",
								isRight: false
						},
						{
								country: "North Korea",
								cc: "KP",
								isRight: true
						},
						{
								country: "South Korea",
								cc: "KR",
								isRight: true
						},
						{
								country: "Kuwait",
								cc: "KW",
								isRight: true
						},
						{
								country: "Kyrgyzstan",
								cc: "KG",
								isRight: true
						},
						{
								country: "Laos",
								cc: "LA",
								isRight: true
						},
						{
								country: "Latvia",
								cc: "LV",
								isRight: true
						},
						{
								country: "Lebanon",
								cc: "LB",
								isRight: true
						},
						{
								country: "Lesotho",
								cc: "LS",
								isRight: false
						},
						{
								country: "Liberia",
								cc: "LR",
								isRight: true
						},
						{
								country: "Libya",
								cc: "LY",
								isRight: true
						},
						{
								country: "Liechtenstein",
								cc: "LI",
								isRight: true
						},
						{
								country: "Lithuania",
								cc: "LT",
								isRight: true
						},
						{
								country: "Luxembourg",
								cc: "LU",
								isRight: true
						},
						{
								country: "Macedonia",
								cc: "MK",
								isRight: true
						},
						{
								country: "Madagascar",
								cc: "MG",
								isRight: true
						},
						{
								country: "Malawi",
								cc: "MW",
								isRight: false
						},
						{
								country: "Malaysia",
								cc: "MY",
								isRight: false
						},
						{
								country: "Maldives",
								cc: "MV",
								isRight: false
						},
						{
								country: "Malta",
								cc: "MT",
								isRight: false
						},
						{
								country: "Mauritius",
								cc: "MU",
								isRight: false
						},
						{
								country: "Mozambique",
								cc: "MZ",
								isRight: false
						},
						{
								country: "Mali",
								cc: "ML",
								isRight: true
						},
						{
								country: "Marshall Islands",
								cc: "MH",
								isRight: true
						},
						{
								country: "Mauritania",
								cc: "MR",
								isRight: true
						},
						{
								country: "Mexico",
								cc: "MX",
								isRight: true
						},
						{
								country: "Micronesia",
								cc: "FM",
								isRight: false
						},
						{
								country: "Moldova",
								cc: "MD",
								isRight: true
						},
						{
								country: "Monaco",
								cc: "MC",
								isRight: true
						},
						{
								country: "Mongolia",
								cc: "MN",
								isRight: true
						},
						{
								country: "Montenegro",
								cc: "ME",
								isRight: true
						},
						{
								country: "Morocco",
								cc: "MA",
								isRight: true
						},
						{
								country: "Myanmar",
								cc: "MM",
								isRight: true
						},
						{
								country: "Netherlands",
								cc: "NL",
								isRight: true
						},
						{
								country: "Namibia",
								cc: "NA",
								isRight: false
						},
						{
								country: "Nauru",
								cc: "NR",
								isRight: false
						},
						{
								country: "Nepal",
								cc: "NP",
								isRight: false
						},
						{
								country: "New Zealand",
								cc: "NZ",
								isRight: false
						},
						{
								country: "Nicaragua",
								cc: "NI",
								isRight: true
						},
						{
								country: "Niger",
								cc: "NE",
								isRight: true
						},
						{
								country: "Nigeria",
								cc: "NG",
								isRight: true
						},
						{
								country: "Norway",
								cc: "NO",
								isRight: true
						},
						{
								country: "Oman",
								cc: "OM",
								isRight: true
						},
						{
								country: "Palau",
								cc: "PW",
								isRight: true
						},
						{
								country: "Palestine",
								cc: "PS",
								isRight: true
						},
						{
								country: "Pakistan",
								cc: "PK",
								isRight: false
						},
						{
								country: "Panama",
								cc: "PA",
								isRight: true
						},
						{
								country: "Papua New Guinea",
								cc: "PG",
								isRight: false
						},
						{
								country: "Paraguay",
								cc: "PY",
								isRight: true
						},
						{
								country: "Peru",
								cc: "PE",
								isRight: true
						},
						{
								country: "Philippines",
								cc: "PH",
								isRight: true
						},
						{
								country: "Poland",
								cc: "PL",
								isRight: true
						},
						{
								country: "Portugal",
								cc: "PT",
								isRight: true
						},
						{
								country: "Qatar",
								cc: "QA",
								isRight: true
						},
						{
								country: "Romania",
								cc: "RO",
								isRight: true
						},
						{
								country: "Russia",
								cc: "RU",
								isRight: true
						},
						{
								country: "Rwanda",
								cc: "RW",
								isRight: true
						},
						{
								country: "Saint Kitts and Nevis",
								cc: "KN",
								isRight: false
						},
						{
								country: "Saint Lucia",
								cc: "LC",
								isRight: false
						},
						{
								country: "Saint Vincent and the Grenadines",
								cc: "VC",
								isRight: false
						},
						{
								country: "Samoa",
								cc: "WS",
								isRight: false
						},
						{
								country: "San Marino",
								cc: "SM",
								isRight: true
						},
						{
								country: "São Tomé and Príncipe",
								cc: "ST",
								isRight: true
						},
						{
								country: "Saudi Arabia",
								cc: "SA",
								isRight: true
						},
						{
								country: "Senegal",
								cc: "SN",
								isRight: true
						},
						{
								country: "Serbia",
								cc: "RS",
								isRight: true
						},
						{
								country: "Seychelles",
								cc: "SC",
								isRight: false
						},
						{
								country: "Sierra Leone",
								cc: "SL",
								isRight: true
						},
						{
								country: "Singapore",
								cc: "SG",
								isRight: false
						},
						{
								country: "Slovakia",
								cc: "SK",
								isRight: true
						},
						{
								country: "Slovenia",
								cc: "SI",
								isRight: true
						},
						{
								country: "Solomon Islands",
								cc: "SB",
								isRight: false
						},
						{
								country: "Somalia",
								cc: "SO",
								isRight: true
						},
						{
								country: "South Africa",
								cc: "ZA",
								isRight: false
						},
						{
								country: "South Sudan",
								cc: "SS",
								isRight: true
						},
						{
								country: "Spain",
								cc: "ES",
								isRight: true
						},
						{
								country: "Sri Lanka",
								cc: "LK",
								isRight: false
						},
						{
								country: "Sudan",
								cc: "SD",
								isRight: true
						},
						{
								country: "Suriname",
								cc: "SR",
								isRight: false
						},
						{
								country: "Swaziland",
								cc: "SZ",
								isRight: false
						},
						{
								country: "Sweden",
								cc: "SE",
								isRight: true
						},
						{
								country: "Switzerland",
								cc: "CH",
								isRight: true
						},
						{
								country: "Syria",
								cc: "SY",
								isRight: true
						},
						{
								country: "Taiwan",
								cc: "TW",
								isRight: true
						},
						{
								country: "Tajikistan",
								cc: "TJ",
								isRight: true
						},
						{
								country: "Tanzania",
								cc: "TZ",
								isRight: false
						},
						{
								country: "Thailand",
								cc: "TH",
								isRight: false
						},
						{
								country: "Togo",
								cc: "TG",
								isRight: true
						},
						{
								country: "Tonga",
								cc: "TO",
								isRight: false
						},
						{
								country: "Trinidad and Tobago",
								cc: "TT",
								isRight: false
						},
						{
								country: "Tunisia",
								cc: "TN",
								isRight: true
						},
						{
								country: "Turkey",
								cc: "TR",
								isRight: true
						},
						{
								country: "Turkmenistan",
								cc: "TM",
								isRight: true
						},
						{
								country: "Tuvalu",
								cc: "TV",
								isRight: false
						},
						{
								country: "Uganda",
								cc: "UG",
								isRight: false
						},
						{
								country: "Ukraine",
								cc: "UA",
								isRight: true
						},
						{
								country: "United Arab Emirates",
								cc: "AE",
								isRight: true
						},
						{
								country: "United Kingdom",
								cc: "GB",
								isRight: false
						},
						{
								country: "United States",
								cc: "US",
								isRight: true
						},
						{
								country: "Uruguay",
								cc: "UY",
								isRight: true
						},
						{
								country: "Uzbekistan",
								cc: "UZ",
								isRight: true
						},
						{
								country: "Vanuatu",
								cc: "VU",
								isRight: true
						},
						{
								country: "Venezuela",
								cc: "VE",
								isRight: true
						},
						{
								country: "Vietnam",
								cc: "VN",
								isRight: true
						},
						{
								country: "Yemen",
								cc: "YE",
								isRight: true
						},
						{
								country: "Zambia",
								cc: "ZM",
								isRight: false
						},
						{
								country: "Zimbabwe",
								cc: "ZW",
								isRight: false
						}
				];

				get legendItems() {
						return [
								{ color: "#3DA243", txt: "Left" },
								{ color: "#FFC400", txt: "Right" }
						];
				}

				getCountryStyle(cc) {

						var rec = _.find(CountriesDriving.data, (d) => {
								return d.cc === cc;
						});

						var color = "#BCB3B8";

						if (rec) {
								color = rec.isRight ? "#3DA243" : "#FFC400";
						}

						return {
								color: "#BCB3B8",
								weight: 1,
								opacity: 1,
								fillColor: color,
								fillOpacity: 1
						};
				}
				
		}
		
		
}