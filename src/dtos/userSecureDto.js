function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class UserSecureDto {
    constructor(user) {
        this.first_name = capitalizeFirstLetter(user.first_name)
        this.last_name = capitalizeFirstLetter(user.last_name)
        this.fullName = `${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(user.last_name)}`
        this.age = user.age
        this.email = user.email
        this.role = user.role
    }
}

export default UserSecureDto