from celery import Celery
from time import sleep

app = Celery('tasks',
    broker='pyamqp://guest@message-queue-server//',
    backend='rpc://'
)

@app.task(bind=True, track_started=True)
def add(self, x, y):
    print("helloooo!!!!")
    self.update_state(state='PROGRESS', meta={
        'state': 'reveiced argument',
        'x': x,
        'x': y,
    })
    result = x + y
    sleep(2)
    self.update_state(state='PROGRESS', meta={
        'state': 'done calc',
        'result': result,
    })
    print("done!!!!")
    sleep(1)
    return result
