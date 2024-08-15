class Location {
    constructor(location = {}) {
        const defaults = {
            address: null,
            lat: null,
            lon: null,
        };
        Object.assign(this, defaults, location);
    }
}

export default class Stage {
    constructor(stage = {}) {
        const defaults = {
            name: null,
            description: null,
            cover: null,
            images: null,
            food: null,
            curiosities: null,
            rating: null,
            location: null,
        };
        Object.assign(this, defaults, stage);
        this.location = new Location(this.location);
    }
}