

$(document).ready(function () {
    var Sql = ace.require("ace/mode/sql").Mode;
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow");
    // editor.renderer.setOption('showLineNumbers', false);
    editor.renderer.setShowGutter(false);
    editor.session.setMode(new Sql());

     $("#grid").kendoGrid({
            dataSource: {
                data: products,
                // schema: {
                //     model: {
                //         fields: {
                //             ProductName: { type: "string" },
                //             UnitPrice: { type: "number" },
                //             UnitsInStock: { type: "number" },
                //             Discontinued: { type: "boolean" }
                //         }
                //     }
                // },
                pageSize: 20
            },
            // height: 550,
            scrollable: {'virtual': true},
            sortable: true,
            // filterable: true,
            pageable: {
                input: true,
                numeric: false
            },
            // columns: {widht: '130px'}
            columns: [
                { field: "ProductName", width: "430px" },
                { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "430px" },
                { field: "UnitsInStock", title: "Units In Stock", width: "430px" },
                { field: "Discontinued", width: "430px" }
            ]
    });

});

var products = [
    {
    //     ProductID : 1,
    //     ProductName : "Chai",
    //     QuantityPerUnit : "10 boxes x 20 bags",
    //     UnitPrice : 18.0000,
    //     UnitsInStock : 39,
    //     Discontinued : false,
    //     Category : {
    //         CategoryID : 1,
    //         CategoryName : "Beverages",
    //         Description : "Soft drinks, coffees, teas, beers, and ales"
    //     }
    // }, {
        ProductID : 2,
        ProductName : "Chang",
        SupplierID : 1,
        CategoryID : 1,
        QuantityPerUnit : "24 - 12 oz bottles",
        UnitPrice : 19.0000,
        UnitsInStock : 17,
        UnitsOnOrder : 40,
        ReorderLevel : 25,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : "Beverages",
            Description : "Soft drinks, coffees, teas, beers, and ales"
        }
    }, {
        ProductID : 3,
        ProductName : "Aniseed Syrup",
        SupplierID : 1,
        CategoryID : 2,
        QuantityPerUnit : "12 - 550 ml bottles",
        UnitPrice : 10.0000,
        UnitsInStock : 13,
        UnitsOnOrder : 70,
        ReorderLevel : 25,
        Discontinued : false,
        Category : {
            CategoryID : 2,
            CategoryName : "Condiments",
            Description : "Sweet and savory sauces, relishes, spreads, and seasonings"
        }
    }
    ];