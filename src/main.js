import express from "express";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/configdb";
import authRoutes from "./routes/authRoutes";
import initAPI from "./routes/api";
const app = express();
const PORT = process.env.PORT || 8081;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
viewEngine(app);

authRoutes(app);

initAPI(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Đã có lỗi xảy ra từ phía server!" });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
