const redis = require('redis')
const bcrypt = require('bcrypt')
const db = redis.createClient()

class User {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key]
        }
    }

    save(cb) {
        if (this.id) {
            this.update(cb)
        } else {
            db.incr('user:ids', (err, id) => {
                if (err) return cb(err)
                this.id = id;
                this.hashPassword((err) => {
                    if (err) return cb(err)
                    this.update(cb)
                })
            })
        }
    }

    update(cb) {
        const id = this.id
        db.set(`user:id:${this.name}`, id, (err) => {
            if (err) return cb(err)
            db.hmset(`user:${id}`, this, (err) => {
                cb(err)
            })
        })
    }

    hashPassword(cb) {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return cb(err)
            this.salt = salt
            bcrypt.hash(this.pass, salt, (err, hash) => {
                if (err) return cb(err)
                this.pass = hash
                cb()
            })
        })
    }

    static getByName(name, cb) {
        User.getId(name, (err, id) => {
            if (err) return cb(err)
            User.get(id, cb)
        })
    }

    static getId(name, cb) {
        db.get(`user:id:${name}`, cb)
    }

    static get(id, cb) {
        db.hgetall(`user:${id}`, (err, data) => {
            if (err) return cb(err)
            cb(null, new User(data))
        })
    }

    static authenticate(name, pass, cb) {
        User.getByName(name, (err, user) => {
            if (err) return cb(err)
            if (!user.id) return cb()
            bcrypt.compare(pass, user.pass, (err, res) => {
                if (err) return cb(err)
                if (res) return cb(null, user)
                cb()
            })
        })
    }
}

// const user = new User({
//     name: 'bert_cai',
//     pass: 'test'
// })

// user.save((err) => {
//     if (err) console.error(err);
//     console.log('user id %d', user.id);
// })

// User.getByName('bert_cai', (err, user) => {
//     if (err) console.error(err);
//     console.log(user);
// })

module.exports = User