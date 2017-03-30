import os
import json
from bottle import Bottle, static_file, redirect
from esql.utility import request_param
from esql.utility.configure import Environment
from esql.utility.data import transform_query_hits

# create wsgi app
app = application = Bottle()

# create esql environment
env = Environment()

from ql import init, parse
from ql.dsl.Query import Query
from ql.parse.parser import TK
from ql.dsl.Response import response
init(env.config['parser']['optimize'], env.config['parser']['debug'])


@app.route('/')
def index():
    # redirect("/static/esql/index.html")
    redirect("/static/classics/index.html")


@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=os.path.join(env.workspace, 'static'))


def parse_sql():
    sql = request_param('sql').strip()
    if sql[-1] != ';':
        sql += ';'
    return parse(sql)


@app.route('/es', method=('GET', 'POST'))
def do_es():
    """ Execute Sql，return ES result
    """
    ast = parse_sql()
    if ast.get_type() == TK.TOK_QUERY:
        query = Query(ast)
        result = env.es.search(index=query._index, doc_type=query._type, body=query.dsl(), request_timeout=100)
        return result
    return None


@app.route('/sql', method=('GET', 'POST'))
def do_sql():
    """ Execute Sql，return ESql result
    """
    ast = parse_sql()
    if ast.get_type() == TK.TOK_QUERY:
        query = Query(ast)
        result = env.es.search(index=query._index, doc_type=query._type, body=query.dsl(), request_timeout=100)
        stmt_res = response(result)
        return stmt_res
    return None

# print(parse('''select city.raw from my_index where city is not null and city = '3717' limit 1,2 order by city;'''))


# @app.route('/web', method=('GET', 'POST'))
# def web():
#     """ WEB UI
#     """
#     sign = request_param('sign')     # single    batch   explain
#     sql = request_param('sql')
#     current_line = int(request_param('current_line'))
#     selected_sql = request_param('selected_sql')
#     if selected_sql:
#         sql = selected_sql
#     elif sign != 'batch':
#         sql = sql.split('\n')[current_line]
#     if sign == 'explain':
#         sql = 'EXPLAIN ' + sql
#     print(sign, sql, current_line, selected_sql)
#     return {
#         "cols": ["age", "name"],
#         "rows": [
#             [20, "ls"],
#             [10, "zs"]
#         ],
#         "rowcount": 2,
#         "duration": 7.82014
#     }