const db = require('../config/conexion');

// En el backend, creamos una función para generar contraseña aleatoria
const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Configuración de nodemailer (en el backend)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // O tu servicio de correo preferido
    auth: {
        user: 'practicaenvio@gmail.com',
        pass: 'ungw xwzv ureo qlbu'
    }
});

// Modificación de la función createUser en el backend
const createUser = (req, res) => {
    const nombres = req.body.Nombres;
    const apellidos = req.body.Apellidos;
    const correo = req.body.Correo;
    const telefono = req.body.Telefono;
    const direccion = req.body.Direccion;
    const genero = req.body.Genero;
    const rol = req.body.Rol;
    
    // Generar contraseña aleatoria
    const generatedPassword = generatePassword();

    // Configuración del correo
    const mailOptions = {
        from: 'soloelectricos@gmail.com',
        to: correo,
        subject: 'Bienvenido a Solo Electricos - Tus credenciales de acceso',
        html: `
            <h1>Bienvenido a Solo Electricos</h1>
            <p>Hola ${nombres},</p>
            <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>
            <p><strong>Correo:</strong> ${correo}</p>
            <p><strong>Contraseña:</strong> ${generatedPassword}</p>
            <p>Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
            <p>Saludos cordiales,<br>Equipo de Solo Electricos</p>
        `
    };

    db.query(
        "INSERT INTO usuario(Nombres,Apellidos,Correo,Contrasena,Telefono,Direccion,Genero,Rol) VALUES (?,?,?,?,?,?,?,?)",
        [nombres, apellidos, correo, generatedPassword, telefono, direccion, genero, rol],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar usuario");
            } else {
                // Enviar correo con las credenciales
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send("Usuario registrado pero hubo un error al enviar el correo");
                    } else {
                        res.status(200).send("Usuario registrado exitosamente y correo enviado");
                    }
                });
            }
        }
    );
};

const getUsers = (req, res) => {

    db.query("SELECT*FROM usuario WHERE Estado = 'Activo'", (err, results) => {

        if (err) {

            console.log(err);

        } else {

            res.send(results);
            console.log(results);

        }
    });
};

const updatePassword = (req, res) => {
    console.log("Datos recibidos:", req.body);

    const id = req.body.ID;
    const contrasena = req.body.Contrasena;

    if (!id || !contrasena) {
        // Verifica que ambos datos estén presentes
        return res.status(400).send("Faltan datos: ID o Contrasena");
    }

    const query = `UPDATE usuario SET Contrasena = ?, Usoc = 'Usada' WHERE ID = ?`;

    // Ejecuta la consulta con los datos recibidos
    db.query(query, [contrasena, id], (err, results) => {
        if (err) {
            console.error("Error en la actualización:", err); // Detalle del error SQL
            res.status(500).send("Error al actualizar el usuario");
        } else if (results.affectedRows === 0) {
            // Si no se actualiza ninguna fila, el ID no coincide con ningún usuario
            res.status(404).send("Usuario no encontrado");
        } else {
            res.send("Usuario actualizado con éxito");
            console.log("Resultado de la actualización:", results);
        }
    });
};




const validationUser = (req, res) => {

    const Correo = req.body.Correo;
    const Contrasena = req.body.Contrasena;

    console.log('Datos recibidos:', Correo, Contrasena);

    db.query("SELECT*FROM usuario WHERE Correo = ? AND Contrasena = ? AND Estado = 'Activo'; ", [Correo, Contrasena], (err, results) => {

        if (err) {

            console.log(err);

        } else {

            res.send({ usuario: results[0] });
            console.log(results);

        }
    });
};

const updateUser = (req, res) => {
    const id = req.body.ID;
    const nombres = req.body.Nombres;
    const apellidos = req.body.Apellidos;
    const correo = req.body.Correo;
    const contrasena = req.body.Contrasena;
    const telefono = req.body.Telefono;
    const direccion = req.body.Direccion;
    const genero = req.body.Genero;
    const rol = req.body.Rol;
    const estado = req.body.Estado;

    const query = `
        UPDATE usuario 
        SET Nombres = ?, Apellidos = ?, Correo = ?, Telefono = ?, Direccion = ?, Genero = ?, Rol = ?, Estado = ?
        WHERE ID = ?`;

    // Ejecutar la consulta SQL para actualizar el usuario
    db.query(query, [nombres, apellidos, correo, telefono, direccion, genero, rol, estado, id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al actualizar el usuario');
        } else {
            res.send('Usuario actualizado con éxito');
        }
    });
};
const desactivateUser = (req, res) => {
    const userId = req.params.id;

    const query = `
        UPDATE usuario 
        SET Estado = 'Inactivo' 
        WHERE ID = ?`;

        db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar el estado del usuario');
        } else {
            res.send('Usuario marcado como inactivo');
        }
    });
};


module.exports = {

    createUser,
    updateUser,
    updatePassword,
    getUsers,
    validationUser,
    desactivateUser
}