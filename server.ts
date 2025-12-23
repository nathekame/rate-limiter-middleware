import express from 'express';


const app = express();
const router = app.router


router.get('/', (req, res) => {

  res.send('Hello rate limiter')

})



app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
