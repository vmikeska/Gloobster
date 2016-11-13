var Common;
(function (Common) {
    var ListGenerator = (function () {
        function ListGenerator() {
            this.clearCont = false;
            this.customMapping = null;
            this.appendStyle = "append";
            this.isAsync = false;
            this.$items = [];
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
            this.eventHandlers.push(new EventHandler(selector, handler));
        };
        ListGenerator.prototype.generateList = function (items) {
            if (this.clearCont) {
                this.$cont.empty();
            }
            if (items.length === 0) {
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
            items.forEach(function (item) {
                var $item = _this.generateItem(item);
                _this.$items.push($item);
                $item.data("no", itemNo);
                itemNo++;
            });
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
            if (this.appendStyle === "append") {
                this.$cont.append($item);
            }
            else if (this.appendStyle === "prepend") {
                this.$cont.prepend($item);
            }
            else if (this.appendStyle === "after") {
                this.$cont.after($item);
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
        return EventHandler;
    }());
    Common.EventHandler = EventHandler;
})(Common || (Common = {}));
//# sourceMappingURL=ListGenerator.js.map