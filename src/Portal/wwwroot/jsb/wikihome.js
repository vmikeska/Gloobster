var __extends=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},Views;!function(t){var i=function(i){function e(){i.call(this),this.combo=new t.WikiSearchCombo,this.combo.initId("SearchCombo",{showRating:!0})}return __extends(e,i),e}(t.ViewBase);t.WikiHomeView=i}(Views||(Views={}));var Views;!function(t){var i=function(){function i(){}return i.prototype.initId=function(t,i){void 0===i&&(i=null),this.config=i,this.$combo=$("#"+t),this.init()},i.prototype.initElement=function(t){this.$combo=t,this.init()},i.prototype.init=function(){var t=this;this.$input=this.$combo.find("input"),this.delayedCallback=new Common.DelayedCallback(this.$input),this.delayedCallback.callback=function(i){i&&t.loader(!0),t.search(i)}},i.prototype.loader=function(t){t?this.$combo.find(".loader").show():this.$combo.find(".loader").hide()},i.prototype.search=function(i){var e=this,n=[["query",i]];t.ViewBase.currentView.apiGet("WikiSearch",n,function(t){e.showResults(t)})},i.prototype.getDisabledItem=function(t){return'<li class="disabled">'+t+"</li>"},i.prototype.showResults=function(t){var i=this;t=_.sortBy(t,function(t){return t.rating}).reverse();var e=this.$combo.find("ul");e.empty(),e.show();var n=t.length>0&&t[0].rating>0;n&&e.append(this.getDisabledItem("Articles rich on content"));var o=!1;t.forEach(function(t){0!==t.rating||o||(e.append(i.getDisabledItem("Help us contribute on these articles")),o=!0);var n=i.getItemHtml(t);e.append(n)}),this.selectionCallback&&e.find("a").click(function(t){t.preventDefault(),i.selectionCallback($(t.target))}),this.loader(!1)},i.prototype.getItemHtml=function(t){var i=$('<div class="stars"></div>');if(this.config&&this.config.showRating)for(var e=1;10>=e;e+=2){var n=e/2,o=(e+1)/2,a=n<=t.rating?"active":"inactive",r=o<=t.rating?"active":"inactive",s=$('\n								<div class="star" data-i="'+e+'">\n										<div class="icon-star-left '+a+'"></div>\n										<div class="icon-star-right '+r+'"></div>\n								</div>');i.append(s)}var c=$('<li><a data-articleId="'+t.articleId+'" href="/wiki/'+t.language+"/"+t.link+'">'+t.title+"</a></li>");return c.append(i),c},i}();t.WikiSearchCombo=i}(Views||(Views={}));