import axios from "axios";
import { store } from "../store";
import Stage from "./Stage.js";
export default class Trip {
    constructor(trip = {}) {
        const required = {
            title: null,
            startDate: null,
            endDate: null,
            tripType: null,
        };

        const optional = {
            description: '',
            day: {},
            id: ''
        };

        for (const key in { ...required, ...optional }) {
            this[key] = trip[key] ?? required[key] ?? optional[key];
        }

        for (const key in required) {
            if (this[key] == null) {  // Controlla se è null o undefined
                throw new Error(`Il campo ${key} è obbligatorio e non può essere nullo o indefinito.`);
            }
        }
    }

    static async get() {
        return await axios.post('/api/g/trips', {}, {
            headers: {
                "Authorization": store.user.idToken
            }
        })
            .then(async (res) => {
                return await this.parse(res.data);
            })
            .catch((error) => {
                console.error(error)
                return false
            });
    }

    static async parse(trip) {
        for (const key in trip) {
            if (!trip[key].day) {
                trip[key].day = {}
            }
            const start = new Date(trip[key].startDate);
            const end = new Date(trip[key].endDate);
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                const newDay = d.toISOString().split('T')[0]
                if (!trip[key].day[newDay]) {
                    trip[key].day[newDay] = {};
                } else {
                    const stages = trip[key].day[newDay]
                    for (const stageKey in stages) {
                        if (stages[stageKey].images) {
                            trip[key].day[newDay][stageKey].images = await store.firebase.loadImg(stages[stageKey].images, `/${key}/${newDay}`)
                        }
                        trip[key].day[newDay][stageKey].id = stageKey
                        trip[key].day[newDay][stageKey] = new Stage(trip[key].day[newDay][stageKey])
                    }

                }
            }
            trip[key].id = key
            trip[key] = new Trip(trip[key])
            // console.log(trip[key].day);
        }
        return trip
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

    async save() {
        return await axios.post('/api/a/trips', { ...this, id: true }, {
            headers: {
                "Authorization": store.user.idToken
            }
        })
            .then(async (res) => {
                return await Trip.parse(res.data);
            })
            .catch((error) => {
                console.error(error)
                return false
            });
    }

    async delete() {
        for (const date in this.day) {
            for (const stageKey in this.day[date]) {
                for (const imgName in this.day[date][stageKey].images) {
                    await Trip.deleteImg(this.id, date, imgName);
                }
            }
        }

        return await axios.delete('/api/d/trips', { data: { id: this.id }, headers: { "Authorization": store.user.idToken } })
            .then((res) => {
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