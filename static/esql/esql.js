var is_executing = false;
var current_result_tab = '';

function execute(command) {
    change_result_tab('history')
    is_executing = true;
    $('#toolbar button.ui.button').addClass('disabled');
    $('#toolbar button.ui.icon.button').removeClass('disabled');

    var editor = ace.edit('editor');
    var current_line = editor.getSelectionRange().start.row;
    var params = {'sign': command, 'sql': editor.getValue(), 'current_line': current_line, 'selected_sql': editor.getSelectedText()};
    $.ajax({
        type: 'POST', dataType: 'json', timeout: 0,
        url: '/web',
        data: params,
        success: function (result) {
            show_result(result, null);
        },
        error: function (xhr, status, error) {
            show_result(null, status);
        }
    });
}

function show_result(result, error) {
    is_executing = false;
    $('#toolbar button.ui.button').removeClass('disabled');
    $("#editor").focus();
    
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
    }
    ];