var Views;!function(e){var n=function(){function n(){}return n.registerLocationCombo=function(n,r){void 0===r&&(r=null);var t=new Common.PlaceSearchConfig;t.providers="2",t.minCharsToSearch=1,t.clearAfterSearch=!1,t.selOjb=n;var a=new Common.PlaceSearchBox(t);return n.change(function(n,t,a){var i={gid:a.SourceId};e.ViewBase.currentView.apiPut("DealsCurrentLocation",i,function(e){r(a)})}),a},n}();e.AirLoc=n}(Views||(Views={}));var __extends=this&&this.__extends||function(e,n){function r(){this.constructor=e}for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t]);e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)},Views;!function(e){var n=function(n){function r(){n.call(this),e.AirLoc.registerLocationCombo($("#currentCity"),function(e){window.location.href="/deals"})}return __extends(r,n),Object.defineProperty(r.prototype,"pageType",{get:function(){return PageType.HomePage},enumerable:!0,configurable:!0}),r}(e.ViewBase);e.HomePageView=n}(Views||(Views={}));var Views;!function(e){var n=function(){function n(){}return n.yearValidation=function(e){return 4!==e.length?!1:null!==Common.F.tryParseInt(e)},n.registerAvatarFileUpload=function(e,n){void 0===n&&(n=null);var r=new Common.FileUploadConfig;r.inputId=e,r.endpoint="UploadAvatar",r.maxFileSize=55e5,r.useMaxSizeValidation=!1;var t=new Common.FileUpload(r);t.onProgressChanged=function(e){$("#progressBar").text(e)},t.onUploadFinished=function(r){var t=new Date;$("#avatar").attr("src","/PortalUser/ProfilePicture?d="+t.getTime()),$("#"+e).data("valid",!0),n&&n()}},n.registerEdit=function(e,n,r,t){var a=this;void 0===t&&(t=null);var i=$("#"+e),o=new Common.DelayedCallback(e);o.callback=function(e){"number"===i.attr("type")&&(e=Common.F.tryParseInt(e));var o=r(e);a.callServer(n,o,t)}},n.registerCombo=function(n,r){var t=$("#"+n),a=t.find("input");a.change(function(n){var t=a.val(),i=r(t);e.ViewBase.currentView.apiPut("UserProperty",i,function(){})})},n.callServer=function(n,r,t){void 0===t&&(t=null);var a={propertyName:n,values:r};e.ViewBase.currentView.apiPut("UserProperty",a,function(){t&&t()})},n.registerLocationCombo=function(e,n,r){var t=this;void 0===r&&(r=null);var a=this.getLocationBaseConfig();a.selOjb=e;var i=new Common.PlaceSearchBox(a);return e.change(function(e,a){t.callServer(n,{sourceId:a.SourceId,sourceType:a.SourceType},r)}),i},n.initInterests=function(r,t){var a=new TravelB.CategoryTagger;a.onFilterChange=function(e,r){var t=e?"ADD":"DEL";n.callServer("Inters",{value:r,action:t},function(){})};var i=TravelB.TravelBUtils.getInterestsTaggerData(),o=e.ViewBase.currentView;a.create(r,"inters",i,o.t("PickCharacteristics","jsUserSettings")),a.initData(t)},n.initLangsTagger=function(e,n){var r=this;void 0===n&&(n=null);var t=TravelB.TravelBUtils.langsDB(),a=_.map(t,function(e){return{text:e.text,value:e.id,kind:"l"}}),i=new Planning.TaggingFieldConfig;i.containerId="langsTagging",i.localValues=!0,i.itemsRange=a,n&&(i.placeholder=n);var o=new Planning.TaggingField(i);o.onItemClickedCustom=function(e,n){var t=e.data("vl");r.callServer("Langs",{value:t,action:"ADD"},n)},o.onDeleteCustom=function(e,n){r.callServer("Langs",{value:e,action:"DEL"},n)};var c=_.map(e,function(e){return{value:e,kind:"l"}});return o.setSelectedItems(c),o},n.getLocationBaseConfig=function(){var e=new Common.PlaceSearchConfig;return e.providers="2",e.minCharsToSearch=1,e.clearAfterSearch=!1,e},n}();e.SettingsUtils=n}(Views||(Views={}));