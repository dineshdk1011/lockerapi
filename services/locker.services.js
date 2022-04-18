var mqtt = require('mqtt');
const db = require("../mongo");
const moment = require('moment')


const service = {
  async unlock(req, res) {
    const subscribe_topic = req.body.subscribe_topic;
    const publish_topic = req.body.publish_topic;
    const key = req.body.key
    try {
      var client = mqtt.connect('mqtt://broker.emqx.io:1883', {
        username: 'emqx',
        password: "public"
      });

      var ssd1406topic = publish_topic;
      var ssd1306topic = subscribe_topic;

      console.log(ssd1406topic);
      client.on('connect', function () {
        console.log('connected');

        client.subscribe(ssd1306topic, function (err) {

          if (!err) {
            console.log('subscribed');

            client.publish(ssd1406topic, key);
            res.status(200);
          }

        })
      });
      client.on('message', function (topic, message) {
        console.log(message.toString());
        const status = message.toString();
        db.lockerData.findOneAndUpdate({ name: req.body.name }, { $set: { status: status } });
        const updatetime = momentupdate(req.body.nam)
      })
      res.end();
    } catch (error) {
      console.log("Cant unlock", error);
      res.sendstatus(500)
    }
  },
  async newLocker(req, res) {
    try {
      const user = await db.lockerData.findOne({ name: req.body.name });
      if (user) return res.status(400).send({ error: "locker already exist" })
      await db.lockerData.insertOne(req.body);
      res.send({ message: "locker added successfully" })

    } catch (err) {
      res.status(500)
    }
  },
  async lockerdata(req, res) {
    try {
      const data = await db.lockerData.find().toArray();
      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },

  async Updatedata(req, res) {
    var status = "close"
    try {
      const data = await db.lockerData.findOneAndUpdate({ name: req.body.name }, { $set: { status: status } },{new: true});
      

      console.log(data);
      const updatetime = momentupdate(req.body.name)
      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },

  async Occupied(req, res) {
    try {
      const data = await db.lockerData.find({ user: { $exists: true, $ne: null } }).toArray();
      res.status(200).send(data);
    } catch (e) {
      res.status(500)
    }
  },

  async Updateuser(req, res) {
    try {
      const data = await db.lockerData.findOneAndUpdate({ name: req.body.name }, { $set: { user: req.body.user, userstatus: req.body.userstatus } });

      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },
  async Updatealldata(req, res) {
    try {
      const data = await db.lockerData.updateMany({ name: req.body.name }, { $set: req.body });

      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },
  async deletedata(req, res) {
    try {
      const data = await db.lockerData.deleteOne({ "name": req.body.name })

      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },
  async logdata(req, res) {
    try {
      const data = await db.logdata.find().toArray();
      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },
  async logdataone(req, res) {
    try {
      const data = await db.logdata.findOne({ name: req.body.name })
      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  }
}

momentupdate = async (name) => {
  var notification = new Promise(async (resolve, reject) => {
    var data = {
      time: moment().format('YYYY-MM-DD, h:mm:ss a'),
      name: name
    }
    await db.logdata.insertOne(data);
  })
  return await notification
}


module.exports = service;