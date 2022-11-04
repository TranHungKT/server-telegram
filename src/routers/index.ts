import { Router } from 'express';

import { groupRouter } from './groupRouters';
import { imageRouter } from './imageRouter';
import { messageRouter } from './messageRouters';
import { userRouter } from './userRouters';

// eslint-disable-next-line prettier/prettier
const router = Router();

router.use(userRouter);
router.use(groupRouter);
router.use(messageRouter);

router.use(imageRouter);
export { router };
