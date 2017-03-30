var grid;
var column_count = 0;
var layout = 'default';
var layout_data_result_height = 20;

function window_width() {
    return window.innerWidth > 600 ? window.innerWidth : 600;
}

function resize() {
    if (window_width() * 0.26 > 252) {   //  width: 26%;  max-width: 252px;
        $(".header").width(252);
        $(".header").css('margin-left', window_width() - 252 - 8);
    } else {
        $(".header").width('26%');
        $(".header").css('margin-left', '74%');
    }
    $("#sql").css('margin-top', - ($(".header").height() + 8));

    if (layout === 'default') {
        layout_default();
    } else if (layout === 'data') {
        layout_data();
    } else {
        layout_info();
    }
    $(".toolbar").width($("#sql").width());
    $("#history").width($(".toolbar").width() - 350);
    set_grid_size();
}

function set_grid_size() {
    if (typeof(grid) === "undefined") {return;}

    if (150 * column_count > $("#data").width() - 2) {
        grid.setGridWidth(150 * column_count);
    } else {
        grid.setGridWidth($("#data").width() - 2);
    }
    grid.setGridHeight($("#data").height() - 54);
}

function layout_default() {
    $(".main").width('70%');
    $("#result").width(window_width() - $("#sql").width() - 40);
    $("#result").height($("#sql").height() - $(".header").height() + 25);
    $("#result").css('resize', 'none');
    $("#data").css('margin-top', 0);
    $("#data").width(window_width() - 12);
    $("#data").height(window.innerHeight - $("#sql").height() - 54);
}

function layout_data() {
    $(".main").width(window_width() - 25);
    $("#result").width(window_width() - 24);
    $("#result").height(layout_data_result_height);
    $("#result").css('resize', 'vertical');
    $("#data").css('margin-top', 0);
    $("#data").width(window_width() - 12);
    $("#data").height(window.innerHeight - $("#sql").height() - $("#result").height() - 70);
}

function layout_info() {
    $(".main").width('70%');
    $("#result").height(window.innerHeight - $(".header").height() - 26);
    $("#result").width(window_width() - $("#sql").width() - 40);
    $("#result").css('resize', 'none');
    $("#data").height(window.innerHeight - $("#sql").height() - 30);
    $("#data").width($("#sql").width() + 12);
    $("#data").height(window.innerHeight - $("#sql").height() - 53);
    $("#data").css('margin-top', 0 - $("#data").height() - 1);
}

$(document).ready(function () {
    reset_element("");
    $("#history").change(function () {
        $("#sql").val($('#history').val());
    });

    $("#sql").height(window.innerHeight * 0.3);
    $("#result").height(layout_data_result_height);

    $('#sql').bind('mouseup mousemove',function(){
        if(this.oldheight === null) {
            this.oldheight = this.style.height;
        }
        if(this.style.height != this.oldheight){
            this.oldheight = this.style.height;
            resize();
        }
    });

    $('#result').bind('mouseup mousemove',function(){
        if(this.oldheight === null) {
            this.oldheight = this.style.height;
        }
        if(this.style.height != this.oldheight){
            this.oldheight = this.style.height;
            if (layout === 'data') {
                layout_data_result_height = $("#result").height();
                resize();
            }
        }
    });

    resize();
    $(window).resize(resize);

    $("#password").keydown(function(e) {
        if (e.keyCode == 13) {
            do_login();
            $("#submit").focus();
            return false;
        }
    });
    $("#sql").keydown(function(e) {
        if (e.altKey) {
            if (e.keyCode == 75) {      // alt + k
                do_execute();
                return false;
            }
            if (e.keyCode == 76) {      // alt + l
                var t = document.getElementById('sql');
                if (t.selectionStart != t.selectionEnd) {
                    do_execute();
                } else {                // 不兼容ie6
                    var start = t.selectionStart;
                    var end = t.selectionEnd;
                    var value = $("#sql").val();
                    var max_len = value.length;
                    while (start > 0) {
                        start -= 1;
                        var char = value.substr(start, 1);
                        if (char == '\n') { break; }
                    }
                    while (end < max_len) {
                        var char = value.substr(end, 1);
                        if (char == '\n') { break; }
                        end += 1;
                    }
                    do_execute(value.substring(start, end));
                }
                return false;
            }
        }
    });
    $("#sql").focus();
    $("#sql").val('select * from hz_point;');   // 赋值可以实现光标后置
});

$.fn.setCursorPosition = function(option) {
    var settings = $.extend({
        index: 0
    }, option);
    return this.each(function() {
        var elem  = this;
        var val   = elem.value;
        var len   = val.length;
        var index = settings.index;

        // 非input和textarea直接返回
        var $elem = $(elem)
        if (!$elem.is('input,textarea')) return;
        // 超过文本长度直接返回
        if (len < index) return;

        setTimeout(function() {
            elem.focus();
            if (elem.setSelectionRange) { // 标准浏览器
                elem.setSelectionRange(index, index)
            } else { // IE9-
                var range = elem.createTextRange();
                range.moveStart("character", -len);
                range.moveEnd("character", -len);
                range.moveStart("character", index);
                range.moveEnd("character", 0);
                range.select();
            }
        }, 10)
    })
};

function reset_element(message) {
    $("#result").text(message);
    $("#data").remove();
    $("div.body").append("<div id='data'><table id='grid'></table></div>");
    resize();
}

function do_execute(sql) {
    reset_element("命令正在执行, 请稍等...");
    $("#submit").hide();
    var params = { 'sql': sql ? sql : get_sql() };
    $.ajax({
        url: '/sql',
        type: 'POST',
        data: params,
        dataType: 'json',
        timeout: 0,         // 用不超时 (不同浏览器可能会有不同效果)
        success: function (result) {
            show_result(result);
        },
        error: function (xhr, status, error) {
            if (status === 'timeout') {
                $("#result").text('命令响应超时.');
            } else {
                $("#result").text('Can not access /sql, Please check ESql server and you network.');
            }
            $("#submit").show();
        },
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function (evt) {
                if ($("#result").text().substring(0,2) === '命令'){   // 命令正在执行... or 命令已执行完...
                    $("#result").text('命令已执行完, 正在接收数据... ' + parseInt(evt.loaded/1024) + ' KB');
                }
            }, false);
            return xhr;
        }
    });
    $("#sql").focus();
}

function escape_char(data) {
    try {
        return data.replace(/[<>]/g,function(c){return {'<':'&lt;','>':'&gt;'}[c];});
    } catch(err) {
        return data;
    }
}

function show_result(result) {
    if (result.code >= 90) {
        $("#submit").show();
        $("#result").text(result.state + '[' + result.code + ']: ' + result.message);
        return;
    }
    set_history();

    $("#result").text("total:" + result.total + " took:" + result.took);

    var config = {
        datatype: "local",
        caption: "执行结果:",
        rowNum: 1000,
        colNames: [],
        colModel: []
    };
    column_count = result.cols.length;
    for (index in result.cols) {
        config.colNames[index] = result.cols[index];
        config.colModel[index] = {name: result.cols[index], index: result.cols[index], sorttype: "int"};
    }

    grid = $("#grid").jqGrid(config);
    set_grid_size();
    var data = [];

    for (var row_index in result.rows) {
        var row = result.rows[row_index];
        var item = {};
        for (var index in result.cols) {
            console.log();
            item[result.cols[index]] = row[index];
        }
        data.push(item);
    }

    console.log(data);
    for (var i = 0; i <= data.length; i++) {
        for (key in data[i]) {
            data[i][key] = escape_char(data[i][key]);
        }
        $("#grid").jqGrid('addRowData', i + 1, data[i]);
    }
    $("#submit").show();
}

function set_history() {
    var is_existed = false;
    var sql= get_sql();
    $("#history option").each(function() {
        if ( $(this).text() == sql ){
            is_existed = true;
        }
    });
    if (!is_existed) {
        $("#history").prepend("<option>" + sql + "</option>");
    }
    $('#history').attr('value', sql);
}

function get_sql() {
    var ret_value = '';
    var t = document.getElementById('sql');
    if (window.getSelection) {
        if (t.selectionStart != undefined && t.selectionEnd != undefined) {
            ret_value = t.value.substring(t.selectionStart, t.selectionEnd);
        }
    }
    return ret_value ? ret_value : $("#sql").val();
}

function get_url_param(name) {
    var pairs = location.search.slice(1).split('&');
    var result = {};
    for (var idx in pairs) {
        var pair = pairs[idx].split('=');
        if (!!pair[0])
            result[pair[0]] = decodeURIComponent(pair[1] || '');
    }
    return result[name];
}
