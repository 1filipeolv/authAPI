const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const checkDBConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB não está conectado");
  }
};

const register = async (req, res) => {
  try {
    checkDBConnection();

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    console.log("[Register] Dados recebidos:", { name, email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Usuário já existe" });
    }

    const user = new User({ name, email, password });
    await user.save();

    console.log("[Register] Usuário salvo:", user._id);

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso",
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("[Register error]:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    checkDBConnection();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Preencha todos os campos" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Credenciais inválidas" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Credenciais inválidas" });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("[Login error]:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor", error: error.message });
  }
};

const logout = async (req, res) => {
  res.json({ success: true, message: "Logout realizado com sucesso" });
};

const deleteAccount = async (req, res) => {
  try {
    checkDBConnection();

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndDelete(decoded.userId);

    res.json({ success: true, message: "Conta excluída com sucesso" });
  } catch (error) {
    console.error("[Delete account error]:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor", error: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    checkDBConnection();

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("[Verify token error]:", error);
    res.status(401).json({ success: false, message: "Token inválido", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    checkDBConnection();

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("[Get profile error]:", err);
    res.status(401).json({ success: false, message: "Token inválido", error: err.message });
  }
};

const refreshToken = async (req, res) => {
  res.status(501).json({ success: false, message: "Refresh token não implementado" });
};

module.exports = { register, login, logout, deleteAccount, verifyToken, getProfile, refreshToken };
