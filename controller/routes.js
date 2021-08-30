const express = require('express');
const router = express.Router();
const urls = require('../model/url');

router.get('/dashboard',  (req, res) => {
    urls.find((err, data) => {
        if(err) throw err;
        
        res.render('dashboard', { urls : data });
        
    });
});


router.post('/create', async (req, res) => {
    const { original, short } = req.body;

    if (!original || !short) {

        res.render( {err: "Empty Fields !" });
    } 
    else {
      await  urls.findOne({ slug: short }, (err, data) => {
            if (err) throw err;
            if (data) {
                res.render('dashboard', {err: "Try Different Short Url, This exists !" });

            } 
            else {
                urls({
                    originalUrl: original,
                    slug: short
                }).save((err) => {
                    res.redirect('/dashboard');
                });
            }
        })
    }

});




router.get('/:slug?', async (req, res) => {

    if (req.params.slug != undefined) {
        var data = await urls.findOne({ slug: req.params.slug });
        if (data) {
            data.visits = data.visits + 1;

            var ref = req.query.ref;
            if (ref) {
                switch (ref) {
                    case 'fb':
                        data.visitsFB = data.visitsFB + 1;
                        break;
                    case 'ig':
                        data.visitsIG = data.visitsIG + 1;
                        break;
                    case 'yt':
                        data.visitsYT = data.visitsYT + 1;
                        break;
                }
            }

            await data.save();

            res.redirect(data.originalUrl);
        } else {
                res.render("index");
            }

        }
});



module.exports = router;