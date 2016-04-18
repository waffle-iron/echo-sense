import decimal
from google.appengine.ext import db

precision = decimal.Decimal(10) ** -2 # Precision for db is 2 decimal places

class DecimalProperty(db.TextProperty):
    data_type = decimal.Decimal

    def validate(self, value):
        value = super(DecimalProperty, self).validate(value)
        if value is None or isinstance(value, decimal.Decimal):
            return value
        elif isinstance(value, basestring):
            return decimal.Decimal(value)
        raise db.BadValueError("Property %s must be a Decimal or string." % self.name)

    def get_value_for_datastore(self, model_instance):
    	vfd = super(DecimalProperty, self).get_value_for_datastore(model_instance)
        decimal.getcontext().prec = 28
        return str(vfd.quantize(precision)) if vfd != None else None

    def make_value_from_datastore(self, value):
    	if value is not None and value != 'None':
            return decimal.Decimal(value)
