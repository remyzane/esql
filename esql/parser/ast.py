
import cson
from enum import Enum
from collections import OrderedDict

from ql.parse.ASTNode import ASTNode
# provide convenience for import in sub module
from ql.parse import lexer as lexis
from ql.parse import parser as grammar


class Element(object):
    def __init__(self, _type, _value=None, children: list=None):
        self.type = _type
        self.value = _value
        self.children = children

    def tree(self, dict_class=dict):
        ret = dict_class({'type': self.type.name})

        if self.value and self.type not in [TK.DOT, TK.KEY_VALUE]:
            ret['value'] = self.value

        if self.children:
            children = []
            for item in self.children:
                children.append(item.tree())
            ret['children'] = children

        return ret


def transform(obj: ASTNode) -> Element:
    if obj.children:
        children = []
        for item in obj.children:
            children.append(transform(item))
        return Element(TK[obj.tokType.name[4:]], obj.tokValue, children)
    else:
        return Element(TK[obj.tokType.name[4:]], obj.tokValue, obj.children)


class AutoNumber(Enum):
    def __new__(cls):
        value = len(cls.__members__) + 1
        obj = object.__new__(cls)
        obj._value_ = value
        return obj


def gen_auto_number_enum(enum_obj):
    for item in enum_obj:
        print('    %s = ()' % item.name[4:])
# from ql.parse.parser import TOKEN
# gen_auto_number_enum(TOKEN)


class TK(AutoNumber):
    IDENTIFIER = ()
    VALUE = ()
    DOT = ()
    CORE_TYPE = ()
    SORT_MODE = ()
    LIST = ()
    DICT = ()
    TUPLE = ()
    EXPRESSION = ()
    COLUMN_DEFINE = ()
    META_DEFINE = ()
    TABLE_COLUMNS = ()
    TABLE_NAME = ()
    TABLE_METAS = ()
    TABLE_OPTIONS = ()
    CREATE_TABLE = ()
    QUERY = ()
    FUNCTION = ()
    KEY_VALUE = ()
    COMPARE = ()
    REVERSED = ()
    COMPLEX = ()
    SELECT = ()
    FROM = ()
    WHERE = ()
    LIMIT = ()
    ORDERBY = ()
    GROUPBY = ()
    SELEXPR = ()
    SORT = ()
    INSERT_INTO = ()
    INSERT_COLUMNS = ()
    BULK_INTO = ()
    INSERT_ROW = ()
    INSERT_ROWS = ()
