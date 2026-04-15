import Fastify from "fastify";
import ollama from "ollama";
import fs from "fs";

const fastify = Fastify();

// 1. Ele vai procurar e abrir o seu arquivo "index.html" (o verde e amarelo)
fastify.get("/", (request, reply) => {
  const html = fs.readFileSync("index.html", "utf8");
  reply.type("text/html").send(html);
});

// 2. Ele vai carregar a sua logo
fastify.get("/logo.png", (request, reply) => {
  try {
    const imagem = fs.readFileSync("logo.png");
    reply.type("image/png").send(imagem);
  } catch (e) {
    reply.status(404).send("Logo não encontrada");
  }
});
// Adicione isso logo abaixo do bloco da logo.png
fastify.get("/fundo.png", (request, reply) => {
  try {
    // Lembre-se de colocar o nome exato do seu arquivo aqui embaixo também!
    const imagemFundo = fs.readFileSync("fundo.png");
    reply.type("image/png").send(imagemFundo); // use 'image/png' se for .png
  } catch (e) {
    reply.status(404).send("Imagem de fundo não encontrada");
  }
});

// 3. A conexão com o motor da IA (Phi-3)
fastify.post("/perguntar", async (request, reply) => {
  const { pergunta } = request.body;
  try {
    const response = await ollama.chat({
      model: "phi3", // Usando o modelo que funciona no seu PC
      messages: [{ role: "user", content: pergunta }],
    });
    return { resposta: response.message.content };
  } catch (error) {
    return { resposta: "Erro na conexão com a IA local." };
  }
});

// 4. Ligar o servidor na porta 3000
// 4. Ligar o servidor na porta 3005
fastify.listen({ port: 3005 }, (err) => {
  if (err) throw err;
  console.log(
    "🚀 Servidor rodando! Acesse no navegador: http://localhost:3005",
  );
});
