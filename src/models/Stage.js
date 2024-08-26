import FIREBASE from "../personal_modules/firebase";

export default class Stage extends FIREBASE {
    static mainPaths = "stages"; // Definisci qui il mainPaths per firebase 

    constructor(stage = {}) {
        super()
        const required = {
            trip_id: null,
            date: null,
            name: null,
            location: null,
            startTime: null,
            endTime: null,
        };

        const optional = {
            description: null,
            food: null,
            curiosities: null,
            rating: null,
        };

        // Costruisci l'oggetto usando il metodo build
        FIREBASE.build.call(this, stage, required, optional);
    }

    static async parse(res) {
        for (const key in res) {
            res[key] = new Stage(res[key])
            await res[key].getFiles()
        }
        return res;
    }
}