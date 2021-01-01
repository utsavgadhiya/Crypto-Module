'use strict'

const _crypto = require('crypto')
const CRYPTO_SECRET = "your-super-secret-key"
const ivstring = Buffer.alloc(16, 0)

exports.encrypt = async function (plainObject, secret = CRYPTO_SECRET) {
    /**
    * Encrypts object or string
    * @param Object object to encrypt
    * @returns Object or string in encrypted form, base64 encoded
    **/

    let encryptedObject = {}
    try {
        if (typeof plainObject === 'object') {
            encryptedObject = getEncryptedObject(
                plainObject.encrypted_keys,
                plainObject.payloads
            )
        } else {
            if (typeof plainObject === 'string') {
                encryptedObject = cipherEncrypt(plainObject)
            } else {
                plainObject = plainObject.toString()
                encryptedObject = cipherEncrypt(plainObject)
            }
        }
        return encryptedObject
    } catch (error) {
        console.error('Error while performing encryption: %s %j', error, error)
        if (!error.statusCode) throw new Error(error.message)
        else throw error
    }

    /**
    * Iterate the object provided, and encrypts the values present sent in request
    * @param {object} payload
    * @return {object} payload
    */

    function getEncryptedObject(attributeKeyList, payload) {
        if (Array.isArray(payload)) {
            // Iterate through the list of payload
            payload.forEach(function (element) {
                element = getEncryptedObject(attributeKeyList, element)
            })
        } else {
            // Iterate through each key in payload json
            for (let key in payload) {
                if (
                    payload[key] !== null &&
                    payload[key] !== undefined &&
                    payload[key] !== ''
                ) {
                    if (attributeKeyList.toString().includes(key)) {
                        // Encrypt string
                        if (typeof payload[key] === 'string') {
                            payload[key] = cipherEncrypt(payload[key])
                        } else {
                            // Encrypt entire object
                            payload[key] = payload[key].toString()
                            payload[key] = cipherEncrypt(payload[key])
                        }
                    } else if (
                        payload[key] instanceof Object ||
                        Array.isArray(payload[key])
                    ) {
                        // Array/Object found
                        payload[key] = getEncryptedObject(attributeKeyList, payload[key])
                    }
                }
            }
        }
        return payload
    }

    /**
    * Encrypts string
    * @param string string to encrypt
    * @param Buffer masterkey
    * @returns String encrypted text, base64 encoded
    */

    function cipherEncrypt(plainText) {
        try {
            const cipher = _crypto.createCipheriv(
                'aes-256-ctr',
                Buffer.from(secret),
                ivstring
            )
            let encrypted = cipher.update(plainText, 'utf8', 'hex')
            encrypted += cipher.final('hex')
            return encrypted
        } catch (e) {
            throw new ReferenceError(
                'Unable to encrypt ' + "'" + plainText + "'" + ' because of bad string',
                e
            )
        }
    }

}

exports.decrypt = async function (encryptedObject, secret = CRYPTO_SECRET) {
    /**
    * Decrypts object or string
    * @param Object object to decrypt
    * @returns Object or string in decrypted form, original object
    **/

    let decryptedObject = {}
    try {
        if (typeof encryptedObject === 'object') {
            decryptedObject = getDecryptedObject(
                encryptedObject.encrypted_keys,
                encryptedObject.payloads
            )
        } else {
            decryptedObject = _decrypt(encryptedObject)
            if (!isNaN(decryptedObject)) {
                decryptedObject = parseInt(decryptedObject)
            }
        }
        return decryptedObject
    } catch (error) {
        console.error('Error while performing decryption %s %j', error, error)
        if (!error.statusCode) throw new Error(error.message)
        else throw error
    }

    /**
    * Iterate the object provided, and decrypts the values present in configuration
    */

    function getDecryptedObject(encryptedKeys, payload) {
        if (Array.isArray(payload)) {
            payload.forEach(function (element) {
                element = getDecryptedObject(encryptedKeys, element)
            })
        } else {
            for (let key in payload) {
                if (
                    payload[key] !== null &&
                    payload[key] !== undefined &&
                    payload[key] !== ''
                ) {
                    if (encryptedKeys.toString().includes(key)) {
                        payload[key] = _decrypt(payload[key])
                        if (!isNaN(payload[key])) {
                            payload[key] = parseInt(Object.keys(key))
                        }
                    } else if (
                        payload[key] instanceof Object ||
                        Array.isArray(payload[key])
                    ) {
                        payload[key] = getDecryptedObject(encryptedKeys, payload[key])
                    }
                }
            }
        }
        return payload
    }

    /**
    * Decrypts encrypted text by given key
    * @param Object base64 encoded input data
    * @param Buffer masterkey
    * @returns String decrypted (original) text
    */

    function _decrypt(cipherText) {
        try {
            const decipher = _crypto.createDecipheriv(
                'aes-256-ctr',
                Buffer.from(secret),
                ivstring
            )
            let decrypted = decipher.update(cipherText, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            return decrypted
        } catch (e) {
            throw new ReferenceError(
                'Unable to decrypt ' + "'" + cipherText + "'" + ' because of bad string',
                e
            )
        }
    }
}
