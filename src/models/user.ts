import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import UnauthorizedError from '../errors/UnauthorizedError';

interface IUser {
  email: string,
  password: string
  name?: string,
  about?: string,
  avatar?: string,
}
interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials:
    (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: validator.isURL,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new UnauthorizedError());
      return bcrypt.compare(password, user.password)
        .then((matched) => (matched ? user : Promise.reject(new UnauthorizedError())));
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
