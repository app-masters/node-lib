/* @flow */
import { ModelSequelize } from '@app-masters/node-lib';
import type { QueryS } from '@app-masters/node-lib';

type userSchema = {
	name: string | QueryS,
	age: number | QueryS,
	data: {
		active: boolean | QueryS
	},
}
type options = {
	created_at: string,
}

class User extends ModelSequelize<userSchema, options> {
	getActives () {
		return User.find({ 'data.active': true }, 'role', 'name');
	}
}
class UserInstance {
	activate (): void {
		//$FlowFixMe, 'this' will only exits after setup runs, but this is correct
		this.data.active = true;
	}
}

User.setup({}, 'user', { name: String, age: Number, data: { active: Boolean } }, UserInstance);

//$FlowFixMe, Age must be a number
User.create({
	name: 'Carl',
	age: '12'
});

User.find({ age: { $gte: 15 } }).then(r => {
	// $FlowFixMe Error cause you didn't check for when R is null
	var a = r[0];
	console.log(a.data.active);
});

User.find({name: 'claudio'}).then(r => {
	if(r) {
		console.log(r[0].created_at);
	}
})
