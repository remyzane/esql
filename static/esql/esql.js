
var change_size_datum = null;

function window_width() {
    return window.innerWidth > 500 ? window.innerWidth : 500;
}

function resize() {
    if (window_width() > 850) {
        var margin_left = 400 + (window_width() - 850) / 2;
        $('#toolbar').css('margin-left', margin_left > 600 ? 600: margin_left);
        $('#tabbar').css('margin-top', '-2.5rem');
    } else {
        $('#toolbar').css('margin-left', '0.5%');
        $('#tabbar').css('margin-top', '0.6rem');
    }
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

function change_result_tab(sign) {
    $('#tab_' + sign).addClass('active').siblings().removeClass('active');
    $('#elm_' + sign).css('display', 'block').siblings().css('display', 'none');
    if (sign === 'explain') {
        $('#copy_curl').css('display', 'block')
    } else {
        $('#copy_curl').css('display', 'none')
    }
}

$(document).ready(function () {
    var Sql = ace.require('ace/mode/sql').Mode;
    var editor = ace.edit('editor');
    editor.session.setMode(new Sql());
    editor.setTheme('ace/theme/tomorrow');
    editor.renderer.setOption('showLineNumbers', false);

    var Yaml = ace.require('ace/mode/yaml').Mode;
    var messager = ace.edit('message');
    messager.session.setMode(new Yaml());
    messager.setTheme('ace/theme/tomorrow');
    messager.renderer.setShowGutter(false);

    var Json = ace.require('ace/mode/json').Mode;
    var dsl = ace.edit('dsl');
    dsl.session.setMode(new Json());
    dsl.setTheme('ace/theme/tomorrow');
    dsl.renderer.setShowGutter(false);

    change_result_tab('history')     // debug only
    $('.ui.menu a.item').on('click', function() { change_result_tab(this.id.substring(4, this.id.length)); });
    
    $('#toolbar button.change-size').bind('mousedown',function(e){
        change_size_datum = e.pageY - $('#editor').height();
     });
    $('#toolbar button.change-size').bind('mouseup mouseout',function(){ change_size_datum = false; });
    $('#toolbar button.change-size').bind('mousemove',function(e){
        if (change_size_datum) {
            $('#editor').height(e.pageY - change_size_datum);
        }
    });

    resize();
    $(window).resize(resize);
    $('#editor').height(window.innerHeight / 3);

     $('#elm_data').kendoGrid({
            dataSource: {
                data: products,
                // schema: {
                //     model: {
                //         fields: {
                //             ProductName: { type: 'string' },
                //             UnitPrice: { type: 'number' },
                //             UnitsInStock: { type: 'number' },
                //             Discontinued: { type: 'boolean' }
                //         }
                //     }
                // },
                pageSize: 20
            },
            height: 300,
            scrollable: {'virtual': true},
            sortable: true,
            // filterable: true,
            pageable: {
                input: true,
                numeric: false
            },
            // columns: {widht: '130px'}
            columns: [
                { field: 'ProductName', width: '430px' },
                { field: 'UnitPrice', title: 'Unit Price', format: '{0:c}', width: '430px' },
                { field: 'UnitsInStock', title: 'Units In Stock', width: '430px' },
                { field: 'Discontinued', width: '430px' }
            ]
    });

});

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
    }
    ];