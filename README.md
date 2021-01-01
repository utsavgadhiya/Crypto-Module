# crypto-module
This is a crypto module for encryption and decryption of data. This is a generic module and can be used with almost any type of data

# Installation
```
npm i @utsavgadhiya/crypto-module
```

# Example of the encryption payload
```
{
     "encrypted_keys": [
        "username",
        "email"
    ],
     "payloads": [
        {
            "members": [
                {
                    "username": "Harry",
                    "email": ""harry.potter@hogwards.edu",
                    "gender": "Male"
                },
                {
                    "username": "Hermione",
                    "email": "hermione.granger@hogwards.edu",
                    "gender": "Female"
                }
            ]
        }
    ]
}
```