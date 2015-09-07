var Views;
(function (Views) {
    var ViewBase = (function () {
        function ViewBase() {
        }
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            var request = new RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendGet();
        };
        ViewBase.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            var request = new RequestSender(endpoint, data, true);
            request.serializeData();
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sentPost();
        };
        return ViewBase;
    })();
    Views.ViewBase = ViewBase;
})(Views || (Views = {}));
//# sourceMappingURL=ViewBase.js.map