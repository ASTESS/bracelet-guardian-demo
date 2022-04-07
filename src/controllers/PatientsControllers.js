const knex = require('../database')
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {
     
    async get(req, res){
        const {id} = req.params
        knex('patient_data').where({profileId: id}).then((data) => {
            res.send(data)
        })
    },
    async create(req, res, next){
        let isValid = false
        let id = 0
        let patientName = ''
        let phones = []
        try {
            const {level, locationX, locationY, macAddress} = req.body
            //const {id} = req.params

            if(macAddress != ''){
                await knex('bracelets').where({macAddress: macAddress}).then((data) => {
                    if(data[0].braceletId != 0){
                        isValid = true
                        id = data[0].profileId
                    } else{
                        res.send('Bracelet is not valid.')
                    }
                })
            }

            if(isValid != false){
                if(locationX != '' && locationY != '' && id != '' && level != ''){
                    await knex('patient_data').insert({
                        level: level,
                        locationX: locationX,
                        locationY: locationY,
                        profileId: id
                    })
                    
                    await knex('profiles').where({profileId: id}).then((data) => {
                        patientName = data[0].profileName
                    })

                    await knex('nurses').then((data) => {
                        console.log(data)
                        for (let index = 0; index < data.length; index++) {
                            client.messages.create({
                                body: 'Alert: ' + patientName + ' has fallen.',
                                from: process.env.TWILIO_PHONE_NUMBER ,
                                to: data[index].phone
                            }).then(message => console.log(message.sid));
                            
                        }
                    })
                    
                    return res.status(200).send('Alert to nurses was sent!!')
                }
                
            } else {
                return res.status(500).send('Information is not valid.')
            }
            

            
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params
            
            await knex('patient_data').where({
                dataId: id
            }).del()

            return res.send('Alert deleted')

        } catch (error) {
            next(error)
        }
    }, 
    async test(req,res, next){
        let message_received = req.body;

        res.writeHead(200);
		return res.end(`Welcome ESP32, the message you sent me is:` + message_received);
    }
    
}