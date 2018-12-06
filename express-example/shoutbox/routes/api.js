const auth = require('basic-auth')
const express = require('express')
const User = require('../models/user')

exports.auth = (req, res, next) => {
    const {
        name,
        pass
    } = auth(req)
    User.authenticate(name, pass, (err, user) => {
        if (err) return next(err)
        if (user) {
            req.remoteUser = user
            // console.log(user,'ahahah')
        }
        // console.log('jinru hahaha')
        next(err)
    })
}

exports.user = (req, res, next) => {
    User.get(req.params.id, (err, user) => {
        if (err) return next(err)
        if (!user.id) return res.sendStatus(404)
        res.json(user)
    })
}