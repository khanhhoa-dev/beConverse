import { Router } from 'express';
import searchController from '../app/controller/searchController';

const route = Router();

route.get('/product', searchController.show);

export default route;
