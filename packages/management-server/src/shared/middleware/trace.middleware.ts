import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { HEADER_TRACE_NAME } from '../constants';


export const TraceMiddleware = (req: Request, res: Response, next: () => void) => {
  let traceId = req.get(HEADER_TRACE_NAME);
  if (!traceId) {
    traceId = v4().split('-')
      .join('')
      .substring(0, 16);
  }
  res.set(HEADER_TRACE_NAME, traceId);
  next();
};
