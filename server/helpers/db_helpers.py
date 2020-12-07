from helpers.database_config import db, session

def add_object_to_db(attribute_array, data_array, model):
    for data in data_array:
        d = dict(zip(attribute_array, data))
        obj = model(**d)
        session.add(obj)
    session.commit()
    