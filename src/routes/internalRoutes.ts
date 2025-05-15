import { Router} from "express";
import { createRouter } from '../utils/create.js';
import { authenticate } from '../middleware/auth.js';
import { handleSgoinfreSize} from '../handlers/index.js';
const { SGOINFRE_SECRET } = process.env;


export default createRouter((router: Router) => {
  router.post(
    "/sgoinfre/size", 
    authenticate({ secret: SGOINFRE_SECRET! }),
    handleSgoinfreSize,
  );
})