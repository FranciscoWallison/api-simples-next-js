/**
 * Nome do arquivo: exemplo.js
 * Data de criação: 30/04/2024
 * Autor: João Silva
 * Matrícula: 123456
 *
 * Descrição:
 * Este arquivo JavaScript é responsável por implementar as funcionalidades
 * de interação do usuário com a interface gráfica do módulo de vendas.
 * Aqui são tratados eventos de cliques, validações de entrada e comunicação
 * com APIs para envio e recebimento de dados.
 *
 * Este script é parte o curso de ADS.
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import openDB from "../../database/dbConfig";
import { app, database } from "../../services/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
const dbInstance = collection(database, "eneias_rodrigues");

export default async function handler(req, res) {
  // const db = await openDB();

  if (req.method === "GET") {
    const id = req.query.id;
    console.log("", id);

    if (id === undefined) {
      const usuarios = await getDocs(dbInstance).then((data) => {
        return data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        });
      });

      res.status(200).json(usuarios);
    } else {
      const valid_usuario = doc(database, "eneias_rodrigues", id);
      const usuario_data = await getDoc(valid_usuario);

      if (valid_usuario === undefined) {
        res.status(404).json({});
      }

      const usuario = { ...usuario_data.data(), id: id };

      // const usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [id]);
      res.status(200).json(usuario);
    }
  }

  if (req.method === "POST") {
    const new_usuario = req.body;

    if (new_usuario.nome === undefined || new_usuario.nome === "") {
      res.status(402).json({ message: "nome é obrigatorio!" });
    }

    if (new_usuario.email === undefined || new_usuario.email === "") {
      res.status(402).json({ message: "email é obrigatorio!" });
    }

    const nome = new_usuario.nome;
    const email = new_usuario.email;

    addDoc(dbInstance, { nome: nome, email: email }).then(() =>
      console.log("gravamos")
    );

    res.status(201).json({});
  }

  if (req.method === "PUT") {
    const update_usuario = req.body;

    if (update_usuario.nome === undefined || update_usuario.nome === "") {
      res.status(402).json({ message: "nome é obrigatorio!" });
    }

    if (update_usuario.email === undefined || update_usuario.email === "") {
      res.status(402).json({ message: "email é obrigatorio!" });
    }

    // const valid_usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [
    //   update_usuario.id,
    // ]);
    // if (valid_usuario === undefined) {
    //   res.status(404).json({});
    // }

    const valid_usuario = doc(database, "eneias_rodrigues", update_usuario.id);

    await updateDoc(valid_usuario, {
      nome: update_usuario.nome,
      email: update_usuario.email,
    });

    // const updateUsuario = await db.prepare(
    //   "UPDATE Usuarios SET nome = ?, email = ? WHERE id = ?"
    // );
    // const runCreat = await updateUsuario.run(
    //   update_usuario.nome,
    //   update_usuario.email,
    //   update_usuario.id
    // );

    res.status(200).json({});
  }

  if (req.method === "DELETE") {
    const ID = req.body.id;

    // const valid_usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [
    //   ID,
    // ]);
    // if (valid_usuario === undefined) {
    //   res.status(404).json({});
    // }

    const valid_usuario = doc(database, "eneias_rodrigues", ID);

    await deleteDoc(valid_usuario);

    res.status(201).json({});
  }
}
