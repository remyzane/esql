import os
from bottle import Bottle, request, static_file
from esql.utility import request_param
from esql.utility.configure import Environment

# create wsgi app
app = application = Bottle()

# create esql environment
env = Environment()

from ql import init, parse
init(env.config['parser']['optimize'], env.config['parser']['debug'])


@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=os.path.join(env.workspace, 'static'))


@app.route('/es', method=('GET', 'POST'))
def execute():
    """ Execute Sql in ES
    """
    sql = request_param('sql').strip()
    query = parse(sql)
    if not query:
        return None
    dsl = query.dsl()
    return dsl


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
