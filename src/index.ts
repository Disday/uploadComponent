import express from "express";
import cors from 'cors'
import path from 'path'
import multer from 'multer'
import { PrismaClient as Prisma } from '@prisma/client'

const app = express();
const prisma = new Prisma();
const upload = multer({ dest: 'src/files' });

const apiHost = "http://localhost";
const port = '9000';
const apiAddress = new URL(apiHost);
apiAddress.port = port;

app.use(cors())
app.use(express.json())
app.use('/files', express.static('src/files'))
// app.use(express.static('../vue/dist'))
app.use(express.static('./vue/dist'))

const buildFileLink = (file) => {
  const url = new URL(apiAddress.href);
  url.pathname = `files/${file.filename}`;
  return url;
};
app
  .get('/', async (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'vue/dist/index.html'))
  })
  .get('/multipleField/files', async (req, res) => {
    const files = await prisma.file.findMany({ where: { isMultiple: true } });
    if (!files) {
      res.json([]);
    }

    const filesWithLink = files.map((file) => {
      const link = buildFileLink(file);
      return { ...file, link };
    })
    res.json(filesWithLink);
  })
  .get('/simpleField/files', async (req, res) => {
    const file = await prisma.file.findFirst({ where: { isMultiple: false } });
    if (!file) {
      res.json(null);
      return;
    }
    const link = buildFileLink(file);
    const fileWithLink = { ...file, link }
    res.json(fileWithLink);
  })
  .post('/multipleField/file', upload.array('files'), async (req, res) => {
    const files = req.files.map(({ filename, originalname }) => {
      return { filename, name: originalname, isMultiple: true };
    })
    //SQLite не поддерживает createMany()
    const promises = files.map((file) => {
      return prisma.file.create({
        data: file,
      })
    });
    await Promise.all(promises);
    res.json();
  })
  .post('/simpleField/file', upload.single('files'), async (req, res) => {
    const { filename, originalname: name } = req?.file;
    const file = { filename, name, isMultiple: false };

    await prisma.file.deleteMany({
      where: {
        isMultiple: false
      }
    });
    await prisma.file.create({
      data: file
    });
    res.json();
  })

  .delete('/file/:id', async (req, res) => {
    const id = Number(req.params.id);
    await prisma.file.delete({
      where: { id }
    })
    res.json()
  })


app.listen(port, () =>
  console.log(`server started at port ${port}`)
);
