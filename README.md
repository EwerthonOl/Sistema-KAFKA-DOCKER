# Sensor-Analista Web App usando KafkaJS com Docker

Este repositório contém o código de um aplicativo web que demonstra a comunicação entre um "Sensor IoT", um "Analista" para os dados do Sensor e um "Cliente" web. 
O sensor gera valores aleatórios e os envia para um tópico Kafka. 
O analista consome os dados do tópico Kafka, processa-os e envia os dados processados ​​para o topico do cliente Kafka que verá os dados processados. 
O web client consome os dados processados ​​do tópico Kafka e os exibe na tela.

## Requisitos

Para executar esse projeto, você precisará de:

* Docker
* Docker Compose
* Node.js
* npm
* Kafka broker

## Instalação

1. Clone esse repósitório.
2. Rode `npm install` para instalar as dependencias.
3. Rode `docker-compose up` para iniciar o Kafka broker e o ZooKeeper.

4. Rode `node sensor.js` para iniciar o servidor do consumidor.
5. Rode `node analista.js` para iniciar o servidor do analista.
6. Rode `node index.js` para iniciar o servidor que recebe e mostra dados do consumidor e do analista.

## Uso

1. Abra uma página na internet em: `http://localhost:3000`.
2. Você verá dois cartões: um que mostra os dados do sensor e outro que mostra os dados do analista.
3. O cartão de dados do sensor mostra os valores gerados pelo sensor.
4. O cartão de dados do analista vai mostrar os valores de minimo, média, e o máximo que foram recebidos pelo analista.

## Explicação dos arquivos principais

O código deste aplicativo web está explicado abaixo:

* `analista.js`: Este arquivo contém o código do analista. O analista consome os dados do tópico Kafka, processa-os e envia os dados processados ​​para outro tópico Kafka.
* `docker-compose.yml`: Este arquivo define a configuração do Docker Compose para o aplicativo web. Ele cria dois contêineres: um para o corretor Kafka e outro para o zookeeper.
* `index.js`: Este arquivo contém o código do aplicativo da web. O aplicativo web consome os dados processados ​​dos dois tópicos Kafka e os exibe na tela.
* `public/index.html`: Este arquivo contém o código HTML com Bootstrap do aplicativo da web.
* `sensor.js`: Este arquivo contém o código do sensor. O sensor gera valores aleatórios e os envia para um tópico Kafka.

### Tecnologias utilizadas

[HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[Bootstrap](https://getbootstrap.com/)
[JQuery](https://jquery.com/)
[Docker](https://www.docker.com/)
[Kafka](https://kafka.apache.org/)
[Node](https://nodejs.org/en)
[NPM](https://www.npmjs.com/)
[Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[BlackboxAI](https://www.useblackbox.ai)