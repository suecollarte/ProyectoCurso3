import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import MongoStore from "connect-mongo"
//import cookieParser from 'cookie-parser'
import session from 'express-session'
//import FileStore from 'session-file-store'



import productoRoute from './routers/producto.router.js'
import cartRoute from './routers/cart.router.js'
import viewRoute from './routers/view.router.js'
import profile from './routers/profile.router.js'
import {Server} from 'socket.io'




//const MONGOURI = 'mongodb+srv://admin:admin@cluster0.hjgxmmk.mongodb.net/?retryWrites=true&w=majority';
const MONGOURI='mongodb://0.0.0.0:27017'
//'mongodb://localhost:27017'

const MONGODB = 'ecommerce';

const app= express();

//app.use(cookieParser('hola'))
//const fileStore = FileStore(session)

app.use(session({
  store: MongoStore.create({ 
    mongoUrl: MONGOURI, 
    dbName: 'ecommerce',
    mongoOptions:{
      //useNewUrlParse:true,
      useUnifiedTopology:true
      }
    }),
    secret:'hola',
    resave: true,
    saveUninitialized:true
  
 /*  store: new fileStore({
    path:"./sessions"}) */
}))

app.use(express.json());
//para poder recibir lo del cliente los json
app.use(express.urlencoded({extended:true}))
//para recibir formularios por donde llegan los datos
// parse application/x-www-form-urlencoded
// parse application/json

// esto es por http
app.get('/', (request,response) =>{
console.log('despliegues')
response.json('Despliegue con /');

})
//para la interfaz
app.use(express.static('./src/public'))

app.engine('handlebars', handlebars.engine({
    defaultLayout:'main',
    layoutDir:'./src/views/layouts',
    partialsDir:'./src/views/partials'
})
)
app.set('views', './src/views')
app.set('view engine', 'handlebars')




app.use('/api/products',productoRoute);
app.use('/api/carts',cartRoute);
app.use('/products',viewRoute);
app.use('/user',profile)

//app.use('productos',viewproduct)

//esta es una promesa
// por eso se trabaja asi...
mongoose.set('strictQuery',false);

try{
    //await mongoose.connect(MONGOURI+MONGODB,{
      //  useUnifiedTopology:true})
      mongoose.connect('mongodb://0.0.0.0:27017', { dbName: 'ecommerce' })
     
     const httpServer= app.listen(8080, () => console.log('Server Up!'))

const io = new Server(httpServer)

app.use((req,res,next)=>{
  req.io=io
  next()
})

io.on('connection',(socket) =>{
  console.log("conexion realizada",socket.id)
  
  socket.on('message', data =>{
    console.log(data)
      })
 
        socket.on('from-client-producto', (producto) => {
          productos.addProducto(producto)
          io.sockets.emit('from-server-producto', { DB_PRODUCTOS });
        });
        socket.on("Agregado", (producto)=>{ //trae del cliente
            
          //enviar listado a todos
          //console.log(productos)
            io.sockets.emit('listaProducto',productos)  //lista
        })
        socket.on("client-borraProducto", (codigo)=>{ //trae codigo del cliente
            
          //enviar listado a todos
            console.log(codigo)
            productos.BorrarProducto(codigo)
            io.sockets.emit('listaProducto',productos)  //lista
        })  
       // socket.emit('listaProducto',todo) //lista todo
        //recibo 
        socket.on('message-desde', data =>{
            // console.log(data)
             log.push({id: socket.id, message:data})
             socket.emit('history',log)
         })
       
     

})
     
    }
catch(err){
    console.log(err.message)
}


    