const db = require('../config/conexion');

const createProduct = (req, res) => {
    const { nombre, cantidad, precio, descripcion, imagen, categoria } = req.body;
    const estado = req.body.estado || "Activo";  

    db.query('INSERT INTO productos (nombre, cantidad, precio, descripcion, imagen, categoria, estado) VALUES(?,?,?,?,?,?,?)',
    [nombre, cantidad, precio, descripcion, imagen, categoria, estado],
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al registrar el producto.");
        } else {
            console.log(result);
            res.send("Producto registrado con éxito!");
        }
    });
};


const specificProduct = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener el producto");
        }
        if (result.length === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        res.send(result[0]);
    });
}

const products = (req,res)=>{

    db.query('SELECT * FROM productos where estado="activo"',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            
            res.send(result);
        }
    }
    );
}

const updateProduct = (req,res)=>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const cantidad = req.body.cantidad;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    const imagen = req.body.imagen;
    const categoria = req.body.categoria;

    db.query('UPDATE productos SET nombre=?,cantidad=?,precio=?,descripcion=?,imagen=?,categoria=? WHERE id=?',[nombre,cantidad,precio,descripcion,imagen,categoria,id],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Producto actualizado con exito!!")
        }
    }
    );
}


const inactivateProduct = (req, res) => {
    const id = req.params.id;  
    const estado = 'Inactivo';  // Establecemos el estado como 'Inactivo'

    db.query('UPDATE productos SET estado=? WHERE id=?', [estado, id], (err, result) => {
        if (err) {
            console.log(err);  // Si ocurre un error, lo mostramos en la consola
            return res.status(500).send("Error al actualizar el producto");
        }

        if (result.affectedRows > 0) {
            res.status(200).send("Producto inactivado con éxito");
        } else {
            // Si no se encontraron productos para actualizar (es posible que el id no exista)
            res.status(404).send("Producto no encontrado");
        }
    });
};


module.exports = {
    createProduct,
    specificProduct,
    products,
    updateProduct,
    inactivateProduct
}