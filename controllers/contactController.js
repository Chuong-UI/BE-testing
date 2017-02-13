exports.getContact = (req, res) => {
    res.render('contact', {
        title: 'Contact'
    });
};
exports.postContact = (req, res) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('message', 'Message cannot be blank').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/contact');
    }

    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
};
