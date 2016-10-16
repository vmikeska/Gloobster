module TravelB {
	export class TravelBUtils {
		public static waitingMins(waitingUntil) {
			var now = new Date();
			var untilDate = new Date(waitingUntil);
			var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			var untilUtc = new Date(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate(), untilDate.getUTCHours(), untilDate.getUTCMinutes(), untilDate.getUTCSeconds());
			var dd = Math.abs(nowUtc.getTime() - untilUtc.getTime());
			var diffMins = Math.ceil(dd / (1000 * 60));
			return diffMins;
			}

		public static minsToTimeStr(mins) {
			var h = Math.floor(mins / 60);
			var m = mins % 60;

			return `${h}h ${m}m`;
		}

			public static i(id, text) {
				return { id: id, text: text };
			}
			
			public static wdSightseeing() {
				return [
						TravelBUtils.i(101, "WalkingTour"),
						TravelBUtils.i(102, "BikeTour"),
						TravelBUtils.i(103, "Trip"),
						TravelBUtils.i(104, "ExhibitionMuseum")
				];
			}

			public static wdNightlife() {
					return [
							TravelBUtils.i(201, "Pub"),
							TravelBUtils.i(202, "Bar"),
							TravelBUtils.i(203, "Club"),
							TravelBUtils.i(204, "Outside")
					];
			}

			public static wdSport() {
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
			}

			public static wdDate() {
					return [
							TravelBUtils.i(401, "OneToOne"),
							TravelBUtils.i(402, "Pairs"),
							TravelBUtils.i(403, "Group")							
					];
			}

			public static wdDining() {
					return [
							TravelBUtils.i(501, "Vegan"),
							TravelBUtils.i(502, "International"),
							TravelBUtils.i(503, "DiningAdventure")							
					];
			}

			public static wdEvents() {
					return [
							TravelBUtils.i(601, "Cinema"),
							TravelBUtils.i(602, "Concert"),
							TravelBUtils.i(603, "SportMatch")
					];
			}

			
		public static getWantDoTaggerData() {
			var data = [
				{ k: "Sightseeing", id: 100, items: TravelBUtils.wdSightseeing() },
				{ k: "Nightlife", id: 200, items: TravelBUtils.wdNightlife() },
				{ k: "Sport", id: 300, items: TravelBUtils.wdSport() },
				{ k: "Date", id: 400, items: TravelBUtils.wdDate() },
				{ k: "Dining", id: 500, items: TravelBUtils.wdDining() },
				{ k: "Events", id: 600, items: TravelBUtils.wdEvents() }
			];
			return data;
		}

		public static wantDoDB() {
			var all = [];
			all = all.concat(this.wdSightseeing(), this.wdNightlife(), this.wdSport(), this.wdDate(), this.wdDining(), this.wdEvents());
			return all;
		}

		public static intLifestyle() {
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
		}

		public static intMusic() {
				return [
						TravelBUtils.i(201, "Rock"),
						TravelBUtils.i(202, "Jazz"),
						TravelBUtils.i(203, "Electro"),
						TravelBUtils.i(204, "DnB"),
						TravelBUtils.i(205, "Techno"),
						TravelBUtils.i(206, "Funk")
				];
		}

		public static intSomething() {
				return [
						TravelBUtils.i(301, "Somthing1"),
						TravelBUtils.i(302, "Somthing2"),
						TravelBUtils.i(303, "Somthing3")						
				];
		}



		public static interestsDB() {

				var all = [];
				all = all.concat(this.intLifestyle(), this.intMusic(), this.intSomething());
				return all;				
		}

		public static getInterestsTaggerData() {
				var data = [
						{ k: "Lifestyle", id: 100, items: TravelBUtils.intLifestyle() },
						{ k: "Music", id: 200, items: TravelBUtils.intMusic() },
						{ k: "Something", id: 300, items: TravelBUtils.intSomething() }
				];
				return data;
		}

		public static langsDB() {
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
		}

//		private textLines = `aa	Afar			
//ab	Abkhazian			
//af	Afrikaans			
//ak	Akan			
//sq	Albanian							
//am	Amharic			
//ar	Arabic			
//an	Aragonese			
//hy	Armenian							
//as	Assamese			
//av	Avaric			
//ae	Avestan			
//ay	Aymara			
//az	Azerbaijani			
//ba	Bashkir			
//bm	Bambara			
//eu	Basque							
//be	Belarusian			
//bn	Bengali			
//bh	Bihari languages			
//bi	Bislama			
//bo	Tibetan							
//bs	Bosnian			
//br	Breton			
//bg	Bulgarian			
//my	Burmese							
//ca	Catalan
//cs	Czech							
//ch	Chamorro			
//ce	Chechen			
//zh	Chinese							
//cv	Chuvash			
//kw	Cornish			
//co	Corsican			
//cr	Cree			
//cy	Welsh							
//cs	Czech							
//da	Danish			
//de	German							
//dv	Maldivian			
//nl	Dutch
//dz	Dzongkha			
//el	Greek
//en	English			
//eo	Esperanto			
//et	Estonian			
//eu	Basque							
//ee	Ewe			
//fo	Faroese			
//fa	Persian			
//fj	Fijian							
//fi	Finnish			
//fr	French			
//fy	Western Frisian			
//ff	Fulah			
//ka	Georgian							
//de	German			
//ga	Irish			
//gl	Galician			
//gv	Manx			
//el	Greek						
//gn	Guarani							
//gu	Gujarati		
//ht	Haitian		
//ha	Hausa							
//he	Hebrew			
//hz	Herero											
//hi	Hindi			
//ho	Hiri Motu			
//hr	Croatian							
//hu	Hungarian							
//hy	Armenian		
//ig	Igbo			
//is	Icelandic							
//io	Ido			
//ii	Sichuan Yi
//iu	Inuktitut			
//id	Indonesian						
//ik	Inupiaq			
//is	Icelandic							
//it	Italian			
//jv	Javanese							
//ja	Japanese		
//kn	Kannada							
//ks	Kashmiri			
//ka	Georgian							
//kr	Kanuri							
//kk	Kazakh			
//km	Central Khmer							
//ki	Kikuyu
//rw	Kinyarwanda			
//ky	Kirghiz
//kv	Komi			
//kg	Kongo			
//ko	Korean			
//kj	Kuanyama
//ku	Kurdish			
//lo	Lao			
//la	Latin			
//lv	Latvian							
//ln	Lingala			
//lt	Lithuanian		
//lb	Luxembourgish
//lu	Luba-Katanga			
//lg	Ganda			
//mk	Macedonian		
//mh	Marshallese		
//ml	Malayalam							
//mi	Maori			
//mr	Marathi							
//ms	Malay			
//mk	Macedonian		
//mg	Malagasy			
//mt	Maltese			
//mn	Mongolian							
//mi	Maori							
//ms	Malay			
//my	Burmese			
//na	Nauru			
//nv	Navajo
//nr	Ndebele
//nd	Ndebele
//ng	Ndonga							
//ne	Nepali			
//nl	Dutch
//no	Norwegian		
//ny	Chichewa
//oj	Ojibwa			
//or	Oriya			
//om	Oromo							
//pa	Panjabi
//fa	Persian			
//pi	Pali			
//pl	Polish							
//pt	Portuguese		
//ps	Pushto
//qu	Quechua			
//rm	Romansh							
//ro	Romanian
//rn	Rundi							
//ru	Russian							
//sg	Sango			
//sa	Sanskrit		
//si	Sinhala
//sk	Slovak						
//sl	Slovenian							
//se	Northern Sami		
//sm	Samoan							
//sn	Shona			
//sd	Sindhi			
//so	Somali							
//st	Sotho
//es	Spanish
//sq	Albanian							
//sr	Serbian										
//ss	Swati							
//su	Sundanese		
//sw	Swahili			
//sv	Swedish			
//ty	Tahitian							
//ta	Tamil			
//tt	Tatar			
//te	Telugu			
//tg	Tajik			
//tl	Tagalog			
//th	Thai			
//bo	Tibetan			
//ti	Tigrinya		
//to	Tonga
//tn	Tswana			
//ts	Tsonga			
//tk	Turkmen			
//tr	Turkish			
//tw	Twi			
//ug	Uighur
//uk	Ukrainian		
//ur	Urdu			
//uz	Uzbek							
//ve	Venda			
//vi	Vietnamese			
//vo	Volapük			
//cy	Welsh			
//wa	Walloon			
//wo	Wolof							
//xh	Xhosa			
//yi	Yiddish			
//yo	Yoruba			
//za	Zhuang
//zh	Chinese						
//zu	Zulu
//`;

//		private convert() {
//				var lns = this.textLines.split("\n");

//				var ostr = "";

//				var added = [];

//				lns.forEach((ln) => {

//						if (ln !== "") {
//								var prms = ln.split("\t");
//								var code = prms[0].trim();
//								var name = prms[1].trim();

//								if (!_.contains(added, (a) => { return a === code; })) {
//										added.push(code);
//										var txt = `TravelBUtils.i("${code}", "${name}"),\n`;

//										ostr += txt;
//								}


//						}

//				});

//				alert(ostr);

//		}
	}
}