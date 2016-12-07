var __extends=this&&this.__extends||function(i,a){function e(){this.constructor=i}for(var n in a)a.hasOwnProperty(n)&&(i[n]=a[n]);i.prototype=null===a?Object.create(a):(e.prototype=a.prototype,new e)},Views;!function(i){var a=function(a){function e(){a.call(this),this.itemTmp=i.ViewBase.currentView.registerTemplate("user-rating-template"),this.initRating(),this.transLangs(),this.transCharact()}return __extends(e,a),e.prototype.transCharact=function(){var i=$("#characts");if(i.length>0){var a=TravelB.TravelBUtils.interestsDB(),e=i.find(".tag").toArray();e.forEach(function(i){var e=$(i),n=parseInt(e.html()),t=_.find(a,function(i){return i.id===n});t?e.html(t.text):e.hide()})}},e.prototype.transLangs=function(){var i=$("#langs");if(i.length>0){var a=TravelB.TravelBUtils.langsDB(),e=i.find(".ltag").toArray();e.forEach(function(i){var e=$(i),n=e.html(),t=_.find(a,function(i){return i.id===n});t?e.html(t.text):e.hide()})}},e.prototype.initRating=function(){var i=this;$("#sendNewText").click(function(a){a.preventDefault();var e={targetUserId:$("#userId").val(),text:$("#newText").val()};i.apiPost("UserRating",e,function(a){$(".ratings .empty").hide();var e={userId:a.userId,name:a.name,text:a.text},n=$(i.itemTmp(e));$(".ratings .items").append(n),$("#newText").val("")})}),$(".rating-delete").click(function(a){var e=$(a.target),n=e.closest(".item"),t=n.data("id"),r=new Common.ConfirmDialog;r.create(i.t("RatingDelTitle","jsUserDetail"),i.t("RatingDelBody","jsUserDetail"),i.t("Cancel","jsLayout"),i.t("Delete","jsLayout"),function(){i.apiDelete("UserRating",[["id",t]],function(){$('.item[data-id="'+t+'"]').remove()})})})},e}(i.ViewBase);i.DetailView=a}(Views||(Views={}));var TravelB;!function(i){var a=function(){function i(){}return i.waitingMins=function(i){var a=new Date,e=new Date(i),n=new Date(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate(),a.getUTCHours(),a.getUTCMinutes(),a.getUTCSeconds()),t=new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds()),r=Math.abs(n.getTime()-t.getTime()),s=Math.ceil(r/6e4);return s},i.minsToTimeStr=function(i){var a=Math.floor(i/60),e=i%60;return a+"h "+e+"m"},i.i=function(i,a){return{id:i,text:a}},i.wdSightseeing=function(){return[i.i(101,"Walking tour"),i.i(102,"Bike tour"),i.i(103,"Local trip"),i.i(104,"Exhibition/Museum"),i.i(105,"Photo hunting")]},i.wdNightlife=function(){return[i.i(201,"Pub"),i.i(202,"Bar"),i.i(203,"Clubbing"),i.i(204,"Outside"),i.i(205,"Pub crawl"),i.i(206,"Concert"),i.i(207,"Pub quiz"),i.i(208,"Dining"),i.i(209,"Cinema")]},i.wdSport=function(){return[i.i(301,"Football"),i.i(302,"Running"),i.i(303,"Basketball"),i.i(304,"Tennis"),i.i(305,"Squash"),i.i(306,"Golf"),i.i(307,"Biking"),i.i(308,"Baseball"),i.i(309,"Hockey"),i.i(310,"Hiking"),i.i(311,"Fishing"),i.i(312,"Chess"),i.i(313,"Poker"),i.i(314,"Lasertag"),i.i(315,"Bowling")]},i.wdDate=function(){return[i.i(401,"One to One"),i.i(402,"Pairs"),i.i(403,"Group")]},i.getWantDoTaggerData=function(){var a=[{k:"Sightseeing",id:100,items:i.wdSightseeing()},{k:"Nightlife",id:200,items:i.wdNightlife()},{k:"Sport",id:300,items:i.wdSport()},{k:"Date",id:400,items:i.wdDate()}];return a},i.intLifestyle=function(){return[i.i(1001,"Travels"),i.i(1002,"Hitchhike"),i.i(1003,"Backpacking"),i.i(1004,"Camping"),i.i(1005,"Sports"),i.i(1006,"Books"),i.i(1007,"Movies"),i.i(1008,"Anime"),i.i(1009,"Politics"),i.i(1010,"Motors"),i.i(1011,"Bio"),i.i(1012,"Environment"),i.i(1013,"Animals"),i.i(1014,"Fitness"),i.i(1015,"Games"),i.i(1016,"Hipster"),i.i(1017,"Naturism"),i.i(1018,"Gay"),i.i(1019,"Ultras"),i.i(1020,"Science"),i.i(1021,"Arts"),i.i(1022,"Volunteering"),i.i(1023,"Vegan"),i.i(1024,"Vegetarian"),i.i(1025,"Religion"),i.i(1026,"Party animal"),i.i(1027,"Writing"),i.i(1028,"Food lover"),i.i(1029,"Alchool"),i.i(1030,"Globe trotter"),i.i(1031,"Dating"),i.i(1032,"Clubbing"),i.i(1033,"Pub"),i.i(1034,"Fashion"),i.i(1035,"IT guy")]},i.intMusic=function(){return[i.i(2001,"Classic"),i.i(2002,"Electronic"),i.i(2003,"Dance"),i.i(2004,"Rock"),i.i(2005,"Techno"),i.i(2006,"Hip hop"),i.i(2007,"Folk"),i.i(2008,"Pop"),i.i(2009,"Blues"),i.i(2010,"Jazz"),i.i(2011,"Latin"),i.i(2012,"Reggae"),i.i(2013,"R & B"),i.i(2014,"Alternative"),i.i(2015,"Grunge"),i.i(2016,"Indie"),i.i(2017,"Punk"),i.i(2018,"Metal"),i.i(2019,"Industrial"),i.i(2020,"Progressive"),i.i(2021,"Rock & Roll"),i.i(2022,"Ska"),i.i(2023,"Soul"),i.i(2024,"Funky"),i.i(2025,"Rockabilly"),i.i(2026,"Rave")]},i.intCharacteristic=function(){return[i.i(3001,"Adventurous"),i.i(3002,"Listener"),i.i(3003,"Cultured"),i.i(3004,"Fair"),i.i(3005,"Independent"),i.i(3006,"Optimistic"),i.i(3007,"Precise"),i.i(3008,"Humble"),i.i(3009,"Open mind"),i.i(3010,"Talkative"),i.i(3011,"Extravagant"),i.i(3012,"Money"),i.i(3013,"Success"),i.i(3014,"Love"),i.i(3015,"Family"),i.i(3016,"Work"),i.i(3017,"Career"),i.i(3018,"Friends"),i.i(3019,"Fun"),i.i(3020,"Education")]},i.wantDoDB=function(){var i=[];return i=i.concat(this.wdSightseeing(),this.wdNightlife(),this.wdSport(),this.wdDate())},i.interestsDB=function(){var i=[];return i=i.concat(this.intLifestyle(),this.intMusic(),this.intCharacteristic())},i.getInterestsTaggerData=function(){var a=[{k:"Lifestyle",id:1e3,items:i.intLifestyle()},{k:"Music",id:2e3,items:i.intMusic()},{k:"Characteristic",id:3e3,items:i.intCharacteristic()}];return a},i.langsDB=function(){return[i.i("aa","Afar"),i.i("ab","Abkhazian"),i.i("af","Afrikaans"),i.i("ak","Akan"),i.i("sq","Albanian"),i.i("am","Amharic"),i.i("ar","Arabic"),i.i("an","Aragonese"),i.i("hy","Armenian"),i.i("as","Assamese"),i.i("av","Avaric"),i.i("ae","Avestan"),i.i("ay","Aymara"),i.i("az","Azerbaijani"),i.i("ba","Bashkir"),i.i("bm","Bambara"),i.i("eu","Basque"),i.i("be","Belarusian"),i.i("bn","Bengali"),i.i("bh","Bihari languages"),i.i("bi","Bislama"),i.i("bo","Tibetan"),i.i("bs","Bosnian"),i.i("br","Breton"),i.i("bg","Bulgarian"),i.i("my","Burmese"),i.i("ca","Catalan"),i.i("ch","Chamorro"),i.i("ce","Chechen"),i.i("zh","Chinese"),i.i("cv","Chuvash"),i.i("kw","Cornish"),i.i("co","Corsican"),i.i("cr","Cree"),i.i("cy","Welsh"),i.i("cs","Czech"),i.i("da","Danish"),i.i("de","German"),i.i("dv","Maldivian"),i.i("nl","Dutch"),i.i("dz","Dzongkha"),i.i("el","Greek"),i.i("en","English"),i.i("eo","Esperanto"),i.i("et","Estonian"),i.i("eu","Basque"),i.i("ee","Ewe"),i.i("fo","Faroese"),i.i("fa","Persian"),i.i("fj","Fijian"),i.i("fi","Finnish"),i.i("fr","French"),i.i("fy","Western Frisian"),i.i("ff","Fulah"),i.i("ka","Georgian"),i.i("de","German"),i.i("ga","Irish"),i.i("gl","Galician"),i.i("gv","Manx"),i.i("el","Greek"),i.i("gn","Guarani"),i.i("gu","Gujarati"),i.i("ht","Haitian"),i.i("ha","Hausa"),i.i("he","Hebrew"),i.i("hz","Herero"),i.i("hi","Hindi"),i.i("ho","Hiri Motu"),i.i("hr","Croatian"),i.i("hu","Hungarian"),i.i("hy","Armenian"),i.i("ig","Igbo"),i.i("is","Icelandic"),i.i("io","Ido"),i.i("ii","Sichuan Yi"),i.i("iu","Inuktitut"),i.i("id","Indonesian"),i.i("ik","Inupiaq"),i.i("is","Icelandic"),i.i("it","Italian"),i.i("jv","Javanese"),i.i("ja","Japanese"),i.i("kn","Kannada"),i.i("ks","Kashmiri"),i.i("ka","Georgian"),i.i("kr","Kanuri"),i.i("kk","Kazakh"),i.i("km","Central Khmer"),i.i("ki","Kikuyu"),i.i("rw","Kinyarwanda"),i.i("ky","Kirghiz"),i.i("kv","Komi"),i.i("kg","Kongo"),i.i("ko","Korean"),i.i("kj","Kuanyama"),i.i("ku","Kurdish"),i.i("lo","Lao"),i.i("la","Latin"),i.i("lv","Latvian"),i.i("ln","Lingala"),i.i("lt","Lithuanian"),i.i("lb","Luxembourgish"),i.i("lu","Luba-Katanga"),i.i("lg","Ganda"),i.i("mk","Macedonian"),i.i("mh","Marshallese"),i.i("ml","Malayalam"),i.i("mi","Maori"),i.i("mr","Marathi"),i.i("ms","Malay"),i.i("mk","Macedonian"),i.i("mg","Malagasy"),i.i("mt","Maltese"),i.i("mn","Mongolian"),i.i("mi","Maori"),i.i("ms","Malay"),i.i("my","Burmese"),i.i("na","Nauru"),i.i("nv","Navajo"),i.i("nr","Ndebele"),i.i("nd","Ndebele"),i.i("ng","Ndonga"),i.i("ne","Nepali"),i.i("nl","Dutch"),i.i("no","Norwegian"),i.i("ny","Chichewa"),i.i("oj","Ojibwa"),i.i("or","Oriya"),i.i("om","Oromo"),i.i("pa","Panjabi"),i.i("fa","Persian"),i.i("pi","Pali"),i.i("pl","Polish"),i.i("pt","Portuguese"),i.i("ps","Pushto"),i.i("qu","Quechua"),i.i("rm","Romansh"),i.i("ro","Romanian"),i.i("rn","Rundi"),i.i("ru","Russian"),i.i("sg","Sango"),i.i("sa","Sanskrit"),i.i("si","Sinhala"),i.i("sk","Slovak"),i.i("sl","Slovenian"),i.i("se","Northern Sami"),i.i("sm","Samoan"),i.i("sn","Shona"),i.i("sd","Sindhi"),i.i("so","Somali"),i.i("st","Sotho"),i.i("es","Spanish"),i.i("sq","Albanian"),i.i("sr","Serbian"),i.i("ss","Swati"),i.i("su","Sundanese"),i.i("sw","Swahili"),i.i("sv","Swedish"),i.i("ty","Tahitian"),i.i("ta","Tamil"),i.i("tt","Tatar"),i.i("te","Telugu"),i.i("tg","Tajik"),i.i("tl","Tagalog"),i.i("th","Thai"),i.i("bo","Tibetan"),i.i("ti","Tigrinya"),i.i("to","Tonga"),i.i("tn","Tswana"),i.i("ts","Tsonga"),i.i("tk","Turkmen"),i.i("tr","Turkish"),i.i("tw","Twi"),i.i("ug","Uighur"),i.i("uk","Ukrainian"),i.i("ur","Urdu"),i.i("uz","Uzbek"),i.i("ve","Venda"),i.i("vi","Vietnamese"),i.i("vo","Volapük"),i.i("cy","Welsh"),i.i("wa","Walloon"),i.i("wo","Wolof"),i.i("xh","Xhosa"),i.i("yi","Yiddish"),i.i("yo","Yoruba"),i.i("za","Zhuang"),i.i("zh","Chinese"),i.i("zu","Zulu")]},i}();i.TravelBUtils=a}(TravelB||(TravelB={}));