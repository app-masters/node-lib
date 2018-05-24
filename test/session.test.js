const {bootstrapAPI, envs, finishTests, app} = require("./helper/apiBootstrap");
const session = require("../lib/sequelize/session");
const axios = require('axios');

// WIP - Test to validate session, late save (disableTouch) and things like that

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

bootstrapAPI();


describe('Session', () => {

    let model;
    it('Setup session', async (done) => {
        let success = session.setup(app, config);

        // Clear session table
        const SequelizeInstance = require('../lib/sequelize/sequelizeInstance');
        let sequelize = SequelizeInstance.getInstance();
        model = sequelize.model('session');

        await model.destroy({
            where: {},
            truncate: true
        });
        let recs = await model.findAll();
        expect(recs.length).toBe(0);

        app.use('/session', async (req, res, next) => {
            try {
                if (!req.session)
                    req.session = {};
                req.session.test = req.query.value;
                console.log("save",req.query.save);
                if (req.query.save===true || req.query.save === "true") {
                    console.log("saving...");
                    await req.session.save();
                    console.log("saved");
                }
                res.send(req.session.test);
            } catch (e) {
                console.error(e.message);
                res.status(500).json(e);
                next(e);
            }
        });

        app.listen(8001, () => {
            console.log('TEST API running');
            done(expect(success).toBe(true));
        });

    });


    it('Create a session, save change', async () => {
        // Change session
        const value = 1;
        const res = await axios.get('http://localhost:8001/session?value=' + value + '&save=true');
        expect(res.status).toBe(200);
        expect(res.data).toBe(value);

        let recs = await model.findAll();
        expect(recs.length).toBe(0);

    });
    //
    // it('Change to disable touch', async (done) => {
    //     done(expect(true).toBe(false));
    // });
    //
    it('Store on session without save', async (done) => {
        // Change session
        const value = 2;
        const res = await axios.get('http://localhost:8001/session?value='+value+'&save=false');
        expect(res.status).toBe(200);
        expect(res.data).toBe(value); // previous value

        let recs = await model.findAll();
        console.log("recs", recs);
        console.log("recs.length", recs.length);
        expect(recs.length).toBe(1);

        let record = JSON.parse(recs[1].data);
        console.log("record", record);
        expect(typeof record).toBe("object");
        expect(record.text).toBe(1);

        // console.log("recs",recs);

    });
    //
    // it('Store on session using save', async (done) => {
    //     done(expect(true).toBe(false));
    // });
});


// finishTests();