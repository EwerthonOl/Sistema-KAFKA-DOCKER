//importando dependencias de objetos e funções que serão usadas
const { Kafka, Partitioners, logLevel } = require('kafkajs')

//iniciando o objeto kafka para uso no sensor
const kafka = new Kafka({
  //definindo o id desse kafka
  clientId: 'analyst-app',
  ///o kafka está na porta 9092 do localhost
  brokers: ['localhost:9092'],
  //////habilitando os logs no terminal apenas para caso de erro
  logLevel: logLevel.ERROR
})

//criando um objeto consumidor e colocando um id nele de: analyst-group
const consumer = kafka.consumer({ groupId: 'analyst-group' })

//criando um produtor do objeto kafka criado antes
const producer = kafka.producer({
  ////coloando as partições para ser as padroes legado, igual a todos os outros produtores criados
  createPartitioner: Partitioners.LegacyPartitioner
})

//criando variaveis para armazenar valores obtidos dos sensores consumidos
let ValorMinimoDoSensor = parseFloat(Number.MAX_VALUE.toFixed(2))
let ValorMaximoDoSensor = parseFloat(Number.MIN_VALUE.toFixed(2))
let sum = 0
let count = 0

//função do analista
async function run() {
  //conecta o consumidor na porta 9092
  await consumer.connect()
  //coloca o consumidor para consumir o topico: sensor-data-topic
  //define pra consumir desde o inicio
  await consumer.subscribe({ topic: 'sensor-data-topic', fromBeginning: true })
  //roda o consumidor para cada dado que foi colocado pelos sensores
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      //armazena os dados em variaveis
      let sensorData = JSON.parse(message.value.toString())
      let sensorValue = sensorData.value
      console.log('\nAnalista consumindo o dado do sensor: ', sensorData)

      //atribuindo os valores lidos as variaveis criadas
      //valores minimo, medio e maximo
      if (sensorValue < ValorMinimoDoSensor) {
        ValorMinimoDoSensor = sensorValue
      }
      if (sensorValue > ValorMaximoDoSensor) {
        ValorMaximoDoSensor = sensorValue
      }

      //conta quantos dados foram recebidos
      sum += sensorValue
      count++

      //cria o objeto de dados processados para ser enviado ao servidor
      let processedData = {
        ValorMinimoDoSensor: ValorMinimoDoSensor,
        ValorMedioDeTodosRecebidos: parseFloat((sum / count).toFixed(2)),
        ValorMaximoDoSensor: ValorMaximoDoSensor
      }

      //conectando o produtor a porta 9092
      await producer.connect()
      //envia os dados processados para o topico: processed-data-topic
      await producer.send({
        topic: 'processed-data-topic',
        messages: [{ value: JSON.stringify(processedData) }]
      })
    }
  })

  //disconecta o produtor da porta
  await producer.disconnect()
}

//roda o sensor e caso haja erro ele mostra qual
run().catch(error => console.error('\nErro no analista:', error))
