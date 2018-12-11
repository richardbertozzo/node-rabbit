require('dotenv').config();
const amqp = require("amqplib");

let producer = amqp.connect(`${process.env.RABBIT_MQ}?heartbeat=60`);

producer
    .then((conn) => {
        return conn.createConfirmChannel()
            .then((channel) => {
                let exchangeName = "amq.direct";
                let routingKey = "test";
                let msg = new Buffer('Hello World');

                channel.publish(exchangeName, routingKey, content = msg, options = {
                    contentType: "text/plain",
                    deliveryMode: 1
                }, (err, ok) => {
                    if (err) {
                        console.error("Error: failed to send message\n" + err);
                    }
                    conn.close();
                });
            });
    })
    .then(null, (err) => {
        console.error(err);
    });