var repository =
{
    getConfigurations: function (options)
    {
        this.openDatabase({
            name: config.database.name,
            version: config.database.version,
            success: function (database)
            {
                var configuration = [];
                var transaction = database.transaction(["configuration"]);

                transaction.oncomplete = function ()
                {
                    var json = {};
                    for (var i = 0; i < configuration.length; i++)
                    {
                        json[configuration[i].key] = configuration[i].value;
                    }

                    if (typeof options.success == "function")
                    {
                        options.success(json);
                    }
                };
            },
            error: function (error)
            {

            }
        });
    },
    setConfigurations: function (options)
    {

    },
    openDatabase: function (options)
    {
        if (window.indexedDB)
        {
            this._openIndexedDatabase(options);
        }
    },
    _openIndexedDatabase: function (options)
    {
        var _this = this;
        var request = window.indexedDB.open(options.name, options.version);

        var success = function (response)
        {
            if (_this.__indexedDatabase)
            {
                _this.__indexedDatabase.close();
            }

            _this.__indexedDatabase = response.target.result;

            if (typeof options.success == "function") { options.success(_this.__indexedDatabase); }
        };

        var upgradeneeded = function (response)
        {
            if (_this.__indexedDatabase)
            {
                _this.__indexedDatabase.close();
            }

            _this.__indexedDatabase = response.target.result;

            var database = _this.__indexedDatabase;
            var transaction = response.target.transaction;

            try
            {
                var configuration = database.createObjectStore("configuration", { keyPath: "id", autoIncrement: true });
                configuration.createIndex("key", "key", { unique: true });
                configuration.createIndex("value", "value");

                var product = database.createObjectStore("product", { keyPath: "id", autoIncrement: true });
                product.createIndex("name", "name");
                product.createIndex("type", "type");
                product.createIndex("downloadtime", "downloadtime");

                transaction.oncomplete = function ()
                {
                    if (typeof options.success == "function") { options.success(database); }
                }
            }
            catch (e)
            {
                _this._deleteIndexedDatabase({
                    name: options.name,
                    success: function (response)
                    {
                        _this._openIndexedDatabase(options);
                    },
                    error: function (response)
                    {

                    }
                });
            }
        };

        var error = function (response)
        {
            // TODO Return Understandable Error
            if (typeof options.error == "function") { options.error(response); }
        };

        request.onsuccess = function (response) { success(response); };
        request.onupgradeneeded = function (response) { upgradeneeded(response); };
        request.onerror = function (response) { error(response); };
        request.onblocked = function (response) { error(response); };
    },
    _deleteIndexedDatabase: function (options)
    {
        var request = window.indexedDB.deleteDatabase(options.name);

        request.onsuccess = function (response)
        {
            if (typeof options.success == "function") { options.success(response); }
        };

        request.onerror = function (response)
        {
            if (typeof options.error == "function") { options.error(response); }
        }
    }
};
