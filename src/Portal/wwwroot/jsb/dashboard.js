var __extends=this&&this.__extends||function(t,i){function s(){this.constructor=t}for(var e in i)i.hasOwnProperty(e)&&(t[e]=i[e]);t.prototype=null===i?Object.create(i):(s.prototype=i.prototype,new s)},Views;!function(t){var i=function(t){function i(){t.call(this),this.blocksCnt=0,this.lastWidth=0,this.init()}return __extends(i,t),i.prototype.init=function(){this.initTabs(),this.initResize()},i.prototype.initTabs=function(){var t=this;this.tabs=new Common.Tabs($("#menuCont"),"main"),this.tabs.initCall=!1,this.tabs.onBeforeSwitch=function(){};var i={id:"tabFriends",text:"Friend's feed",cls:"hidden"};this.tabs.addTabConf(i,function(){t.setConts(t.$tbFriends)});var s={id:"tabPortal",text:"Portal feed",cls:"hidden"};this.tabs.addTabConf(s,function(){t.setConts(t.$tbPortal)});var e={id:"tabWebNavi",text:"Web navigation",cls:"hidden"};this.tabs.addTabConf(e,function(){t.setConts(t.$tbWebNavi)}),this.tabs.create(),this.$tbFriends=$(".tb-friends"),this.$tbPortal=$(".tb-portal"),this.$tbWebNavi=$(".tb-web"),this.$tabFriends=$("#tabFriends").parent(),this.$tabPortal=$("#tabPortal").parent(),this.$tabWebNavi=$("#tabWebNavi").parent()},i.prototype.initResize=function(){var t=this;$(window).resize(function(){t.resize()}),this.resize()},i.prototype.resize=function(){var t=$(window).width();this.setPage(t)},i.prototype.setPage=function(t){if(this.lastWidth!==t){this.lastWidth=t,console.log(t);var i=1100,s=750;this.$tbFriends.addClass("hidden"),this.$tbPortal.addClass("hidden"),this.$tbWebNavi.addClass("hidden"),this.$tabFriends.addClass("hidden"),this.$tabPortal.addClass("hidden"),this.$tabWebNavi.addClass("hidden"),t>i?(this.$tbFriends.removeClass("hidden"),this.$tbPortal.removeClass("hidden"),this.$tbWebNavi.removeClass("hidden"),this.blocksCnt=3):t>s?(this.$tbPortal.removeClass("hidden"),this.$tbWebNavi.removeClass("hidden"),this.$tabFriends.removeClass("hidden"),this.$tabPortal.removeClass("hidden"),this.blocksCnt=2,this.tabs.activateTab(this.$tabPortal.find(".btn"))):(this.$tbWebNavi.removeClass("hidden"),this.$tabFriends.removeClass("hidden"),this.$tabPortal.removeClass("hidden"),this.$tabWebNavi.removeClass("hidden"),this.blocksCnt=1,this.tabs.activateTab(this.$tabWebNavi.find(".btn")))}},i.prototype.setConts=function(t){this.$tbFriends.addClass("hidden"),this.$tbPortal.addClass("hidden"),1===this.blocksCnt&&this.$tbWebNavi.addClass("hidden"),t.removeClass("hidden")},i}(t.ViewBase);t.DashboardView=i}(Views||(Views={}));