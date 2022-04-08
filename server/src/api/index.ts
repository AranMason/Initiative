import { Router } from 'express';

import initiativeAPI from './initiative';

// Create
const router = Router();

// Set up routers
router.use('/initiative', initiativeAPI);

export default router;
