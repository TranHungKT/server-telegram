import { Router } from 'express';

import { groupRouter } from './groupRouters';
import { messageRouter } from './messageRouters';
import { userRouter } from './userRouters';

// eslint-disable-next-line prettier/prettier
const router = Router();

router.use(userRouter);
router.use(groupRouter);
router.use(messageRouter);

export { router };
