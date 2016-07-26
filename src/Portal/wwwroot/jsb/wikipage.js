var __extends=this&&this.__extends||function(e,t){function i(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)},Views;!function(e){!function(e){e[e.Continent=0]="Continent",e[e.Country=1]="Country",e[e.City=2]="City"}(e.ArticleType||(e.ArticleType={}));var t=(e.ArticleType,function(e){function t(t,n){e.call(this),this.articleType=n,this.articleId=t,this.langVersion=this.getLangVersion(),this.photos=new r(t),this.rating=new o(t,this.langVersion),this.report=new i(t,this.langVersion)}return __extends(t,e),t.prototype.getLangVersion=function(){var e=window.location.pathname.split("/");return e[2]},t}(e.ViewBase));e.WikiPageView=t;var i=function(){function t(e,t){var i=this;this.regToggleButton(),this.articleId=e,this.langVersion=t,this.$bubble=$(".bubble"),this.$bubble.find(".cancel").click(function(e){e.preventDefault();var t=$(e.target);i.toggleForm(t)}),this.regSend()}return t.prototype.toggleForm=function(e){e.closest(".evaluate").toggleClass("evaluate-open")},t.prototype.regSend=function(){var t=this;this.$bubble.find(".send").click(function(i){i.preventDefault();var n=$(i.target),o=n.closest(".evaluate"),r=n.closest(".bubble"),s={lang:t.langVersion,articleId:t.articleId,sectionId:o.data("id"),text:r.find("input").val()};e.ViewBase.currentView.apiPost("WikiReport",s,function(e){t.toggleForm(n)})})},t.prototype.regToggleButton=function(){var t=this;$(".icon-flag").click(function(i){if(i.preventDefault(),e.ViewBase.currentView.fullReg){var o=$(i.target);t.toggleForm(o)}else n.displayFullRegMessage()})},t}();e.Report=i;var n=function(){function t(){}return t.displayFullRegMessage=function(){var t=new Common.InfoDialog,i=e.ViewBase.currentView;t.create(i.t("FullRegTitle","jsWiki"),i.t("FullRegBody","jsWiki"))},t}();e.RegMessages=n;var o=function(){function t(e,t){this.regRating(),this.regRatingDD(),this.regRatingPrice(),this.articleId=e,this.langVersion=t}return t.prototype.getRatingDesign=function(e){var t={rstr:e,cls:""};return e>0?(t.rstr="+"+e,t.cls="plus"):t.cls="minus",t},t.prototype.regRatingDD=function(){var e=this;this.regRatingBase("pmBtn","place","WikiRating",function(t){e.setLikeDislike(t.$cont,t.like,!t.like,"pmBtn","icon-plus","icon-minus")})},t.prototype.regRatingPrice=function(){var e=this;this.regRatingBase("priceBtn","rate","WikiPriceRating",function(t){e.setLikeDislike(t.$cont,t.like,!t.like,"priceBtn","icon-plus","icon-minus"),t.$cont.prev().find(".price").text(t.res.toFixed(2))})},t.prototype.regRatingBase=function(t,i,o,r){var s=this;$("."+t).click(function(t){t.preventDefault();var a=$(t.target),l=a.data("like"),c=a.closest("."+i),u=c.data("id"),g={articleId:s.articleId,sectionId:u,language:s.langVersion,like:l};e.ViewBase.currentView.fullReg?e.ViewBase.currentView.apiPut(o,g,function(e){r({$cont:c,like:l,res:e})}):n.displayFullRegMessage()})},t.prototype.regRating=function(){var e=this;this.regRatingBase("ratingBtn","evaluate","WikiRating",function(t){if(e.setLikeDislike(t.$cont,t.like,!t.like,"ratingBtn","icon-heart","icon-nosmile"),null!=t.res){var i=t.$cont.find(".sRating");i.removeClass("plus").removeClass("minus");var n=e.getRatingDesign(t.res);i.text(n.rstr),i.addClass(n.cls)}})},t.prototype.setLikeDislike=function(e,t,i,n,o,r){var s=e.find("."+n),a=s.toArray();a.forEach(function(e){var n=$(e),s=n.data("like");if(s){var a=o+"Red";n.removeClass(o),n.removeClass(a),n.addClass(t?a:o)}else{var l=r+"Red";n.removeClass(r),n.removeClass(l),n.addClass(i?l:r)}})},t}();e.Rating=o;var r=function(){function t(t){this.articleId=t,$("#recommendPhoto").click(function(t){t.preventDefault(),e.ViewBase.currentView.fullReg?($("#photosForm").show(),$("#recommendPhoto").hide()):n.displayFullRegMessage()}),$("#photosForm .cancel").click(function(e){e.preventDefault(),$("#photosForm").hide(),$("#recommendPhoto").show()});var i=$("#photosForm #cid");i.change(function(e){e.preventDefault();var t=i.prop("checked");t?$(".photoButton").show():$(".photoButton").hide()}),this.registerPhotoUpload(this.articleId,"galleryInput")}return t.prototype.registerPhotoUpload=function(t,i){var n=new Common.FileUploadConfig;n.inputId=i,n.endpoint="WikiPhotoGallery";var o=new Common.FileUpload(n);o.customId=t,o.onProgressChanged=function(e){var t=$("#galleryProgress");t.show();var i=e+"%";$(".progress").css("width",i),t.find("span").text(i)},o.onUploadFinished=function(t,i){var n=$("#galleryProgress");n.hide();var o=new Common.InfoDialog,r=e.ViewBase.currentView;o.create(r.t("UploadTitle","jsWiki"),r.t("UploadBody","jsWiki"))}},t}();e.WikiPhotosUser=r}(Views||(Views={}));