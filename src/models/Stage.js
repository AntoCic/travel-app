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
            id: '',
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
            .then(async (res) => {
                const [stageKey] = Object.entries(res.data)[0];
                res.data[stageKey].images = await store.firebase.loadImg(res.data[stageKey].images, `/${res.data[stageKey].trip_id}/${res.data[stageKey].date}`)
                res.data[stageKey].id = stageKey
                res.data[stageKey] = new Stage(res.data[stageKey])
                return res.data
            })
            .catch((error) => {
                console.error(error)
                return false
            });
    }

    static async deleteImg(id, date, imgName) {

        return await axios.post(`/api/d-img/${id}/${date}`, { imgName }, {
            headers: {
                Authorization: store.user.idToken,
            },
        }).then(async (res) => {
            if (res.data.deleted) {
                return await res.data
            } else {
                console.error('Delete failed:', res.data);
            }
        }).catch((error) => {
            store.loading.off();
            console.error('Delete error:', error);
        })
    }

    async delete() {
        for (const imgName in this.images) {
            console.log(imgName);
            await Stage.deleteImg(this.trip_id, this.date, imgName);
        }

        return await axios.delete(`/api/d/trips/${this.trip_id}/day/${this.date}`, { data: { id: this.id }, headers: { "Authorization": store.user.idToken } })
            .then((res) => {
                console.log(res.data);
                if (res.data.deleted) {
                    return res.data.deleted
                } else {
                    return false
                }

            })
            .catch((error) => {
                console.error(error)
                store.loading.off();
                return false
            })

    }

}