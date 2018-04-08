import psycopg2
from psycopg2 import sql
connection = psycopg2.connect("host=database-server port=5432 dbname=postgres user=postgres password=postgres")
cur = connection.cursor()
cur.execute("select version()")
result = cur.fetchone()
print(result)
columns = ['col1', 'col2', 'col3']
idents = sql.SQL(', ').join(sql.Identifier(col) for col in columns)
print(idents.as_string(connection))
