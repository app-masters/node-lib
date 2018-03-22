/* global test, expect, jest, jasmine, */
const ModelSequelize = require('../lib/modelSequelize');
const UserSchema = require('./src/userSequelizeSchema');
const RoleSchema = require('./src/roleSequelizeSchema');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

class Role extends ModelSequelize {}

class RoleInstance {
    static getTitle () {
        return this.title;
    };
}

class User extends ModelSequelize {
    static getActives () {
        return this.find({'data.active': true}, 'role', 'name');
    }
}

class UserInstance {
    static activate () {
        this.data.active = true;
    };

    static getName () {
        return this.name;
    };
}

test('[Sequelize] Model setup', () => {
    Role.setup('role', RoleSchema, RoleInstance);
    User.setup('user', UserSchema, UserInstance, [Role]);
    expect(true).toBe(true);
});

let user = null;
let role = null;

test('[Sequelize] User create', async () => {
    role = await Role.create({title: 'user'});
    const userObj = {
        name: ['José', 'João', 'Maria', 'Carolina', 'Ana', 'Karen', 'Paulo', 'Breno'][Math.floor(Math.random() * 6)],
        local: {
            email: 'usuario@email.com',
            password: (Math.random() * 100000).toFixed(0)
        },
        data: {
            age: Math.floor(Math.random() * 7) + 20,
            height: Number((Math.floor(Math.random() * 35) / 100).toFixed(2)) + 1.55,
            active: false,
            gender: ['male', 'female'][Math.floor(Math.random() * 2)]
        },
        roleId: role.id

    };
    user = await User.create(userObj);
    expect(typeof user).toBe('object');
});

test('[Sequelize] User findByID', async () => {
    user = await User.findById(user.id);
    expect(typeof user).toBe('object');
});

test('[Sequelize] User findOne', async () => {
    user = await User.findOne({id: user.id});
    expect(typeof user).toBe('object');
});

test('[Sequelize] User findByID populated', async () => {
    user = await User.findById(user.id, 'role');
    expect(user.role.getTitle()).toBe('user');
});

test('[Sequelize] User findOne populated', async () => {
    user = await User.findOne({id: user.id}, 'role');
    expect(user.role.getTitle()).toBe('user');
});

test('[Sequelize] User class method / find', async () => {
    const actives = await User.getActives();
    expect(typeof actives).toBe('object');
});

test('[Sequelize] User instance method', async () => {
    expect(user.data.active).toBe(false);
    user.activate();
    expect(user.data.active).toBe(true);
    expect(user.getName()).toBe(user.name);
});

test('[Sequelize] User update', async () => {
    let newData = user.data;
    newData.active = true;
    const updated = await User.update({id: user.id}, {data: newData});
    expect(updated).toBe(true);
});

// test('[Sequelize] User delete', async () => {
//     const deleted = await User.delete({id: user.id});
//     expect(!!deleted).toBe(true);
// });