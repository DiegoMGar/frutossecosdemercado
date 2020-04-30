import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as awsMiddleware from 'aws-serverless-express/middleware';

const app = express();
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsMiddleware.eventContext());

// BASE PATH
router.get('/', (req, res) => {
  res.send({
    title: 'Frutos secos de mercado - api',
    version: process.env.version,
  });
});

// LOGIN
router.post('/login', (req, res) => {});
// LEE LOS PEDIDOS
router.get('/pedidos', (req, res) => {});

// AÑADE UN PEDIDO
router.post('/pedidos', (req, res) => {});

app.use('/', router);

// Export your express server so you can import it in the lambda function.
export default app;
