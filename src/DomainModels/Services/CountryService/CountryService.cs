using System.Collections.Generic;
using System.Linq;
using Gloobster.DomainModels.Services.GeonamesService;

namespace Gloobster.DomainModels.Services.CountryService
{
	public class CountryService: ICountryService
	{
		public List<Country> CountriesList;

		public CountryService()
		{
			var countriesJson = GetCountriesJson();
			var countries = Newtonsoft.Json.JsonConvert.DeserializeObject<CountriesRoot>(countriesJson);
			CountriesList = countries.Countries;

			//	new List<Country>();

			//var countriesJson = GetCountriesJson();
			//JObject jObject = JObject.Parse(countriesJson);
			//var jCountries = jObject["countries"].ToArray();

			//foreach (var jCountry in jCountries)
			//{
			//	var country = new Country
			//	{
			//		CountryCode = jCountry["countryCode"].Value<string>(),
			//		CountryName = jCountry["countryName"].Value<string>(),
			//		IsoAlpha3 = jCountry["isoAlpha3"].Value<string>()
			//	};

			//	CountriesList.Add(country);
			//}

		}

		public Country GetByCountryName(string countryName)
		{
			var country = CountriesList.FirstOrDefault(c => c.CountryName.Equals(countryName));

			if (country == null)
			{

			}

			return country;
		}

		public Country GetCountryByCountryCode2(string countryCode2)
		{
			var country = CountriesList.FirstOrDefault(c => c.CountryCode.Equals(countryCode2));
			return country;
		}

		private string GetCountriesJson()
		{
			return @"
				{					
						""countries"": [
							{
								""countryCode"": ""AD"",
								""countryName"": ""Andorra"",
								""isoAlpha3"": ""AND""
							},
							{
								""countryCode"": ""AE"",
								""countryName"": ""United Arab Emirates"",
								""isoAlpha3"": ""ARE""
							},
							{
								""countryCode"": ""AF"",
								""countryName"": ""Afghanistan"",
								""isoAlpha3"": ""AFG""
							},
							{
								""countryCode"": ""AG"",
								""countryName"": ""Antigua and Barbuda"",
								""isoAlpha3"": ""ATG""
							},
							{
								""countryCode"": ""AI"",
								""countryName"": ""Anguilla"",
								""isoAlpha3"": ""AIA""
							},
							{
								""countryCode"": ""AL"",
								""countryName"": ""Albania"",
								""isoAlpha3"": ""ALB""
							},
							{
								""countryCode"": ""AM"",
								""countryName"": ""Armenia"",
								""isoAlpha3"": ""ARM""
							},
							{
								""countryCode"": ""AO"",
								""countryName"": ""Angola"",
								""isoAlpha3"": ""AGO""
							},
							{
								""countryCode"": ""AQ"",
								""countryName"": ""Antarctica"",
								""isoAlpha3"": ""ATA""
							},
							{
								""countryCode"": ""AR"",
								""countryName"": ""Argentina"",
								""isoAlpha3"": ""ARG""
							},
							{
								""countryCode"": ""AS"",
								""countryName"": ""American Samoa"",
								""isoAlpha3"": ""ASM""
							},
							{
								""countryCode"": ""AT"",
								""countryName"": ""Austria"",
								""isoAlpha3"": ""AUT""
							},
							{
								""countryCode"": ""AU"",
								""countryName"": ""Australia"",
								""isoAlpha3"": ""AUS""
							},
							{
								""countryCode"": ""AW"",
								""countryName"": ""Aruba"",
								""isoAlpha3"": ""ABW""
							},
							{
								""countryCode"": ""AX"",
								""countryName"": ""Åland"",
								""isoAlpha3"": ""ALA""
							},
							{
								""countryCode"": ""AZ"",
								""countryName"": ""Azerbaijan"",
								""isoAlpha3"": ""AZE""
							},
							{
								""countryCode"": ""BA"",
								""countryName"": ""Bosnia and Herzegovina"",
								""isoAlpha3"": ""BIH""
							},
							{
								""countryCode"": ""BB"",
								""countryName"": ""Barbados"",
								""isoAlpha3"": ""BRB""
							},
							{
								""countryCode"": ""BD"",
								""countryName"": ""Bangladesh"",
								""isoAlpha3"": ""BGD""
							},
							{
								""countryCode"": ""BE"",
								""countryName"": ""Belgium"",
								""isoAlpha3"": ""BEL""
							},
							{
								""countryCode"": ""BF"",
								""countryName"": ""Burkina Faso"",
								""isoAlpha3"": ""BFA""
							},
							{
								""countryCode"": ""BG"",
								""countryName"": ""Bulgaria"",
								""isoAlpha3"": ""BGR""
							},
							{
								""countryCode"": ""BH"",
								""countryName"": ""Bahrain"",
								""isoAlpha3"": ""BHR""
							},
							{
								""countryCode"": ""BI"",
								""countryName"": ""Burundi"",
								""isoAlpha3"": ""BDI""
							},
							{
								""countryCode"": ""BJ"",
								""countryName"": ""Benin"",
								""isoAlpha3"": ""BEN""
							},
							{
								""countryCode"": ""BL"",
								""countryName"": ""Saint Barthélemy"",
								""isoAlpha3"": ""BLM""
							},
							{
								""countryCode"": ""BM"",
								""countryName"": ""Bermuda"",
								""isoAlpha3"": ""BMU""
							},
							{
								""countryCode"": ""BN"",
								""countryName"": ""Brunei"",
								""isoAlpha3"": ""BRN""
							},
							{
								""countryCode"": ""BO"",
								""countryName"": ""Bolivia"",
								""isoAlpha3"": ""BOL""
							},
							{
								""countryCode"": ""BQ"",
								""countryName"": ""Bonaire"",
								""isoAlpha3"": ""BES""
							},
							{
								""countryCode"": ""BR"",
								""countryName"": ""Brazil"",
								""isoAlpha3"": ""BRA""
							},
							{
								""countryCode"": ""BS"",
								""countryName"": ""Bahamas"",
								""isoAlpha3"": ""BHS""
							},
							{
								""countryCode"": ""BT"",
								""countryName"": ""Bhutan"",
								""isoAlpha3"": ""BTN""
							},
							{
								""countryCode"": ""BV"",
								""countryName"": ""Bouvet Island"",
								""isoAlpha3"": ""BVT""
							},
							{
								""countryCode"": ""BW"",
								""countryName"": ""Botswana"",
								""isoAlpha3"": ""BWA""
							},
							{
								""countryCode"": ""BY"",
								""countryName"": ""Belarus"",
								""isoAlpha3"": ""BLR""
							},
							{
								""countryCode"": ""BZ"",
								""countryName"": ""Belize"",
								""isoAlpha3"": ""BLZ""
							},
							{
								""countryCode"": ""CA"",
								""countryName"": ""Canada"",
								""isoAlpha3"": ""CAN""
							},
							{
								""countryCode"": ""CC"",
								""countryName"": ""Cocos [Keeling] Islands"",
								""isoAlpha3"": ""CCK""
							},
							{
								""countryCode"": ""CD"",
								""countryName"": ""Democratic Republic of the Congo"",
								""isoAlpha3"": ""COD""
							},
							{
								""countryCode"": ""CF"",
								""countryName"": ""Central African Republic"",
								""isoAlpha3"": ""CAF""
							},
							{
								""countryCode"": ""CG"",
								""countryName"": ""Republic of the Congo"",
								""isoAlpha3"": ""COG""
							},
							{
								""countryCode"": ""CH"",
								""countryName"": ""Switzerland"",
								""isoAlpha3"": ""CHE""
							},
							{
								""countryCode"": ""CI"",
								""countryName"": ""Ivory Coast"",
								""isoAlpha3"": ""CIV""
							},
							{
								""countryCode"": ""CK"",
								""countryName"": ""Cook Islands"",
								""isoAlpha3"": ""COK""
							},
							{
								""countryCode"": ""CL"",
								""countryName"": ""Chile"",
								""isoAlpha3"": ""CHL""
							},
							{
								""countryCode"": ""CM"",
								""countryName"": ""Cameroon"",
								""isoAlpha3"": ""CMR""
							},
							{
								""countryCode"": ""CN"",
								""countryName"": ""China"",
								""isoAlpha3"": ""CHN""
							},
							{
								""countryCode"": ""CO"",
								""countryName"": ""Colombia"",
								""isoAlpha3"": ""COL""
							},
							{
								""countryCode"": ""CR"",
								""countryName"": ""Costa Rica"",
								""isoAlpha3"": ""CRI""
							},
							{
								""countryCode"": ""CU"",
								""countryName"": ""Cuba"",
								""isoAlpha3"": ""CUB""
							},
							{
								""countryCode"": ""CV"",
								""countryName"": ""Cape Verde"",
								""isoAlpha3"": ""CPV""
							},
							{
								""countryCode"": ""CW"",
								""countryName"": ""Curacao"",
								""isoAlpha3"": ""CUW""
							},
							{
								""countryCode"": ""CX"",
								""countryName"": ""Christmas Island"",
								""isoAlpha3"": ""CXR""
							},
							{
								""countryCode"": ""CY"",
								""countryName"": ""Cyprus"",
								""isoAlpha3"": ""CYP""
							},
							{
								""countryCode"": ""CZ"",
								""countryName"": ""Czech Republic"",
								""isoAlpha3"": ""CZE""
							},
							{
								""countryCode"": ""DE"",
								""countryName"": ""Germany"",
								""isoAlpha3"": ""DEU""
							},
							{
								""countryCode"": ""DJ"",
								""countryName"": ""Djibouti"",
								""isoAlpha3"": ""DJI""
							},
							{
								""countryCode"": ""DK"",
								""countryName"": ""Denmark"",
								""isoAlpha3"": ""DNK""
							},
							{
								""countryCode"": ""DM"",
								""countryName"": ""Dominica"",
								""isoAlpha3"": ""DMA""
							},
							{
								""countryCode"": ""DO"",
								""countryName"": ""Dominican Republic"",
								""isoAlpha3"": ""DOM""
							},
							{
								""countryCode"": ""DZ"",
								""countryName"": ""Algeria"",
								""isoAlpha3"": ""DZA""
							},
							{
								""countryCode"": ""EC"",
								""countryName"": ""Ecuador"",
								""isoAlpha3"": ""ECU""
							},
							{
								""countryCode"": ""EE"",
								""countryName"": ""Estonia"",
								""isoAlpha3"": ""EST""
							},
							{
								""countryCode"": ""EG"",
								""countryName"": ""Egypt"",
								""isoAlpha3"": ""EGY""
							},
							{
								""countryCode"": ""EH"",
								""countryName"": ""Western Sahara"",
								""isoAlpha3"": ""ESH""
							},
							{
								""countryCode"": ""ER"",
								""countryName"": ""Eritrea"",
								""isoAlpha3"": ""ERI""
							},
							{
								""countryCode"": ""ES"",
								""countryName"": ""Spain"",
								""isoAlpha3"": ""ESP""
							},
							{
								""countryCode"": ""ET"",
								""countryName"": ""Ethiopia"",
								""isoAlpha3"": ""ETH""
							},
							{
								""countryCode"": ""FI"",
								""countryName"": ""Finland"",
								""isoAlpha3"": ""FIN""
							},
							{
								""countryCode"": ""FJ"",
								""countryName"": ""Fiji"",
								""isoAlpha3"": ""FJI""
							},
							{
								""countryCode"": ""FK"",
								""countryName"": ""Falkland Islands"",
								""isoAlpha3"": ""FLK""
							},
							{
								""countryCode"": ""FM"",
								""countryName"": ""Micronesia"",
								""isoAlpha3"": ""FSM""
							},
							{
								""countryCode"": ""FO"",
								""countryName"": ""Faroe Islands"",
								""isoAlpha3"": ""FRO""
							},
							{
								""countryCode"": ""FR"",
								""countryName"": ""France"",
								""isoAlpha3"": ""FRA""
							},
							{
								""countryCode"": ""GA"",
								""countryName"": ""Gabon"",
								""isoAlpha3"": ""GAB""
							},
							{
								""countryCode"": ""GB"",
								""countryName"": ""United Kingdom"",
								""isoAlpha3"": ""GBR""
							},
							{
								""countryCode"": ""GD"",
								""countryName"": ""Grenada"",
								""isoAlpha3"": ""GRD""
							},
							{
								""countryCode"": ""GE"",
								""countryName"": ""Georgia"",
								""isoAlpha3"": ""GEO""
							},
							{
								""countryCode"": ""GF"",
								""countryName"": ""French Guiana"",
								""isoAlpha3"": ""GUF""
							},
							{
								""countryCode"": ""GG"",
								""countryName"": ""Guernsey"",
								""isoAlpha3"": ""GGY""
							},
							{
								""countryCode"": ""GH"",
								""countryName"": ""Ghana"",
								""isoAlpha3"": ""GHA""
							},
							{
								""countryCode"": ""GI"",
								""countryName"": ""Gibraltar"",
								""isoAlpha3"": ""GIB""
							},
							{
								""countryCode"": ""GL"",
								""countryName"": ""Greenland"",
								""isoAlpha3"": ""GRL""
							},
							{
								""countryCode"": ""GM"",
								""countryName"": ""Gambia"",
								""isoAlpha3"": ""GMB""
							},
							{
								""countryCode"": ""GN"",
								""countryName"": ""Guinea"",
								""isoAlpha3"": ""GIN""
							},
							{
								""countryCode"": ""GP"",
								""countryName"": ""Guadeloupe"",
								""isoAlpha3"": ""GLP""
							},
							{
								""countryCode"": ""GQ"",
								""countryName"": ""Equatorial Guinea"",
								""isoAlpha3"": ""GNQ""
							},
							{
								""countryCode"": ""GR"",
								""countryName"": ""Greece"",
								""isoAlpha3"": ""GRC""
							},
							{
								""countryCode"": ""GS"",
								""countryName"": ""South Georgia and the South Sandwich Islands"",
								""isoAlpha3"": ""SGS""
							},
							{
								""countryCode"": ""GT"",
								""countryName"": ""Guatemala"",
								""isoAlpha3"": ""GTM""
							},
							{
								""countryCode"": ""GU"",
								""countryName"": ""Guam"",
								""isoAlpha3"": ""GUM""
							},
							{
								""countryCode"": ""GW"",
								""countryName"": ""Guinea-Bissau"",
								""isoAlpha3"": ""GNB""
							},
							{
								""countryCode"": ""GY"",
								""countryName"": ""Guyana"",
								""isoAlpha3"": ""GUY""
							},
							{
								""countryCode"": ""HK"",
								""countryName"": ""Hong Kong"",
								""isoAlpha3"": ""HKG""
							},
							{
								""countryCode"": ""HM"",
								""countryName"": ""Heard Island and McDonald Islands"",
								""isoAlpha3"": ""HMD""
							},
							{
								""countryCode"": ""HN"",
								""countryName"": ""Honduras"",
								""isoAlpha3"": ""HND""
							},
							{
								""countryCode"": ""HR"",
								""countryName"": ""Croatia"",
								""isoAlpha3"": ""HRV""
							},
							{
								""countryCode"": ""HT"",
								""countryName"": ""Haiti"",
								""isoAlpha3"": ""HTI""
							},
							{
								""countryCode"": ""HU"",
								""countryName"": ""Hungary"",
								""isoAlpha3"": ""HUN""
							},
							{
								""countryCode"": ""ID"",
								""countryName"": ""Indonesia"",
								""isoAlpha3"": ""IDN""
							},
							{
								""countryCode"": ""IE"",
								""countryName"": ""Ireland"",
								""isoAlpha3"": ""IRL""
							},
							{
								""countryCode"": ""IL"",
								""countryName"": ""Israel"",
								""isoAlpha3"": ""ISR""
							},
							{
								""countryCode"": ""IM"",
								""countryName"": ""Isle of Man"",
								""isoAlpha3"": ""IMN""
							},
							{
								""countryCode"": ""IN"",
								""countryName"": ""India"",
								""isoAlpha3"": ""IND""
							},
							{
								""countryCode"": ""IO"",
								""countryName"": ""British Indian Ocean Territory"",
								""isoAlpha3"": ""IOT""
							},
							{
								""countryCode"": ""IQ"",
								""countryName"": ""Iraq"",
								""isoAlpha3"": ""IRQ""
							},
							{
								""countryCode"": ""IR"",
								""countryName"": ""Iran"",
								""isoAlpha3"": ""IRN""
							},
							{
								""countryCode"": ""IS"",
								""countryName"": ""Iceland"",
								""isoAlpha3"": ""ISL""
							},
							{
								""countryCode"": ""IT"",
								""countryName"": ""Italy"",
								""isoAlpha3"": ""ITA""
							},
							{
								""countryCode"": ""JE"",
								""countryName"": ""Jersey"",
								""isoAlpha3"": ""JEY""
							},
							{
								""countryCode"": ""JM"",
								""countryName"": ""Jamaica"",
								""isoAlpha3"": ""JAM""
							},
							{
								""countryCode"": ""JO"",
								""countryName"": ""Jordan"",
								""isoAlpha3"": ""JOR""
							},
							{
								""countryCode"": ""JP"",
								""countryName"": ""Japan"",
								""isoAlpha3"": ""JPN""
							},
							{
								""countryCode"": ""KE"",
								""countryName"": ""Kenya"",
								""isoAlpha3"": ""KEN""
							},
							{
								""countryCode"": ""KG"",
								""countryName"": ""Kyrgyzstan"",
								""isoAlpha3"": ""KGZ""
							},
							{
								""countryCode"": ""KH"",
								""countryName"": ""Cambodia"",
								""isoAlpha3"": ""KHM""
							},
							{
								""countryCode"": ""KI"",
								""countryName"": ""Kiribati"",
								""isoAlpha3"": ""KIR""
							},
							{
								""countryCode"": ""KM"",
								""countryName"": ""Comoros"",
								""isoAlpha3"": ""COM""
							},
							{
								""countryCode"": ""KN"",
								""countryName"": ""Saint Kitts and Nevis"",
								""isoAlpha3"": ""KNA""
							},
							{
								""countryCode"": ""KP"",
								""countryName"": ""North Korea"",
								""isoAlpha3"": ""PRK""
							},
							{
								""countryCode"": ""KR"",
								""countryName"": ""South Korea"",
								""isoAlpha3"": ""KOR""
							},
							{
								""countryCode"": ""KW"",
								""countryName"": ""Kuwait"",
								""isoAlpha3"": ""KWT""
							},
							{
								""countryCode"": ""KY"",
								""countryName"": ""Cayman Islands"",
								""isoAlpha3"": ""CYM""
							},
							{
								""countryCode"": ""KZ"",
								""countryName"": ""Kazakhstan"",
								""isoAlpha3"": ""KAZ""
							},
							{
								""countryCode"": ""LA"",
								""countryName"": ""Laos"",
								""isoAlpha3"": ""LAO""
							},
							{
								""countryCode"": ""LB"",
								""countryName"": ""Lebanon"",
								""isoAlpha3"": ""LBN""
							},
							{
								""countryCode"": ""LC"",
								""countryName"": ""Saint Lucia"",
								""isoAlpha3"": ""LCA""
							},
							{
								""countryCode"": ""LI"",
								""countryName"": ""Liechtenstein"",
								""isoAlpha3"": ""LIE""
							},
							{
								""countryCode"": ""LK"",
								""countryName"": ""Sri Lanka"",
								""isoAlpha3"": ""LKA""
							},
							{
								""countryCode"": ""LR"",
								""countryName"": ""Liberia"",
								""isoAlpha3"": ""LBR""
							},
							{
								""countryCode"": ""LS"",
								""countryName"": ""Lesotho"",
								""isoAlpha3"": ""LSO""
							},
							{
								""countryCode"": ""LT"",
								""countryName"": ""Lithuania"",
								""isoAlpha3"": ""LTU""
							},
							{
								""countryCode"": ""LU"",
								""countryName"": ""Luxembourg"",
								""isoAlpha3"": ""LUX""
							},
							{
								""countryCode"": ""LV"",
								""countryName"": ""Latvia"",
								""isoAlpha3"": ""LVA""
							},
							{
								""countryCode"": ""LY"",
								""countryName"": ""Libya"",
								""isoAlpha3"": ""LBY""
							},
							{
								""countryCode"": ""MA"",
								""countryName"": ""Morocco"",
								""isoAlpha3"": ""MAR""
							},
							{
								""countryCode"": ""MC"",
								""countryName"": ""Monaco"",
								""isoAlpha3"": ""MCO""
							},
							{
								""countryCode"": ""MD"",
								""countryName"": ""Moldova"",
								""isoAlpha3"": ""MDA""
							},
							{
								""countryCode"": ""ME"",
								""countryName"": ""Montenegro"",
								""isoAlpha3"": ""MNE""
							},
							{
								""countryCode"": ""MF"",
								""countryName"": ""Saint Martin"",
								""isoAlpha3"": ""MAF""
							},
							{
								""countryCode"": ""MG"",
								""countryName"": ""Madagascar"",
								""isoAlpha3"": ""MDG""
							},
							{
								""countryCode"": ""MH"",
								""countryName"": ""Marshall Islands"",
								""isoAlpha3"": ""MHL""
							},
							{
								""countryCode"": ""MK"",
								""countryName"": ""Macedonia"",
								""isoAlpha3"": ""MKD""
							},
							{
								""countryCode"": ""ML"",
								""countryName"": ""Mali"",
								""isoAlpha3"": ""MLI""
							},
							{
								""countryCode"": ""MM"",
								""countryName"": ""Myanmar [Burma]"",
								""isoAlpha3"": ""MMR""
							},
							{
								""countryCode"": ""MN"",
								""countryName"": ""Mongolia"",
								""isoAlpha3"": ""MNG""
							},
							{
								""countryCode"": ""MO"",
								""countryName"": ""Macao"",
								""isoAlpha3"": ""MAC""
							},
							{
								""countryCode"": ""MP"",
								""countryName"": ""Northern Mariana Islands"",
								""isoAlpha3"": ""MNP""
							},
							{
								""countryCode"": ""MQ"",
								""countryName"": ""Martinique"",
								""isoAlpha3"": ""MTQ""
							},
							{
								""countryCode"": ""MR"",
								""countryName"": ""Mauritania"",
								""isoAlpha3"": ""MRT""
							},
							{
								""countryCode"": ""MS"",
								""countryName"": ""Montserrat"",
								""isoAlpha3"": ""MSR""
							},
							{
								""countryCode"": ""MT"",
								""countryName"": ""Malta"",
								""isoAlpha3"": ""MLT""
							},
							{
								""countryCode"": ""MU"",
								""countryName"": ""Mauritius"",
								""isoAlpha3"": ""MUS""
							},
							{
								""countryCode"": ""MV"",
								""countryName"": ""Maldives"",
								""isoAlpha3"": ""MDV""
							},
							{
								""countryCode"": ""MW"",
								""countryName"": ""Malawi"",
								""isoAlpha3"": ""MWI""
							},
							{
								""countryCode"": ""MX"",
								""countryName"": ""Mexico"",
								""isoAlpha3"": ""MEX""
							},
							{
								""countryCode"": ""MY"",
								""countryName"": ""Malaysia"",
								""isoAlpha3"": ""MYS""
							},
							{
								""countryCode"": ""MZ"",
								""countryName"": ""Mozambique"",
								""isoAlpha3"": ""MOZ""
							},
							{
								""countryCode"": ""NA"",
								""countryName"": ""Namibia"",
								""isoAlpha3"": ""NAM""
							},
							{
								""countryCode"": ""NC"",
								""countryName"": ""New Caledonia"",
								""isoAlpha3"": ""NCL""
							},
							{
								""countryCode"": ""NE"",
								""countryName"": ""Niger"",
								""isoAlpha3"": ""NER""
							},
							{
								""countryCode"": ""NF"",
								""countryName"": ""Norfolk Island"",
								""isoAlpha3"": ""NFK""
							},
							{
								""countryCode"": ""NG"",
								""countryName"": ""Nigeria"",
								""isoAlpha3"": ""NGA""
							},
							{
								""countryCode"": ""NI"",
								""countryName"": ""Nicaragua"",
								""isoAlpha3"": ""NIC""
							},
							{
								""countryCode"": ""NL"",
								""countryName"": ""Netherlands"",
								""isoAlpha3"": ""NLD""
							},
							{
								""countryCode"": ""NO"",
								""countryName"": ""Norway"",
								""isoAlpha3"": ""NOR""
							},
							{
								""countryCode"": ""NP"",
								""countryName"": ""Nepal"",
								""isoAlpha3"": ""NPL""
							},
							{
								""countryCode"": ""NR"",
								""countryName"": ""Nauru"",
								""isoAlpha3"": ""NRU""
							},
							{
								""countryCode"": ""NU"",
								""countryName"": ""Niue"",
								""isoAlpha3"": ""NIU""
							},
							{
								""countryCode"": ""NZ"",
								""countryName"": ""New Zealand"",
								""isoAlpha3"": ""NZL""
							},
							{
								""countryCode"": ""OM"",
								""countryName"": ""Oman"",
								""isoAlpha3"": ""OMN""
							},
							{
								""countryCode"": ""PA"",
								""countryName"": ""Panama"",
								""isoAlpha3"": ""PAN""
							},
							{
								""countryCode"": ""PE"",
								""countryName"": ""Peru"",
								""isoAlpha3"": ""PER""
							},
							{
								""countryCode"": ""PF"",
								""countryName"": ""French Polynesia"",
								""isoAlpha3"": ""PYF""
							},
							{
								""countryCode"": ""PG"",
								""countryName"": ""Papua New Guinea"",
								""isoAlpha3"": ""PNG""
							},
							{
								""countryCode"": ""PH"",
								""countryName"": ""Philippines"",
								""isoAlpha3"": ""PHL""
							},
							{
								""countryCode"": ""PK"",
								""countryName"": ""Pakistan"",
								""isoAlpha3"": ""PAK""
							},
							{
								""countryCode"": ""PL"",
								""countryName"": ""Poland"",
								""isoAlpha3"": ""POL""
							},
							{
								""countryCode"": ""PM"",
								""countryName"": ""Saint Pierre and Miquelon"",
								""isoAlpha3"": ""SPM""
							},
							{
								""countryCode"": ""PN"",
								""countryName"": ""Pitcairn Islands"",
								""isoAlpha3"": ""PCN""
							},
							{
								""countryCode"": ""PR"",
								""countryName"": ""Puerto Rico"",
								""isoAlpha3"": ""PRI""
							},
							{
								""countryCode"": ""PS"",
								""countryName"": ""Palestine"",
								""isoAlpha3"": ""PSE""
							},
							{
								""countryCode"": ""PT"",
								""countryName"": ""Portugal"",
								""isoAlpha3"": ""PRT""
							},
							{
								""countryCode"": ""PW"",
								""countryName"": ""Palau"",
								""isoAlpha3"": ""PLW""
							},
							{
								""countryCode"": ""PY"",
								""countryName"": ""Paraguay"",
								""isoAlpha3"": ""PRY""
							},
							{
								""countryCode"": ""QA"",
								""countryName"": ""Qatar"",
								""isoAlpha3"": ""QAT""
							},
							{
								""countryCode"": ""RE"",
								""countryName"": ""Réunion"",
								""isoAlpha3"": ""REU""
							},
							{
								""countryCode"": ""RO"",
								""countryName"": ""Romania"",
								""isoAlpha3"": ""ROU""
							},
							{
								""countryCode"": ""RS"",
								""countryName"": ""Serbia"",
								""isoAlpha3"": ""SRB""
							},
							{
								""countryCode"": ""RU"",
								""countryName"": ""Russia"",
								""isoAlpha3"": ""RUS""
							},
							{
								""countryCode"": ""RW"",
								""countryName"": ""Rwanda"",
								""isoAlpha3"": ""RWA""
							},
							{
								""countryCode"": ""SA"",
								""countryName"": ""Saudi Arabia"",
								""isoAlpha3"": ""SAU""
							},
							{
								""countryCode"": ""SB"",
								""countryName"": ""Solomon Islands"",
								""isoAlpha3"": ""SLB""
							},
							{
								""countryCode"": ""SC"",
								""countryName"": ""Seychelles"",
								""isoAlpha3"": ""SYC""
							},
							{
								""countryCode"": ""SD"",
								""countryName"": ""Sudan"",
								""isoAlpha3"": ""SDN""
							},
							{
								""countryCode"": ""SE"",
								""countryName"": ""Sweden"",
								""isoAlpha3"": ""SWE""
							},
							{
								""countryCode"": ""SG"",
								""countryName"": ""Singapore"",
								""isoAlpha3"": ""SGP""
							},
							{
								""countryCode"": ""SH"",
								""countryName"": ""Saint Helena"",
								""isoAlpha3"": ""SHN""
							},
							{
								""countryCode"": ""SI"",
								""countryName"": ""Slovenia"",
								""isoAlpha3"": ""SVN""
							},
							{
								""countryCode"": ""SJ"",
								""countryName"": ""Svalbard and Jan Mayen"",
								""isoAlpha3"": ""SJM""
							},
							{
								""countryCode"": ""SK"",
								""countryName"": ""Slovakia"",
								""isoAlpha3"": ""SVK""
							},
							{
								""countryCode"": ""SL"",
								""countryName"": ""Sierra Leone"",
								""isoAlpha3"": ""SLE""
							},
							{
								""countryCode"": ""SM"",
								""countryName"": ""San Marino"",
								""isoAlpha3"": ""SMR""
							},
							{
								""countryCode"": ""SN"",
								""countryName"": ""Senegal"",
								""isoAlpha3"": ""SEN""
							},
							{
								""countryCode"": ""SO"",
								""countryName"": ""Somalia"",
								""isoAlpha3"": ""SOM""
							},
							{
								""countryCode"": ""SR"",
								""countryName"": ""Suriname"",
								""isoAlpha3"": ""SUR""
							},
							{
								""countryCode"": ""SS"",
								""countryName"": ""South Sudan"",
								""isoAlpha3"": ""SSD""
							},
							{
								""countryCode"": ""ST"",
								""countryName"": ""São Tomé and Príncipe"",
								""isoAlpha3"": ""STP""
							},
							{
								""countryCode"": ""SV"",
								""countryName"": ""El Salvador"",
								""isoAlpha3"": ""SLV""
							},
							{
								""countryCode"": ""SX"",
								""countryName"": ""Sint Maarten"",
								""isoAlpha3"": ""SXM""
							},
							{
								""countryCode"": ""SY"",
								""countryName"": ""Syria"",
								""isoAlpha3"": ""SYR""
							},
							{
								""countryCode"": ""SZ"",
								""countryName"": ""Swaziland"",
								""isoAlpha3"": ""SWZ""
							},
							{
								""countryCode"": ""TC"",
								""countryName"": ""Turks and Caicos Islands"",
								""isoAlpha3"": ""TCA""
							},
							{
								""countryCode"": ""TD"",
								""countryName"": ""Chad"",
								""isoAlpha3"": ""TCD""
							},
							{
								""countryCode"": ""TF"",
								""countryName"": ""French Southern Territories"",
								""isoAlpha3"": ""ATF""
							},
							{
								""countryCode"": ""TG"",
								""countryName"": ""Togo"",
								""isoAlpha3"": ""TGO""
							},
							{
								""countryCode"": ""TH"",
								""countryName"": ""Thailand"",
								""isoAlpha3"": ""THA""
							},
							{
								""countryCode"": ""TJ"",
								""countryName"": ""Tajikistan"",
								""isoAlpha3"": ""TJK""
							},
							{
								""countryCode"": ""TK"",
								""countryName"": ""Tokelau"",
								""isoAlpha3"": ""TKL""
							},
							{
								""countryCode"": ""TL"",
								""countryName"": ""East Timor"",
								""isoAlpha3"": ""TLS""
							},
							{
								""countryCode"": ""TM"",
								""countryName"": ""Turkmenistan"",
								""isoAlpha3"": ""TKM""
							},
							{
								""countryCode"": ""TN"",
								""countryName"": ""Tunisia"",
								""isoAlpha3"": ""TUN""
							},
							{
								""countryCode"": ""TO"",
								""countryName"": ""Tonga"",
								""isoAlpha3"": ""TON""
							},
							{
								""countryCode"": ""TR"",
								""countryName"": ""Turkey"",
								""isoAlpha3"": ""TUR""
							},
							{
								""countryCode"": ""TT"",
								""countryName"": ""Trinidad and Tobago"",
								""isoAlpha3"": ""TTO""
							},
							{
								""countryCode"": ""TV"",
								""countryName"": ""Tuvalu"",
								""isoAlpha3"": ""TUV""
							},
							{
								""countryCode"": ""TW"",
								""countryName"": ""Taiwan"",
								""isoAlpha3"": ""TWN""
							},
							{
								""countryCode"": ""TZ"",
								""countryName"": ""Tanzania"",
								""isoAlpha3"": ""TZA""
							},
							{
								""countryCode"": ""UA"",
								""countryName"": ""Ukraine"",
								""isoAlpha3"": ""UKR""
							},
							{
								""countryCode"": ""UG"",
								""countryName"": ""Uganda"",
								""isoAlpha3"": ""UGA""
							},
							{
								""countryCode"": ""UM"",
								""countryName"": ""U.S. Minor Outlying Islands"",
								""isoAlpha3"": ""UMI""
							},
							{
								""countryCode"": ""US"",
								""countryName"": ""United States"",
								""isoAlpha3"": ""USA""
							},
							{
								""countryCode"": ""UY"",
								""countryName"": ""Uruguay"",
								""isoAlpha3"": ""URY""
							},
							{
								""countryCode"": ""UZ"",
								""countryName"": ""Uzbekistan"",
								""isoAlpha3"": ""UZB""
							},
							{
								""countryCode"": ""VA"",
								""countryName"": ""Vatican City"",
								""isoAlpha3"": ""VAT""
							},
							{
								""countryCode"": ""VC"",
								""countryName"": ""Saint Vincent and the Grenadines"",
								""isoAlpha3"": ""VCT""
							},
							{
								""countryCode"": ""VE"",
								""countryName"": ""Venezuela"",
								""isoAlpha3"": ""VEN""
							},
							{
								""countryCode"": ""VG"",
								""countryName"": ""British Virgin Islands"",
								""isoAlpha3"": ""VGB""
							},
							{
								""countryCode"": ""VI"",
								""countryName"": ""U.S. Virgin Islands"",
								""isoAlpha3"": ""VIR""
							},
							{
								""countryCode"": ""VN"",
								""countryName"": ""Vietnam"",
								""isoAlpha3"": ""VNM""
							},
							{
								""countryCode"": ""VU"",
								""countryName"": ""Vanuatu"",
								""isoAlpha3"": ""VUT""
							},
							{
								""countryCode"": ""WF"",
								""countryName"": ""Wallis and Futuna"",
								""isoAlpha3"": ""WLF""
							},
							{
								""countryCode"": ""WS"",
								""countryName"": ""Samoa"",
								""isoAlpha3"": ""WSM""
							},
							{
								""countryCode"": ""XK"",
								""countryName"": ""Kosovo"",
								""isoAlpha3"": ""XKX""
							},
							{
								""countryCode"": ""YE"",
								""countryName"": ""Yemen"",
								""isoAlpha3"": ""YEM""
							},
							{
								""countryCode"": ""YT"",
								""countryName"": ""Mayotte"",
								""isoAlpha3"": ""MYT""
							},
							{
								""countryCode"": ""ZA"",
								""countryName"": ""South Africa"",
								""isoAlpha3"": ""ZAF""
							},
							{
								""countryCode"": ""ZM"",
								""countryName"": ""Zambia"",
								""isoAlpha3"": ""ZMB""
							},
							{
								""countryCode"": ""ZW"",
								""countryName"": ""Zimbabwe"",
								""isoAlpha3"": ""ZWE""
							}
						]
					}				
			";


		}
	}
}

//countries table generated from: http://peric.github.io/GetCountries/