const amqp = require('amqp') as any;
import uuid from 'uuid/v4';

export interface CeleryResponse<T> {
    task_id: string;
    status: 'STARTED' | 'SUCCESS' | 'FAILURE' | 'PROGRESS';
    result: T;
    children: any[];
    traceback: string | null;
}

export class Session {
    connection: any;

    constructor(private host: string) {
    }

    async connect() {
        return new Promise<void>(resolve => {
            this.connection = amqp.createConnection({ host: this.host });
            this.connection.on('ready', resolve);
        });
    }

    destroy() {
        this.connection.destroy();
    }

    private createResultQueue<T>(taskID: string, handleMessage: (msg: CeleryResponse<T>) => void) {
        const resultQueueName = taskID.replace(/-/g, '');
        const q = this.connection.queue(resultQueueName, {
            exclusive: true,
            autoDelete: true,
            durable: true,
        });
        q.subscribe((msg: CeleryResponse<T>) => {
            if (msg.status === 'SUCCESS' || msg.status === 'FAILURE') {
                q.destroy();
            }
            handleMessage(msg);
        });
        return resultQueueName;
    }

    private generateProps(command: string, taskID: string, replyTo?: string) {
        const ret = {
            contentType: 'application/json',
            correlationId: taskID,
            replyTo,
            contentEncoding: 'utf-8',
            headers: {
                'id': taskID,
                'task': command,
            },
        }
        if (!replyTo) {
            delete ret['replyTo'];
        }
        return ret;
    }

    private generatePayload(args: Object[], kwargs: { [key: string]: any }) {
        return JSON.stringify([
            args,
            kwargs,
            null
        ]);
    }

    execute(command: string, args: Object[] = [], kwargs: { [key: string]: any } = {}) {
        if (!this.connection) {
            throw 'please "connect" before call';
        }
        const taskID = uuid();
        const headers = this.generateProps(command, taskID);
        const payload = this.generatePayload(args, kwargs);
        console.log(headers);
        console.log(payload);
        this.connection.publish('celery', payload, headers);        
    }

    call<T>(command: string, args: Object[] = [], kwargs: { [key: string]: any } = {}, handleOther?: (msg: CeleryResponse<T>) => void) {
        if (!this.connection) {
            throw 'please "connect" before call';
        }
        const taskID = uuid();
        return new Promise<T>((resolve, reject) => {
            const replyTo = this.createResultQueue<T>(taskID, msg => {
                switch (msg.status) {
                    case 'SUCCESS': return resolve(msg.result);
                    case 'FAILURE': return reject(msg.result);
                    default: return handleOther && handleOther(msg);
                }
            });
            const headers = this.generateProps(command, taskID, replyTo);
            const payload = this.generatePayload(args, kwargs);
            console.log(headers);
            console.log(payload);
            this.connection.publish('celery', payload, headers);
        });
    }
}
