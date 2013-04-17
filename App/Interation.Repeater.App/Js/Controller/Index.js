(function (window, $)
{
    var i = function (input) { return parseInt(input); };
    var r = function (input) { return Math.round(input); };
    $.fn.i = function (cssKey, rate) { return i(i(this.css(cssKey)) * (rate || 1)); };

    window.index =
    {
        init: function ()
        {
            this._generateMenu(config.menus);
            this._resizePage($(window).width(), $(window).height());

            $("div#footer ul.menu a:first").click();
        },
        _selectMenu: function (sender, options)
        {
            sender.parents("ul.menu").find("a").removeClass("selected");
            sender.addClass("selected");

            var header = $("div#header");
            var h1 = header.children("h1");
            var search = header.children("div.search");

            h1.filter(":visible").remove();
            h1.filter(".template").clone().removeClass("template").text(options.h1).appendTo(header);
            search.css({ display: options.search ? "block" : "none" });

            this._loadingPartial(options.name);
        },
        _loadingPartial: function (name)
        {
            var options =
            {
                url: config.urls.partial.replace(/(\/*)$/, "/") + name,
                cache: false,
                success: function (json)
                {

                },
                error: function (response)
                {

                },
                complete: function ()
                {

                }
            }

            $.ajax(options);
        },
        _resizePage: function (width, height)
        {
            var header = $("div#header");
            var footer = $("div#footer");

            header.css({ height: i(width * 0.045), width: width });
            footer.css({ height: i(width * 0.050), width: width }).css({ top: height - footer.height() });

            this._resizeHeader(header, header.width(), header.height()).show();
            this._resizeFooter(footer, header.width(), header.height()).show();
        },
        _resizeHeader: function (header, width, height)
        {
            var h1 = header.children("h1");
            var search = header.children("div.search");
            var keywords = search.children("input.keywords");
            var searchClear = search.children("a.clear");

            h1.css({ fontSize: i(height * 0.42), height: height, lineHeight: height + "px", width: i(width * 0.5) });
            search.css({ height: i(height * 0.33) * 2, right: i(width * 0.013), width: i(width * 0.2) });
            search.css({ borderRadius: search.height(), marginTop: r(0.5 * (height - search.height())), boxShadow: this._getShadow(height * 0.05, height * 0.05, "rgba(0,0,0,0.5)", true) });
            keywords.css({ fontSize: i(search.height() * 0.5), marginLeft: search.height(), marginTop: i(search.height() * 0.15) }).css({ height: search.height() - 2 * keywords.i("margin-top") });
            keywords.css({ lineHeight: keywords.css("height"), width: search.width() - 2 * keywords.i("margin-left") });
            searchClear.css({ height: keywords.height(), marginTop: keywords.css("margin-top") }).css({ marginLeft: searchClear.css("margin-top"), width: searchClear.height() });

            return header;
        },
        _resizeFooter: function (footer, width, height)
        {
            var menu = footer.find("ul.menu");
            var menuItems = menu.children("li");
            var anchors = menuItems.children("a");

            var unitWidth = i(width * 0.075);
            var margin = { h: i(unitWidth * 0.25), v: i(height * 0.075) };

            menu.css({ height: height, width: menuItems.length * (unitWidth + 2 * margin.h) });
            menuItems.css({ height: height - 2 * margin.v, margin: margin.v + "px " + margin.h + "px", width: unitWidth });
            anchors.css({ height: i(menuItems.height() * 0.35) }).css({ lineHeight: anchors.css("height"), paddingTop: menuItems.height() - anchors.height() });
            anchors.css({ borderRadius: height * 0.08, fontSize: i(anchors.height() * 0.75) });

            return footer;
        },
        _generateMenu: function (menus)
        {
            var _this = this;
            var container = $("div#footer ul.menu");
            var template = container.children("li:first");

            container.empty();

            $.each(menus, function (i, menu)
            {
                template.clone().appendTo(container).children("a").text(menu.text).click(function () { _this._selectMenu($(this), menu); });
            });
        },
        _getShadow: function (offset, range, color, inset)
        {
            return offset + "px " + offset + "px " + range + "px " + color + (inset ? " inset" : "");
        }
    };
})(window, jQuery);
