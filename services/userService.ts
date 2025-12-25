
export default class UserService {
    users: {}[];
    constructor() {
        this.users = [
            { id: 1, name: "Jack", age: 67 },
            { id: 2, name: "Jude", age: 55},
            { id: 3, name: "Julia", age: 45}
        ]
    }

    getAllUsers() {
        return this.users;
    }
}
