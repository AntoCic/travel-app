import FIREBASE from "../personal_modules/firebase";

import Stage from "./Stage.js";

export default class Trip extends FIREBASE {
    static mainPaths = "trips"; // Definisci qui il mainPaths per firebase 

    constructor(trip = {}) {
        super()
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

        // Costruisci l'oggetto usando il metodo build
        FIREBASE.build.call(this, trip, required, optional);
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
                    console.log(stages);
                    // for (const stageKey in stages) {
                    //     if (stages[stageKey].images) {
                    //         trip[key].day[newDay][stageKey].images = await store.firebase.loadImg(stages[stageKey].images, `/${key}/${newDay}`)
                    //     }
                    //     trip[key].day[newDay][stageKey].id = stageKey
                    //     trip[key].day[newDay][stageKey] = new Stage(trip[key].day[newDay][stageKey])
                    // }

                }
            }

            trip[key] = new Trip(trip[key])
        }
        return trip
    }
}