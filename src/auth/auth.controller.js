const { User } = require('./auth.model');
let Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function signUp(req, res) {
  const { name, email, password } = req.body;

  const rules = {
    name: 'required|min:2',
    email: 'required|email',
    password: 'required|min:6',
  };
  const validation = new Validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json({ error: validation.errors.all() });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists.' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();

  const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });


  res.status(201).json({ meta: { access_token: accessToken } });
}


async function signIn(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  res.json({
    meta: {
      access_token: accessToken,
    },
  });
}


async function getMe(req, res){
  const user = req.user.toObject();
  delete user.password;

  res.json({ data: user });
}


module.exports = { signUp, signIn, getMe };