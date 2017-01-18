from bottle import Bottle, request
from esql.utility.configure import Environment

# create wsgi app
app = application = Bottle()

# create esql environment
env = Environment()


from ql import init, parse
init(env.config['parser']['optimize'], env.config['parser']['debug'])


@app.route('/es', method=('GET', 'POST'))
def execute():
    """ Execute Sql in ES
    """
    request_data = request.forms if request.method == 'POST' else request.query
    sql = request_data.get('sql')
    return parse(sql)

print(parse('''select city.raw from my_index where city is not null and city = '3717' limit 1,2 order by city;'''))
