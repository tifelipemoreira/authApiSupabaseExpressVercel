const pool = require("../config/dbPostgress");
const bcrypt = require("bcrypt");
const { response } = require("express");

const CreateUser = async (req, res) => {
  const { email, password, user_name, fullname, erp_user_code } = req.body;

  //validar se todos os campos do body foram informados.
  if (!email) {
    return res.status(400).json({
      status: "Missing email",
    });
  } else if (!password) {
    return res.status(400).json({
      status: "Missing password",
    });
  } else if (!user_name) {
    return res.status(400).json({
      status: "Missing user_name",
    });
  } else if (!fullname) {
    return res.status(400).json({
      status: "Missing fullname",
    });
  } else if (!erp_user_code) {
    return res.status(400).json({
      status: "Missing erp_user_code",
    });
  }

  //verifica se o email, erp_user_code  ou user_name já existem
  var alreadyExists = await checkUserAlreadyExists(
    email,
    erp_user_code,
    user_name
  );
  if (alreadyExists.error) {
    return res.status(500).json(alreadyExists.e);
  }
  if (!alreadyExists.continue) {
    return res.status(409).json({
      status: "email,erp_user_code or user_name already exists",
    });
  }
  var userCreated = await createUser(
    email,
    erp_user_code,
    password,
    user_name,
    fullname
  );
  if (userCreated.error) {
    return res.status(500).json(userCreated.errBcrypt);
  }

  if (userCreated.id) {
    console.log(userCreated);
    return res.status(201).json({
      status: "sucess",
      data: { id: userCreated.id, email:userCreated.email,user_name:userCreated.user_name},
    });
  }
};

const getUsers = async (req, res) => {
  if (!req.query.user_name) {
    return res
      .status(400)
      .json({ status: "Consulta por ID. Obrigatório passar o ID." });
  }
  var user_name = req.query.user_name;
  try {
    pool.query(
      `SELECT id,erp_user_code,email FROM users WHERE user_name = '${user_name}' `,
      (error, result) => {
        //retorna objeto com resultado da query
        if (typeof error != "undefined") {
          console.log(error);
          return res.status(400).json({ error });
        }
        //console.log("funcionou")
        return res.status(200).json(result.rows);
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
};

//função de autenticação retorna token
const oauth2 = async (req, res) => {
  const { email, password } = req.body;
  const bcryptPassword = bcrypt.hashSync(password, 10);
  try {
    var response = await pool.query(
      `select * from users where  email = '${email.trim()}'`
    );
  } catch (e) {
    return res.status(500).json({ status: "error", error: e });
  }
  if (!response.rows[0]) {
    return res.status(401).json({ status: "Unauthorized" });
  } else if (!bcrypt.compareSync(password, response.rows[0].password)) {
    return res.status(401).json({ status: "Unauthorized" });
  }
  return res.status(200).json({
    status: "sucess",
    email: response.email,
    password: response.password,
  });
};


/** Função que verifica se já existe cadastro com campos que não permitem
 * repetir.
 */
async function checkUserAlreadyExists(email, erp_user_code, user_name) {
  var response;
  var res;
  console.log(
    `select count(*) from users where  email = '${email.trim()}' or erp_user_code =  '${erp_user_code.trim()}' or user_name = '${user_name.trim()}'`
  );
  try {
    response = await pool.query(
      `select count(*) quantidade from users where  email = '${email.trim()}' or erp_user_code =  '${erp_user_code.trim()}' or user_name = '${user_name.trim()}'`
    );
    console.log("count", response.rows[0].quantidade);
  } catch (e) {
    console.log("1");
    res = { continue: false, error: true, e };
    return res;
  }
  if (response.rows[0].quantidade > 0) {
    console.log("2");
    return { continue: false, error: false };
  }
  console.log("3");
  return { continue: true, error: false };
}

async function createUser(email, erp_user_code, password, user_name, fullname) {
  var response;
  var bcryptPassword = bcrypt.hashSync(password, 10);
  var insert1 = `insert into users (email,erp_user_code,password,user_name,fullname)`;
  var insert2 = `values  ('${email.trim()}','${erp_user_code.trim()}','${bcryptPassword}','${user_name.trim()}','${fullname.trim()}') RETURNING id,email,user_name`;
  var insert = insert1 + insert2;
  try {
    response = await pool.query(insert);
  } catch (e) {
    return { error: true, e };
  }
  return { id: response.rows[0].id, email:response.rows[0].email, user_name:response.rows[0].user_name , error: false };
}


module.exports = {
  getUsers,
  CreateUser,
  oauth2,
};
