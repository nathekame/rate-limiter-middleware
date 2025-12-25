import express from 'express';
import router from './routes/api';


const app = express()

app.use(router)

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
