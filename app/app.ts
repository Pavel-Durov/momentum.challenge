import cors from 'cors';
import express from 'express';
import router from './routes/chat';
import { init } from './logger';
import { CRON_SCHEDULE, PORT } from './config';

import { CompanyStore } from './store';
import { CompanyUpdateJob } from './storeJob';
import { StatusCodes } from 'http-status-codes';

const app: express.Application = express();

const log = init('server');

const options: cors.CorsOptions = {
  origin: '*'
};

app.use(express.json());
app.use(cors(options));

const store = new CompanyStore();
const updateJob = new CompanyUpdateJob(store, CRON_SCHEDULE);

app.use('/chat', router(store),)

app.get('/health', (req, res) => {
  res.send('I am alive!').status(StatusCodes.OK);
});

app.listen(PORT, function () {
  log.info(`listening on http://localhost:${PORT}`);
  updateJob.updateOneAndSchedule();
});
