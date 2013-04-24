(function (window, $)
{
    var i = function (input) { return parseInt(input); };
    var r = function (input) { return Math.round(input); };
    $.fn.i = function (cssKey, rate) { return parseInt(parseInt(this.css(cssKey)) * (rate || 1)); };
    $.fn.r = function (cssKey, rate) { return Math.round(parseInt(this.css(cssKey)) * (rate || 1)); };

    window.index =
    {
        init: function ()
        {
            var _this = this;

            this._generateMenu(config.menus);
            this._resizePage($(window).width(), $(window).height());


            $(document).bind("mouseup", function (event) { _this._touchEnd($(this), event); })
                       .bind("mouseleave", function (event) { _this._touchEnd($(this), event); })
                       .bind("mousemove", function (event) { _this._touchMove($(this), event); })
                       .bind("touchend", function (event) { _this._touchEnd($(this), event.originalEvent.touches[0]); })
                       .bind("touchcancel", function (event) { _this._touchEnd($(this), event.originalEvent.touches[0]); })
                       .bind("touchmove", function (event) { _this._touchMove($(this), event.originalEvent.touches[0]); event.preventDefault(); });

            $("div#header input.keywords").watermark("Search")
                                          .focus(function (event) { $(this).select(); })
                                          .keypress(function (event) { _this._keypress($(this), event); })
                                          .bind("propertychange input", function (event) { _this._change($(this), event); });

            $("div#header div.search a.clear").click(function () { _this._clearKeywords(); });
            $("div#footer ul.menu a:first").click();
        },
        _touchStart: function (sender, event)
        {
            if (this._touchInfo == undefined)
            {
                this._touchInfo =
                {
                    start: { pageX: event.pageX, pageY: event.pageY, time: Date.now() }
                };
            }

            if (sender.hasClass("partial"))
            {
                var max = $("div#header").height();
                var min = $(window).height() - $("div#footer").height() - sender.height();

                this._touchInfo.partial =
                {
                    sender: sender,
                    marginTop: sender.i("margin-top"),
                    maxMarginTop: max,
                    minMarginTop: min > max ? max : min
                };
            }
            else if (sender.hasClass("showcase"))
            {
                var max = 0;
                var min = (function (li) { return li.width() * (1 - li.length); })(sender.children());

                this._touchInfo.showcase =
                {
                    sender: sender,
                    marginLeft: sender.i("margin-left"),
                    minMarginLeft: min > max ? max : min,
                    maxMarginLeft: max
                };
            }
        },
        _touchMove: function (sender, event)
        {
            if (this._touchInfo == undefined)
            {
                return;
            }

            var start = this._touchInfo.start;

            if (this._touchInfo.vertical == undefined)
            {
                var xx = Math.pow(start.pageX - event.pageX, 2);
                var yy = Math.pow(start.pageY - event.pageY, 2);

                if (xx + yy > 450)
                {
                    this._touchInfo.vertical = yy > xx;
                }
            }

            if (this._footPrint != undefined)
            {
                this._footPrint = [this._footPrint[1], { t: Date.now(), x: event.pageX, y: event.pageY }];
            }
            else
            {
                this._footPrint = [{ t: start.time, x: start.pageX, y: start.pageY }, { t: Date.now(), x: event.pageX, y: event.pageY }];
            }

            if (this._touchInfo.partial != undefined)
            {
                if (this._touchInfo.vertical === true || this._touchInfo.showcase == undefined)
                {
                    var _info = this._touchInfo.partial;
                    var _sender = _info.sender;

                    var marginTop = _info.marginTop + event.pageY - start.pageY;
                    if (marginTop < _info.minMarginTop) { marginTop = _info.minMarginTop + (marginTop - _info.minMarginTop) * 0.5; }
                    else if (marginTop > _info.maxMarginTop) { marginTop = _info.maxMarginTop + (marginTop - _info.maxMarginTop) * 0.5; }

                    _sender.css({ marginTop: marginTop });
                }
            }

            if (this._touchInfo.showcase != undefined)
            {
                if (this._touchInfo.vertical === false)
                {
                    var _info = this._touchInfo.showcase;
                    var _sender = _info.sender;

                    var marginLeft = _info.marginLeft + event.pageX - start.pageX;
                    if (marginLeft < _info.minMarginLeft) { marginLeft = _info.minMarginLeft; }
                    else if (marginLeft > _info.maxMarginLeft) { marginLeft = _info.maxMarginLeft; }

                    _sender.css({ marginLeft: marginLeft });
                }
            }
        },
        _touchEnd: function (sender, event)
        {
            if (this._touchInfo == undefined)
            {
                return;
            }

            if (this._touchInfo.partial != undefined && this._touchInfo.vertical === true)
            {
                var _info = this._touchInfo.partial;
                var _sender = _info.sender;
                var marginTop = _sender.i("margin-top");

                if (marginTop < _info.minMarginTop) { _sender.animate({ marginTop: _info.minMarginTop }); }
                else if (marginTop > _info.maxMarginTop) { _sender.animate({ marginTop: _info.maxMarginTop }); }
            }

            if (this._touchInfo.showcase != undefined && this._touchInfo.vertical === false)
            {
                var _info = this._touchInfo.showcase;
                var _sender = _info.sender;
                var s0 = _sender.i("margin-left");
                var dt = this._footPrint[1].t - this._footPrint[0].t;
                var v0 = dt == 0 ? 0 : (this._footPrint[1].x - this._footPrint[0].x) / dt;
                var unit = sender.children().width();
                var index = s0 / unit;

                _sender.climb({
                    css: "margin-left",
                    x1: Math.floor(index) * unit,
                    x2: Math.ceil(index) * unit,
                    s0: s0,
                    v0: v0,
                    complete: function (v)
                    {
                        var parent = _sender.parents("div.showcase");
                        var category = parent.attr("category");
                        var i = v < 0 ? Math.floor(1 - index) : Math.ceil(-1 - index);
                        parent.parent().children("ol[category='" + category + "']").children().removeClass("active").eq(i).addClass("active");
                    }
                });
            }

            this._touchInfo = null;
        },
        _keypress: function (sender, event)
        {
            switch (sender.attr("for"))
            {
                case "search":
                    if (event.keyCode == 13 && !sender.hasClass("empty")) { this._search(sender.val()); }
                    break;
            }
        },
        _change: function (sender, event)
        {
            switch (sender.attr("for"))
            {
                case "search":
                    if (sender.val().length == 0) { sender.parent(".filled").removeClass("filled"); }
                    else if (!sender.hasClass("empty")) { sender.parent().addClass("filled"); }
                    break;
            }
        },
        _search: function(keywords)
        {
            alert(keywords);
        },
        _clearKeywords: function()
        {
            $("input.keywords").val("").blur().parent().removeClass("filled");
        },
        _loadPartial: function (name)
        {
            var _this = this;
            var indexed = $("div.partial[index]");
            var body = $(document.body).addClass("loading");

            var ajaxLoading = function ()
            {
                var options =
                {
                    url: config.urls.partial.replace(/(\/*)$/, "/") + name,
                    cache: false,
                    success: function (json)
                    {
                        if (loadingIndex == _this._loadingIndex)
                        {
                            _this._generatePartial(name, json);
                        }

                        body.removeClass("loading");
                    },
                    error: function (response)
                    {
                        alert("Cannot connect to iRepeater Store");
                    },
                    complete: function ()
                    {
                        loading.hide();
                    }
                };

                var loading = $("div#loading").show();
                var loadingIndex = _this._loadingIndex = (_this._loadingIndex || -1) + 1;

                $.ajax(options);
            };
            
            if (indexed.length > 0)
            {
                var duration = 1000;
                var header = $("div#header");
                var h1 = header.find("h1:visible");
                var button = header.find("a.button:visible");
                var h1New = header.find("h1.template").clone().removeClass("template").text(name);
                var buttonNew = header.find("a.template").clone().removeClass("template");
                var h1MarginLeft = h1New.i("margin-left");
                var buttonMarginLeft = buttonNew.i("margin-left");

                h1New.css({ marginLeft: $(window).width() - h1New.r("width", 0.5), opacity: 0 }).appendTo(header);

                h1.animate({ marginLeft: -h1.r("width", 0.5), opacity: 0 }, duration, function () { $(this).remove(); });
                button.animate({ marginLeft: -0.5 * ($(window).width()) }, duration, function () { $(this).remove() });
                h1New.animate({ marginLeft: h1MarginLeft, opacity: 1 });

                indexed.filter(":visible").animate({ marginLeft: -$(window).width() }, duration, ajaxLoading);
            }
            else
            {
                ajaxLoading();
            }
        },
        _resizePage: function (width, height)
        {
            var header = $("div#header");
            var footer = $("div#footer");
            var loading = $("div#loading");
            var partial = $("div.partial");

            header.css({ height: i(width * 0.045), top: 0, width: width });
            footer.css({ height: i(width * 0.050), width: width }).css({ top: height - footer.height() });
            loading.css({ fontSize: i(width * 0.0125) }).css({ borderRadius: loading.i("font-size", 0.5), padding: loading.i("font-size"), paddingLeft: loading.i("font-size", 3), width: loading.width() });
            loading.css({ "background-position-x": loading.i("font-size", 0.55), height: loading.i("font-size", 1.5) }).css({ lineHeight: loading.css("height"), left: i((width - loading.outerWidth()) * 0.5), top: i((height - loading.outerHeight()) * 0.5) });
            partial.css({ marginBottom: footer.height(), marginTop: header.height(), width: width });

            this._resizeHeader(header, header.width(), header.height()).show();
            this._resizeFooter(footer, footer.width(), footer.height()).show();
            this._resizePartial(partial, partial.width());
        },
        _resizeHeader: function (header, width, height)
        {
            var h1 = header.children("h1");
            var button = header.children("a.button");
            var search = header.children("div.search");
            var keywords = search.children("input.keywords");
            var searchClear = search.children("a.clear");

            h1.css({ fontSize: i(height * 0.42), height: height, lineHeight: height + "px", width: i(width * 0.5) }).css({ marginLeft: i(0.5 * (width - h1.width())) });
            button.css({ fontSize: i(height * 0.28), height: i(height * 0.7), marginLeft: r(width * 0.016), padding: "0px " + i(height * 0.4) + "px" }).css({ lineHeight: button.css("height"), marginTop: r(0.5 * (height - button.height())) });
            search.css({ height: i(height * 0.33) * 2, right: i(width * 0.013), width: i(width * 0.2) });
            search.css({ borderRadius: search.height(), marginTop: r(0.5 * (height - search.height())), boxShadow: this._getShadow(height * 0.05, height * 0.05, height * 0.05, "rgba(0,0,0,0.5)", true) });
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
        _resizePartial: function (partial, width)
        {
            var banner = partial.find("a.banner");
            var loop = partial.find("ul.loop");
            var loopList = loop.children();
            var showcase = partial.find(".showcase");

            var radius = r(width * 0.005);
            var grid = { height: i(width * 0.1), width: i(width * 0.242) };
            var margin = i((width - 4 * grid.width) * 0.5);

            banner.css({ "border-bottom-left-radius": radius, "border-top-left-radius": radius, height: 3 * grid.height, marginLeft: margin, marginTop: margin, width: 3 * grid.width });
            loop.css({ "border-bottom-right-radius": radius, "border-top-right-radius": radius, height: 3 * grid.height, marginRight: margin, marginTop: margin, width: grid.width });
            loopList.css({ height: grid.height, width: "100%" });
            
            this._resizeShowcase(showcase, width, margin);
        },
        _resizeShowcase: function (showcase, width, margin)
        {
            var head = showcase.filter("h2");
            var headSpan = head.children("span");
            var headAnchor = head.children("a");
            var headLabel = head.children("label");
            var desc = showcase.filter("p");
            var descSpan = desc.children("span");
            var div = showcase.filter("div");
            var pages = div.children("ul");
            var pageList = pages.children("li");
            var item = pageList.children("div.item");
            var icon = item.children("div.icon");
            var iconType = icon.children("span.type");
            var info = item.children("div.info");
            var name = info.children("p.name");
            var text = info.children("p.text");
            var star = info.children("p.star");
            var price = item.children("a.price");
            var navs = showcase.filter("ol");
            var navList = navs.children("li");

            var grid = { width: i(width / 3) - 2, height: i(width * 0.1) };

            head.css({ boxShadow: this._getShadow(0, width * 0.003, width * 0.003, "rgba(0,0,0,0.3)") });
            head.css({ fontSize: i(width * 0.014), lineHeight: i(width * 0.05) + "px", marginTop: i(width * 0.02) });
            headSpan.css({ fontSize: i(width * 0.017), marginLeft: margin });
            headAnchor.css({ marginLeft: margin });
            headLabel.css({ marginLeft: margin });
            div.css({ width: width });
            pages.attr({ autoWidth: Math.round(width - grid.width * 2 - 6) });
            pageList.css({ width: width });
            item.css({ height: grid.height, width: grid.width });
            icon.css({ margin: margin, height: item.height() - 2 * margin }).css({ borderRadius: icon.i("height", 0.12), width: icon.height() });
            iconType.css({ "border-top-right-radius": icon.i("height", 0.12), height: i(width * 0.0175) }).css({ marginTop: -iconType.height(), width: iconType.height() });
            info.css({ height: icon.height(), marginTop: margin, width: item.width() - icon.width() - 2 * margin });
            name.css({ marginBottom: item.r("height", 0.03), fontSize: headSpan.css("font-size") });
            text.css({ marginBottom: name.css("margin-bottom"), fontSize: name.r("font-size", 0.65) });
            star.css({ height: text.i("font-size") });
            price.css({ fontSize: i(width * 0.012), height: item.i("height", 0.25), marginRight: margin });
            price.css({ marginTop: -i(0.5 * (info.height() + price.height())) });
            price.css({ borderRadius: price.i("height", 0.15), lineHeight: price.css("height"), padding: "0px " + price.i("height", 0.5) + "px" });
            price.css({ boxShadow: this._getShadow(price.height() * 0.05, price.height() * 0.05, price.height() * 0.1, "rgba(0,0,0,0.45)", true) });
            desc.css({ height: iconType.height() }).css({ lineHeight: desc.css("height"), marginTop: desc.i("height", 0.5) });
            descSpan.css({ fontSize: text.css("font-size"), marginLeft: margin, paddingLeft: desc.height() });
            navList.css({ height: i(width * 0.0065), margin: i(width * 0.01) }).css({ borderRadius: navList.height(), width: navList.height() });
            navList.css({ boxShadow: this._getShadow(navList.height() * 0.2, navList.height() * 0.2, navList.height() * 0.5, "rgba(0,0,0,0.45)", true) });
            navs.css({ height: navList.height() + 2 * i(navList.css("margin-top")) }).attr({ unitWidth: navList.width() + 2 * i(navList.css("margin-top")) });
        },
        _getShadow: function (x, y, range, color, inset)
        {
            return x + "px " + y + "px " + range + "px " + color + (inset ? " inset" : "");
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

            $("div.partial:visible").remove();
            this._loadPartial(options.name);
        },
        _generatePartial: function (name, json)
        {
            $("div.partial." + name).remove();

            var _this = this;
            var indexed = $("div.partial[index]");
            var template = $("div.partial.template");
            var target = $("<div></div>").addClass("partial " + name);

            target.attr({ index: indexed.length, style: template.attr("style") });
            target.appendTo(document.body);

            switch (name)
            {
                case "featured":
                    this._generateBanner(target, template, json.Topics);
                    this._generateShowcase(target, template, json.Newest, 6, "newest", true);
                    this._generateShowcase(target, template, json.Hottest, 6, "hottest", true);
                    break;
            }

            target.bind("mousedown", function (event) { _this._touchStart($(this), event); })
                  .bind("touchstart", function (event) { _this._touchStart($(this), event.originalEvent.touches[0]); });
        },
        _generateBanner: function (target, template, array)
        {
            var loop = template.find("ul.loop").clone();
            var li = loop.children(":first").clone();
            var banner = template.find("a.banner").clone();
            var clear = this._generateClear("div");

            banner.appendTo(target);
            loop.empty().appendTo(target);
            clear.appendTo(target);

            $.each(array, function (i, json)
            {
                var item = li.clone().appendTo(loop);
                item.find("img").attr({ src: json.ImageUrl });
            });

            var count = loop.children().length;
            var scrollTop = (count - 3) * li.height();
            var animateScrollTop = (count - 4) * li.height();

            var animate = function ()
            {
                var li = loop.children();
                banner.find("img").attr("src", li.last().find("img").attr("src"));
                li.first().before(li.last().remove());
                loop.scrollTop(scrollTop);

                setTimeout(function ()
                {
                    loop.animate({ scrollTop: animateScrollTop }, 1000, animate);
                }, 8000);
            }

            animate();
        },
        _generateShowcase: function (target, template, json, pageSize, category, light)
        {
            var _this = this;

            var head = template.find("h2.showcase").clone().attr({ category: category });
            var div = template.find("div.showcase").clone().attr({ category: category });
            var desc = template.find("p.showcase").clone().attr({ category: category });
            var navs = null, navItem = null;

            var pages = div.children("ul");
            var pageItem = pages.children("li:first").clone();
            var productItem = pageItem.children("div.item:first").clone();

            var pageCount = Math.ceil(json.Products.length / pageSize);
            var autoWidth = i(pages.attr("autoWidth"));

            head.appendTo(target).find("span").text(json.Title + " ");
            div.appendTo(target);
            pages.empty().appendTo(div);
            pageItem.empty();
            desc.appendTo(target);

            if (light)
            {
                var navs = template.find("ol.showcase").clone().attr({ category: category });
                var navItem = navs.children("li:first").clone();
                navs.empty().appendTo(target).css({ width: pageCount * i(navs.attr("unitWidth")) });
                head.find("a").click(function () { _this._loadPartial(category); });
                head.find("label").remove();
            }
            else
            {
                var to = json.Products.length > pageSize ? pageSize : json.Products.length;
                head.find("label").text("1-" + to + " of " + json.Products.length);
                head.find("a").remove();
            }

            pages.bind("mousedown", function (event) { _this._touchStart($(this), event); })
                 .bind("touchstart", function (event) { _this._touchStart($(this), event.originalEvent.touches[0]); });

            for (var c = 0; c < pageCount; c++)
            {
                var page = pageItem.clone().attr({ index: c }).appendTo(pages);

                if (navs != null && navItem != null)
                {
                    navItem.clone().appendTo(navs).addClass(c == 0 ? "active" : null);
                }

                for (var j = 0; j < pageSize; j++)
                {
                    var index = c * pageSize + j;
                    var product = json.Products[index];
                    var item = productItem.clone();

                    if (index >= json.Products.length) { break; }

                    item.find("div.icon>img").attr({ src: product.IconUrl });
                    item.find("div.icon>span.type").addClass(product.Visual ? "video" : "audio");
                    item.find("p.name").text(product.Name);
                    item.find("p.published>span").text($.formatDate($.resolveDate(product.CreatedDate), "MMMM dd, yyyy"));
                    item.find("p.category>span.class").text(product.Class);
                    item.find("p.category>span.subclass").text(product.SubClass);
                    item.find("p.star").css({ backgroundPositionY: function () { return -$(this).height() * product.Star } });
                    item.find("a.price").text(product.Price == 0 ? "Free" : (product.PriceUnit + " " + product.Price.toFixed(2)));

                    if (i(j / 3) % 2 == 1) { item.addClass("alter"); }
                    if (j % 3 == 1) { item.css({ width: autoWidth }); }

                    item.appendTo(page);
                }
            }
        },
        _generateClear: function(tagName)
        {
            return $(document.createElement(tagName)).addClass("clear");
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
        }
    };
})(window, jQuery);
