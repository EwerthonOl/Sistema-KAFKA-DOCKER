//importando dependencias de objetos e funções que serão usadas
const express = require('express')
const path = require('path')
const socketIO = require('socket.io')
const { Kafka, logLevel } = require('kafkajs')

//criando o server express e dizendo que sua view será um documento HTML
const app = express()
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

//colocando para o localhost apontar para o file do index.html
app.use('/', (req, res) => {
  res.render('index.html')
})

//servidor do express ouvindo na porta 3000
const server = app.listen(3000, function () {
  console.log('Servidor web app iniciado na porta 3000')
})

//criando um socket IO para ouvir no server
const io = socketIO(server)

//configurando o kafka
const kafka = new Kafka({
  //definindo o id desse kafka
  clientId: 'web-app',
  ///o kafka está na porta 9092 do localhost
  brokers: ['localhost:9092'],
  //////habilitando os logs no terminal apenas para caso de erro
  logLevel: logLevel.ERROR
})

//criando um objeto consumidor e colocando um id nele de: web-app-group
const consumer = kafka.consumer({ groupId: 'web-app-group' })

//função do webapp
async function run() {
  //conecta o consumidor na porta 9092
  await consumer.connect()
  //coloca o consumidor para consumir o topico: sensor-data-topic
  //define pra consumir desde o inicio
  await consumer.subscribe({ topic: 'sensor-data-topic', fromBeginning: true })
  //coloca o consumidor para consumir o topico: processed-data-topic
  //define pra consumir desde o inicio
  await consumer.subscribe({
    topic: 'processed-data-topic',
    fromBeginning: true
  })
  //roda o consumidor para cada dado que foi colocado pelos topicos
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const sensorData = JSON.parse(message.value.toString())

      // Envia os dados do sensor para o cliente via socket.io
      if (topic === 'sensor-data-topic') {
        io.emit('sensor-data', sensorData)
        console.log('\nDado enviado pelo sensor', sensorData)
      }

      // Envia os dados processados para o cliente via socket.io
      if (topic === 'processed-data-topic') {
        io.emit('processed-data', sensorData)

        console.log('\nDado processado pelo analista:', sensorData)
      }
    }
  })
}
//roda o sensor e caso haja erro ele mostra qual
run().catch(error => console.error('Erro na web app:', error))
//coloca o express para executar na pasta public como front
app.use(express.static(path.join(__dirname, 'public')))
