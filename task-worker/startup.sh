#!/bin/bash
sleep 15
celery -A tasks worker --loglevel=info
