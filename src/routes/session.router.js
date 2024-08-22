import { Router } from "express";
const router = Router();
import UsuarioModel from "../models/usuarios.model.js";
import { createHash, isValidPassword } from "../util/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";

// Ruta de registro
router.post("/register", async (req, res) => {
    const { usuario, password, first_name, last_name, email, age, cart } = req.body;

    try {
        // Verifica si el usuario o el email ya existen
        const existeUsuario = await UsuarioModel.findOne({ usuario });
        const existeEmail = await UsuarioModel.findOne({ email });

        if (existeUsuario || existeEmail) {
            return res.status(400).send("El usuario o el email ya existen");
        }

        // Crea el nuevo usuario
        const nuevoUsuario = new UsuarioModel({
            usuario,
            password: createHash(password),
            first_name,
            last_name,
            email,
            age,
            cart: cart || null  // Asigna el ID del carrito si está disponible
        });

        await nuevoUsuario.save();

        // Genera el token JWT
        const token = jwt.sign({ usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol }, "Aniwear", { expiresIn: "1h" });
        res.cookie("CookieToken", token, { httpOnly: true, maxAge: 3600000 });
        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;
    try{
        const usuarioEncontrado = await UsuarioModel.findOne({usuario});
        if(!usuarioEncontrado) {
            return res.status(401).send("Usuario o contraseña incorrectos");
        }
        if(!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Usuario o contraseña incorrectos");
        }
        const token = jwt.sign({usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol}, "Aniwear", {expiresIn: "1h"});
        res.cookie("CookieToken", token, {httpOnly: true, maxAge: 3600000});
        res.redirect("/api/sessions/current");
    }catch(error){
        res.status(500).send(error);
    }
});

router.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
    if(req.user) {
        res.render("home", {usuario: req.user.usuario});
    }else {
        res.status(401).send("No autorizado");
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("CookieToken");
    res.redirect("/login");
});



export default router;