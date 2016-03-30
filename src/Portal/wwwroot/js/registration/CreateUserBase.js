var Reg;
(function (Reg) {
    var CreateUserBase = (function () {
        function CreateUserBase() {
        }
        return CreateUserBase;
    })();
    Reg.CreateUserBase = CreateUserBase;
    (function (NetworkType) {
        NetworkType[NetworkType["Facebook"] = 0] = "Facebook";
        NetworkType[NetworkType["Google"] = 1] = "Google";
        NetworkType[NetworkType["Twitter"] = 2] = "Twitter";
        NetworkType[NetworkType["Base"] = 3] = "Base";
    })(Reg.NetworkType || (Reg.NetworkType = {}));
    var NetworkType = Reg.NetworkType;
})(Reg || (Reg = {}));
//# sourceMappingURL=CreateUserBase.js.map