console.log("MONGO_URI:", process.env.MONGO_URI)
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config() 

const authRoutes = require("./routes/auth")

const app = express()

app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
)

app.use(express.json())

app.use("/api/auth", authRoutes)

app.use((err, req, res, next) => {
  console.error("[Erro Global]:", err)
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: err.message,
  })
})

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
