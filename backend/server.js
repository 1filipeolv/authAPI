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

let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("MongoDB connected")
        return mongoose
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err)
        throw err
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

app.use(async (req, res, next) => {
  try {
    await connectToDB()
    next()
  } catch (err) {
    next(err)
  }
})

app.use("/api/auth", authRoutes)

app.use((err, req, res, next) => {
  console.error("[Erro Global]:", err)
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: err.message,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
