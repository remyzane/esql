from typing import List
from esql.parser.ast import TK, Element
from esql.parser.utility import *


class Node(object):
    """ Abstract base class for RST nodes.
    """
    __slots__ = ()


class NodeList(list):
    """ Node List
    """


class Attribute(Node):
    __slots__ = ('key', 'value')

    def __init__(self, tree: Element = None):
        if tree.type == TK.TOK_KEY_VALUE:
            self.key = tree.sub(0).value
            self.value = tree.sub(1).value


class Attributes(List[Attribute]):

    def __init__(self, attributes):
        for attribute in attributes:
            self.append(Attribute(attribute))


class TableName(Node):
    __slots__ = ('index_name', 'doc_type')

    def __init__(self, tree):
        for item in tree:
            if item.type == TK.TOK_DOT:
                self.index_name = item.sub(0).value
                self.doc_type = item.sub(1).value


class FieldDefine(Node):
    __slots__ = ('name', 'type', 'options', 'fields')

    def __init__(self, tree: Element = None):
        if tree.type == TK.TOK_COLUMN_DEFINE:
            self.name = tree.value
            self.type = tree.sub(0).value
            if self.type == 'object':
                cols = tree.sub_token(TK.TOK_TABLE_COLUMNS)
                if cols and cols.children:
                    self.fields = FieldsDefine(cols.children)
            opts = tree.sub_token(TK.TOK_COLUMN_OPTIONS)
            if opts:
                self.options = Attributes(opts.sub(0).children)

    def dsl(self):
        field = {'type': self.type}
        if hasattr(self, 'options'):
            for option in self.options:
                field[option.key] = option.value
        if hasattr(self, 'fields'):
            field['properties'] = self.fields.dsl()
        return field


class FieldsDefine(List[FieldDefine]):

    def __init__(self, fields):
        for field in fields:
            self.append(FieldDefine(field))

    def dsl(self):
        properties = {}
        for field in self:
            properties[field.name] = field.dsl()
        return properties


class TableCreate(Node):
    """ Create Table
    """
    __slots__ = ('table', 'fields')

    mapping = TK.TOK_CREATE_TABLE

    def __init__(self, tree: Element, table: TableName = None, fields: List[FieldDefine] = None):
        self.table = table
        self.fields = fields or []

        for child in tree.children:
            if child.type == TK.TOK_TABLE_NAME:
                self.table = TableName(child.children)
            elif child.type == TK.TOK_TABLE_COLUMNS:
                self.fields = FieldsDefine(child.children)

    def dsl(self):
        dsl = {'index': self.table.index_name,
               'doc_type': self.table.doc_type,
               'body': {self.table.doc_type: {}}}
        dsl['body'][self.table.doc_type]['properties'] = self.fields.dsl()
        return dsl


class SelectField(Node):
    __slots__ = ('name', 'type', 'params')

    def __init__(self, tree: Element = None):
        self.name = tree.sub(0).value
        self.type = tree.sub(0).type
        if tree.sub(0).type == TK.TOK_FUNCTION:
            self.params = []
            for item in tree.sub(0).children:
                self.params.append(item.value)

    def dsl(self):
        properties = {}
        return properties


class SelectFields(List[SelectField]):

    def __init__(self, objects):
        for item in objects:
            self.append(SelectField(item))

    def dsl(self):
        properties = {'aaa':1}
        for item in self:
            properties[item.name] = item.dsl()
        return properties


class GroupByFields(list):

    def __init__(self, objects):
        for item in objects:
            self.append(item.value)

    def dsl(self):
        properties = {}
        for item in self:
            properties[item] = {'terms': {'field': item, 'size': 4096}}
        return properties


class DataSelect(Node):
    """ Data Query (Select)
    """
    __slots__ = ('table', 'select', 'group_by')
    
    mapping = TK.TOK_QUERY

    def __init__(self, tree: Element, table: TableName = None, select: List[FieldDefine] = None):
        self.table = table
        self.select = select or []

        for child in tree.children:
            if child.type == TK.TOK_SELECT:
                self.select = SelectFields(child.children)
            elif child.type == TK.TOK_FROM:
                self.table = TableName(child.sub_token(TK.TOK_TABLE_NAME).children)
            elif child.type == TK.TOK_GROUPBY:
                self.group_by = GroupByFields(child.children)

    def dsl(self):
        dsl = {'index': self.table.index_name,
               'doc_type': self.table.doc_type,
               '_source': []}
        for item in self.select:
            if item.type == TK.TOK_VALUE:
                dsl['_source'].append(item.name)
        if hasattr(self, 'group_by'):
            dsl['aggs'] = self.group_by.dsl()

        return dsl
