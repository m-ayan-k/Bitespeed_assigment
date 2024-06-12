import { Router } from 'express';
import {identifyContact,contactDelete,getAllContacts,deleteContactsById} from './controllers';

const router = Router();

router.post('/identify', identifyContact);
router.delete('/delete-all',contactDelete);
router.get('/contacts',getAllContacts);
router.delete('/contacts/:id',deleteContactsById);

export default router;
