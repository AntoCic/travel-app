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
            location: null,
            startTime: null,
            endTime: null,
            images: null,
            description: null,
            food: null,
            curiosities: null,
            rating: null,
        };
        Object.assign(this, defaults, stage);
        this.location = new Location(this.location);
    }
}