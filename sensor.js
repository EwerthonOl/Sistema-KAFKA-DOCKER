//importando dependencias de objetos e funções que serão usadas
const { Kafka, Partitioners, logLevel } = require('kafkajs')

//iniciando o objeto kafka para uso no sensor
const kafka = new Kafka({
  //definindo o id desse kafka
  clientId: 'sensor-app',
  ////o kafka está na porta 9092 do localhost
  brokers: ['localhost:9092'],
  //////habilitando os logs no terminal apenas para caso de erro
  logLevel: logLevel.ERROR
})

//criando um produtor do objeto kafka criado antes
const producer = kafka.producer({
  ////coloando as partições para ser as padroes legado, igual a todos os outros produtores criados
  createPartitioner: Partitioners.LegacyPartitioner
})

//função do sensor
async function run() {
  //conectando o produtor a porta 9092
  await producer.connect()

  for (let index = 0; index < 10; index++) {
    // Gerando valores simulados para o sensor
    const sensorValue = parseFloat((Math.random() * 100).toFixed(2))
    console.log('\nSensor enviando o dado obtido: ', sensorValue)

    //envia os dados para o topico: sensor-data-topic
    await producer.send({
      topic: 'sensor-data-topic',
      //mensagem com os dados
      messages: [{ value: JSON.stringify({ value: sensorValue }) }]
    })
  }

  //disconecta o produtor da porta
  await producer.disconnect()
}

//roda o sensor e caso haja erro ele mostra qual
run().catch(error => console.error('\nErro no sensor:', error))
