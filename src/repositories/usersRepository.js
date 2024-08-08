export default class UsersRepository {
    constructor(userDao) {
        this.userDao = userDao;
    }

    createUser = async newUser => await this.userDao.create(newUser);
    getUsers = async () => await this.userDao.getAll();
    getUserBy = async filter => await this.userDao.getBy(filter);
    updateUser = async (uid, userToUpdate) => await this.userDao.update(uid, userToUpdate);
    deleteUser = async uid => await this.userDao.remove(uid);
}