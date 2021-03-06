﻿(function (window, $)
{
    var i = function (input) { return parseInt(input); };
    var r = function (input) { return Math.round(input); };
    $.fn.i = function (css, rate) { return parseInt(parseInt(this.css(css)) * (rate || 1)); };
    $.fn.r = function (css, rate) { return Math.round(parseInt(this.css(css)) * (rate || 1)); };

    window.index =
    {
        init: function ()
        {
            var _this = this;

            $(document).bind("touchstart", function (event) { event.preventDefault(); });

            this._generateMenu(config.partials);
            this._resizePage($(window).width(), $(window).height());

            $(document).unbind("touchstart")
                       .bind("touchend", function (event) { _this._touchEnd($(this), event); })
                       .bind("touchcancel", function (event) { _this._touchEnd($(this), event); })
                       .bind("touchmove", function (event) { _this._touchMove($(this), event); });

            $("div#header").bind("touchmove", function () { event.preventDefault(); });
            $("div#header a.back").live("click", function (event) { _this._back($(this), event); });
            $("div#header form.search").live("submit", function (event) { _this._search($(this), event); event.preventDefault(); });
            $("div#header form.search a.clear").live("click", function (event) { _this._clear($(this), event); });
            $("div#header form.search input.keywords").watermark("Search")
                                                      .focus(function (event) { $(this).select(); })
                                                      .bind("input", function (event) { _this._change($(this), event); });

            $("div#main div.banner a").live("click", function (event) { _this._open($(this), event); });
            $("div#main h2.showcase a").live("click", function (event) { _this._open($(this), event); });
            $("div#main div.showcase ul").live("touchstart", function (event) { _this._touchStart($(this), event); });
            $("div#main div.showcase div.item").live("click", function (event) { _this._open($(this), event); });
            $("div#main div.showcase a.price").live("click", function (event) { _this._download($(this), event); return false; });
            $("div#main div.detail a.more").live("click", function (event) { _this._toggleMore($(this), event); });

            $("div#footer").bind("touchmove", function () { event.preventDefault(); });
            $("div#footer ul.menu a").live("click", function (event) { _this._selectMenu($(this), event, this.options); }).eq(0).click();
        },
        _touchStart: function (sender, event)
        {
            var tag = sender.attr("tag");
            var touch = event.originalEvent.touches[0];

            if (this._touchInfo == undefined)
            {
                this._touchInfo = {};
                this._touchInfo.start = { pageX: touch.pageX, pageY: touch.pageY, time: Date.now() };
            }

            if (this._touchInfo[tag] != undefined)
            {
                return;
            }

            var args = { sender: sender };

            switch (tag)
            {
                case "showcase":

                    break;
            }

            this._touchInfo[tag] = args;
        },
        _touchMove: function (sender, event)
        {
            if (this._touchInfo == undefined) { return; }

            var start = this._touchInfo.start;
            var touch = event.originalEvent.touches[0];

            if (this._touchInfo.vertical == undefined)
            {
                var xx = Math.pow(start.pageX - touch.pageX, 2);
                var yy = Math.pow(start.pageY - touch.pageY, 2);
                if (xx + yy > 450) { this._touchInfo.vertical = yy > xx; }
            }

            if (this._footPrint != undefined)
            {
                this._footPrint = [this._footPrint[1], { t: Date.now(), x: event.pageX, y: event.pageY }];
            }
            else
            {
                this._footPrint = [{ t: start.time, x: start.pageX, y: start.pageY }, { t: Date.now(), x: event.pageX, y: event.pageY }];
            }

            if (this._touchInfo.showcase != undefined && this._touchInfo.vertical)
            {
                var args = this._touchInfo.showcase;
                //args.sender.scrollTop(args.value - touch.pageY + start.pageY);

                event.preventDefault();
            }
        },
        _touchEnd: function (sender, event)
        {
            this._touchInfo = null;
        },
        _keyPress: function (sender, event)
        {
            switch (sender.attr("tag"))
            {
                case "search":
                    if (event.keyCode == 13 && !sender.hasClass("empty")) { this._search(sender.val()); }
                    break;
            }
        },
        _change: function (sender, event)
        {
            switch (sender.attr("tag"))
            {
                case "search":
                    if (sender.val().length == 0) { sender.parent(".filled").removeClass("filled"); }
                    else if (!sender.hasClass("empty")) { sender.parent().addClass("filled"); }
                    break;
            }
        },
        _clear: function (sender, event)
        {
            $("div#header input.keywords").val("").blur().parent().removeClass("filled");
        },
        _open: function (sender, event)
        {
            if (!this._validRequest(sender, event)) { return; }

            if (this.__togglingPartial) { return; }
            else { this.__togglingPartial = true; }

            var _this = this;
            var header = $("div#header");
            var main = $("div#main");
            var name = sender.attr("name");
            var title = sender.attr("title");
            var indexed = main.children("div.partial");
            var visible = indexed.filter(":visible");
            var h1 = header.children("h1:visible");
            var back = header.children("a.back:visible");
            var h1Template = header.children("h1.template");
            var h1New = h1Template.clone().removeClass("template").text(title);
            var partialTemplate = $("div.partial.template");
            var partialNew = $("<div>").addClass("partial");
            var wrapper = partialTemplate.children("div.wrapper").clone().empty();
            var loading = $("div#loading").hide();
            var width = main.width();

            visible.css({ left: 0 });
            main.children("div.partial[name='" + name + "']").remove();
            partialNew.attr({ index: indexed.length, name: name, style: partialTemplate.attr("style"), tag: "partial", title: title });
            partialNew.append(wrapper).appendTo(main).show();

            var complete = function (json)
            {
                if (json != undefined && loading.is(":visible"))
                {
                    _this._generatePartial(wrapper, name, json);
                }

                loading.hide();
            };

            if (indexed.length <= 0)
            {
                h1.remove();
                back.remove();
                h1New.appendTo(header);
                loading.show();
                partialNew.css({ left: 0 });

                this.__togglingPartial = false;
                this._loadPartial(this._getAjaxOptions(sender), complete);
                return;
            }

            var duration = 500;
            var backTemplate = header.children("a.back.template");
            var backNew = backTemplate.clone().removeClass("template").text(visible.attr("title"));
            var h1MarginLeft = h1New.i("margin-left");
            var backMarginLeft = backNew.i("margin-left");

            h1.animate({ marginLeft: -h1.r("width", 0.5) - backMarginLeft, opacity: 0 }, duration, function () { $(this).remove(); });
            back.animate({ marginLeft: -0.5 * width }, duration, function () { $(this).remove(); });
            h1New.css({ opacity: 0 }).css({ marginLeft: width - h1New.r("width", 0.5) }).animate({ marginLeft: h1MarginLeft, opacity: 1 }, duration);
            backNew.css({ opacity: 0 }).css({ marginLeft: i(0.5 * (width - backNew.outerWidth())) }).animate({ marginLeft: backMarginLeft, opacity: 1 }, duration);

            h1Template.after(h1New);
            backTemplate.after(backNew);
            partialNew.css({ left: width });

            main.animate({ scrollLeft: width }, duration, function ()
            {
                visible.hide();
                loading.show();
                partialNew.css({ left: 0 });
                $(this).scrollLeft(0);

                _this.__togglingPartial = false;
                _this._loadPartial(_this._getAjaxOptions(sender), complete);
            });
        },
        _back: function (sender, event)
        {
            if (this.__togglingPartial) { return; }
            else { this.__togglingPartial = true; }

            var _this = this;
            var header = $("div#header");
            var main = $("div#main");
            var indexed = main.children("div.partial");
            var visible = indexed.filter(":visible");
            var index = i(visible.attr("index"));
            var previous = isNaN(index) ? indexed.last().show() : indexed.filter("[index=" + (index - 1) + "]").show();
            var previousIndex = i(previous.attr("index"));
            var width = main.width();
            var h1 = header.children("h1:visible");
            var back = header.children("a.back:visible");
            var name = previous.attr("name");
            var title = previous.attr("title");
            var h1Template = header.children("h1.template");
            var h1New = h1Template.clone().removeClass("template").text(title);
            var loading = $("div#loading").hide();
            var h1MarginLeft = h1New.i("margin-left");
            var backMarginLeft = back.i("margin-left");
            var duration = 500;

            h1.animate({ marginLeft: width - h1New.r("width", 0.5), opacity: 0 }, duration, function () { $(this).remove(); });
            back.animate({ marginLeft: i(0.5 * (width - back.outerWidth())), opacity: 0 }, duration, function () { $(this).remove(); });
            h1New.css({ opacity: 0 }).css({ marginLeft: -h1.r("width", 0.5) - backMarginLeft }).animate({ marginLeft: h1MarginLeft, opacity: 1 }, duration);
            h1Template.after(h1New);

            if (previousIndex >= 1)
            {
                var earlier = indexed.filter("[index=" + (previousIndex - 1) + "]");
                var backTemplate = header.children("a.back.template");
                var backNew = backTemplate.clone().removeClass("template").text(earlier.attr("title"));

                backNew.css({ opacity: 0 }).css({ marginLeft: -0.5 * width }).animate({ marginLeft: backMarginLeft, opacity: 1 }, duration);
                backTemplate.after(backNew);
            }

            visible.css({ left: width });
            previous.css({ left: 0 });

            main.scrollLeft(width).animate({ scrollLeft: 0 }, duration, function ()
            {
                _this.__togglingPartial = false;
                visible.remove();
            });
        },
        _validRequest: function (sender, event)
        {
            return !(sender.hasClass("item") && sender.attr("identity") == undefined);
        },
        _search: function (keywords)
        {
            alert(keywords);
        },
        _loadPartial: function (options, callback)
        {
            var ajaxJson =
            {
                url: options.url,
                data: options.data,
                cache: false,
                success: function (json)
                {
                    if (loadingIndex == _this.__loadPartialIndex)
                    {
                        if ($.isFunction(callback)) { callback(json); }
                    }
                },
                error: function (response)
                {
                    if (loadingIndex == _this.__loadPartialIndex)
                    {
                        alert("Cannot connect to iRepeater Store");
                    }
                },
                complete: function ()
                {
                    if (loadingIndex == _this.__loadPartialIndex)
                    {
                        if ($.isFunction(callback)) { callback(json); }
                    }
                }
            };

            var _this = this;
            var loadingIndex = this.__loadPartialIndex = (this.__loadPartialIndex || 0) + 1;
            $.ajax(ajaxJson);
        },
        _loadComment: function (productId, callback)
        {
            var ajaxJson =
            {
                url: config.urls.comment,
                data: { productId: productId },
                cache: false,
                success: function (json)
                {
                    if ($.isFunction(callback))
                    {
                        callback();
                    }
                }
            };

            $.ajax(ajaxJson);
        },
        _getAjaxOptions: function (sender)
        {
            var options = { url: null, data: {} };
            var name = sender.attr("name");
            var tag = sender.attr("tag");

            switch (tag)
            {
                case "menu":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + name;
                    break;
                case "topic":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + "topic";
                    options.data = { id: sender.attr("identity") };
                    break;
                case "seeall":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + "products";
                    options.data = { orderby: sender.attr("name") };
                    break;
                case "product":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + "product";
                    options.data = { id: sender.attr("identity") };
                    break;
            }

            return options;
        },
        _download: function (sender, event)
        {
            if (sender.hasClass("active"))
            {

            }
            else
            {
                var active = $("a.price.active").css({ width: "auto" });
                var width = sender.hide().text("Buy Now").addClass("active").width();

                active.removeClass("active").text(function () { return $(this).attr("price"); });
                sender.text(sender.attr("price")).show().animate({ width: width }, 250, function ()
                {
                    var $this = $(this);
                    if ($this.hasClass("active")) { $this.text("Buy Now"); }
                    else { $this.css({ width: "auto" }); }
                });
            }
        },
        _toggleMore: function (sender, event)
        {
            var ps = sender.parents("div.detail").find("p.desc");

            if (sender.hasClass("down"))
            {
                sender.removeClass("down").addClass("up");
                ps.filter(".preview").hide();
                ps.filter(".text").show();
            }
            else
            {
                sender.removeClass("up").addClass("down");
                ps.filter(".preview").show();
                ps.filter(".text").hide();
            }
        },
        _resizePage: function (width, height)
        {
            var body = $(document.body);
            var header = body.children("div#header");
            var footer = body.children("div#footer");
            var main = body.children("div#main");
            var loading = body.children("div#loading");
            var partial = body.children("div.partial");

            header.css({ height: i(width * 0.045), top: 0, width: width });
            footer.css({ height: i(width * 0.050), width: width }).css({ top: height - footer.height() });
            main.css({ height: height - header.height() - footer.height(), left: 0, top: header.height(), width: width });
            loading.css({ fontSize: i(width * 0.0125) }).css({ borderRadius: loading.i("font-size", 0.5), padding: loading.i("font-size"), paddingLeft: loading.i("font-size", 3), width: loading.width() });
            loading.css({ "background-position-x": loading.i("font-size", 0.55), height: loading.i("font-size", 1.5) }).css({ lineHeight: loading.css("height"), left: i((width - loading.outerWidth()) * 0.5), top: i((height - loading.outerHeight()) * 0.5) });
            partial.css({ height: main.height(), width: main.width() });

            this._resizeHeader(header, header.width(), header.height()).show();
            this._resizeFooter(footer, footer.width(), footer.height()).show();
            this._resizePartial(partial, partial.width(), partial.height());
        },
        _resizeHeader: function (header, width, height)
        {
            var h1 = header.children("h1");
            var back = header.children("a.back");
            var search = header.children("form.search");
            var keywords = search.find("input.keywords");
            var searchClear = search.find("a.clear");

            h1.css({ fontSize: i(height * 0.42), height: height, lineHeight: height + "px", width: i(width * 0.25) }).css({ marginLeft: i(0.5 * (width - h1.width())) });
            back.css({ fontSize: i(height * 0.28), height: i(height * 0.7), marginLeft: r(width * 0.016) });
            back.css({ "border-left-width": back.r("height", 0.5), "border-right-width": back.r("height", 0.25), lineHeight: back.css("height"), marginTop: r(0.5 * (height - back.height())) });
            search.css({ height: i(height * 0.33) * 2, right: i(width * 0.013), width: i(width * 0.2) });
            search.css({ borderRadius: search.height(), marginTop: r(0.5 * (height - search.height())), boxShadow: this._getShadow(height * 0.05, height * 0.05, height * 0.05, "rgba(0,0,0,0.5)", true) });
            keywords.css({ fontSize: i(search.height() * 0.5), marginLeft: search.height(), marginTop: i(search.height() * 0.15) }).css({ height: search.height() - 2 * keywords.i("margin-top") });
            keywords.css({ lineHeight: keywords.css("height"), width: search.width() - 2 * keywords.i("margin-left") });
            searchClear.css({ height: keywords.height(), marginTop: keywords.css("margin-top") }).css({ marginLeft: searchClear.css("margin-top"), width: searchClear.height() });

            return header;
        },
        _resizeFooter: function (footer, width, height)
        {
            var menu = footer.children("ul.menu");
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
        _resizePartial: function (partial, width, height)
        {
            var wrapper = partial.children("div.wrapper");
            var banner = partial.children("div.banner");
            var showcase = partial.children("*.showcase");
            var quickLink = partial.children("*.quicklink");
            var superlink = partial.children("div.superlink");
            var detail = partial.children("div.detail");

            var grid = { height: i(width * 0.1), width: i(width * 0.2416) };
            var margin = i((width - 4 * grid.width) * 0.5);

            wrapper.css({ "min-height": height + 1, width: width });
            banner.css({ boxShadow: this._getShadow(width * 0.006, width * 0.006, width * 0.02, "rgba(0,0,0,0.21)") });
            banner.css({ height: 3 * grid.height, margin: margin, width: 4 * grid.width });
            superlink.css({ fontSize: i(width * 0.013), lineHeight: 2.5, paddingTop: i(width * 0.025), width: width });
            detail.css({ width: width });

            this._resizeBanner(banner, width, grid, margin);
            this._resizeShowcase(showcase, width, margin);
            this._resizeQuickLink(quickLink, width, margin);
            this._resizeDetail(detail, width, margin);
        },
        _resizeBanner: function (banner, width, grid, margin)
        {
            var display = banner.children("a.display");
            var displayImg = display.children("img");
            var loop = banner.children("ul.loop");
            var loopList = loop.children("li");

            display.css({ height: 3 * grid.height, width: 3 * grid.width });
            displayImg.css({ height: display.height(), width: display.width() });
            loop.css({ width: grid.width });
            loopList.css({ height: grid.height });
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
            head.css({ fontSize: i(width * 0.014), lineHeight: i(width * 0.05) + "px", marginTop: i(width * 0.02), width: width });
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
            name.css({ marginBottom: item.r("height", 0.03), fontSize: headSpan.css("font-size"), lineHeight: headSpan.css("font-size") });
            text.css({ marginBottom: name.css("margin-bottom"), fontSize: name.r("font-size", 0.65) });
            star.css({ height: text.i("font-size") });
            price.css({ fontSize: i(width * 0.012), height: i(width * 0.02), marginRight: margin }).css({ marginTop: -i(0.5 * (info.height() + price.height())) });
            price.css({ borderRadius: price.i("height", 0.18), lineHeight: price.css("height"), padding: "0px " + price.i("height", 0.5) + "px" });
            price.css({ boxShadow: this._getShadow(price.height() * 0.05, price.height() * 0.05, price.height() * 0.2, "rgba(0,0,0,0.6)", true) });
            desc.css({ height: iconType.height() }).css({ lineHeight: desc.css("height"), marginTop: desc.i("height", 0.5), width: width });
            descSpan.css({ fontSize: text.css("font-size"), marginLeft: margin, paddingLeft: desc.height() });
            navList.css({ height: i(width * 0.0065), margin: i(width * 0.01) }).css({ borderRadius: navList.height(), width: navList.height() });
            navList.css({ boxShadow: this._getShadow(navList.height() * 0.2, navList.height() * 0.2, navList.height() * 0.5, "rgba(0,0,0,0.45)", true) });
            navs.css({ height: navList.height() + 2 * i(navList.css("margin-top")) }).attr({ unitWidth: navList.width() + 2 * i(navList.css("margin-top")) });
        },
        _resizeQuickLink: function (quickLink, width, margin)
        {
            var head = quickLink.filter("h2");
            var headSpan = head.children("span");
            var div = quickLink.filter("div");
            var welcome = div.find("p.welcome");
            var links = div.find("ul.links");
            var linkList = links.children();

            head.css({ fontSize: i(width * 0.014), lineHeight: i(width * 0.05) + "px", marginTop: i(width * 0.04), width: width });
            headSpan.css({ fontSize: i(width * 0.017), marginLeft: margin });
            div.css({ boxShadow: this._getShadow(0, 0, i(width * 0.01), "rgba(0,0,0,0.3)", true), width: width - 2 - 4 * margin });
            div.css({ borderRadius: i(width * 0.01), borderWidth: 1, margin: "0px " + margin + "px " + (2 * margin) + "px", padding: margin });
            welcome.css({ fontSize: i(width * 0.025), height: i(width * 0.041) });
            links.css({ fontSize: i(width * 0.016), lineHeight: 2.8, marginTop: margin });
            linkList.css({ width: div.i("width", 1 / 3) });
        },
        _resizeDetail: function (detail, width, margin)
        {
            var left = detail.children("div.left");
            var icon = left.children("div.icon");
            var iconType = icon.children("span.type");
            var price = left.children("a.price");
            var texts = left.children("p.text");
            var hr = left.children("hr");
            var right = detail.children("div.right");
            var h2 = right.children("h2");
            var h3 = right.children("h3");
            var h4 = right.children("h4");
            var desc = right.children("p.desc");
            var more = right.find("a.more");

            left.css({ margin: margin, marginRight: 0, width: i(width * 0.2) });
            icon.css({ borderRadius: left.i("width", 0.075), height: left.width(), width: left.width() });
            iconType.css({ "border-top-right-radius": icon.css("border-bottom-left-radius"), height: i(width * 0.035) }).css({ marginTop: -iconType.height(), width: iconType.height() });
            price.css({ fontSize: i(width * 0.012), height: i(width * 0.02), marginBottom: margin, marginTop: margin });
            price.css({ borderRadius: price.i("height", 0.18), lineHeight: price.css("height"), padding: "0px " + price.i("height", 0.5) + "px" });
            price.css({ boxShadow: this._getShadow(price.height() * 0.05, price.height() * 0.05, price.height() * 0.2, "rgba(0,0,0,0.6)", true) });
            texts.css({ fontSize: i(width * 0.012), lineHeight: 1.6 });
            hr.css({ margin: i(width * 0.005) + "px 0px" });
            right.css({ margin: margin, width: (width - left.width()) - 3 * margin });
            h3.css({ fontSize: i(width * 0.0125), height: i(width * 0.04) });
            h2.css({ fontSize: i(width * 0.02), height: i(width * 0.04) });
            h4.css({ fontSize: i(width * 0.0125), lineHeight: 1.5, margin: i(width * 0.025) + "px 0px " + i(width * 0.01) + "px" });
            desc.css({ fontSize: i(width * 0.012), lineHeight: 1.5, margin: i(width * 0.012) + "px 0px" });
            more.css({ fontSize: i(width * 0.012), height: i(width * 0.015), marginBottom: i(width * 0.012) });
            more.css({ lineHeight: more.css("height"), paddingLeft: more.i("height", 1.3), paddingRight: more.i("height", 0.3) });
            more.css({ "background-position-x": more.css("padding-right"), borderRadius: more.i("height", 0.3) });

            this._resizeOthers(right, right.width());
        },
        _resizeOthers: function (right, width)
        {
            var poster = right.children("div.poster");
            var posterWrapper = poster.children("div.wrapper");
            var posterUl = posterWrapper.children("ul");
            var posterLi = posterUl.children("li");
            var rating = right.children("div.rating");
            var ratingUl = rating.children("ul");
            var ratingLi = ratingUl.children("li");
            var ratingSpan = ratingLi.children("span");
            var ratingSpanLeft = ratingSpan.filter(".left");
            var ratingSpanRight = ratingSpan.filter(".right");
            var ratingSpanBar = ratingSpanRight.filter(".bar");
            var ratingRate = rating.children("div.rate");
            var ratingWrapper = ratingRate.children("div.wrapper");
            var ratingRateText = ratingWrapper.children("span");
            var ratingRateHandler = ratingWrapper.children("label");

            var ratingUnitHeight = i(width * 0.02);

            poster.css({ border: "solid 1px rgba(0,0,0,0.35)", borderRadius: i(width * 0.01), height: right.i("width", 0.45), width: right.width() - 2 });
            posterWrapper.css({ margin: poster.i("height", 0.05) }).css({ height: poster.height() - 2 * posterWrapper.i("margin-top"), width: poster.width() - 2 * posterWrapper.i("margin-top") });
            posterUl.css({ height: posterWrapper.height() });
            posterLi.css({ height: posterWrapper.height(), marginRight: posterWrapper.css("margin-left") });
            rating.css({ height: 6 * ratingUnitHeight, width: width });
            ratingUl.css({ "border-right-width": 1, fontSize: i(width * 0.015), height: rating.height(), width: i(width * 0.5) });
            ratingLi.css({ height: ratingUnitHeight, width: ratingUl.width() });
            ratingSpan.css({ lineHeight: ratingLi.css("height") });
            ratingSpanLeft.css({ height: ratingLi.height(), width: ratingLi.i("height", 6) });
            ratingSpanRight.css({ width: ratingLi.width() - ratingSpanLeft.i("width", 1.5) });
            ratingSpanBar.css({ borderWidth: 1, margin: ratingLi.i("height", 0.18) + "px 0px" }).css({ height: ratingLi.height() - 2 * ratingSpanBar.i("margin-top") - 2 });
            ratingRate.css({ "border-left-width": 1, height: rating.height(), width: width - ratingUl.width() - 2 });
            ratingWrapper.css({ margin: ratingRate.i("height", 0.39) + "px auto" }).css({ height: ratingRate.height() - 2 * ratingWrapper.i("margin-top") });
            ratingRateText.css({ fontSize: ratingWrapper.i("height", 0.7), height: ratingWrapper.height(), lineHeight: ratingWrapper.css("height") });
            ratingRateHandler.css({ height: ratingWrapper.height(), width: ratingWrapper.height() * 7 });
        },
        _getShadow: function (x, y, range, color, inset)
        {
            return x + "px " + y + "px " + range + "px " + color + (inset ? " inset" : "");
        },
        _selectMenu: function (sender, event, options)
        {
            sender.parents("ul.menu").find("a").removeClass("selected");
            sender.addClass("selected");

            $("div#header>form.search").css({ display: options.searchable ? "block" : "none" });
            $("div#main").empty();

            var _this = this;
            setTimeout(function () { _this._open(sender, event); });
        },
        _setBannerAnimation: function (banner)
        {
            var display = banner.children("a.display");
            var loop = banner.children("ul.loop");
            var height = loop.children().height();
            var length = loop.children().length;
            var from = -(length - 3) * height;
            var to = -(length - 4) * height;
            var getCss = function (value)
            {
                return {
                    "-webkit-transform": "translateY(" + value + "px)",
                    "-ms-transform": "translateY(" + value + "px)",
                    "transform": "translateY(" + value + "px)"
                };
            }

            var animation = function ()
            {
                var last = loop.children().last();
                var lastLink = last.children("a");
                var offset = from;

                var timer = setInterval(function ()
                {
                    offset += 2;

                    if (offset >= to)
                    {
                        loop.css(getCss(from)).prepend(last.remove());
                        display.attr({ identity: lastLink.attr("identity"), title: lastLink.attr("title") });
                        display.find("img").attr({ src: lastLink.find("img").attr("src") });

                        clearInterval(timer);
                        setTimeout(animation, 10000);
                    }
                    else
                    {
                        loop.css(getCss(offset));
                    }
                }, 10);
            };

            animation();
        },
        _generatePartial: function (target, name, json)
        {
            var template = $("div.partial.template");

            switch (name)
            {
                case "featured":
                    this._generateBanner(target, template, json.Topics);
                    this._generateShowcase(target, template, json.Newest, 6, "newest", true);
                    this._generateShowcase(target, template, json.Hottest, 6, "hottest", true);
                    this._generateQuickLink(target, template);
                    break;
                case "newest":
                case "hottest":
                    this._generateShowcase(target, template, json, 12, name);
                    break;
                case "topic":
                    this._generateShowcase(target, template, json.Products, 12, name);
                    break;
                case "product":
                    this._generateDetail(target, template, json);
                    break;
            }

            if (name != "product")
            {
                this._generateSubperLink(target, template);
            }
        },
        _generateBanner: function (target, template, array)
        {
            var banner = template.children("div.banner").clone();
            var display = banner.children("a.display");
            var loop = banner.children("ul.loop");
            var loopItem = loop.children("li").remove().first();

            banner.appendTo(target);

            $.each(array, function (i, json)
            {
                var item = loopItem.clone().appendTo(loop);
                item.find("a").attr({ identity: json.Id, title: json.Name }).find("img").attr({ src: json.ImageUrl });
            });

            this._setBannerAnimation(banner);
        },
        _generateShowcase: function (target, template, array, pageSize, name, light)
        {
            var _this = this;

            var head = template.find("h2.showcase").clone().appendTo(target);
            var div = template.find("div.showcase").clone().appendTo(target);
            var desc = template.find("p.showcase").clone().appendTo(target);
            var pages = div.children("ul").attr({ tag: "showcase" });
            var pageItem = pages.children("li").remove().first();
            var productItem = pageItem.children("div.item").remove().first();

            var pageCount = Math.ceil(array.length / pageSize);
            var autoWidth = i(pages.attr("autoWidth"));
            var title = (function (c) { return (c && c.title) ? c.title : $("div#header h1").text(); })(config.partials[name]);
            var navs = null, navItem = null;

            head.find("span").text(title + " ");

            if (light)
            {
                var navs = template.find("ol.showcase").clone();
                var navItem = navs.children("li").remove().first();
                navs.appendTo(target).css({ width: pageCount * i(navs.attr("unitWidth")) });
                head.find("a").attr({ name: name, title: title });
                head.find("label").remove();
            }
            else
            {
                var to = array.length > pageSize ? pageSize : array.length;
                head.find("label").text("1-" + to + " of " + array.length);
                head.find("a").remove();
            }

            for (var c = 0; c < (pageCount || 1) ; c++)
            {
                var page = pageItem.clone().attr({ index: c }).appendTo(pages);

                if (navs != null && navItem != null)
                {
                    navItem.clone().appendTo(navs).addClass(c == 0 ? "active" : null);
                }

                for (var j = 0; j < pageSize; j++)
                {
                    var index = c * pageSize + j;
                    var product = array[index];
                    var item = productItem.clone();

                    if (i(j / 3) % 2 == 1) { item.addClass("alter"); }
                    if (j % 3 == 1) { item.css({ width: autoWidth }); }

                    if (index >= array.length)
                    {
                        item.empty().appendTo(page);
                        continue;
                    }

                    var price = product.Price == 0 ? "Free" : (product.PriceUnit + product.Price.toFixed(2));

                    item.attr({ identity: product.Id, title: product.Name });
                    item.find("div.icon>img").attr({ src: product.IconUrl });
                    item.find("div.icon>span.type").addClass(product.Visual ? "video" : "audio");
                    item.find("p.name").text(product.Name);
                    item.find("p.published>span").text($.formatDate($.resolveDate(product.Updated), "dd MMMM yyyy"));
                    item.find("p.category>span.class").text(product.Class);
                    item.find("p.category>span.subclass").text(product.SubClass);
                    item.find("p.star").css({ backgroundPositionY: function () { return -$(this).height() * product.Star } });
                    item.find("a.price").attr({ price: price }).text(price);

                    item.appendTo(page);
                }
            }
        },
        _generateQuickLink: function (target, template)
        {
            var head = template.find("h2.quicklink").clone().appendTo(target);
            var div = template.find("div.quicklink").clone().appendTo(target);
        },
        _generateSubperLink: function (target, template)
        {
            template.find("div.superlink").clone().appendTo(target);
        },
        _generateDetail: function (target, template, json)
        {
            var _this = this;
            var detail = template.find("div.detail").clone();
            var left = detail.children("div.left");
            var icon = left.children("div.icon");
            var price = left.children("a.price");
            var right = detail.children("div.right");
            var texts = left.children("p.text");
            var right = detail.children("div.right");
            var h2 = right.children("h2");
            var h3 = right.children("h3");
            var h4 = right.children("h4");

            var _price = json.Price == 0 ? "Free" : (json.PriceUnit + json.Price.toFixed(2));
            var _updated = $.formatDate($.resolveDate(json.Updated), "dd MMMM yyyy");
            var _version = json.Version.toFixed(1);
            var _size = $.formatFileSize(json.Size);
            var _classes = [json.Class, json.SubClass].join(" > ");

            detail.appendTo(target);
            icon.find("img").attr({ src: json.IconUrl });
            price.attr({ price: _price }).text(_price);
            texts.filter(".category").children("span").text(json.Class);
            texts.filter(".updated").children("span").text(_updated);
            texts.filter(".version").children("span").text(_version);
            texts.filter(".size").children("span").text(_size);
            texts.filter(".language").children("span").text(json.Language);
            texts.filter(".rated").children("span").text(parseInt(json.Star) + "+");

            h3.text(_classes);
            h2.text(json.Name);

            this._generateDescription(right, json.Descriptions);
            this._generatePoster(right, json.Posters);
            this._generateRating(right, json);

            this._loadComment(json.Id, function (json) { _this._generateComment(json); });
        },
        _generateDescription: function (target, array)
        {
            if (array == undefined || array.length == 0)
            {
                return;
            }

            var maxLength = 200;
            var desc = target.children("p.desc").remove().first().addClass("text").hide();
            var elements = $.convert(array, function (i, e) { return desc.clone().text(e); });

            target.children("h4.desc").after(elements);
            elements = target.children("p.desc.text");

            if (array.length > 1 || array[0].length > maxLength)
            {
                var preview = elements.first().clone().removeClass("text").addClass("preview");
                if (preview.text().length > maxLength) { preview.text(preview.text().substring(0, maxLength) + "..."); }

                target.find("div.more>a").addClass("down");
                elements.last().after(preview.show());
            }
            else
            {
                elements.show();
            }
        },
        _generatePoster: function (target, array)
        {
            if (array == undefined || array.length == 0)
            {
                return;
            }

            var poster = target.children("div.poster");
            var wrapper = poster.children("div.wrapper");
            var ul = wrapper.children("ul");
            var li = ul.children("li").remove().first().show();
            var height = li.height();
            var width = 0;

            $.each(array, function (i, data)
            {
                var size = data.ImageSize;
                var img = li.clone().appendTo(ul).find("img").attr({ "src": data.ImageUrl });
                var imgWidth = (size == undefined || size.X == 0 || size.Y == 0) ? height : (size.X / size.Y * height);

                width += imgWidth;
                img.css({ height: height, width: imgWidth });
            });

            ul.children(":last").css({ marginRight: 0 });
            ul.css({ width: (array.length - 1) * li.i("margin-right") + width + 1 });
        },
        _generateRating: function (target, json)
        {
            var rating = target.children("div.rating");
            var spans = rating.find("ul span");
            var left = spans.filter(".left");
            var right = spans.filter(".right");
            var wrapper = rating.find("div.wrapper");

            var ratingHeight = spans.height();
            var ratingsCount = json.Ratings == undefined ? 0 : json.Ratings.length;
            var rightWidth = right.width();
            var maxStatistical = 0;

            right.filter(".sum").text(ratingsCount + (ratingsCount <= 1 ? " Rating" : " Ratings"));
            wrapper.css({ width: wrapper.children("span").width() + wrapper.children("label").width() });

            $.each(json.StatisticalRating, function (i, value)
            {
                if (value > maxStatistical) { maxStatistical = value; }
            });

            if (maxStatistical > 0)
            {
                $.each(json.StatisticalRating, function (i, value)
                {
                    right.filter(".s" + i).children("u").css({ width: (value / maxStatistical) * 100 + "%" });
                });
            }
        },
        _generateComment: function (array)
        {

        },
        _generateClear: function (tagName)
        {
            return $(document.createElement(tagName)).addClass("clear");
        },
        _generateMenu: function (partials)
        {
            var _this = this;
            var container = $("div#footer ul.menu");
            var template = container.children("li").remove().first();

            $.each(partials, function (name, partial)
            {
                if (partial.menu != undefined)
                {
                    var text = partial.menu.text;
                    var options = { name: name, searchable: partial.searchable };
                    var anchor = template.clone().appendTo(container).children("a").attr({ name: name, title: partial.title });

                    anchor.text(text).get(0).options = options;
                }
            });
        }
    };
})(window, jQuery);