import { reactive } from 'vue'
import axios from 'axios'
// import Stage from './models/Stage.js'
import Trip from './models/Trip.js';
export const store = reactive({
    userJWT: null,

    async start() {
        console.log('-START-');
        this.tripTypes.get();
        this.tripTypes.getImgUrl();
        return
    },

    async onLogin() {
        this.loading.on("Altri 2s per vedere il loader");

        // this.item.get()
        this.trip.get()

        setTimeout(() => {
            this.loading.off();
        }, 2000);

        // console.log('-Is logeed-');
        // this.firebase.db_get();
        // this.trip.get();
    },

    onLogout() {
        console.log('- LOGOUT -');
    },

    tripTypes: {
        all: null,
        async get() {
            store.loading.on();
            return await axios.get('/api/g-public/tripTypes', {}, {
                headers: {
                    "Authorization": this.userJWT
                }
            })
                .then((res) => {
                    store.loading.off();
                    if (res.data) {
                        this.all = res.data
                    }
                    return true
                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return false
                })

        },
        getImgUrl(tripTypeId) {
            if (tripTypeId) {
                return Object.values(this.all[tripTypeId].files)[0].url;
            }
        },
    },

    trip: {
        all: {},

        async get() {
            this.all = await Trip.get();
            console.log(this.all);
        },

        async add(newTrip) {
            const added = await Trip.add(newTrip, true);
            if (added) {
                this.all = { ...this.all, ...added }
            } else {
                console.error('Errore adding item');
            }
        },

        // async get() {
        //     this.all = await Trip.get()
        //     console.log(this.all);
        //     return this.all
        // },

        // async add(trip) {
        //     let newTrip = new Trip(trip);
        //     newTrip = await newTrip.save()
        //     const key = Object.keys(newTrip)[0];
        //     this.all[key] = newTrip[key];
        //     return newTrip
        // },

        // async delete(id) {
        //     let isSure = confirm('Sicuro di voler eliminare il viaggio?')
        //     if (isSure) {

        //     } else {
        //         return false
        //     }
        // },

        // async getTypes() {
        //     this.types = null
        //     store.loading.on();
        //     return await axios.get('/api/trip-type/tripTypes', {}, {
        //         headers: {
        //             "Authorization": store.user.idToken
        //         }
        //     })
        //         .then((res) => {
        //             store.loading.off();
        //             if (res.data) {
        //                 this.types = res.data
        //             }
        //             return true
        //         })
        //         .catch((error) => {
        //             console.error(error)
        //             store.loading.off();
        //             return false
        //         })
        // },


        // async addStage(stage) {
        //     let newStage = new Stage(stage);
        //     newStage = await newStage.save()
        //     const key = Object.keys(newStage)[0];
        //     this.all[stage.trip_id].day[stage.date][key] = newStage[key]
        //     console.log(this.all);
        //     return newStage
        // },
    },



    loading: {
        state: false,
        msg: "",
        on(msg = "Loading...") {
            this.msg = msg
            this.state = true
        },
        off() { this.state = false },
    },

})