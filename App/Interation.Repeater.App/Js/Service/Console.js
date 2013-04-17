var console =
{
    start: function (callback)
    {
        repository.getConfigurations({
            success: function (json)
            {
                window.config.language = json.language || window.config.language;
                window.config.volume = json.volume || window.config.volume;

                if (typeof callback == "function") { callback(); }
            },
            error: function (errors)
            {

            }
        });
    }
};