// Store Archivio per gestire le informazioni principali.

import { reactive } from 'vue'
import ttServices from '@tomtom-international/web-sdk-services';
import axios from 'axios'
import Trip from './models/Trip.js';
import Stage from './models/Stage.js';
export const store = reactive({
    userJWT: null,

    async start() {
        this.loading.on();
        this.tripTypes.get();
    },

    async onLogin() {
        await this.trip.get()
        await this.stage.get()
        await this.location.getApikey()
        this.loading.on("Altri 3s per vedere bene il bellissimo il loader ;)");
        setTimeout(() => {
            this.loading.off();
        }, 3000);
    },

    onLogout() {
        console.log('- LOGOUT -');
        this.loading.off();
    },

    tripTypes: {
        all: null,
        async get() {
            return await axios.get('/api/g-public/tripTypes').then((res) => {
                if (res.data) {
                    this.all = res.data
                }
                return true
            }).catch((error) => {
                console.error(error)
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
        all: null,

        async get() {
            this.all = await Trip.get();
            return
        },

        async add(newTrip) {
            const added = await Trip.add(newTrip, true);
            if (added) {
                this.all = { ...this.all, ...added }
            } else {
                console.error('Errore adding item');
            }
        },

    },

    stage: {
        all: null,

        async get() {
            this.all = await Stage.get();
            return
        },

        async add(newStage) {
            const added = await Stage.add(newStage, true);
            if (added) {
                this.all = { ...this.all, ...added }
                return added
            } else {
                console.error('Errore adding item');
                return false
            }
        },
        async delete(stageId) {
            store.loading.on();
            const tripId = this.all[stageId].trip_id;
            const deleted = await this.all[stageId].delete();
            if (deleted) {
                delete store.trip.all[tripId].day[this.all[stageId].date][deleted]
                await store.trip.all[tripId].update()
                delete this.all[deleted]
                store.loading.off();
            } else {
                console.error('Errore delete item');
                store.loading.off();
            }
        }
    },

    location: {
        apikey: '',
        countrySet: 'IT',
        setCountry(countrySet) {
            this.countrySet = countrySet
        },
        async getApikey() {
            this.apikey = await axios.post('/api/tomtomapikey', {}, {
                headers: {
                    "Authorization": store.userJWT
                }
            }).then(async (res) => {
                return res.data
            }).catch((error) => {
                console.error(error);
                return '';
            });
        },
        async getSuggestion(address, countrySet = this.countrySet) {
            if (address.trim() === '') {
                return [];
            }
            return await ttServices.services.fuzzySearch({
                key: this.apikey,
                query: address,
                language: 'it-IT',
                countrySet,
                limit: 6
            }).then((res) => {
                const suggestion = res.results.map(result => ({
                    id: result.id,
                    address: result.address.freeformAddress
                }));
                return suggestion
            }).catch((error) => {
                console.error('Autocomplete error:', error);
                return [];
            });
        },

        async getLocation(address, countrySet = this.countrySet) {
            if (address.trim() === '') return false;
            return await ttServices.services.geocode({
                key: this.apikey,
                query: address,
                countrySet,
            }).then((res) => {
                if (res.results && res.results.length > 0) {
                    const location = {
                        address: res.results[0].address.freeformAddress,
                        lat: res.results[0].position.lat,
                        lng: res.results[0].position.lng,
                    }
                    return location;
                } else {
                    console.error('Indirizzo non trovato. Riprova.');
                    return false;
                }
            }).catch((error) => {
                console.error('Errore nella geocodifica:', error);
                return false;
            });
        },

    },

    // this.store.loading.on();
    // this.store.loading.off();
    loading: {
        state: false,
        msg: "",

        loadingMessages: [
            "Stiamo controllando se il sole splende nella tua destinazione...",
            "Prepariamo le valigie virtuali... quasi pronti!",
            "Stiamo mappando il percorso perfetto... non perderti!", -
            "Ricerca di spiagge nascoste e avventure indimenticabili...",
            "Caricamento della modalità vacanza... quasi lì!",
            "Stiamo preparando il kit di sopravvivenza del viaggiatore... tieniti pronto!",
            "Cercando destinazioni da sogno... solo un attimo!",
            "Stiamo calcolando il tempo perfetto per il relax...",
            "Prepariamo la mappa delle avventure... prendi il tuo zaino!",
            "Scoprendo le gemme nascoste per te... resta sintonizzato!",
            "Imballiamo esperienze uniche... la tua avventura inizia presto!",
            "Stiamo allineando le stelle per il tuo viaggio perfetto...",
            "Prepariamo il tuo itinerario da sogno... manca poco!",
            "Prenota con anticipo per ottenere le migliori offerte sui voli.",
            "Fai una lista di controllo per la valigia, così non dimentichi nulla di importante.",
            "Porta sempre una copia dei tuoi documenti di viaggio, meglio essere prudenti!",
            "Assicurati di avere adattatori di corrente per i paesi che visiterai.",
            "Viaggia leggero: più spazio in valigia significa più spazio per i souvenir!",
            "Prenota alloggi con cancellazione gratuita per maggiore flessibilità.",
            "Non dimenticare il caricabatterie del telefono e una power bank per le emergenze.",
            "Fai sempre una ricerca sulle usanze locali prima di partire, per viaggiare con rispetto.",
            "Tieniti idratato durante il volo, specialmente sui viaggi a lungo raggio.",
            "Metti in valigia un kit di pronto soccorso, non si sa mai!",
            "Prepara uno zaino con gli oggetti essenziali per i tuoi spostamenti giornalieri.",
            "Verifica le politiche sui bagagli della tua compagnia aerea per evitare sorprese.",
            "Porta abiti versatili che puoi combinare facilmente tra loro.",
            "Non dimenticare il costume da bagno, anche se non hai previsto di nuotare!",
            "Porta con te una borsa ripiegabile: utile per lo shopping o per gli imprevisti."
        ],

        on(msg = null) {
            if (msg === null) {
                this.msg = this.loadingMessages[Math.floor(Math.random() * this.loadingMessages.length)]
            } else {
                this.msg = msg
            }

            this.state = true
        },
        off() { this.state = false },
    },

})