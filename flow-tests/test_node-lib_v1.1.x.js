/* @flow */
import { ModelSequelize } from '@app-masters/node-lib';
import type { QueryS } from '@app-masters/node-lib';

type userSchema = {
  name: string | QueryS,
  age: number | QueryS,
  data: {
    active: boolean
  } | QueryS,
}
type options = {
  created_at: Date,

}

class User extends ModelSequelize<userSchema> {
  getActives () {
    return User.find({ data: { active: true } }, 'role', 'name');
  }
}
class UserInstance {
  activate (): void {
    //$FlowFixMe, 'this' will only exits after setup runs, but this is correct
    this.data.active = true;
  }
}
User.setup({}, 'user', { name: String, age: Number, data: { active: Boolean } }, UserInstance);
User.create({
  name: 'joao',
  tes: 'ta'
});

User.find({ age: { $gte: 15 } }).then(r => {
  if (r) {
    var a = r[0];
    if(a.data)
    {
      console.log(a.data.active);
    }
  }
})
