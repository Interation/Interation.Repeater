(function ($)
{
    $.extend(
    {
        exists: function (array, rule)
        {
            if (typeof rule == "function")
            {
                var exists = false;
                $.each(array, function (i, e) { return !(exists = rule(i, e)); });
                return exists;
            }
        },
        convert: function (array, rule)
        {
            if (typeof rule == "function")
            {
                var result = [];
                $.each(array, function (i, e) { result.push(rule(i, e)); });
                return result;
            }
        },
        formatFileSize: function (kb)
        {
            if (kb > 1099511627776)
            {
                return (kb / 1099511627776) + "TB";
            }
            else if (kb > 1073741824)
            {
                return (kb / 1073741824) + "GB";
            }
            else if (kb > 1048576)
            {
                return (kb / 1048576) + "MB";
            }
            else
            {
                return kb + "KB";
            }
        },
        formatDate: function (date, format)
        {
            var o =
            {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };

            if (/(y+)/.test(format))
            {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            if (/(M{3,4})/.test(format))
            {
                var month = date.getMonth();
                var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                format = format.replace(RegExp.$1, RegExp.$1.length == 3 ? shortMonths[month] : longMonths[month]);
            }

            for (var k in o)
            {
                if (new RegExp("(" + k + ")").test(format))
                {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }

            return format;
        },
        resolveDate: function (str)
        {
            if (match = str.match(/Date\((\d+)\)/))
            {
                return new Date(parseInt(match[1]));
            }
        },
        formatTime: function (seconds, milli)
        {
            var date = new Date(Math.round(seconds * 1000));

            var hours = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            var seconds = date.getUTCSeconds();

            if (hours < 10) { hours = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            var formatted = hours + ":" + minutes + ":" + seconds;

            if (milli)
            {
                milli = date.getUTCMilliseconds();
                if (milli < 10) { milli = "00" + minutes; }
                if (milli < 100) { milli = "0" + minutes; }
                formatted += "." + milli;
            }

            return formatted;
        },
        reverseFormatTime: function (text)
        {
            var time = 0;
            var result = null;

            if (result = text.match(/(\d+):(\d{1,2}):(\d{1,2}).(\d{3})/))
            {
                time = parseInt(result[1]) * 3600 + parseInt(result[2]) * 60 + parseInt(result[3]) + parseInt(result[4]) * 0.001;
            }

            return time;
        }
    });

    $.fn.extend(
    {
        watermark: function (text)
        {
            this.focus(function () { if ($(this).hasClass("empty")) { $(this).removeClass("empty").val(""); } });
            this.blur(function () { if ($(this).val().length == 0) { $(this).addClass("empty").val(text); } }).blur();
            return this;
        },
        climb: function (options)
        {
            //var options = {
            //    css: "margin-left",
            //    x0: 0,
            //    x1: 100,
            //    s0: 20,
            //    v0: 2,
            //    complete: function ()
            //    {
            //    }
            //};

            var $this = $(this);
            var x1 = Math.min(options.x1, options.x2);
            var x2 = Math.max(options.x1, options.x2);
            var s0 = isNaN(options.s0) ? parseInt($this.css(options.css)) : options.s0;
            var v0 = options.v0;
            var t0 = Date.now();
            var g = 10;

            var yx = function (x) { return -(x - x1) * (x - x2) };                      // hill model
            var dyx = function (x) { return -2 * x + x1 + x2; };                        // first derivative of yx
            var acme = (function (m) { return { x: m, y: yx(m) }; })(0.5 * (x1 + x2));  // max point
            var a0 = -g * Math.sin(Math.atan(dyx(s0)));                                 // acceleration at begining
            var aoa = 1;                                                        // acceleration of acceleration

            var complete = function (v)
            {
                if (typeof options.complete == "function")
                {
                    options.complete(v);
                }
            };

            if (x1 == x2)
            {
                $this.css(options.css, x1);
                return;
            }

            var timer = setInterval(function ()
            {
                try
                {
                    var t = Date.now() - t0;
                    //var s = s0 + v0 * t + 0.5 * a0 * t * t + aoa * Math.pow(t, 3) / 6;
                    var s = s0 + v0 * t;

                    if (s <= x1)
                    {
                        s = x1;
                        complete(-1);
                        clearInterval(timer);
                    }
                    else if (x2 <= s)
                    {
                        s = x2;
                        complete(1);
                        clearInterval(timer);
                    }

                    $this.css(options.css, s);
                }
                catch (e)
                {
                    clearInterval(timer);
                }
            }, 5);
        },
        dampen: function (cssKey, options)
        {
            //var options =
            //{
            //    range: [0, 600],
            //    initial: 1,
            //    v0: 2,
            //    factor: 0.0025,
            //    flexible: true
            //};

            var $this = $(this);

            var t0 = Date.now();
            var s0 = options.initial;
            var v0 = options.v0;
            var a = (v0 == 0 ? 0 : (v0 > 0 ? -1 : 1)) * Math.abs(options.factor);
            var x0 = Math.min(options.range[0], options.range[1]);
            var x1 = Math.max(options.range[0], options.range[1]);

            var args = function (key, value)
            {
                this[key] = value;
            };

            if (v0 == 0)
            {
                if (s0 < x0) { $this.animate(new args(cssKey, x0)); }
                else if (x1 < s0) { $this.animate(new args(cssKey, x1)); }

                return;
            }

            var frame = null;

            if (options.flexible)
            {
                var animate = function ()
                {
                    var t = Date.now() - t0;
                    var vt = v0 + a * t;
                    var s1 = s0 + v0 * t + 0.5 * a * (t * t);

                    $this.css(cssKey, s1);

                    if (vt * a > 0)
                    {
                        if (s1 < x0) { $this.animate(new args(cssKey, x0)); }
                        else if (x1 < s1) { $this.animate(new args(cssKey, x1)); }

                        return;
                    }

                    setTimeout(frame, 5);
                }
            }
            else
            {
                var animate = function ()
                {
                    var t = Date.now() - t0;
                    var vt = v0 + a * t;
                    var s1 = s0 + v0 * t + 0.5 * a * (t * t);

                    $this.css(cssKey, s1);

                    if (s1 < x0) { $this.css(cssKey, x0); return; }
                    if (x1 < s1) { $this.css(cssKey, x1); return; }

                    setTimeout(frame, 5);
                }
            }

            setTimeout(animate, 0);
        }
    });
})(jQuery);
