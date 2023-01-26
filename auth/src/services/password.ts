import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    //static we can access without create an instance of a class
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        //we wrapped the buf inside as Buffer so TS knows the type of buf
        const buf = ( await scryptAsync(password, salt, 64) ) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        //the password is stored along with the salt in the databse. They are separasted by .
        const[hashedPassword, salt] = storedPassword.split('.');
        //we are using the same salt to hash a password. The salt is stored as part of password
        const buf = ( await scryptAsync(suppliedPassword, salt, 64) ) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}