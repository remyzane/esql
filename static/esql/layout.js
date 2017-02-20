var change_size_datum = null;
var EDITOR_MIN_HIGHT = 90;
var RESUTL_MIN_HIGHT = 180;
var WINDOWS_WITH_CRITICAL_POINT = 900;
var current_result_tab = '';

$(document).ready(function () {
    init_element();
    change_result_tab('data')     // debug only       data   message   explain   history
    $('.ui.menu a.item').on('click', function() { change_result_tab(this.id.substring(4, this.id.length)); });
    
    $('#toolbar button.change-size').bind('mousedown',function(e){
        change_size_datum = e.pageY - $('#editor').height();
     });
    $('body').bind('mouseup',function(){ change_size_datum = false; });
    $('body').bind('mousemove',function(e){
        if (change_size_datum) {
            set_editor_hight(e.pageY - change_size_datum);
            resize();
        }
    });
    $(window).resize(resize);
    set_editor_hight((window.innerHeight - get_tool_tab_bar_hight()) / 3);
    resize();
});

function window_width() {
    return window.innerWidth > 500 ? window.innerWidth : 500;
}

function set_editor_hight(hight) {
    if (window_width() > WINDOWS_WITH_CRITICAL_POINT) {
        var editor_max_height = window.innerHeight - get_tool_tab_bar_hight() - RESUTL_MIN_HIGHT;
    } else {
        var editor_max_height = window.innerHeight - get_tool_tab_bar_hight() - RESUTL_MIN_HIGHT;
    }
    if (hight > editor_max_height) {
        hight = editor_max_height;
    }
    $('#editor').height(hight < EDITOR_MIN_HIGHT ? EDITOR_MIN_HIGHT : hight);
}

function set_tool_tab_bar_hight() {
    if (window_width() > WINDOWS_WITH_CRITICAL_POINT) {
        var margin_left = 400 + (window_width() - WINDOWS_WITH_CRITICAL_POINT) / 2;
        $('#toolbar').css('margin-left', margin_left > 600 ? 600: margin_left);
        $('#tabbar').css('margin-top', '-2.5rem');
    } else {
        $('#toolbar').css('margin-left', '0.5%');
        $('#tabbar').css('margin-top', '0.6rem');
    }
}
function get_tool_tab_bar_hight() {
    if (window_width() > WINDOWS_WITH_CRITICAL_POINT) {
        return $('#tabbar').height() + 45;
    } else {
        return $('#toolbar').height() + $('#tabbar').height() + 51;
    }
}

function resize() {
    set_tool_tab_bar_hight()
    var result_height = window.innerHeight - $('#editor').height() - get_tool_tab_bar_hight();
    if (result_height < RESUTL_MIN_HIGHT) {
        result_height = RESUTL_MIN_HIGHT;
    }
    $('.result-content').css('height', result_height);
    if (current_result_tab === 'data') {
        $("#data").data("kendoGrid").setOptions({height: result_height});
    }
    ace.edit('editor').resize();
    ace.edit('message').resize();
    ace.edit('dsl').resize();
}

function change_result_tab(sign) {
    current_result_tab = sign;
    $('#tab_' + sign).addClass('active').siblings().removeClass('active');
    $('#elm_' + sign).css('display', 'block').siblings().css('display', 'none');
    if (sign === 'explain') {
        $('#copy_curl').css('display', 'block')
    } else {
        $('#copy_curl').css('display', 'none')
    }
    resize();
}

function init_element() {
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
    messager.setOptions({readOnly:true})

    var Json = ace.require('ace/mode/json').Mode;
    var dsl = ace.edit('dsl');
    dsl.session.setMode(new Json());
    dsl.setTheme('ace/theme/tomorrow');
    dsl.renderer.setShowGutter(false);
    dsl.renderer.setStyle("disabled", true)
    dsl.setOptions({readOnly:true})

    $('#data').kendoGrid({
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
                // pageSize: 11
            },
            // height: 300,
            scrollable: {'virtual': true},
            sortable: true,
            // filterable: true,
            // pageable: {
            //     input: true,
            //     numeric: false
            // },
            // columns: {widht: '130px'}
            columns: [
                { field: 'ProductName', width: '430px' },
                { field: 'UnitPrice', title: 'Unit Price', format: '{0:c}', width: '430px' },
                { field: 'UnitsInStock', title: 'Units In Stock', width: '430px' },
                { field: 'Discontinued', width: '430px' }
            ]
    });
}
