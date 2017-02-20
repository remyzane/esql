
$(document).ready(function () {

});

function show_loading(msg) {
    if (msg === null) {
        $('#loading').css('display', 'none');
    } else {
        $('#loading div.ui.loader').text(msg);
        $('#loading').css('display', 'block');
    }
}

function show_result() {
    show_loading(null);
    $('#result').css('display', 'block');
    $('#toolbar button.ui.button').removeClass('disabled');
}

function execute(command) {
    $('#toolbar button.ui.button').addClass('disabled');
    $('#toolbar button.ui.icon.button').removeClass('disabled');
    switch (command) {
    case 'single':
        show_loading('Executeing');
        break;
    case 'batch':
        show_loading('Batch Executeing');
        break;
    case 'explain':
        show_loading('Explaining');
        break;
    }
    $('#result').css('display', 'none');
}

var products = [
    {
        ProductID : 1,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    }, {
        ProductID : 2,
        ProductName : 'Chang',
        SupplierID : 1,
        CategoryID : 1,
        QuantityPerUnit : '24 - 12 oz bottles',
        UnitPrice : 19.0000,
        UnitsInStock : 17,
        UnitsOnOrder : 40,
        ReorderLevel : 25,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    }, {
        ProductID : 3,
        ProductName : 'Aniseed Syrup',
        SupplierID : 1,
        CategoryID : 2,
        QuantityPerUnit : '12 - 550 ml bottles',
        UnitPrice : 10.0000,
        UnitsInStock : 13,
        UnitsOnOrder : 70,
        ReorderLevel : 25,
        Discontinued : false,
        Category : {
            CategoryID : 2,
            CategoryName : 'Condiments',
            Description : 'Sweet and savory sauces, relishes, spreads, and seasonings'
        }
    },
    {
        ProductID : 10,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 11,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 12,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 13,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 14,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 15,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 16,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 17,
        ProductName : 'Chai',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    },
    {
        ProductID : 18,
        ProductName : 'Chaixxxx',
        QuantityPerUnit : '10 boxes x 20 bags',
        UnitPrice : 18.0000,
        UnitsInStock : 39,
        Discontinued : false,
        Category : {
            CategoryID : 1,
            CategoryName : 'Beverages',
            Description : 'Soft drinks, coffees, teas, beers, and ales'
        }
    }
    ];