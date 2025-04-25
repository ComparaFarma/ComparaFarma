// server/api/download/modelo-importacao.get.ts
import { createReadStream } from 'fs'
import { join, dirname } from 'path'
import { sendStream, setHeader } from 'h3'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineEventHandler((event) => {
  const filePath = join(__dirname, '../../public/import-model.xlsx')

  const stream = createReadStream(filePath)
  setHeader(event, 'Content-Disposition', 'attachment; filename="import-model.xlsx"')
  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

  return sendStream(event, stream)
})
