import { Router } from 'express';

import { fileRouters } from './fileRouters';
import { groupRouter } from './groupRouters';
import { messageRouter } from './messageRouters';
import { userRouter } from './userRouters';

// eslint-disable-next-line prettier/prettier
const router = Router();

router.use(userRouter);
router.use(groupRouter);
router.use(messageRouter);
router.use(fileRouters);

export { router };
