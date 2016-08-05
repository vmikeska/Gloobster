var __extends=this&&this.__extends||function(e,t){function i(){this.constructor=e}for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a]);e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)},Views;!function(e){var t=function(t){function i(){t.apply(this,arguments)}return __extends(i,t),i.prototype.initialize=function(t){var i=this;this.createFilesConfig(),this.setFilesCustomConfig(t),this.getTrip(t);var a=new Common.DelayedCallback("nameInput");a.callback=function(e){var t={propertyName:"Name",values:{id:i.trip.tripId,name:e}};i.apiPut("tripProperty",t,function(){})};var r=new Common.DelayedCallback("description");r.callback=function(e){var t={propertyName:"Description",values:{id:i.trip.tripId,description:e}};i.apiPut("tripProperty",t,function(){})};var n=new Common.DelayedCallback("notes");n.callback=function(e){var t={propertyName:"Notes",values:{id:i.trip.tripId,notes:e}};i.apiPut("tripProperty",t,function(){})},$("#public").change(function(e){var t=$(e.target).prop("checked"),a={propertyName:"NotesPublic",values:{id:i.trip.tripId,isPublic:t}};i.apiPut("tripProperty",a,function(){})}),this.tripMenu=new e.TripMenu},i.prototype.createFilesConfig=function(){var e=new Trip.FilesConfig;e.containerId="filesContainer",e.inputId="fileInput",e.templateId="file-template",e.isMasterFile=!0,e.editable=!0,this.files=new Trip.TripFiles(e)},i.prototype.setFilesCustomConfig=function(e){if(this.files.fileUpload){var t=new Common.TripFileCustom;t.tripId=e,this.files.fileUpload.customConfig=t}},i.prototype.getTrip=function(e){var i=this,a=[["id",e]];t.prototype.apiGet.call(this,"trip",a,function(e){return i.onTripLoaded(e)})},i.prototype.onTripLoaded=function(e){this.trip=e,this.files.setFiles(this.trip.files,this.trip.tripId,this.trip.filesPublic),this.planner=new Trip.Planner(this.trip,!0)},i}(e.ViewBase);e.TripDetailView=t}(Views||(Views={}));var Views;!function(e){var t=function(){function t(){this.registerEvents(),this.registerTemplates(),this.container=$(".menuItemContent")}return t.prototype.registerTemplates=function(){this.privacyTemplate=e.ViewBase.currentView.registerTemplate("menuPrivacy-template"),this.shareTemplate=e.ViewBase.currentView.registerTemplate("menuShare-template"),this.participantsTemplate=e.ViewBase.currentView.registerTemplate("participants-template"),this.participantTemplate=e.ViewBase.currentView.registerTemplate("participant-template")},t.prototype.setCode=function(e){var t="";e&&(t="http://gloobster/"+e),$("#sharingCode").val(t)},t.prototype.createPrivacyContent=function(t){var i=$(this.privacyTemplate());i.find("#friendsPublic").prop("checked",t.friendsPublic),i.find("#allowRequestJoin").prop("checked",t.allowToRequestJoin),i.find("#friendsPublic").change(function(i){var a=$(i.target).prop("checked"),r={propertyName:"FriendsPublic",values:{id:t.tripId,state:a}};e.ViewBase.currentView.apiPut("tripProperty",r,function(){t.friendsPublic=a})}),i.find("#allowRequestJoin").change(function(i){var a=$(i.target).prop("checked"),r={propertyName:"AllowToRequestJoin",values:{id:t.tripId,state:a}};e.ViewBase.currentView.apiPut("tripProperty",r,function(){t.allowToRequestJoin=a})}),this.container.html(i)},t.prototype.fillSocStr=function(e,t){t.find("#share").find("span").html(e)},t.prototype.createShareContent=function(){var t=this,i=$(this.shareTemplate()),a=new Common.ShareButtons(i.find("#shareCont"));a.onSelectionChanged=function(e){t.fillSocStr(e,i)},this.fillSocStr(a.getStr(),i),i.find("#share").click(function(){var i=a.getSelectedNetworks(),r={message:$("#message").val(),tripId:e.ViewBase.currentView.trip.tripId,networks:i};t.container.hide();var n=e.ViewBase.currentView,o=new Common.InprogressDialog;o.create(n.t("SharingTrip","jsTrip"));var s=new Common.HintDialog;e.ViewBase.currentView.apiPost("TripSocNetworks",r,function(e){o.remove();var t=""===e;t?s.create(n.t("TripShared","jsTrip")):"HasUnnamed"===e&&s.create(n.t("CannotShareUnnamed","jsTrip"))})}),this.container.html(i)},t.prototype.createParticipantsContent=function(e){var t=this,i=this.participantsTemplate();this.container.html(i),e.participants.forEach(function(e){t.generateOneParticipant(e.name,e.userId,e.isAdmin,e.state)});var a=new Common.UserSearchConfig;a.elementId="friends",a.clearAfterSearch=!0,a.endpoint="FriendsSearch",this.userSearchBox=new Common.UserSearchBox(a),this.userSearchBox.onUserSelected=function(i){t.addUser(e,i)}},t.prototype.isAreadyAdded=function(e,t){var i=_.find(e.participants,function(e){return e.id===t});return null!=i},t.prototype.addUser=function(t,i){var a=this,r=i.friendId,n=this.isAreadyAdded(t,r);if(!n){var o={caption:$("#caption").val(),tripId:t.tripId,users:[r]};e.ViewBase.currentView.apiPost("TripParticipants",o,function(e){a.addOneParticipant(i.displayName,r)})}},t.prototype.generateOneParticipant=function(t,i,a,r){var n=e.ViewBase.currentView.trip,o={name:t,id:i,checked:a?"checked":"",state:this.getTextState(r)},s=$("#participantsTable"),l=$(this.participantTemplate(o));l.find(".del").click(function(t){var i=$(t.target),a=i.data("id"),r=[["tripId",n.tripId],["id",a]];e.ViewBase.currentView.apiDelete("TripParticipants",r,function(e){s.find("#"+a).remove(),n.participants=_.reject(n.participants,function(e){return e.userId===a})})}),l.find(".isAdmin").click(function(t){var i=$(t.target),a=i.data("id"),r=i.prop("checked"),o={tripId:n.tripId,id:a,isAdmin:r};e.ViewBase.currentView.apiPut("TripParticipantsIsAdmin",o,function(e){var t=_.find(n.participants,function(e){return e.userId===a});t.isAdmin=r})}),s.prepend(l)},t.prototype.getTextState=function(t){var i=e.ViewBase.currentView;return t===ParticipantState.Invited?i.t("Invited","jsTrip"):t===ParticipantState.Accepted?i.t("Accepted","jsTrip"):t===ParticipantState.Maybe?i.t("Maybe","jsTrip"):t===ParticipantState.Refused?i.t("Refused","jsTrip"):void 0},t.prototype.addOneParticipant=function(t,i){this.generateOneParticipant(t,i,!1,0);var a=e.ViewBase.currentView.trip,r={isAdmin:!1,name:t,state:0,userId:i};a.participants.push(r)},t.prototype.registerEvents=function(){var e=this,t=$(".tripMenuButton");t.click(function(i){var a=$(i.target);t.not(a).removeClass("popup-open");var r=a.data("tmp");e.displayContent(r)})},t.prototype.displayContent=function(t){this.container.show();var i=e.ViewBase.currentView.trip;"menuPrivacy-template"===t&&this.createPrivacyContent(i),"menuShare-template"===t&&this.createShareContent(),"participants-template"===t&&this.createParticipantsContent(i)},t}();e.TripMenu=t}(Views||(Views={}));var Common;!function(e){var t=function(){function e(e){this.socNetworks=[{type:SocialNetworkType.Facebook,iconName:"facebook"},{type:SocialNetworkType.Twitter,iconName:"twitter"}],this.activeTag='<span class="icon-visited"></span>',this.$owner=e,this.createHtml()}return e.prototype.getSelectedNetworks=function(){var e=this,t=[];return this.$owner.find("div").toArray().forEach(function(i){var a=$(i);e.isActive(a)&&t.push(parseInt(a.data("t")))}),t},e.prototype.createHtml=function(){var e=this,t=!0;this.socNetworks.forEach(function(i){if(Views.ViewBase.currentView.hasSocNetwork(i.type)){var a=e.getItemHtml(t,!0,i.type);e.$owner.append(a),t=!1}})},e.prototype.getByType=function(e){return _.find(this.socNetworks,function(t){return t.type===e})},e.prototype.getItemHtml=function(e,t,i){var a=this,r=e?"":" mleft10",n=this.getByType(i),o=$('<div data-t="'+i+'" class="icon-holder minus"><img class="opacity5 middle'+r+'" src="../../images/share-'+n.iconName+'.png">'+this.activeTag+"</div>");return o.click(function(e){var t=a.isActive(o);if(t){var i=o.find(".icon-visited");i.remove()}else o.append(a.activeTag);if(a.onSelectionChanged){var r=a.getStr();a.onSelectionChanged(r)}}),o},e.prototype.getStr=function(){var e=this.getSelectedNetworks(),t=[];_.contains(e,0)&&t.push("Facebook"),_.contains(e,2)&&t.push("Twitter");var i="("+t.join()+")";return i},e.prototype.isActive=function(e){var t=e.find(".icon-visited");return 1===t.length},e}();e.ShareButtons=t}(Common||(Common={}));var Trip;!function(e){var t=function(){function e(){var e=$("#comment-template").html();this.template=Handlebars.compile(e)}return e.prototype.generateComments=function(){var e=this,t="";return this.comments?(this.comments.forEach(function(i){t+=e.generateComment(i)}),t):""},e.prototype.postComment=function(e){var t=this,i=$("#commentInput"),a=i.val(),r={text:a,tripId:e};Views.ViewBase.currentView.apiPost("tripComment",r,function(e){t.comments=e.comments,t.users=e.users,t.displayComments()}),i.val("")},e.prototype.displayComments=function(){var e=this.generateComments();$("#commentsContainer").html(e)},e.prototype.generateComment=function(e){var t=this.addUserData(e),i=this.template(t);return i},e.prototype.addUserData=function(e){var t=this.getUserById(e.userId),i=Views.ViewBase.currentView.t("Anonymous","jsLayout"),a="/PortalUser/ProfilePicture_s/"+t.id;t&&(i=t.displayName,e.id=t.id);var r=new Date(e.postDate);return e.displayDate=r.getDate()+"."+r.getMonth()+"."+r.getFullYear()+" ("+r.getHours()+":"+r.getMinutes()+")",e.displayName=i,e.photoUrl=a,e},e.prototype.getUserById=function(e){var t=_.find(this.users,function(t){return t.id===e});return t},e}();e.Comments=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function e(){}return e}();e.FilesConfig=t;var i=function(){function e(t,i){var a=this;void 0===i&&(i=null),t.adderTemplate&&(this.fileInputTemplate=Views.ViewBase.currentView.registerTemplate(t.adderTemplate)),this.fileDocumentTemplate=Views.ViewBase.currentView.registerTemplate(t.templateId),t.isMasterFile&&(e.masterFiles=this),this.config=t,this.$mainContainer=$("#"+t.mainContainerId),this.$container=$("#"+t.containerId);var r=$("#deleteFileConfirm");r.unbind(),r.click(function(){a.callDelete(e.lastIdToDelete),$("#popup-delete").hide()}),this.config.editable&&this.registerFileUpload(i),this.v=Views.ViewBase.currentView}return e.prototype.registerFileUpload=function(e){var t=this,i=new Common.FileUploadConfig;i.inputId=this.config.inputId,i.endpoint="TripFile",i.customInputRegistration=!0,this.fileUpload=new Common.FileUpload(i,e),this.fileUpload.onProgressChanged=function(e){t.$mainContainer.find(".upload-droparea").show(),t.$mainContainer.find(".upload-progressbar").show();var i=t.$mainContainer.find(".upload-progressbar");i.show(),t.setUploadProgress(e)},this.fileUpload.onUploadFinished=function(e,i){t.$mainContainer.find(".upload-droparea").hide(),t.$mainContainer.find(".upload-progressbar").hide(),t.setUploadProgress(0),i&&t.filterFiles(i.files,i.filesPublic)}},e.prototype.addAdder=function(){var e=this;this.$adder=$(this.fileInputTemplate({id:this.config.inputId})),this.fileDaD=new Common.FileDaD,this.$container.append(this.$adder),this.fileUpload.$filesInput=this.$adder.find("#"+this.config.inputId),this.fileDaD.onFiles=function(t){e.fileUpload.filesEvent(t)},this.fileDaD.registerComponent(this.config.mainContainerId)},e.prototype.setFiles=function(e,t,i){this.filesPublic=i,this.files=e,this.tripId=t,this.onFilesSet()},e.prototype.onFilesSet=function(){this.generateFiles()},e.prototype.callDelete=function(e){var t=this,i=[["fileId",e],["tripId",this.tripId]];this.v.apiDelete("tripFile",i,function(e){t.filterFiles(e.files,e.filesPublic)})},e.prototype.filterFiles=function(t,i){var a=this;if(t){if(this.filesPublic=i,this.config.entityId){var r=_.filter(t,function(e){return e.entityId===a.config.entityId});this.files=r,this.generateFiles()}else this.files=t,this.generateFiles();e.masterFiles&&!this.config.isMasterFile&&(e.masterFiles.files=t,e.masterFiles.filesPublic=i,e.masterFiles.generateFiles())}},e.prototype.generateFiles=function(){var e=this;this.$container.children().not(this.$adder).remove(),this.files&&this.files.length>0&&($(".fileDocs").show(),this.files.forEach(function(t){var i=t.ownerId===Views.ViewBase.currentUserId,a=e.getFilePublic(t.id),r=i||a.isPublic;if(r){var n={fileName:e.getShortFileName(t.originalFileName),id:t.id,fileType:e.getFileType(t.originalFileName),tripId:e.tripId,editable:e.config.editable,isOwner:i,canManipulate:e.config.editable&&i},o=e.generateFile(n);e.$container.prepend(o)}}),this.$container.find(".delete").click(function(t){t.preventDefault();var i=$(t.target),a=i.data("id"),r=new Common.ConfirmDialog;r.create(e.v.t("DelDialogTitle","jsTrip"),e.v.t("DelDialogBody","jsTrip"),e.v.t("Cancel","jsLayout"),e.v.t("Ok","jsLayout"),function(){e.callDelete(a)})})),this.config.editable&&this.config.addAdder&&!this.$adder&&this.addAdder()},e.prototype.generateFile=function(e){var t=this,i=this.getFilePublic(e.id),a=this.fileDocumentTemplate(e),r=$(a),n=r.find(".filePublic");return n.prop("checked",i.isPublic),this.config.editable&&n.change(function(e){var i=$(e.target),a=i.data("id"),r=i.prop("checked"),n={fileId:a,tripId:t.tripId,state:r};Views.ViewBase.currentView.apiPut("tripFilePublic",n,function(e){var t=$(".filePublic"+a);t.prop("checked",r)})}),r},e.prototype.getFilePublic=function(e){var t=_.find(this.filesPublic,function(t){return t.fileId===e});return t},e.prototype.getFileType=function(e){var t=e.split("."),i=t[t.length-1];if(_.contains(["jpg","jpeg","bmp","png","gif"],i))return"img";if(_.contains(["docx","doc"],i))return"doc";var a=["doc","docx","xml","html","pdf","txt","jpg","jpeg","bmp","png","gif"],r=_.contains(a,i);return r?i:"txt"},e.prototype.getShortFileName=function(e){if(e.length<=13)return e;var t=0,i="";return e.split("").forEach(function(e){i.length>24||(t++,i+=e,10===t&&(i+="-",t=0))}),i},e.prototype.setUploadProgress=function(e){var t=this.$mainContainer.find(".upload-progressbar");t.find(".progress").css("width",e+"%"),t.find("span").text(e+"%")},e}();e.TripFiles=i}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function t(t,i){this.$currentContainer=$("#plannerCont1"),this.lastRowNo=1,this.placesPerRow=3,this.contBaseName="plannerCont",this.emptyName=Views.ViewBase.currentView.t("Unnamed","jsTrip"),this.inverseColor=!1;var a=_.find(t.participants,function(e){return e.userId===Views.ViewBase.currentUserId});this.isInvited=null!=a,this.isOwner=t.ownerId===Views.ViewBase.currentUserId,this.editable=i,this.dialogManager=new e.DialogManager(this),this.placeDialog=new e.PlaceDialog(this.dialogManager),this.travelDialog=new e.TravelDialog(this.dialogManager),this.trip=t,this.registerTemplates(),this.placesMgr=new e.PlacesManager(t.id),this.placesMgr.setData(t.travels,t.places),this.redrawAll()}return t.prototype.redrawAll=function(){var e=this,t=_.sortBy(this.placesMgr.places,"orderNo"),i=0;t.forEach(function(t){if(i++,e.manageRows(i),e.addPlace(t,e.inverseColor),t.leaving){var a=t.leaving;e.addTravel(a,e.inverseColor)}e.inverseColor=!e.inverseColor}),this.editable&&this.addAdder()},t.prototype.manageRows=function(e){var t=Math.floor(e/this.placesPerRow),i=e%this.placesPerRow;i>0&&t++,t>this.lastRowNo&&this.addRowContainer(),t<this.lastRowNo&&this.removeRowContainer(),this.$lastCell&&this.refreshAdder()},t.prototype.removeRowContainer=function(){var e=this.contBaseName+this.lastRowNo;$("#"+e).remove(),this.lastRowNo=this.lastRowNo-1;var t=this.contBaseName+this.lastRowNo;this.$currentContainer=$("#"+t)},t.prototype.addRowContainer=function(){var e=this.lastRowNo+1,t=this.contBaseName+e,i='<div id="'+t+'" class="daybyday table margin"></div>',a=$(i);this.$currentContainer.after(a),this.$currentContainer=a,this.lastRowNo=e},t.prototype.addAdder=function(){var e=this,t=this.addPlaceTemplate();this.$currentContainer.append(t),this.$adder=$("#addPlace"),this.$lastCell=$("#lastCell"),this.$adder.click(function(t){t.preventDefault(),e.addEnd()})},t.prototype.refreshAdder=function(){this.$lastCell.remove(),this.addAdder()},t.prototype.registerTemplates=function(){this.addPlaceTemplate=Views.ViewBase.currentView.registerTemplate("addPlace-template"),this.travelTemplate=Views.ViewBase.currentView.registerTemplate("travel-template"),this.placeTemplate=Views.ViewBase.currentView.registerTemplate("place-template")},t.prototype.addEnd=function(){var e=this;this.dialogManager.closeDialog(),this.dialogManager.deactivate();var t=this.placesMgr.getLastPlace(),i={selectorId:t.id,position:NewPlacePosition.ToRight,tripId:this.trip.tripId};Views.ViewBase.currentView.apiPost("tripPlanner",i,function(i){var a=e.placesMgr.mapTravel(i.travel,t,null);t.leaving=a,e.placesMgr.travels.push(a);var r=e.placesMgr.mapPlace(i.place,a,null);a.to=r,e.placesMgr.places.push(r),e.manageRows(e.placesMgr.places.length),e.updateRibbonDate(t.id,"leavingDate",a.leavingDateTime),e.addTravel(a,!e.inverseColor),e.addPlace(r,e.inverseColor),e.inverseColor=!e.inverseColor,e.dialogManager.selectedId=i.place.id})},t.prototype.updateRibbonDate=function(e,t,i){$("#"+e).find("."+t).text(this.formatShortDateTime(i))},t.prototype.getTravelIcon=function(e){switch(e){case TravelType.Bus:return"icon-car";case TravelType.Car:return"icon-car";case TravelType.Plane:return"icon-plane";case TravelType.Ship:return"icon-boat";case TravelType.Walk:return"icon-walk";case TravelType.Bike:return"icon-bike";case TravelType.Train:return"icon-train";default:return""}},t.prototype.regDateLinks=function(e){var t=this;e.find(".dateLink").click(function(e){e.preventDefault();var i=$(e.target),a=i.closest(".placeCont").attr("id");t.setActivePlaceOrTravel(a)})},t.prototype.addTravel=function(e,t){var i=this,a={id:e.id,icon:this.getTravelIcon(e.type),colorClass:""};t?a.colorClass="":a.colorClass="green";var r=this.travelTemplate(a),n=$(r);n.find(".transport").click("*",function(e){var t=$(e.delegateTarget),a=t.closest(".travelCont").attr("id");i.setActivePlaceOrTravel(a)}),this.appendToTimeline(n)},t.prototype.appendToTimeline=function(e){this.$adder?this.$lastCell.before(e):this.$currentContainer.append(e)},t.prototype.setActivePlaceOrTravel=function(e){this.dialogManager.deactivate();var t,i,a=$("#"+e),r=a.hasClass("placeCont");r?(i=this.placeDialog,t=a.find(".destination")):(i=this.travelDialog,t=a.find(".transport"),t.append($('<span class="tab"></span>'))),t.addClass("active"),this.dialogManager.selectedId=e,i.display()},t.prototype.addPlace=function(e,t){var i=this,a=this.emptyName;e.place&&(a=e.place.selectedName);var r={id:e.id,isActive:!1,name:a,arrivingDate:"",leavingDate:"",arrivalDateLong:"",rowNo:this.lastRowNo,isFirstDay:null==e.arriving,colorClassArriving:"",colorClassLeaving:"",arrivingId:"",leavingId:""};if(null!=e.arriving){var n=e.arriving.arrivingDateTime;r.arrivingDate=this.formatShortDateTime(n),r.arrivalDateLong=this.formatShortDateTime(n)+(""+n.getUTCFullYear()),r.arrivingId=e.arriving.id}if(null!=e.leaving){var o=e.leaving.leavingDateTime;r.leavingDate=this.formatShortDateTime(o),r.leavingId=e.leaving.id}t?(r.colorClassArriving="green",r.colorClassLeaving=""):(r.colorClassArriving="",r.colorClassLeaving="green");var s=this.placeTemplate(r),l=$(s);this.regDateLinks(l),l.find(".destination").click("*",function(e){var t=$(e.delegateTarget),a=t.closest(".placeCont").attr("id");i.setActivePlaceOrTravel(a)}),this.appendToTimeline(l)},t.prototype.formatShortDateTime=function(e){var t=moment.utc(e).format("l"),i=t.replace(e.getUTCFullYear(),"");return i},t}();e.Planner=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function t(e,t){this.mainTmp=Views.ViewBase.currentView.registerTemplate("placeTravelTime-template"),this.dialogManager=e,this.data=t}return t.prototype.create=function(e){var t=this,i={};if(e===TripEntityType.Travel){i={infoTxt:"How long takes the travel?",dir1:"leaving",dir2:"arriving",showLeft:!0,showMiddle:!0,showRight:!0},this.$html=$(this.mainTmp(i));var a=this.dialogManager.planner.placesMgr.getTravelById(this.data.id);this.initDatePicker("leavingDate",this.data.leavingDateTime,function(e,i){t.updateDateTime(e,null,"leavingDateTime");var r=a.to.id;t.ribbonUpdate(r,i,"arrivingDate")}),this.initDatePicker("arrivingDate",this.data.arrivingDateTime,function(e,i){t.updateDateTime(e,null,"arrivingDateTime");var r=a.from.id;t.ribbonUpdate(r,i,"leavingDate")}),this.initTimePicker("arrivingHours","arrivingMinutes","arrivingDateTime",this.data.arrivingDateTime),this.initTimePicker("leavingHours","leavingMinutes","leavingDateTime",this.data.leavingDateTime)}if(e===TripEntityType.Place){var r=null!=this.data.arrivingDateTime,n=null!=this.data.leavingDateTime,o=r&&n,s=this.getInfoText(o,r,n);i={infoTxt:s,dir1:"arriving",dir2:"leaving",showLeft:r,showMiddle:o,showRight:n},this.$html=$(this.mainTmp(i)),n&&(this.initDatePicker("leavingDate",this.data.leavingDateTime,function(e,i){t.updateDateTime(e,null,"leavingDateTime",t.data.leavingId),t.ribbonUpdate(t.data.id,i,"leavingDate")}),this.initTimePicker("leavingHours","leavingMinutes","leavingDateTime",this.data.leavingDateTime,this.data.leavingId)),r&&(this.initDatePicker("arrivingDate",this.data.arrivingDateTime,function(e,i){t.updateDateTime(e,null,"arrivingDateTime",t.data.arrivingId),t.ribbonUpdate(t.data.id,i,"arrivingDate")}),this.initTimePicker("arrivingHours","arrivingMinutes","arrivingDateTime",this.data.arrivingDateTime,this.data.arrivingId))}return this.setUseTime(e),this.$html},t.prototype.setUseTime=function(e){var t=this,i=this.$html.find("#timeVis");i.prop("checked",this.data.useTime),this.visibilityTime(this.data.useTime),i.change(function(a){var r=i.prop("checked"),n=t.dialogManager.getPropRequest("useTime",{state:r,entityType:e});t.dialogManager.updateProp(n,function(e){}),t.visibilityTime(r)})},t.prototype.getInfoText=function(e,t,i){var a="";return e?a="How long are you staying?":t?a="When do you arrive?":i&&(a="When do you start your journey?"),a},t.prototype.visibilityTime=function(e){var t=this.$html.find(".time");e?t.show():t.hide()},t.prototype.initTimePicker=function(t,i,a,r,n){var o=this;void 0===n&&(n=null);var s=this.$html.find("#"+t),l=this.$html.find("#"+i);if(r){var c=e.Utils.dateStringToUtcDate(r);s.val(c.getHours()),l.val(c.getMinutes())}var p=new Common.DelayedCallback(s);p.callback=function(){o.onTimeChanged(s,l,a,n)},s.change(function(){o.onTimeChanged(s,l,a,n)});var d=new Common.DelayedCallback(l);d.callback=function(){o.onTimeChanged(s,l,a,n)},l.change(function(){o.onTimeChanged(s,l,a,n)})},t.prototype.initDatePicker=function(t,i,a){var r=this,n=this.datePickerConfig(),o=this.$html.find("#"+t);if(o.datepicker(n),i){var s=e.Utils.dateStringToUtcDate(i);o.datepicker("setDate",s)}o.change(function(e){var t=$(e.target),i=t.datepicker("getDate"),n=r.getDatePrms(i);a(n,i)})},t.prototype.ribbonUpdate=function(t,i,a){var r=e.Utils.dateToUtcDate(i);this.dialogManager.planner.updateRibbonDate(t,a,r)},t.prototype.getDatePrms=function(e){var t={year:e.getUTCFullYear(),month:e.getUTCMonth()+1,day:e.getUTCDate()+1};return 32===t.day&&(t.day=1,t.month=t.month+1),t},t.prototype.updateDateTime=function(e,t,i,a){void 0===a&&(a=null);var r={};e&&(r=$.extend(r,e)),t&&(r=$.extend(r,t));var n=this.dialogManager.getPropRequest(i,r);null!=a&&(n.values.entityId=a),this.dialogManager.updateProp(n,function(e){})},t.prototype.onTimeChanged=function(e,t,i,a){void 0===a&&(a=null);var r=e.val();""===r&&(r="0");var n=t.val();""===n&&(n="0");var o={hour:r,minute:n};this.updateDateTime(null,o,i,a)},t.prototype.datePickerConfig=function(){return{}},t}();e.PlaceTravelTime=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function t(e){this.planner=e,this.placeDetailTemplate=Views.ViewBase.currentView.registerTemplate("placeDetail-template"),this.placeDetailViewTemplate=Views.ViewBase.currentView.registerTemplate("placeDetailView-template"),this.travelDetailTemplate=Views.ViewBase.currentView.registerTemplate("travelDetail-template"),this.travelDetailViewTemplate=Views.ViewBase.currentView.registerTemplate("travelDetailView-template"),this.visitedItemTemplate=Views.ViewBase.currentView.registerTemplate("visitItem-template"),this.travelDetailViewFriends=Views.ViewBase.currentView.registerTemplate("travelDetailViewFriends-template"),this.placeDetailViewFriends=Views.ViewBase.currentView.registerTemplate("placeDetailViewFriends-template")}return t.prototype.createFilesInstanceView=function(t,i){var a=new e.FilesConfig;a.containerId="entityDocs",a.templateId="fileView-template",a.editable=!1,a.addAdder=!1,a.entityId=t;var r=new e.TripFiles(a);return r},t.prototype.createFilesInstance=function(t,i){var a=new e.FilesConfig;a.mainContainerId="dialogUpload",a.containerId="entityDocs",a.inputId="entityFileInput",a.templateId="fileItem-template",a.editable=!0,a.addAdder=!0,a.adderTemplate="fileCreate-template",a.entityId=t;var r=new Common.TripFileCustom;r.tripId=this.planner.trip.tripId,r.entityId=t,r.entityType=i;var n=new e.TripFiles(a,r);return n},t.prototype.initDescription=function(e,t){var i=this;$("#dialogDescription").val(e);var a=new Common.DelayedCallback("dialogDescription");a.callback=function(e){var a=i.getPropRequest("description",{entityType:t,description:e});i.updateProp(a,function(e){})}},t.prototype.getDialogData=function(e,t){var i=[["dialogType",e],["tripId",this.planner.trip.tripId],["id",this.selectedId]];Views.ViewBase.currentView.apiGet("TripPlannerProperty",i,function(e){t(e)})},t.prototype.closeDialog=function(){$(".daybyday-form").remove(),$(".daybyday-view").remove()},t.prototype.regClose=function(e){var t=this;e.find(".close").click(function(e){e.preventDefault(),t.closeDialog(),t.deactivate()})},t.prototype.deactivate=function(){$(".destination.active").removeClass("active");var e=$(".transport.active");e.removeClass("active"),e.find(".tab").remove()},t.prototype.getPropRequest=function(e,t){var i={propertyName:e,values:{tripId:this.planner.trip.tripId,entityId:this.selectedId}};return i.values=$.extend(i.values,t),i},t.prototype.updateProp=function(e,t){Views.ViewBase.currentView.apiPut("tripPlannerProperty",e,function(e){return t(e)})},t}();e.DialogManager=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function t(e){this.dialogManager=e}return t.prototype.display=function(){var e=this;this.dialogManager.closeDialog(),this.dialogManager.getDialogData(TripEntityType.Place,function(t){e.$rowCont=$("#"+t.id).parent(),e.dialogManager.planner.editable?e.createEdit(t):e.createView(t)})},t.prototype.createView=function(e){this.buildTemplateView(this.$rowCont,e),this.files=this.dialogManager.createFilesInstanceView(e.id,TripEntityType.Place),this.files.setFiles(e.files,this.dialogManager.planner.trip.tripId,e.filesPublic)},t.prototype.createEdit=function(e){var t=this;this.buildTemplateEdit(this.$rowCont,e),this.createNameSearch(e),$("#stayAddress").val(e.addressText),this.createAddressSearch(e),this.regAddressText(),this.createPlaceToVisitSearch(e),this.dialogManager.initDescription(e.description,TripEntityType.Place),e.wantVisit&&e.wantVisit.forEach(function(e){t.addPlaceToVisit(e.id,e.selectedName,e.sourceType,e.sourceId)}),this.files=this.dialogManager.createFilesInstance(e.id,TripEntityType.Place),this.files.setFiles(e.files,this.dialogManager.planner.trip.tripId,e.filesPublic)},t.prototype.createNameSearch=function(e){var t=this,i=new Common.PlaceSearchConfig;i.providers="0,1,2,3,4",i.elementId="cities",i.minCharsToSearch=1,i.clearAfterSearch=!1,i.customSelectedFormat=function(e){return t.placeNameCustom(e)},this.placeSearch=new Common.PlaceSearchBox(i),this.placeSearch.onPlaceSelected=function(e,i){return t.onPlaceSelected(e,i)},e.place&&this.placeSearch.setText(e.place.selectedName)},t.prototype.placeNameCustom=function(e){var t="",i=_.contains([SourceType.FB,SourceType.S4,SourceType.Yelp],e.SourceType);return i&&(t=""+this.takeMaxChars(e.Name,19)),e.SourceType===SourceType.Country&&(t=e.CountryCode),e.SourceType===SourceType.City&&(t=this.takeMaxChars(e.City,19)+", "+e.CountryCode),t},t.prototype.takeMaxChars=function(e,t){return e.length<=t?e:e.substring(0,t-1)+"."},t.prototype.createPlaceToVisitSearch=function(e){var t=this,i=new Common.PlaceSearchConfig;i.providers="1,0,4",i.elementId="placeToVisit",i.minCharsToSearch=1,i.clearAfterSearch=!0,this.placeToVisitSearch=new Common.PlaceSearchBox(i),this.placeToVisitSearch.onPlaceSelected=function(e,i){return t.onPlaceToVisitSelected(e,i)},e.place&&e.place.coordinates&&this.placeToVisitSearch.setCoordinates(e.place.coordinates.Lat,e.place.coordinates.Lng)},t.prototype.createAddressSearch=function(e){var t=this,i=new Common.PlaceSearchConfig;i.providers="1,0,4",i.elementId="stayPlace",i.minCharsToSearch=1,i.clearAfterSearch=!1,i.customSelectedFormat=function(e){return e.Name},this.addressSearch=new Common.PlaceSearchBox(i),this.addressSearch.onPlaceSelected=function(e,i){return t.onAddressSelected(e,i)};var a="";e.address&&(a=e.address.selectedName),this.addressSearch.setText(a),e.place&&e.place.coordinates&&this.addressSearch.setCoordinates(e.place.coordinates.Lat,e.place.coordinates.Lng)},t.prototype.regAddressText=function(){var e=this,t=new Common.DelayedCallback("stayAddress");t.callback=function(t){var i=e.dialogManager.getPropRequest("addressText",{text:t});e.dialogManager.updateProp(i,function(e){})}},t.prototype.buildTemplateView=function(e,t){var i=this,a="",r={name:Views.ViewBase.currentView.t("Unnamed","jsTrip"),wantVisit:[],hasNoWantVisit:!0};if(r.wantVisit=_.map(t.wantVisit,function(e){return{name:e.selectedName,icon:i.getIcon(e.sourceType),link:i.getSocLink(e.sourceType,e.sourceId)}}),r.hasNoWantVisit=0===r.wantVisit.length,t.place&&(r.name=t.place.selectedName),this.dialogManager.planner.isInvited||this.dialogManager.planner.isOwner){var n="";t.address&&(n=t.address.selectedName),r=$.extend(r,{stayAddress:t.addressText,description:t.description,stayName:n}),t.address&&(r=$.extend(r,{stayIco:this.getIcon(t.address.sourceType),stayLink:this.getSocLink(t.address.sourceType,t.address.sourceId),hasAddress:!0})),a=this.dialogManager.placeDetailViewTemplate(r)}else a=this.dialogManager.placeDetailViewFriends(r);var o=$(a);this.dialogManager.regClose(o),e.after(o)},t.prototype.getSocLink=function(e,t){var i="";return e===SourceType.FB&&(i="http://facebook.com/"+t),e===SourceType.S4&&(i="http://foursquare.com/v/"+t),e===SourceType.Yelp&&(i="http://www.yelp.com/biz/"+t),i},t.prototype.buildTemplateEdit=function(t,i){var a=this,r={showDelButton:i.isLastPlace&&i.placesCount>2},n=$(this.dialogManager.placeDetailTemplate(r)),o=new e.PlaceTravelTime(this.dialogManager,i),s=o.create(TripEntityType.Place);n.find(".the-first").after(s),n.find(".delete").click(function(e){e.preventDefault();var t=Views.ViewBase.currentView,r=new Common.ConfirmDialog;r.create(t.t("PlaceRemovelDialogTitle","jsTrip"),t.t("PlaceRemovelDialogBody","jsTrip"),t.t("Cancel","jsLayout"),t.t("Delete","jsLayout"),function(){Views.ViewBase.currentView.apiDelete("TripPlanner",[["tripId",i.tripId]],function(e){a.deletePlace(e.placeId,e.travelId)})})}),this.dialogManager.regClose(n),t.after(n)},t.prototype.deletePlace=function(e,t){$("#"+e).remove(),$("#"+t).remove(),this.dialogManager.closeDialog();var i=this.dialogManager.planner.placesMgr;i.removePlaceById(e),i.removeTravelById(t),this.dialogManager.planner.manageRows(i.places.length)},t.prototype.onPlaceToVisitSelected=function(e,t){var i=this,a=this.dialogManager.getPropRequest("placeToVisit",{sourceId:e.SourceId,sourceType:e.SourceType,selectedName:t.Name});this.dialogManager.updateProp(a,function(a){var r=a.Result;i.addPlaceToVisit(r,t.Name,e.SourceType,e.SourceId)})},t.prototype.onAddressSelected=function(e,t){$("#stayAddress").val(t.Address);var i=this.dialogManager.getPropRequest("address",{sourceId:e.SourceId,sourceType:e.SourceType,selectedName:t.Name,address:t.Address,lat:t.Coordinates.Lat,lng:t.Coordinates.Lng});this.dialogManager.updateProp(i,function(e){})},t.prototype.onPlaceSelected=function(e,t){$(".active .name").text(this.placeSearch.lastText);var i=this.dialogManager.getPropRequest("place",{sourceId:e.SourceId,sourceType:e.SourceType,selectedName:this.placeSearch.lastText}),a=t.Coordinates;a&&(this.addressSearch.setCoordinates(a.Lat,a.Lng),this.placeToVisitSearch.setCoordinates(a.Lat,a.Lng),i.values.lat=a.Lat,i.values.lng=a.Lng),this.dialogManager.updateProp(i,function(e){})},t.prototype.addPlaceToVisit=function(e,t,i,a){var r=this,n=this.getIcon(i),o={
id:e,icon:n,name:this.takeMaxChars(t,33),link:this.getSocLink(i,a)},s=this.dialogManager.visitedItemTemplate(o),l=$(s);l.find(".delete").click(function(e){e.preventDefault();var t=$(e.target),i=r.dialogManager.getPropRequest("placeToVisitRemove",{id:t.parent().data("id")});r.dialogManager.updateProp(i,function(e){}),l.remove()}),$("#placeToVisit").before(l)},t.prototype.getIcon=function(e){switch(e){case SourceType.FB:return"icon-facebook";case SourceType.S4:return"icon-foursquare";case SourceType.Yelp:return"icon-yelp"}return""},t}();e.PlaceDialog=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function e(){this.clearAfterSelection=!1}return e}();e.AirportComboConfig=t;var i=function(){function e(e,i){void 0===i&&(i=new t),this.limit=10,this.config=i,this.$combo=$("#"+e),this.$cont=this.$combo.find("ul"),this.$input=this.$combo.find("input"),this.registerInput(),this.registerInOut()}return e.prototype.setText=function(e){this.lastText=e,this.$input.val(e)},e.prototype.registerInOut=function(){var e=this;this.$input.focus(function(e){$(e.target).val("")}),this.$input.focusout(function(){e.setText(e.lastText)})},e.prototype.registerInput=function(){var e=this,t=new Common.DelayedCallback(this.$input);t.callback=function(t){var i=[["query",t],["limit",e.limit]];Views.ViewBase.currentView.apiGet("airport",i,function(t){return e.onResult(t)})}},e.prototype.onResult=function(e){this.displayResults(e)},e.prototype.displayResults=function(e){var t=this;e&&(this.$cont.html(""),e.forEach(function(e){var i=t.getItemHtml(e);t.$cont.append(i)}),this.registerClick())},e.prototype.registerClick=function(){var e=this;this.$cont.find("li").click(function(t){var i=$(t.target);e.onClick(i)})},e.prototype.onClick=function(e){var t=e.data("value"),i=e.data("id");this.config.clearAfterSelection?this.$input.val(""):this.$input.val(t),this.$cont.html("");var a={id:i,name:t};this.onSelected(a)},e.prototype.getItemHtml=function(e){var t=e.iataFaa;""===t&&(t=e.icao);var i=e.name+" ("+e.city+")",a=e.city+" ("+t+")";return'<li data-value="'+a+'" data-id="'+e.id+'">'+i+'<span class="color2">� '+t+"</span></li>"},e}();e.AirportCombo=i}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function t(e){this.dialogManager=e}return t.prototype.display=function(){var e=this;this.dialogManager.closeDialog(),this.dialogManager.getDialogData(TripEntityType.Travel,function(t){e.data=t,e.$rowCont=$("#"+t.id).parent(),e.dialogManager.planner.editable?e.createEdit(t):e.createView(t)})},t.prototype.createView=function(e){this.buildTemplateView(e),this.files=this.dialogManager.createFilesInstanceView(e.id,TripEntityType.Travel),this.files.setFiles(e.files,this.dialogManager.planner.trip.tripId,e.filesPublic)},t.prototype.extendContextForFlight=function(e,t){e.isFlight=!0;var i={from:"",to:"",flightDetails:"-"};t.flightFrom&&(i.from=t.flightFrom.selectedName),t.flightTo&&(i.to=t.flightTo.selectedName);var a=$.extend(e,i);return a},t.prototype.formatDate=function(e,t){var i=t?"LLL":"LL",a=moment.utc(e).format(i);return a},t.prototype.buildTemplateView=function(e){var t="",i=new Date(e.leavingDateTime),a=new Date(e.arrivingDateTime);if(this.dialogManager.planner.isInvited||this.dialogManager.planner.isOwner){var r={arrivingDateTime:this.formatDate(i,e.useTime),leavingDateTime:this.formatDate(a,e.useTime),description:e.description,isFlight:!1};e.type===TravelType.Plane&&(r=this.extendContextForFlight(r,e)),t=this.dialogManager.travelDetailViewTemplate(r)}else{var n={arrivingDateTime:this.formatDate(i,e.useTime),leavingDateTime:this.formatDate(a,e.useTime),isFlight:!1};e.type===TravelType.Plane&&(n=this.extendContextForFlight(n,e)),t=this.dialogManager.travelDetailViewFriends(n)}var o=$(t);this.dialogManager.regClose(o),this.$rowCont.after(o)},t.prototype.createEdit=function(e){this.buildTemplateEdit(this.$rowCont,e),this.initTravelType(e.type),this.dialogManager.initDescription(e.description,TripEntityType.Travel),this.files=this.dialogManager.createFilesInstance(e.id,TripEntityType.Travel),this.files.setFiles(e.files,this.dialogManager.planner.trip.tripId,e.filesPublic),this.initAirport(e.flightFrom,"airportFrom","flightFrom"),this.initAirport(e.flightTo,"airportTo","flightTo")},t.prototype.initAirport=function(t,i,a){var r=this,n=new e.AirportCombo(i);n.onSelected=function(e){var t=r.dialogManager.getPropRequest(a,{id:e.id,name:e.name});r.dialogManager.updateProp(t,function(e){})},t&&n.setText(t.selectedName)},t.prototype.initTravelType=function(e){var t=this;this.showHideTravelDetails(e);var i=$("#travelType"),a=i.find("input");a.val(e);var r=i.find("li[data-value='"+e+"']"),n=r.data("cls"),o=r.data("cap");i.find(".selected").html('<span class="'+n+' black left mright5"></span>'+o),a.change(function(e){var r=parseInt(a.val());t.showHideTravelDetails(r);var n=t.dialogManager.getPropRequest("travelType",{travelType:r});t.dialogManager.updateProp(n,function(e){var t=i.find("li[data-value='"+r+"']"),a=t.data("cls");$(".active").children().first().attr("class",a)})})},t.prototype.showHideTravelDetails=function(e){var t=$("#flightDetails");t.hide(),e===TravelType.Plane&&t.show()},t.prototype.buildTemplateEdit=function(t,i){var a=$(this.dialogManager.travelDetailTemplate()),r=new e.PlaceTravelTime(this.dialogManager,i),n=r.create(TripEntityType.Travel);a.find(".the-first").after(n),Common.DropDown.registerDropDown(a.find(".dropdown")),this.dialogManager.regClose(a),t.after(a)},t}();e.TravelDialog=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function e(){}return e.dateStringToUtcDate=function(e){var t=new Date(Date.parse(e)),i=6e4*t.getTimezoneOffset(),a=new Date(t.getTime()+i);return a},e.dateToUtcDate=function(e){var t=6e4*e.getTimezoneOffset(),i=new Date(e.getTime()-t),a=new Date(Date.UTC(i.getUTCFullYear(),i.getUTCMonth(),i.getUTCDate()));return a},e}();e.Utils=t}(Trip||(Trip={}));var Trip;!function(e){var t=function(){function e(){}return e}();e.Place=t;var i=function(){function e(){}return e}();e.PlaceLocation=i;var a=function(){function e(){}return e}();e.Travel=a;var r=function(){function i(e){this.places=[],this.travels=[],this.tripId=e}return i.prototype.removePlaceById=function(e){this.places=_.reject(this.places,function(t){return t.id===e})},i.prototype.removeTravelById=function(e){this.travels=_.reject(this.travels,function(t){return t.id===e})},i.prototype.mapTravel=function(t,i,r){var n=new a;return n.id=t.id,n.type=t.type,n.arrivingDateTime=e.Utils.dateStringToUtcDate(t.arrivingDateTime),n.leavingDateTime=e.Utils.dateStringToUtcDate(t.leavingDateTime),n.from=i,n.to=r,n},i.prototype.mapPlace=function(e,i,a){var r=new t;return r.id=e.id,r.orderNo=e.orderNo,r.place=e.place,r.arriving=i,r.leaving=a,r},i.prototype.setData=function(e,t){var i=this;t.forEach(function(t){var a=i.mapPlace(t,null,null);t.arrivingId!==Constants.emptyId&&(a.arriving=i.getOrCreateTravelById(t.arrivingId,e),a.arriving.to=a),t.leavingId!==Constants.emptyId&&(a.leaving=i.getOrCreateTravelById(t.leavingId,e),a.leaving.from=a),i.places.push(a)})},i.prototype.getOrCreateTravelById=function(e,t){var i=_.find(this.travels,function(t){return t.id===e});if(i)return i;var a=_.find(t,function(t){return t.id===e}),r=this.mapTravel(a,null,null);return this.travels.push(r),r},i.prototype.getTravelById=function(e){return _.find(this.travels,function(t){return t.id===e})},i.prototype.getLastPlace=function(){var e=_.max(this.places,function(e){return e.orderNo});return e},i}();e.PlacesManager=r}(Trip||(Trip={}));