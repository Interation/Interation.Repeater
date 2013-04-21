var config =
{
    volume: 1,
    language: (function ()
    {
        try { return navigator.systemLanguage.toLowerCase(); }
        catch (e) { return "en-us"; }
    })(),
    database: { name: "Repeater", version: 13 }
};

config.urls =
{
    partial: "http://192.168.1.2/api/partial"
};

config.menus =
{
    featured: { h1: "iRepeater Store", name: "featured", text: "Featured", search: true },
    genius: { h1: "Genius", name: "genius", text: "Genius", search: true },
    charts: { h1: "Top Charts", name: "charts", text: "Top Charts", search: true },
    categories: { h1: "Categories", name: "categories", text: "Categories", search: true },
    purchased: { h1: "Purchased", name: "purchased", text: "Purchased" },
    updates: { h1: "Updates", name: "updates", text: "Updates" }
};

config.lang =
{

};
