import expresss, { json } from 'express'
//la dependencia de cors
import fs from 'node:fs/promises' //fs es file system
import path from 'node:path'

const PORT = process.env.PORT ?? 3000
const app = expresss()

app.use(json())

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} $[req.url]`)
    next()
})

app.get('/openapi.yaml', async (req, res, next) => {
    try {
        const filePath = path.join(process.cwd(), 'apenapi.yaml')
        const yamlData = await fs.readFile(filePath, 'utf-8')
        res.setHeader('Content-Type', 'text/yaml')
        res.send(yamlData)
    } catch (e) {
        console.error(e.medsage)
        res.status(500).send({error: 'Unable to fetch openapi.yaml manifest'})
    }
})

app.get('/.well-known/ai-plugin.json', (req, res) => {
    res.sendFile(path.join(process.cwd(), '.well-known/ai-plugin.json'))
})

app.get('/logo.png', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'logo.png'))
})


//iniciar el servidor
app.listen(PORT, () => {
    console.log('ChatGPT Plugin is listening on port', PORT)
})