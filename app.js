const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const { json } = require('express')
const app = express()


app.use(express.json())
app.use(cors())

//Establecemos los prámetros de conexión
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Pakistan92',
    database:'ubicaciones'
})

//Conexión a la database
conexion.connect(function(error){
    if(error){
        throw error
    }else{
        console.log("Estás fuerte haz podido conectar la db")
    }
})

app.get('/', function(req,res){
    res.send('Ruta INICIO')
})

//Mostrar todos las ubicaciones
app.get('/api/ubicaciones', (req,res)=>{
    conexion.query('SELECT * FROM ubicaciones', (error,filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//Mostrar una SOLA Ubicacion
app.get('/api/ubicaciones/:id', (req,res)=>{
    conexion.query('SELECT * FROM ubicaciones WHERE id = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error
        }else{
            res.send(fila)
        }
    })
})

//Crear una ubicacion
app.post('/api/ubicaciones', (req,res)=>{
    let data = {direccion:req.body.direccion, numero:req.body.numero, provincia:req.body.provincia}
    let sql = "INSERT INTO ubicaciones SET ?"
    conexion.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{              
             /*Esto es lo nuevo que agregamos para el CRUD con Javascript*/
             Object.assign(data, {id: result.insertId }) //agregamos el ID al objeto data             
             res.send(data) //enviamos los valores                         
        }
    })
})

//Editar ubicacion
app.put('/api/ubicaciones/:id', (req, res)=>{
    let id = req.params.id
    let direccion = req.body.direccion
    let numero = req.body.numero
    let provincia = req.body.provincia
    let sql = "UPDATE ubicaciones SET direccion = ?, numero = ?, provincia = ? WHERE id = ?"
    conexion.query(sql, [direccion, numero, provincia, id], function(error, results){
        if(error){
            throw error
        }else{              
            res.send(results)
        }
    })
})


//Eliminar ubicacion
app.delete('/api/ubicaciones/:id', (req,res)=>{
    conexion.query('DELETE FROM ubicaciones WHERE id = ?', [req.params.id], function(error, filas){
        if(error){
            throw error
        }else{              
            res.send(filas)
        }
    })
})
const puerto = process.env.PUERTO || 3000
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto)
})









///Hasta aqui ---------------------------------------------------------------






// const dbConnection = require('./dbConnection.js');

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended : false}));

// //Create
// app.post('/insert',(request,response)=>{
//     const {name}=request.body;
//     const db = dbConnection.getDbConnectionInstancia();

//     const result = db.insertarNombre(name);

//     result
//     .then(data => response.json({data:data}))
//     .catch(err => console.log(err));

// });


// //Read
// app.get('/getAll',(request,response)=>{
//     console.log('test');
//     const db = dbConnection.getDbConnectionInstancia();
//     const result = db.getAllData();

//     result
//     .then(data => response.json({data:data}))
//     .catch(err => console.log(err));
// })


// //Update
 


// //Delete

// app.listen(process.env.PORT, ()=> console.log('app is runnig'));