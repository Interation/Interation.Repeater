(function ($)
{
    var animation = function (sender, name, frames, options, callback)
    {
        options = options || {};
        options.duration = isNaN(options.duration) ? 1000 : options.duration;
        options.delay = isNaN(options.delay) ? 0 : options.delay;
        options.repeat = isNaN(options.repeat) ? "infinite" : parseInt(options.repeat);
        options.timingFunction = options.timingFunction || "ease";
        options.direction = options.direction || "normal";
        options.fillMode = options.fillMode || "forwards";

        this.name = name;
        this.frames = frames;
        this.options = options;
        this.sender = $(sender);
        this.callback = $.isFunction(callback) ? callback : function (event) { };
    };

    animation.prototype =
    {
        init: function ()
        {
            var _this = this;
            var options = this.options;
            var delay = options.duration + options.delay;

            this._generateStyle(this.name, this.frames, this.options);
            this.sender.addClass(this.name);

            if (options.repeat != 'infinite')
            {
                setTimeout(function () { _this.callback.call(_this); }, delay * options.repeat);
            }
            else
            {
                setInterval(function () { _this.callback.call(_this); }, delay);
            }

            return this;
        },
        pause: function ()
        {
            this.sender.css(this.getBrowserCode() + 'animation-play-state', 'paused');
            return this;
        },
        play: function ()
        {
            this.sender.css(this.getBrowserCode() + 'animation-play-state', 'running');
            return this;
        },
        _generateStyle: function (name, frames, options)
        {
            $(document.head).children("style#" + name).remove();
            var style = $("<style>").attr({ id: name, type: "text/css" });
            var keyframes = this._generateKeyframes(name, frames);
            var namedCss = this._generateNamedCss(name, options);

            $(document.head).append(style);
            style.append(document.createTextNode(keyframes));
            style.append(document.createTextNode(namedCss));
        },
        _generateKeyframes: function (name, frames)
        {
            var browserCode = this.getBrowserCode();
            var head = "@" + browserCode + "keyframes " + name;
            var content = $.convert(frames, function (k, frame)
            {
                var value = $.convert(frame, function (kk, value) { return browserCode + kk + ":" + value + ";" });

                return k + " {" + value + "}";
            }).join("\n");

            return [head, "\n{\n", content, "\n}\n"].join("");
        },
        _generateNamedCss: function (name, options)
        {
            var css =
            {
                "animation-name": name,
                "animation-duration": options.duration + "ms",
                "animation-timing-function": options.timingFunction,
                "animation-iteration-count": options.repeat,
                "animation-direction": options.direction,
                "animation-delay": options.delay + "ms",
                "animation-play-state": "running",
                "animation-fill-mode": options.fillMode
            };

            var browserCode = this.getBrowserCode();
            var content = $.convert(css, function (key, css) { return browserCode + key + ":" + css + ";"; }).join("\n");
            return ["." + name, "\n{\n", content, "\n}\n"].join("");
        },
        getBrowserCode: function ()
        {
            var ua = navigator.userAgent;
            if (ua.indexOf('Opera') != -1)
            {
                return '-o-';
            }
            else if (ua.indexOf('WebKit') != -1)
            {
                return '-webkit-';
            }
            else if (navigator.product == 'Gecko')
            {
                return '-moz-';
            }
            else if (ua.indexOf('MSIE') != -1)
            {
                return '-ms-';
            }
            else
            {
                return '';
            }
        }
    };

    animation.prototype.constructor = animation;

    $.fn.extend({
        animation: function (name, frames, options, callback)
        {
            return new animation(this, name, frames, options, callback).init();
        }
    })
})(jQuery);