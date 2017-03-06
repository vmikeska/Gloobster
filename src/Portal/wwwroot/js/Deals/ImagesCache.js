var Planning;
(function (Planning) {
    var ImagesCache = (function () {
        function ImagesCache() {
        }
        Object.defineProperty(ImagesCache, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        ImagesCache.getImageById = function (id, type, size, $group) {
            console.log("QQ:GettingImg: " + id);
            var image = _.find(this.images, { id: id });
            if (!image) {
                var queueItem = _.find(this.queue, { id: id });
                if (!queueItem) {
                    var qi = {
                        id: id,
                        type: type,
                        size: size
                    };
                    this.queue.push(qi);
                    this.exeQueueSafe();
                }
            }
            else {
                console.log("QQ:Applaying: " + id);
                this.applyImage($group, image);
            }
        };
        ImagesCache.exeQueueSafe = function () {
            var _this = this;
            this.dret.receive(function () {
                console.log("QQ:ExecutingCache");
                _this.exeQueue();
            });
        };
        ImagesCache.exeQueue = function () {
            var _this = this;
            if (this.isRunning) {
                return;
            }
            this.isRunning = true;
            var items = _.take(this.queue, this.execBy);
            var data = [];
            items.forEach(function (i) {
                data.push(["items", (i.id + "-" + i.type + "-" + i.size)]);
            });
            this.v.apiGet("PlaceImage", data, function (images) {
                console.log("QQ:Received: " + images.length);
                images.forEach(function (image) {
                    _this.images.push(image);
                    _.remove(_this.queue, { id: image.id, type: image.type, size: image.size });
                    var $group = $(".group_" + image.id);
                    console.log("QQ:Applaying-get: " + image.id);
                    _this.applyImage($group, image);
                });
                _this.isRunning = false;
                if (any(_this.queue)) {
                    _this.exeQueue();
                }
            });
        };
        ImagesCache.applyImage = function ($group, image) {
            if (image.data) {
                if (image.type === FlightCacheRecordType.City) {
                    var $img = $group.find(".img");
                    $img.attr("src", "data:image/jpeg;base64," + image.data);
                }
                if (image.type === FlightCacheRecordType.Country) {
                    var $cont = $group.find(".img-wrap");
                    $cont.html(image.data);
                }
            }
        };
        ImagesCache.execBy = 4;
        ImagesCache.dret = new Common.DelayedReturn();
        ImagesCache.images = [];
        ImagesCache.queue = [];
        ImagesCache.isRunning = false;
        return ImagesCache;
    }());
    Planning.ImagesCache = ImagesCache;
})(Planning || (Planning = {}));
//# sourceMappingURL=ImagesCache.js.map