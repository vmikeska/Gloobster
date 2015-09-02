var Views;
(function (Views) {
    var ViewBase = (function () {
        function ViewBase() {
        }
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var urlBase = '/api/' + endpointName;
            var urlQuery = "";
            if (params) {
                urlQuery = "?";
                params.forEach(function (param) {
                    urlQuery += param[0] + "=" + param[1] + "&";
                });
                urlQuery = urlQuery.substring(0, urlQuery.length - 1);
            }
            var url = urlBase + urlQuery;
            $.ajax({
                type: 'GET',
                url: url,
                success: function (response) {
                    callback(response);
                },
                error: function (res) {
                    //todo: some universal error handler
                    alert(JSON.stringify(res));
                }
            });
        };
        return ViewBase;
    })();
    Views.ViewBase = ViewBase;
})(Views || (Views = {}));
//# sourceMappingURL=ViewBase.js.map