const mongoose = require('mongoose')

if (process.argv.length < 3) { 
    console.log('Password is missing')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://agoss:${password}@fullstackdb.7wk3e.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullstackDB`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name : String,
    number : String, 
})

const PhonebookEntry = mongoose.model('Entry', phonebookSchema)

if (process.argv.length > 3) { 
    const entry = new PhonebookEntry({
        name : process.argv[3],
        number : process.argv[4]
    })

    entry.save().then(result => { 
        console.log(`added ${entry.name} number ${entry.number} to phonebook`)
        mongoose.connection.close()
    })
} else { 
    PhonebookEntry.find({}).then(result => { 
        result.forEach(entry => { 
            console.log(entry)
        })
        mongoose.connection.close()
    })
}

