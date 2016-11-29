var Planning;
(function (Planning) {
    var PropsDataUpload = (function () {
        function PropsDataUpload(searchId, propName) {
            this.values = [];
            this.searchId = searchId;
            this.propName = propName;
        }
        PropsDataUpload.prototype.setVal = function (val) {
            this.value = val;
        };
        PropsDataUpload.prototype.addVal = function (name, val) {
            this.values.push({ name: name, val: val });
        };
        PropsDataUpload.prototype.send = function (callback) {
            if (callback === void 0) { callback = null; }
            var req = {
                id: this.searchId,
                name: this.propName,
                value: this.value,
                values: this.values
            };
            Views.ViewBase.currentView.apiPut("CustomSearch", req, function (res) {
                if (callback) {
                    callback(res);
                }
            });
        };
        return PropsDataUpload;
    }());
    Planning.PropsDataUpload = PropsDataUpload;
})(Planning || (Planning = {}));
//# sourceMappingURL=PropsDataUpload.js.map