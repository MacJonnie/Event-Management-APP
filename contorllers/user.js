import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db.js'



// signUp
const signUp = async (req, res) => {
  try {
      // collect the payload from the request body
    const { email, username, password } = req.body

    // check if the email already exist in the DB.
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      console.log("User Already Exists");
      return res.status(400).json({ message: "User Already Exists" });
    };
    
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = await pool.query(
      'INSERT INTO users (email, username, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, username, hashedPassword, "USER"]
    );
    
    console.log("User Successfully Created");
    res.status(201).json({
      message: "User Created Successfully",
      user: newUser.rows[0]
    });
  } catch (error) {
      console.log("SignUp request failed:", error);
      res.status(500).json({ message: "Something went wrong" });
  }};

  
     // signIn
const signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const isValidUser = await pool.query( 'SELECT * FROM users WHERE email = $1', [email]);
      if (!isValidUser) {
        console.log("User does not exist");
        return res.status(400).json({message: "User does not exist"});
      }
      const user = isValidUser.rows[0];

      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({message: "Incorrect password"});
      }
      
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.API_SECRET, { expiresIn: "1h" });
      
      res.status(200).send({
        user: { userId: user.id, email: user.email, role: user.role },
        message: "Logged in successfully",
        accessToken: token,
      });
      
      console.log("You are now logged in");
      console.log("Welcome back", user.username);
    }catch(err) {
      console.error(err);
      res.status(500).send({ message: 'Something went wrong'});
    }};


    // Change role
const changeRole = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',[email]
    );
    const user = result.rows[0];

    if (!user) {
      console.log("User not found")
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'CREATOR') {
      return res.status(400).json({ message: 'User is already a CREATOR' });
    }

    const updated = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING *', ['CREATOR', email]
    );

    res.status(200).json({
      message: 'User role updated to CREATOR',
      user: updated.rows[0]
    });
    console.log("User role updated to CREATOR")
  } catch (error) {
    console.error('Role update failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export { signUp, signIn, changeRole };
 