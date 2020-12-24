'use strict'

const cryptoHelper = require('../services/crypto-helper')
const express = require('express')
const router = express.Router()

router.post('/encrypt', async function (req, res, next) {
    const payload = req.body
    try {
        const encryptedData = await cryptoHelper.encrypt(payload)
        res.status(200).send(new Object(
            {
                data: encryptedData,
                status_code: 200,
                status_message: 'Encryption successful',
                errors: []
            }
        ))
    } catch (error) {
        res.status(500).send(new Object(
            {
                errors: error,
                status_code: 500,
                status_message: 'Error while performing encryption',
                data: []
            }
        ))
    }
})

router.post('/decrypt', async function (req, res, next) {
    const payload = req.body
    try {
        const decryptedData = await cryptoHelper.decrypt(payload)
        res.status(200).send(new Object({
            data: decryptedData,
            status_code: 200,
            status_message: 'Decryption successful',
            errors: []
        }))
    } catch (error) {
        res.status(500).send(new Object(
            {
                errors: error,
                status_code: 500,
                status_message: 'Error while performing decryption',
                data: []
            }
        ))
    }
})

module.exports = router
