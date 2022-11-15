import Event from '../models/eventModel';
import * as factory from './handlerFactory';

export const createEvent = factory.createOne(Event);
