function User(data) {
    this.id = data.user_id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.profileImage = data.profile_image;
}

module.exports = User;