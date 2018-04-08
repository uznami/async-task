import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { Session } from './celery-rpc';
import { router as project } from './api-project';
import { router as step } from './api-step';
import { createTableAPI } from './api-table';

async function main(app: Application) {
    const session = new Session('message-queue-server');
    await session.connect();
    app.use('/projects', project);
    app.use('/steps', step);    
    app.use('/tables', createTableAPI(session));    
    app.listen(process.env.APPSERVER_PORT);    
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
main(app);
