import express from 'express';
import * as eventController from '../controllers/eventController';

const eventRouter = express.Router();

eventRouter.route('/').post(eventController.createEvent);

export default eventRouter;
