var config =
{
    volumn: 1,
    debuging: navigator == null || navigator.systemLanguage == null,
    language: (navigator == null || navigator.systemLanguage == null) ? "en-us" : navigator.systemLanguage.toLowerCase(),
    database: { name: "Repeater", version: 13 },
    initialize: function (options)
    {
        options = options || {};

        this.volumn = isNaN(options.volumn) ? this.volumn : options.volumn;
        this.language = options.language || this.language;
    }
};

config.langs = {
    store: { "en-us": "iRepeater Store", "zh-cn": "iRepeater Store" },
    featured: { "en-us": "Featured", "zh-cn": "推荐" },
    charts: { "en-us": "", "zh-cn": "" },
    genius: { "en-us": "", "zh-cn": "" },
    genius: { "en-us": "", "zh-cn": "" },
    genius: { "en-us": "", "zh-cn": "" },
    genius: { "en-us": "", "zh-cn": "" },
};

config.urls = {
    partial: "http://192.168.1.2/api/partial"
};

config.partials = {
    featured: { title: config.langs.store[config.language], menu: { text: "Featured" }, searchable: true },
    genius: { title: "Genius", menu: { text: "Genius" }, searchable: true },
    charts: { title: "Top Charts", menu: { text: "Top Charts" }, searchable: true },
    categories: { title: "Categories", menu: { text: "Categories" }, searchable: true },
    purchased: { title: "Purchased", menu: { text: "Purchased" } },
    updates: { title: "Updates", menu: { text: "Updates" } },
    topic: { },
    hottest: { title: "What's Hot " },
    newest: { title: "New & Noteworthy" }
};
