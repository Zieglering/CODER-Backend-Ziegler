function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class UserSecureDto {
    constructor(user) {
        this.fullName = `${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(user.last_name)}`
        this.email = user.email
        this.role = user.role
    }
}

export default UserSecureDto