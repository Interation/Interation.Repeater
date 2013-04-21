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
                var longMonths = ["January", "February", "March", "April", "May", "June","July","August", "September", "October", "November", "December"];

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
        resolveDate: function(str)
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
