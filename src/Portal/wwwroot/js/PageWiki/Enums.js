var Wiki;
(function (Wiki) {
    (function (SectionType) {
        SectionType[SectionType["Header"] = 0] = "Header";
        SectionType[SectionType["Standard"] = 1] = "Standard";
        SectionType[SectionType["DosDonts"] = 2] = "DosDonts";
        SectionType[SectionType["Links"] = 3] = "Links";
    })(Wiki.SectionType || (Wiki.SectionType = {}));
    var SectionType = Wiki.SectionType;
    (function (LayoutSize) {
        LayoutSize[LayoutSize["Web"] = 0] = "Web";
        LayoutSize[LayoutSize["Mobile"] = 1] = "Mobile";
    })(Wiki.LayoutSize || (Wiki.LayoutSize = {}));
    var LayoutSize = Wiki.LayoutSize;
    ;
    (function (ArticleType) {
        ArticleType[ArticleType["Continent"] = 0] = "Continent";
        ArticleType[ArticleType["Country"] = 1] = "Country";
        ArticleType[ArticleType["City"] = 2] = "City";
    })(Wiki.ArticleType || (Wiki.ArticleType = {}));
    var ArticleType = Wiki.ArticleType;
})(Wiki || (Wiki = {}));
//# sourceMappingURL=Enums.js.map