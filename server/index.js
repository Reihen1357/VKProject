import express from 'express'
import * as dotenv from 'dotenv'
import {sequelize} from "./db.js";
import cors from 'cors'
import './tableModels/models.js'
import router from './routes/index.js'
import path from "path";
import fileUpload from 'express-fileupload'
import {fileURLToPath} from 'url';

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

