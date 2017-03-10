import os
from bottle import Bottle, request, static_file, redirect
from esql.utility import request_param
from esql.utility.configure import Environment

# create wsgi app
app = application = Bottle()

# create esql environment
env = Environment()

from ql import init, parse
init(env.config['parser']['optimize'], env.config['parser']['debug'])


@app.route('/')
def index():
    redirect("/static/esql/index.html")


@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=os.path.join(env.workspace, 'static'))


@app.route('/es', method=('GET', 'POST'))
def execute():
    """ Execute Sql in ES
    """
    print(request_param('sql'))
    sql = request_param('sql').strip()
    if sql[-1] != ';':
        sql += ';'
    query = parse(sql)
    if not query:
        return None
    params = {
        'search_type': 'query_then_fetch',
        'index': query._index,
        'doc_type': query._type,
        'body': query.dsl(),
        'ignore_unavailable': True,
        'request_timeout': 300  # ESql.request_timeout.get('select', ESql.request_timeout_default)
    }
    result = env.es.search(**params)
    return result


@app.route('/web', method=('GET', 'POST'))
def web():
    """ WEB UI
    """
    sign = request_param('sign')     # single    batch   explain
    sql = request_param('sql')
    current_line = int(request_param('current_line'))
    selected_sql = request_param('selected_sql')
    if selected_sql:
        sql = selected_sql
    elif sign != 'batch':
        sql = sql.split('\n')[current_line]
    if sign == 'explain':
        sql = 'EXPLAIN ' + sql 
    print(sign, sql, current_line, selected_sql)
    return sql

# print(parse('''select city.raw from my_index where city is not null and city = '3717' limit 1,2 order by city;'''))
