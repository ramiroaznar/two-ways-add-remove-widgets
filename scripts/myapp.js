(function () {

    window.myapp = window.myapp || {};

    window.onload = function () {

        // the URL to your viz.json
        var diJSON = 'https://team.cartodb.com/u/ramirocartodb/api/v3/viz/6b168b90-4350-11e6-8eac-0e5db1731f59/viz.json';


        var username = diJSON.match(/\/u\/(.+)\/api\/v\d\/|:\/\/(.+)\.cartodb\.com\/api/i)[1],
            myapp = window.myapp;

        // SQL client, if needed
        myapp.sqlclient = new cartodb.SQL({
            user: username,
            protocol: "https",
            sql_api_template: "https://{user}.cartodb.com:443"
        });

        myapp.dashboard = cartodb.deepInsights.createDashboard('#dashboard', diJSON, {
            no_cdn: false
        }, function (err, dashboard) {

            // DI map
            myapp.map = dashboard.getMap();

            // CartoDB layers
            myapp.layers = myapp.map.getLayers();

            // Array of widgets views
            myapp.widgets = dashboard.getWidgets();

            // Array of widgets’ data models
            myapp.widgetsdata = myapp.widgets.map(function (a) {
                return a.dataviewModel
            });

            // addWidget function
            myapp.addWidget = function (type, layer_index, options) {
                try {
                    var layer = myapp.layers[layer_index];
                    switch (type) {
                    case 'category':
                        dashboard.createCategoryWidget(options, layer);
                        break;
                    case 'formula':
                        dashboard.createFormulaWidget(options, layer);
                        break;
                    case 'histogram':
                        dashboard.createHistogramWidget(options, layer);
                        break;
                    case 'timeseries':
                        dashboard.createTimeSeriesWidget(options, layer);
                        break;
                    }
                    myapp.widgets = dashboard.getWidgets();
                    myapp.widgetsdata = myapp.widgets.map(function (a) {
                        return a.dataviewModel
                    });
                    return 'OK';
                } catch (error) {
                    return error;
                }
            }

            // removeWidget function
            myapp.removeWidget = function (index) {
                myapp.widgets[index].remove();
                myapp.widgets = dashboard.getWidgets();
                myapp.widgetsdata = myapp.widgets.map(function (a) {
                    return a.dataviewModel
                });
            }

            // add & remove histogram widget v1 [blue]
            var histo = {
                "type": "histogram",
                "title": "Histogram Widget",
                "column": "pop_max",
                "bins": 10
            };

            cdb.$('#add1').click(function() {
                var histoWidget = dashboard.createHistogramWidget(histo,myapp.layers[1]);
                cdb.$('#remove1').click(function() {
                    histoWidget.remove();
                 });
            });

            // add & remove category widget v2 [red]
            cdb.$('#add2').click(function() {
                myapp.addWidget('category', 1, {
                    "title": "Category widget",
                    "column": "adm0name"
                });

                cdb.$('#remove2').click(function() {
                    myapp.removeWidget(0);
                 });

            });

        });
    }

})();
