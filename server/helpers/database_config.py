from os import getenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE = [getenv(name) for name in ('DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_DATABASE')]
db_str = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}'
db = session = None
try:
    db = create_engine(db_str)
    session = sessionmaker(db)()
except ValueError:
    print('ENV credentials are being loaded')
