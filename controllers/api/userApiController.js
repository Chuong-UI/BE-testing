const express = require('express');
const router = express.Router();

const User = require(global.appRoot + 'models/User');

router.route('/')
    .post(function (req, res) {
        var user = new User();
        user.userName = req.body.userName;
        user.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
    })
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

router.route('/:userId')
    .get(function (req, res) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                res.send(err);

            res.json(user);
        });
    })
    .put(function (req, res) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                res.send(err);
            user.userName = req.body.userName;
            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'user updated!' });
            });

        });
    })
    .delete(function (req, res) {
        User.remove({
            _id: req.params.userId
        }, function (err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router