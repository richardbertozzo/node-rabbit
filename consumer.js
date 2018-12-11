require('dotenv').config();
const amqp = require("amqplib");
const domain = require("domain");

let exchangeName = "amq.direct";
let queueName = "testQ1";
let routingKey = "test";

//use domain module to handle reconnecting
let consumer;
const dom = domain.create();
dom.on("error", relisten);
dom.run(listen);

function listen() {
    consumer = amqp.connect(process.env.RABBIT_MQ);
    consumer.then((conn) => {
        return conn.createChannel().then((ch) => {
            ch.assertExchange(exchangeName, 'direct', {
                durable: true,
                autoDelete: false
            });
            ch.assertQueue(queueName, {
                durable: true,
                autoDelete: false,
                exclusive: false
            });
            ch.bindQueue(queueName, exchangeName, routingKey);
            ch.consume(queueName, (message) => {
                //callback funtion on receiving messages
                console.log(message.content.toString());
            }, {
                noAck: false
            });
        });
    }).then(null, (err) => {
        console.error("Exception handled, reconnecting...\nDetail:\n" + err);
        setTimeout(listen, 5000);
    });
}

function relisten() {
    consumer.then((conn) => {
        conn.close();
    });
    setTimeout(listen, 5000);
}