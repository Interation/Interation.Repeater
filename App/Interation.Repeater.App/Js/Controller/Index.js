(function (window, $)
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

            this._generateMenu(config.partials);
            this._resizePage($(window).width(), $(window).height());

            $(document).bind("dbclick", function (event) { event.preventDefault(); })
                       .bind("touchend", function (event) { _this._touchEnd($(this), event); })
                       .bind("touchcancel", function (event) { _this._touchEnd($(this), event); })
                       .bind("touchmove", function (event) { _this._touchMove($(this), event); });

            $("div#header input.keywords").watermark("Search")
                                          .focus(function (event) { $(this).select(); })
                                          .keypress(function (event) { _this._keyPress($(this), event); })
                                          .bind("input", function (event) { _this._change($(this), event); });

            $("div#header a.back").live("click", function (event) { _this._back($(this), event); });
            $("div#header div.search a.clear").live("click", function () { _this._clearKeywords(); });


            $("div.partial").live("touchstart", function (event) { _this._touchStart($(this), event); });
            $("div.partial div.showcase ul").live("touchstart", function (event) { _this._touchStart($(this), event); });
            $("div.partial h2.showcase a").live("click", function (event) { _this._open($(this), event); });
            $("div.partial ul.showcase div.item").live("click", function (event) { _this._open($(this), event); });
            $("div.partial a.topic").live("click", function (event) { _this._open($(this), event); });
            $("div.partial a.price").live("click", function (event) { _this._download($(this), event); return false; });
            $("div.partial div.detail a.more").live("click", function (event) { _this._toggleMore($(this), event); });

            $("div#footer ul.menu a").live("click", function (event) { _this._selectMenu($(this), event, this.options); }).eq(0).click();
        },
        _touchStart: function (sender, event)
        {
            var module = sender.attr("module");
            var touch = event.originalEvent.touches[0];

            if (this._touchInfo == undefined)
            {
                this._touchInfo = {};
                this._touchInfo.start = { pageX: touch.pageX, pageY: touch.pageY, time: Date.now() };
            }

            var args = { sender: sender };

            switch (module)
            {
                case "partial":
                    args.value = sender.scrollTop();
                    args.minimum = 0;
                    args.maximum = sender.get(0).scrollHeight - sender.height();
                    args.maximum = args.maximum < args.minimum ? args.minimum : args.maximum;
                    break;
                case "":
                    break;
            }

            this._touchInfo[module] = args;
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

            if (this._touchInfo.partial != undefined)
            {
                var args = this._touchInfo.partial;
                args.sender.scrollTop(args.value - touch.pageY + start.pageY);
            }

            event.preventDefault();

            //if (this._touchInfo.partial != undefined)
            //{
            //    if (this._touchInfo.vertical === true || this._touchInfo.showcase == undefined)
            //    {
            //        var _info = this._touchInfo.partial;
            //        var _sender = _info.sender;

            //        var marginTop = _info.marginTop + event.pageY - start.pageY;
            //        if (marginTop < _info.minMarginTop) { marginTop = _info.minMarginTop + (marginTop - _info.minMarginTop) * 0.5; }
            //        else if (marginTop > _info.maxMarginTop) { marginTop = _info.maxMarginTop + (marginTop - _info.maxMarginTop) * 0.5; }

            //        _sender.css({ marginTop: marginTop });
            //    }
            //}

            //if (this._touchInfo.showcase != undefined)
            //{
            //    if (this._touchInfo.vertical === false)
            //    {
            //        var _info = this._touchInfo.showcase;
            //        var _sender = _info.sender;

            //        var marginLeft = _info.marginLeft + event.pageX - start.pageX;
            //        if (marginLeft < _info.minMarginLeft) { marginLeft = _info.minMarginLeft; }
            //        else if (marginLeft > _info.maxMarginLeft) { marginLeft = _info.maxMarginLeft; }

            //        _sender.css({ marginLeft: marginLeft });
            //    }
            //}
        },
        _touchEnd: function (sender, event)
        {
            this._touchInfo = null;

            //if (this._touchInfo == undefined)
            //{
            //    return;
            //}

            //if (this._touchInfo.partial != undefined && this._touchInfo.vertical === true)
            //{
            //    var _info = this._touchInfo.partial;
            //    var _sender = _info.sender;
            //    var marginTop = _sender.i("margin-top");

            //    if (marginTop < _info.minMarginTop) { _sender.animate({ marginTop: _info.minMarginTop }); }
            //    else if (marginTop > _info.maxMarginTop) { _sender.animate({ marginTop: _info.maxMarginTop }); }
            //}

            //if (this._touchInfo.showcase != undefined && this._touchInfo.vertical === false)
            //{
            //    var _info = this._touchInfo.showcase;
            //    var _sender = _info.sender;
            //    var s0 = _sender.i("margin-left");
            //    var dt = this._footPrint[1].t - this._footPrint[0].t;
            //    var v0 = dt == 0 ? 0 : (this._footPrint[1].x - this._footPrint[0].x) / dt;
            //    var unit = sender.children().width();
            //    var index = s0 / unit;

            //    _sender.climb({
            //        css: "margin-left",
            //        x1: Math.floor(index) * unit,
            //        x2: Math.ceil(index) * unit,
            //        s0: s0,
            //        v0: v0,
            //        complete: function (v)
            //        {
            //            var parent = _sender.parents("div.showcase");
            //            var category = parent.attr("category");
            //            var i = v < 0 ? Math.floor(1 - index) : Math.ceil(-1 - index);
            //            parent.parent().children("ol[category='" + category + "']").children().removeClass("active").eq(i).addClass("active");
            //        }
            //    });
            //}

            //this._touchInfo = null;
        },
        _keyPress: function (sender, event)
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
        _search: function (keywords)
        {
            alert(keywords);
        },
        _clearKeywords: function ()
        {
            $("input.keywords").val("").blur().parent().removeClass("filled");
        },
        _back: function (sender, event)
        {
            var _this = this;
            var indexed = $("div.partial[index]");
            var visible = indexed.filter(":visible");
            var index = i(visible.attr("index"));
            var previous = isNaN(index) ? indexed.last().show() : indexed.filter("[index=" + (index - 1) + "]").show();
            var previousIndex = i(previous.attr("index"));
            var width = $(window).width();
            var body = $(document.body).addClass("loading");
            var header = $("div#header");
            var h1 = header.children("h1:visible");
            var back = header.children("a.back:visible");
            var name = previous.attr("name");
            var title = previous.attr("title");
            var h1New = header.children("h1.template").clone().removeClass("template").text(title);
            var loading = $("div#loading").hide();
            var h1MarginLeft = h1New.i("margin-left");
            var backMarginLeft = back.i("margin-left");
            var duration = 500;

            h1.animate({ marginLeft: $(window).width() - h1New.r("width", 0.5), opacity: 0 }, duration, function () { $(this).remove(); });
            back.animate({ marginLeft: i(0.5 * ($(window).width() - back.outerWidth())), opacity: 0 }, duration, function () { $(this).remove(); });
            h1New.css({ opacity: 0 }).prependTo(header).css({ marginLeft: -h1.r("width", 0.5) - backMarginLeft }).animate({ marginLeft: h1MarginLeft, opacity: 1 }, duration);

            if (previousIndex >= 1)
            {
                var earlier = indexed.filter("[index=" + (previousIndex - 1) + "]");
                var earlierName = earlier.attr("name");
                var earlierTitle = earlier.attr("title");
                var backNew = header.children("a.back.template").clone().removeClass("template").text(earlierTitle);
                backNew.css({ opacity: 0 }).prependTo(header).css({ marginLeft: -0.5 * ($(window).width()) }).animate({ marginLeft: backMarginLeft, opacity: 1 }, duration);
            }

            previous.animate({ marginLeft: 0 }, {
                duration: duration,
                step: function (current)
                {
                    visible.css({ marginLeft: width + current, width: -current });
                },
                complete: function ()
                {
                    visible.remove();
                    body.removeClass("loading");
                }
            });
        },
        _open: function (sender, event)
        {
            if (!this._validRequest(sender, event))
            {
                return;
            }

            var _this = this;
            var name = sender.attr("name");
            var title = sender.attr("title");
            var indexed = $("div.partial[index]");
            var header = $("div#header");
            var body = $(document.body).addClass("loading");
            var h1 = header.children("h1:visible");
            var back = header.children("a.back:visible");
            var h1New = header.children("h1.template").clone().removeClass("template").text(title);
            var backNew = header.children("a.back.template").clone().removeClass("template").text(indexed.last().attr("title"));
            var loading = $("div#loading").hide();

            var complete = function (json)
            {
                if (json != undefined && loading.is(":visible"))
                {
                    _this._generatePartial(name, title, json);
                    body.removeClass("loading");
                }

                loading.hide();
            };

            if (indexed.length <= 0)
            {
                h1.remove();
                back.remove();
                h1New.appendTo(header);
                loading.show();

                this._loadPartial(this._getAjaxOptions(sender), complete);
                return;
            }

            var duration = 500;
            var h1MarginLeft = h1New.i("margin-left");
            var backMarginLeft = backNew.i("margin-left");

            h1New.css({ opacity: 0 }).prependTo(header).css({ marginLeft: $(window).width() - h1New.r("width", 0.5) }).animate({ marginLeft: h1MarginLeft, opacity: 1 }, duration);
            backNew.css({ opacity: 0 }).prependTo(header).css({ marginLeft: i(0.5 * ($(window).width() - backNew.outerWidth())) }).animate({ marginLeft: backMarginLeft, opacity: 1 }, duration);
            h1.animate({ marginLeft: -h1.r("width", 0.5) - backMarginLeft, opacity: 0 }, duration, function () { $(this).remove(); });
            back.animate({ marginLeft: -0.5 * ($(window).width()) }, duration, function () { $(this).remove(); });

            indexed.filter(":visible").animate({ marginLeft: -$(window).width() }, duration, function ()
            {
                $(this).hide();
                loading.show();

                _this._loadPartial(_this._getAjaxOptions(sender), complete);
            });
        },
        _validRequest: function (sender, event)
        {
            if (sender.hasClass("item") && sender.attr("identity") == undefined)
            {
                return false;
            }

            return true;
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
                    if (loadingIndex == _this.__loadingIndex)
                    {
                        if (typeof callback == "function") { callback(json); }
                    }
                },
                error: function (response)
                {
                    if (loadingIndex == _this.__loadingIndex)
                    {
                        alert("Cannot connect to iRepeater Store");
                    }
                },
                complete: function ()
                {
                    if (loadingIndex == _this.__loadingIndex)
                    {
                        if (typeof callback == "function") { callback(); }
                    }
                }
            };

            var _this = this;
            var loadingIndex = this.__loadingIndex = (this.__loadingIndex || 0) + 1;
            $.ajax(ajaxJson);
        },
        _getAjaxOptions: function (sender)
        {
            var options = { url: null, data: {} };
            var name = sender.attr("name");
            var action = sender.attr("action");
            var tagName = sender.get(0).tagName.toLowerCase();

            switch (tagName + "-" + action)
            {
                case "a-menu":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + name;
                    break;
                case "a-topic":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + action;
                    options.data = { id: sender.attr("identity") };
                    break;
                case "a-products":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + action;
                    options.data = { orderby: sender.attr("name") };
                    break;
                case "div-product":
                    options.url = config.urls.partial.replace(/(\/*)$/, "/") + action;
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
            var header = $("div#header");
            var footer = $("div#footer");
            var loading = $("div#loading");
            var partial = $("div.partial");

            header.css({ height: i(width * 0.045), top: 0, width: width });
            footer.css({ height: i(width * 0.050), width: width }).css({ top: height - footer.height() });
            loading.css({ fontSize: i(width * 0.0125) }).css({ borderRadius: loading.i("font-size", 0.5), padding: loading.i("font-size"), paddingLeft: loading.i("font-size", 3), width: loading.width() });
            loading.css({ "background-position-x": loading.i("font-size", 0.55), height: loading.i("font-size", 1.5) }).css({ lineHeight: loading.css("height"), left: i((width - loading.outerWidth()) * 0.5), top: i((height - loading.outerHeight()) * 0.5) });
            partial.css({ height: height - header.height() - footer.height(), marginBottom: footer.height(), marginTop: header.height(), top: 0, width: width });

            this._resizeHeader(header, header.width(), header.height()).show();
            this._resizeFooter(footer, footer.width(), footer.height()).show();
            this._resizePartial(partial, partial.width());
        },
        _resizeHeader: function (header, width, height)
        {
            var h1 = header.children("h1");
            var back = header.children("a.back");
            var search = header.children("div.search");
            var keywords = search.children("input.keywords");
            var searchClear = search.children("a.clear");

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
            var superlink = partial.find("div.superlink");
            var showcase = partial.find(".showcase");
            var quickLink = partial.find(".quicklink");
            var detail = partial.find("div.detail");

            var radius = r(width * 0.005);
            var grid = { height: i(width * 0.1), width: i(width * 0.242) };
            var margin = i((width - 4 * grid.width) * 0.5);

            banner.css({ "border-bottom-left-radius": radius, "border-top-left-radius": radius, height: 3 * grid.height, marginLeft: margin, marginTop: margin, width: 3 * grid.width });
            loop.css({ "border-bottom-right-radius": radius, "border-top-right-radius": radius, height: 3 * grid.height, marginRight: margin, marginTop: margin, width: grid.width });
            loopList.css({ height: grid.height, width: "100%" });
            superlink.css({ fontSize: i(width * 0.013), lineHeight: 2.5, paddingTop: i(width * 0.025), width: width });
            detail.css({ width: width });

            this._resizeShowcase(showcase, width, margin);
            this._resizeQuickLink(quickLink, width, margin);
            this._resizeProductPage(detail, width, margin);
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
        _resizeProductPage: function (detail, width, margin)
        {
            var left = detail.children("div.left");
            var icon = left.children("div.icon");
            var iconType = icon.children("span.type");
            var price = left.children("a.price");
            var texts = left.children("p.text");
            var hr = left.children("hr");
            var right = detail.children("div.right");
            var h3 = right.children("h3");
            var h2 = right.children("h2");
            var ps = right.children("p");
            var more = right.find("a.more");
            var screenshot = right.children("div.screenshot");

            left.css({ margin: margin, marginRight: 0, width: i(width * 0.2) });
            icon.css({ borderRadius: left.i("width", 0.075), height: left.width(), width: left.width() });
            iconType.css({ "border-top-right-radius": icon.css("border-bottom-left-radius"), height: i(width * 0.035) }).css({ marginTop: -iconType.height(), width: iconType.height() });
            price.css({ fontSize: i(width * 0.012), height: i(width * 0.02), marginBottom: margin, marginTop: margin });
            price.css({ borderRadius: price.i("height", 0.18), lineHeight: price.css("height"), padding: "0px " + price.i("height", 0.5) + "px" });
            price.css({ boxShadow: this._getShadow(price.height() * 0.05, price.height() * 0.05, price.height() * 0.2, "rgba(0,0,0,0.6)", true) });
            texts.css({ fontSize: i(width * 0.012), lineHeight: 1.6 });
            hr.css({ margin: i(width * 0.005) + "px 0px" });
            right.css({ margin: margin, width: (width - left.width()) - 3 * margin });
            h3.css({ fontSize: i(width * 0.015), height: i(width * 0.03) });
            h2.css({ fontSize: i(width * 0.02), height: i(width * 0.04) });
            ps.css({ fontSize: i(width * 0.012), lineHeight: 1.5, margin: i(width * 0.012) + "px 0px" });
            more.css({ fontSize: i(width * 0.012), height: i(width * 0.015), marginBottom: i(width * 0.012) }).css({ lineHeight: more.css("height"), paddingLeft: more.i("height", 1) });
            screenshot.css({ border: "solid 1px rgba(0,0,0,0.35)", height: right.i("width", 0.5), width: right.width() - 2 });
        },
        _getShadow: function (x, y, range, color, inset)
        {
            return x + "px " + y + "px " + range + "px " + color + (inset ? " inset" : "");
        },
        _selectMenu: function (sender, event, options)
        {
            sender.parents("ul.menu").find("a").removeClass("selected");
            sender.addClass("selected");

            /*****important*****/
            $("body").addClass("loading");
            $("div.partial[index]").remove();
            $("div#header>div.search").css({ display: options.searchable ? "block" : "none" });

            var _this = this;
            setTimeout(function () { _this._open(sender, event); });
        },
        _generatePartial: function (name, title, json)
        {
            $("div.partial." + name).remove();

            var _this = this;
            var indexed = $("div.partial[index]");
            var template = $("div.partial.template");
            var target = $("<div></div>").addClass("partial " + name).attr({ module: "partial", title: title });

            target.attr({ index: indexed.length, name: name, style: template.attr("style") });
            target.appendTo(document.body);

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
                    this._generateProductPage(target, template, json);
                    break;
            }

            if (name != "product")
            {
                this._generateSubperLink(target, template);
            }
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
                item.find("a.topic").attr({ identity: json.Id, title: json.Name }).find("img").attr({ src: json.ImageUrl });
            });

            var count = loop.children().length;
            var scrollTop = (count - 3) * li.height();
            var animateScrollTop = (count - 4) * li.height();

            var animate = function ()
            {
                var li = loop.children();
                var lastLink = li.last().find("a.topic");
                banner.attr({ identity: lastLink.attr("identity"), title: lastLink.attr("title") }).find("img").attr("src", lastLink.find("img").attr("src"));
                li.first().before(li.last().remove());
                loop.scrollTop(scrollTop);

                setTimeout(function ()
                {
                    loop.animate({ scrollTop: animateScrollTop }, 1000, animate);
                }, 8000);
            }

            animate();
        },
        _generateShowcase: function (target, template, array, pageSize, name, light)
        {
            var _this = this;

            var head = template.find("h2.showcase").clone().attr({ name: name });
            var div = template.find("div.showcase").clone().attr({ name: name });
            var desc = template.find("p.showcase").clone().attr({ name: name });
            var navs = null, navItem = null;

            var pages = div.children("ul").attr({ module: "showcase" });
            var pageItem = pages.children("li:first").clone();
            var productItem = pageItem.children("div.item:first").clone();

            var pageCount = Math.ceil(array.length / pageSize);
            var autoWidth = i(pages.attr("autoWidth"));
            var title = (function (c) { return (c && c.title) ? c.title : $("div#header h1").text(); })(config.partials[name]);

            head.appendTo(target).find("span").text(title + " ");
            div.appendTo(target);
            pages.empty().appendTo(div);
            pageItem.empty();
            desc.appendTo(target);

            if (light)
            {
                var navs = template.find("ol.showcase").clone().attr({ name: name });
                var navItem = navs.children("li:first").clone();
                navs.empty().appendTo(target).css({ width: pageCount * i(navs.attr("unitWidth")) });
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
        _generateProductPage: function (target, template, json)
        {
            var detail = template.find("div.detail").clone();
            var left = detail.children("div.left");
            var icon = left.children("div.icon");
            var price = left.children("a.price");
            var right = detail.children("div.right");
            var texts = left.children("p.text");
            var right = detail.children("div.right");
            var h3 = right.children("h3");
            var h2 = right.children("h2");
            var ps = right.children("p");
            var more = right.children("div.more").remove().first();

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

            if (json.Descriptions != undefined && json.Descriptions.length > 0)
            {
                var tem = right.children("p.desc").first();
                var convertor = function (i, e) { return tem.clone().hide().removeClass("head").addClass("text").text(e); };
                ps.after($.convert(json.Descriptions, convertor));

                var maxLength = 200;
                var texts = ps.parent().children("p.desc.text");

                if (json.Descriptions.length > 1 || json.Descriptions[0].length > maxLength)
                {
                    var preview = texts.first().clone().removeClass("text").addClass("preview");
                    if (preview.text().length > maxLength) { preview.text(preview.text().substring(0, maxLength) + "..."); }

                    ps.after(preview.show());
                    more.children("a").addClass("down");
                    texts.last().after(more);
                }
                else
                {
                    texts.show();
                }
            }

        },
        _generateClear: function (tagName)
        {
            return $(document.createElement(tagName)).addClass("clear");
        },
        _generateMenu: function (partials)
        {
            var _this = this;
            var container = $("div#footer ul.menu");
            var template = container.children("li:first");

            container.empty();

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