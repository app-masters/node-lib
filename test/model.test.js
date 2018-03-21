/* global test, expect, jest, jasmine, */
const ModelSequelize = require('../lib/modelSequelize');
const sequelize = require('./src/bootstrap');

class User extends ModelSequelize {
    static getActives () {
        return this.find({active: true, User});
    }
}

class UserInstance {
    static activate () {
        this.active = true;
    };

    static getName () {
        return this.name;
    };
}

test('Sequelize configuration', () => {
    expect(typeof sequelize).toBe('object');
});

const UserModel = require('./src/UserSequelizeSchema');

let user;
test('User find', async () => {
    User.setup(UserModel, UserInstance);
    user = await User.findById(1);
    expect(typeof user).toBe('object');
});

test('User class method', async () => {
    const actives = await User.getActives();
    expect(typeof actives).toBe('object');
});

test('User instance method', async () => {
    expect(user.active).toBe(false);
    user.activate();
    expect(user.active).toBe(true);
});

test('User create', async () => {
    const userObj = {
        name: ['José', 'João', 'Maria', 'Carolina', 'Ana', 'Karen', 'Paulo', 'Breno'][Math.floor(Math.random() * 6)],
        age: Math.floor(Math.random() * 7) + 20,
        height: Number((Math.floor(Math.random() * 35)/100).toFixed(2)) + 1.55,
        active: false,
        gender: ['male', 'female'][Math.floor(Math.random() * 2)]
    };
    user = await User.create(userObj);
    expect(typeof user).toBe('object');
});

test('User findOne', async () => {
    user = await User.findOne({id: user.id});
    expect(typeof user).toBe('object');
});

test('User update', async () => {
    console.log(user);
    user = await User.update({id: user.id}, {active: true});
    console.log(user[0].active);
    expect(typeof user).toBe('object');
});