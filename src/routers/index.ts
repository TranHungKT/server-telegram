import { Router } from 'express';

import { fileRouters } from './fileRouters';
import { groupRouters } from './groupRouters';
import { messageRouters } from './messageRouters';
import { userRouters } from './userRouters';

const routers = Router();

routers.use(userRouters);
routers.use(groupRouters);
routers.use(messageRouters);
routers.use(fileRouters);

export { routers };
