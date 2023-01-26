import mongoose from 'mongoose';
import { Password } from '../services/password';

//An interface that describes the properties required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

//An interface that describes the properties the user model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties the usr document has
//take all the  properties that a normal Document has and add these on top
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email : {
        type: String, //releated to mongoose and not ts
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    //need to massage the retunrned User so it is standard. Also, we need to remove the password key from
    //the User model. toJSON will be called automatically by json stringfy to massage the data.
    //the delete ret.* deletes the entry from the response.
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id; // renaming the __id to id standard with other DB type
            delete ret._id; //deleting the __id property
            delete ret.password; //deleting the password property
            delete ret.__v; //deleting the __v property
        },
    }
});
// mongoode doesn;t have support for await async. we use done() to let the process we are done
// we are using the function keyword. if we use the arrow function, the value of this will be the context of the file
userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        //this.get password get the user password out of the user document
        const hashed = await Password.toHash(this.get('password'));
        //replace the password with the hashed password
        this.set('password', hashed);
        //remember to call done because we have done all the asyn work
        done();
    }
});
//created so the typescript can validate our data
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

// The second argument in the command below defines the return type
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };