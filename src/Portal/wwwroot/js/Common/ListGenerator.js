var Common;
(function (Common) {
    var ListGenerator = (function () {
        function ListGenerator() {
            this.clearCont = false;
            this.customMapping = null;
            this.appendStyle = "append";
            this.isAsync = false;
            this.listLimit = 0;
            this.listLimitMoreTmp = "";
            this.listLimitLessTmp = "";
            this.listLimitLast = true;
            this.$items = [];
            this.hidableIdClass = "hidable-" + Views.ViewBase.currentView.makeRandomString();
        }
        Object.defineProperty(ListGenerator, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        ListGenerator.init = function ($cont, itemTemplateName) {
            var lg = new ListGenerator();
            lg.$cont = $cont;
            lg.itemTemplateName = itemTemplateName;
            lg.eventHandlers = [];
            lg.itemTemplate = this.v.registerTemplate(lg.itemTemplateName);
            return lg;
        };
        ListGenerator.prototype.destroy = function () {
            this.$items.forEach(function ($i) {
                $i.remove();
            });
        };
        ListGenerator.prototype.evnt = function (selector, handler) {
            var eh = new EventHandler(selector, handler);
            this.eventHandlers.push(eh);
            return eh;
        };
        ListGenerator.prototype.generateList = function (items) {
            if (this.clearCont) {
                this.$cont.empty();
            }
            if (!any(items)) {
                if (this.emptyTemplate) {
                    var t = ListGenerator.v.registerTemplate(this.emptyTemplate);
                    var $t = $(t());
                    this.$cont.html($t);
                    this.$items.push($t);
                }
                return;
            }
            var by = 10;
            if (this.isAsync && (items.length > by)) {
                var to = by;
                var max = items.length - 1;
                for (var i = 0; i <= max; i = i + by) {
                    if (to > max) {
                        to = max + 1;
                    }
                    var index = i / by;
                    this.genItemsChunkTime(i, index, items.slice(i, to));
                    to = to + by;
                }
            }
            else {
                this.genItemsChunk(0, items);
            }
        };
        ListGenerator.prototype.genItemsChunkTime = function (startNo, chunkNo, items) {
            var _this = this;
            setTimeout(function () {
                _this.genItemsChunk(startNo, items);
            }, 500 * chunkNo);
        };
        ListGenerator.prototype.genItemsChunk = function (startNo, items) {
            var _this = this;
            var itemNo = startNo;
            var hidable = this.isHidable(items);
            items.forEach(function (item) {
                var $item = _this.generateItem(item);
                _this.$items.push($item);
                $item.data("no", itemNo);
                if (hidable) {
                    _this.hidableFnc(itemNo, $item, items);
                }
                itemNo++;
            });
        };
        ListGenerator.prototype.isHidable = function (items) {
            if (this.listLimit === 0) {
                return false;
            }
            return items.length > this.getListLimit();
        };
        ListGenerator.prototype.getListLimit = function () {
            var l = this.listLimitLast ? this.listLimit + 1 : this.listLimit;
            return l;
        };
        ListGenerator.prototype.hidableFnc = function (itemNo, $item, items) {
            var _this = this;
            var limit = this.getListLimit();
            if (itemNo + 1 === limit) {
                var t = ListGenerator.v.registerTemplate(this.listLimitMoreTmp);
                this.$expander = $(t());
                this.$expander.click(function (e) {
                    e.preventDefault();
                    _this.toggleHidingCls(true);
                });
                this.$cont.append(this.$expander);
            }
            if (itemNo + 1 > limit) {
                $item.addClass(this.hidableIdClass);
                $item.addClass("hidable-hide");
            }
            var isLast = itemNo + 1 === items.length;
            if (isLast) {
                var tl = ListGenerator.v.registerTemplate(this.listLimitLessTmp);
                this.$collapser = $(tl());
                this.$collapser.click(function (e) {
                    e.preventDefault();
                    _this.toggleHidingCls(false);
                });
                this.$cont.append(this.$collapser);
                this.$collapser.addClass("hidden");
                this.toggleHidingCls(false);
            }
        };
        ListGenerator.prototype.toggleHidingCls = function (state) {
            var $hs = this.$cont.find("." + this.hidableIdClass);
            if (state) {
                this.$cont.removeClass("list-state-collapsed");
                this.$cont.addClass("list-state-expanded");
                this.$collapser.removeClass("hidden");
                this.$expander.addClass("hidden");
                $hs.removeClass("hidable-hide");
            }
            else {
                this.$cont.addClass("list-state-collapsed");
                this.$cont.removeClass("list-state-expanded");
                this.$collapser.addClass("hidden");
                this.$expander.removeClass("hidden");
                $hs.addClass("hidable-hide");
            }
        };
        ListGenerator.prototype.generateItem = function (item) {
            var context = item;
            if (this.customMapping) {
                context = this.customMapping(item);
            }
            var $item = $(this.itemTemplate(context));
            if (this.activeItem) {
                var actItemRes = this.activeItem(item);
                if (actItemRes.isActive) {
                    $item.addClass(actItemRes.cls);
                }
            }
            this.eventHandlers.forEach(function (eh) {
                var $i = $item;
                if (eh.selector) {
                    $i = $item.find(eh.selector);
                }
                $i.on(eh.event, function (e) {
                    e.preventDefault();
                    var $target = $(e.delegateTarget);
                    eh.handler(e, $item, $target, item);
                });
            });
            if (this.beforeItemAppended) {
                this.beforeItemAppended($item, item);
            }
            if (this.appendStyle === "append") {
                this.$cont.append($item);
            }
            else if (this.appendStyle === "prepend") {
                this.$cont.prepend($item);
            }
            else if (this.appendStyle === "after") {
                this.$cont.after($item);
            }
            else if (this.appendStyle === "before") {
                this.$cont.before($item);
            }
            if (this.onItemAppended) {
                this.onItemAppended($item, item);
            }
            return $item;
        };
        return ListGenerator;
    }());
    Common.ListGenerator = ListGenerator;
    var EventHandler = (function () {
        function EventHandler(selector, handler) {
            this.event = "click";
            this.selector = selector;
            this.handler = handler;
        }
        EventHandler.prototype.setEvent = function (event) {
            this.event = event;
            return this;
        };
        return EventHandler;
    }());
    Common.EventHandler = EventHandler;
})(Common || (Common = {}));
//# sourceMappingURL=ListGenerator.js.map