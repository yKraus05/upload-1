
# 📁 Upload - Gerenciador de Arquivos

Sistema completo para upload, listagem, visualização e remoção de imagens, com backend em NestJS e frontend em Angular + Tailwind CSS.

---

## ✨ Funcionalidades

- **Upload de imagens** (jpg, jpeg, png, gif, webp) com limite de 5MB por arquivo
- **Listagem de arquivos** com nome, tamanho e data de criação
- **Remoção de arquivos** por nome
- **Galeria de imagens** moderna no frontend Angular, com grid responsivo (Tailwind)
- **Visualização instantânea** das imagens enviadas
- **Tratamento de erros** (arquivo grande, formato inválido, etc.)
- **Serviço de arquivos reativo** (Angular Signals + RxJS)
- **CORS habilitado** para integração frontend/backend
- **Serviço estático**: imagens acessíveis via URL pública

---

## 👨‍💻 Autor

Lucas Borges  
[GitHub](https://github.com/LucasBorges2009)

---

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Instalação

```bash
git clone https://github.com/LucasBorges2009/upload.git
cd upload
npm install
```

### Rodando o Backend (NestJS)

```bash
cd upload
npm run start:dev
# ou
npm start
```
Acesse: [http://localhost:3000](http://localhost:3000)

### Rodando o Frontend (Angular)

```bash
cd upload/frontend
npm install
npx ng serve
# ou
npm start
```
Acesse: [http://localhost:4200](http://localhost:4200)

---

## 📂 Regras de Upload

- Apenas imagens: **jpg, jpeg, png, gif, webp**
- Tamanho máximo: **5MB**
- Arquivos salvos em: `/uploads`
- Acesso público: `http://localhost:3000/uploads/<nome-do-arquivo>`

---

## 📌 Endpoints da API (NestJS)

### 📤 Upload de imagem
- **POST** `/arquivo/upload`
- Body: FormData (campo `file`)
- Respostas:
  - Sucesso: `{ message, filename, originalname, size }`
  - Erro tipo: `{ statusCode: 400, message: "Apenas arquivos de imagem são permitidos." }`
  - Erro tamanho: `{ statusCode: 413, message: "Arquivo muito grande!" }`

### 📂 Listar arquivos
- **GET** `/arquivo`
- Resposta: `{ total, files: [{ filename, size, criado }] }`

### 🗑️ Remover arquivo
- **DELETE** `/arquivo/delete/:filename`
- Resposta: `{ message, filename }` ou erro 404

---

## 🖼️ Frontend Angular

- **Galeria de imagens**: grid responsivo com Tailwind CSS
- **Upload**: botão para selecionar e enviar imagens
- **Visualização**: imagens carregadas da API, exibidas instantaneamente
- **Reatividade**: atualização automática após upload ou remoção
- **Tratamento de erros**: mensagens amigáveis para usuário

### Estrutura principal

- `frontend/src/app/components/galeria/galeria.component.ts/html`: componente da galeria
- `frontend/src/app/services/arquivo.service.ts`: serviço de integração com API
- `frontend/src/app/app.routes.ts`: rotas

---

## ⚙️ Tecnologias e Bibliotecas

- **Backend**: NestJS, Multer, TypeScript
- **Frontend**: Angular 21+, Tailwind CSS 4, RxJS, Angular Signals

---

## 🧪 Testes rápidos

### Upload
POST `/arquivo/upload` (FormData, campo `file`)

### Listar
GET `/arquivo`

### Deletar
DELETE `/arquivo/delete/<nome-do-arquivo>`

---

## 📌 Observações

- A pasta `/uploads` é criada automaticamente
- Apenas imagens são aceitas (validação backend)
- Nome do arquivo é gerado automaticamente
- Imagens ficam acessíveis via URL pública
- Frontend e backend podem rodar separadamente

---

## 📷 Prints

### Upload
![POST](image.png)

### Listar
![GET](image-1.png)

### Deletar
![DELETE](image-2.png)