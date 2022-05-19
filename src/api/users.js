const pool = require("../config/dbPostgress");
const bcrypt = require("bcrypt");

const getUsersbyEmail = async (req, res) => {
  console.log("Ping function");
  return res.status(200).json({
    status: "Email",
  });
};

const postCreateUser = async (req, res) => {
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
    return res.status(500).json(userCreated.e);
  }

  if (userCreated.id) {
    console.log(userCreated);
    return res.status(200).json({
      status: "user created",
      data: { id: userCreated.id },
    });
  }
};

const getUserById = async (req, res) => {
  if (!req.query.id) {
    return res
      .status(400)
      .json({ status: "Consulta por ID. Obrigatório passar o ID." });
  }
  var id = req.query.id;
  try {
    pool.query(
      `SELECT id,erp_user_code,email FROM users WHERE id = '${id}' `,
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
  var insert;
  var bcryptPassword = "";
  // utiliza biblioteca bcrypt para criptografar a senha
  bcrypt.hash(password, 10, (errBcrypt, hash) => {
    if (errBcrypt) {
      return (res = { continue: false, error: true, errBcrypt });
    }
    bcryptPassword = hash;
    console.log("bcrypt", bcryptPassword);
  });
  
  insert = `insert into users`;
  insert = insert + `(email,erp_user_code,password,user_name,fullname)`;
  insert =
    insert +
    `values  ('${email.trim()}','${erp_user_code.trim()}','${bcryptPassword}','${user_name.trim()}','${fullname.trim()}') RETURNING id`;
  console.log(insert);
  try {
    console.log("4");
    response = await pool.query(insert);
  } catch (e) {
    console.log("5");
    res = { continue: false, error: true, e };
    return res;
  }
  console.log(response.rows[0].id);
  return { id: response.rows[0].id, error: false };
}

//função de autenticação retorna token
const oauth2 = async (req, res) => {
  const { email, password } = req.body;
  try {
    response = await pool.query(
      `select count(*) quantidade from users where  email = '${email.trim()}' and password = '${password.trim()}'`
    );
    return res.status(200).json({ email: email });
  } catch (e) {
    return res.status(400).json({ error: "credentials wrong" });
  }
};

module.exports = {
  getUserById,
  getUsersbyEmail,
  postCreateUser,
  oauth2,
};
