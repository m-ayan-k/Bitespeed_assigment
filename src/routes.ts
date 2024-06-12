import { Router } from 'express';
import {identifyContact} from './controllers';

const router = Router();

router.post('/identify', identifyContact);

export default router;
