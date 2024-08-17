import axios from "axios";
import { store } from "../store";
class Location {
    constructor(location = {}) {
        const defaults = {
            address: "",
            lat: "",
            lon: "",
        };
        Object.assign(this, defaults, location);
    }
}

export default class Stage {
    constructor(stage = {}) {

        const required = {
            trip_id: null,
            date: null,
            name: null,
            location: null,
            startTime: null,
            endTime: null,
        };

        const optional = {
            images: null,
            description: null,
            food: null,
            curiosities: null,
            rating: null,
        };

        for (const key in { ...required, ...optional }) {
            this[key] = stage[key] ?? required[key] ?? optional[key];
        }

        this.location = new Location(this.location);

        for (const key in required) {
            if (this[key] == null) {
                throw new Error(`Il campo ${key} è obbligatorio e non può essere nullo o indefinito.`);
            }
        }
    }

    async save() {
        return await axios.post(`/api/a/trips/${this.trip_id}/day/${this.date}`, { ...this, id: true }, {
            headers: {
                "Authorization": store.user.idToken
            }
        })
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                console.error(error)
                return false
            });
    }

}