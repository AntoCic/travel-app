import axios from "axios";
import { store } from "../store";
export default class Trip {
    constructor(trip = {}) {
        const defaults = {
            title: null,
            description: null,
            startDate: null,
            endDate: null,
            tripType: null,
            day: {}
        };

        Object.assign(this, defaults, trip);

        !this.title ? console.error('non hai settato title') : false;
        !this.tripType ? console.error('non hai settato tripType') : false;
        if (this.startDate && this.endDate) {

            const start = new Date(this.startDate);
            const end = new Date(this.endDate);
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                this.day[d.toISOString().split('T')[0]] = { date: d.toDateString() };
            }

        } else {
            console.error('non hai settato startDate and endDate')
        }
    }

    static async get() {
        return await axios.post('/api/g/trips', {}, {
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

    async save() {
        return await axios.post('/api/a/trips', { ...this, id: true }, {
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

    async delete() {
        console.log('del');

    }
}