import express from 'express';
import { Session } from './celery-rpc';

export function createTableAPI(session: Session) {
    const router = express.Router();
    router.get('/', async (_req, res) => {
        session.execute('tasks.add', [3243, 2325]);
        res.json('hello from tables!');
    });
    router.get('/add', async (req, res) => {
        const x = req.query.x || 0;
        const y = req.query.y || 0;
        const result = await session.call<number>('tasks.add', [x, y]);
        res.json(result);
    });
    return router;
}
