import { createHandler } from '../utils/create.js';
import { logger} from "../logger.js"

export const handleTransaction = createHandler(
  async (req, res) => {
    const body = req.body;
    try {
      logger.log(body);
    } catch (error) {

    }

    res.status(201).send();
  }
)