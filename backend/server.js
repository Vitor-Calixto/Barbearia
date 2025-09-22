import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs-extra";

const app = express();
const PORT = 3000;
const DATA_FILE = "./data/bookings.json";

app.use(cors());
app.use(bodyParser.json());

// garante que o arquivo existe
await fs.ensureFile(DATA_FILE);
if (!(await fs.readFile(DATA_FILE, "utf8"))) {
  await fs.writeJson(DATA_FILE, []);
}

// listar agendamentos
app.get("/api/bookings", async (req, res) => {
  const data = await fs.readJson(DATA_FILE);
  res.json(data);
});

// adicionar agendamento
app.post("/api/bookings", async (req, res) => {
  const { name, phone, service, date, time, note } = req.body;
  if (!name || !phone || !date || !time) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }

  const bookings = await fs.readJson(DATA_FILE);
  const newBooking = { id: Date.now(), name, phone, service, date, time, note };
  bookings.push(newBooking);
  await fs.writeJson(DATA_FILE, bookings, { spaces: 2 });

  res.json(newBooking);
});

// deletar agendamento
app.delete("/api/bookings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  let bookings = await fs.readJson(DATA_FILE);
  bookings = bookings.filter((b) => b.id !== id);
  await fs.writeJson(DATA_FILE, bookings, { spaces: 2 });
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
);
