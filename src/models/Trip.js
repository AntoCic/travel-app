import axios from "axios";
import { store } from "../store";
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
                for (const key in res.data) {

                    if (!res.data[key].day) {
                        res.data[key].day = {}
                    }
                    const start = new Date(res.data[key].startDate);
                    const end = new Date(res.data[key].endDate);
                    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                        const newDay = d.toISOString().split('T')[0]
                        if (!res.data[key].day[newDay]) {
                            res.data[key].day[newDay] = {};
                        } else {
                            const stages = res.data[key].day[newDay]
                            for (const stageKey in stages) {
                                if (stages[stageKey].images) {
                                    res.data[key].day[newDay][stageKey].images = await store.firebase.loadImg(stages[stageKey].images, `/${key}/${newDay}`)
                                }
                            }
                            
                        }
                    }
                    console.log(res.data[key].day);
                }

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