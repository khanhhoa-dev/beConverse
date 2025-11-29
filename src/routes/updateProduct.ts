import { Router } from 'express';
import updateProductController from '../app/controller/updateProductController';
const router = Router();

router.patch('/product/:slug', updateProductController.update);

export default router;
