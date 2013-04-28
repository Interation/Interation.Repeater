var console =
{
    start: function (callback)
    {
        if (config.debuging)
        {
            callback();
            return;
        }

        repository.getConfigurations({
            success: function (json)
            {
                config.initialize(json);

                if (typeof callback == "function") { callback(); }
            },
            error: function (errors)
            {

            }
        });
    }
};