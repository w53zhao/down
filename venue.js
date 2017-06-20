function Venue(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image_url;
    this.rating = data.rating;
    this.address = data.location.display_address;
}

module.exports = Venue;