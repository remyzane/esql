import json


def transform_query_hits(hits):
    ret_value = {'data': []}
    for hit in hits['hits']:
        row = {
            '_index': '',
            '_type': hit['_type'],
            '_id': hit['_id']
        }
        if '_index' in hit:
            row['_index'] = hit['_index']

        if 'fields' in hit:
            row.update(hit['fields'])

        if '_source' in hit:
            for (k, v) in hit['_source'].items():
                if type(v) in (list, dict, tuple):
                    row[k] = json.dumps(v, ensure_ascii=False)
                else:
                    row[k] = v
        if 'highlight' in hit:
            for (k, v) in hit["highlight"].items():
                if len(v) > 1:
                    row["HL_" + k] = json.dumps(v, ensure_ascii=False)
                elif len(v) == 1:
                    row["HL_" + k] = v[0]
        if 'inner_hits' in hit:
            for (k, v) in hit["inner_hits"].items():
                row["JN_" + k] = json.dumps(transform_query_hits(v['hits']), ensure_ascii=False)
        ret_value['data'].append(row)
    if 'total' in hits:
        ret_value['count'] = hits['total']
    else:
        ret_value['count'] = len(ret_value['data'])
    return ret_value
