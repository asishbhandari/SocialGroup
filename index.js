import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {register} from './controllers/authenticationRoutes/registerAuthentication.js';
import {login} from './controllers/authenticationRoutes/loginAuthemtication.js';
import userRoutes from './controllers/verifiedUserRoutes/usersRoutes.js';
import postRoutes from './controllers/userPostRoutes/postRoutes.js';
import {createPost} from './controllers/userPostRoutes/posts.js';
import { verifyToken } from './middleware/verifyAuth.js';

//  configurations
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();
const app= express();
app.use(express.json());
// app.use(express.urlencoded())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json({limit: '30mb', extended: true})); // check if express.json is enough or we need to have bodyparser as seperate package
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors()); // Cors enables your express application access control to allow restricted resources from being accessed from external domains.
app.use("/assets", express.static(path.join(__dirname, './public/assets'))); // setting up local storage


//  file storage
const storage= multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/assets');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const upload =multer({storage: storage})


//  Routes with files to upload 
// app.get('/', (req,res)=>{ res.send('Hi connection working')}) // testing 
app.post('/authentication/register', upload.single('picture'),  register);
app.post('/post', verifyToken, upload.single('picture'), createPost)

// Routes
app.post('/authentication/login', login);
app.use('/verifiedUser',userRoutes)
app.use('/posts', postRoutes)

//  below code is used to include static build folder of frontend 
app.use(express.static(path.join(__dirname, "./client/dist")))
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

// mongoos setup
const PORT = process.env.PORT || 3001;

// mongoose.connect(process.env.MONGO_URL).then( ()=> console.log(`server port: ${PORT}`)).catch((error) => console.log(`${error} did not connect`))
// app.listen(PORT, ()=> console.log(`server port: ${PORT}`));

// or we can listen to port after connection with mongodb is established
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {app.listen(PORT, ()=> console.log(`server port: ${PORT}`))
}).catch((error) => console.log(`${error} did not connect`))



//  testing
// app.get('/', (req,res)=>{ res.send('Hi connection working')}) 
// app.listen(3001, ()=>{console.log("app is running")});