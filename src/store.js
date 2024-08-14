import { reactive } from 'vue'
import axios from 'axios'
import { auth, provider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail } from './firebase';

export const store = reactive({

    start() {
        this.user.checkLogged()
        console.log('-START-');
        this.trip.getTypes();
    },

    onLogin() {
        console.log('-Is logeed-');
        store.firebase.loadImg();
        this.firebase.db_get();
    },

    trip: {
        types: null,

        async getTypes() {
            this.types = null
            store.loading.on();
            return await axios.get('/api/trip-type/tripTypes', {}, {
                headers: {
                    "Authorization": store.user.idToken
                }
            })
                .then((res) => {
                    store.loading.off();
                    if (res.data) {
                        this.types = res.data
                    }
                    return true
                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return false
                })
        }


    },

    user: {
        isLogged: null,
        idToken: null,
        email: null,
        uid: null,
        userName: null,
        checkLogged() {
            onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    this.isLogged = true
                    this.idToken = currentUser.accessToken
                    this.email = currentUser.email
                    this.uid = currentUser.uid

                    if (this.userName) {
                        await this.addUserName(this.userName)
                    } else {
                        this.userName = await this.getUserName()
                    }
                    store.onLogin();
                    store.loading.off();
                } else {
                    this.reset();
                }
            });
        },

        // Metodo per eseguire il login
        async login(email, password) {
            try {
                store.loading.on();
                await signInWithEmailAndPassword(auth, email, password);
                return true
            } catch (error) {
                this.reset();
                console.error('Login failed', error);
                return false
            }
        },
        async googleLogin() {
            try {
                store.loading.on();
                await signInWithPopup(auth, provider);
                return true
            } catch (error) {
                this.reset();
                console.error('Login failed', error);
                return false
            }
        },
        // Metodo per eseguire il register
        async register(userName, email, password) {
            try {
                store.loading.on();
                this.userName = userName
                await createUserWithEmailAndPassword(auth, email, password);
                return true
            } catch (error) {
                this.reset();
                console.error('Error registering:', error);
                alert('Registration failed. Please try again.');
                return false
            }
        },
        resetPassword(email) {
            if (email.trim() === '') {
                alert("Inserisci l'email per recuperare la password.");
                return;
            }
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert("Email per il reset della password inviata.");
                })
                .catch((error) => {
                    alert(error.message);
                    store.loading.off();
                    console.error("Errore di reset della password:", error);
                });
        },
        // Metodo per eseguire il logout
        async getUserName() {
            store.loading.on();
            return await axios.post('/api/g/userdata/userName', {}, {
                headers: {
                    "Authorization": this.idToken
                }
            })
                .then(async (res) => {
                    if (res.data && res.data.constructor !== Object) {
                        return res.data
                    } else {
                        const userName = prompt("Inserisci il Nome utenete").trim();
                        if (userName != null && userName != '') {
                            return await this.addUserName(userName)
                        } else {
                            alert("Nome non settato correttamente");
                            return null
                        }
                    }
                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return null
                })


        },
        // Metodo per eseguire il logout
        async addUserName(userName) {
            store.loading.on();
            return await axios.post('/api/a/userdata', { userName }, {
                headers: {
                    "Authorization": this.idToken
                }
            })
                .then((res) => {
                    if (res.data.userName) {
                        return res.data.userName
                    } else {
                        return null
                    }
                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return null
                })

        },
        // Metodo per eseguire il logout
        async logout() {
            try {
                await signOut(auth);
            } catch (error) {
                this.reset();
                console.error('Logout failed', error);
            }
        },
        // Metodo per eseguire il logout
        reset() {
            this.isLogged = false
            this.idToken = null
            this.email = null
            this.uid = null
            this.userName = null
            store.loading.off();
        },

    },

    firebase: {
        items: {},
        images: {},
        storageBucket: 'cic-travel-app.appspot.com',

        getImgUrl(path) {

            if (path) {
                // Rimuove il primo carattere se è '/'
                if (path[0] === '/') {
                    path = path.slice(1);
                }

                // Rimuove l'ultimo carattere se è '/'
                if (path[path.length - 1] === '/') {
                    path = path.slice(0, -1);
                }

                // Sostituisce tutti i '/' rimanenti con '%2F'
                path = path.replace(/\//g, '%2F');
            }

            return `https://firebasestorage.googleapis.com/v0/b/${this.storageBucket}/o/public%2F${path}?alt=media`
        },

        async db_get() {
            this.items = {}
            store.loading.on();
            return await axios.post('/api/g/items', {}, {
                headers: {
                    "Authorization": store.user.idToken
                }
            })
                .then((res) => {
                    store.loading.off();
                    if (res.data) {
                        this.items = res.data
                    }
                    return true
                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return false
                })
        },
        async db_add(item) {
            store.loading.on();
            return await axios.post('/api/a/items', { name: item, id: true }, {
                headers: {
                    "Authorization": store.user.idToken
                }
            })
                .then((res) => {
                    store.loading.off();
                    if (res.data) {
                        const [[key, value]] = Object.entries(res.data);
                        this.items[key] = value
                    }
                    return true
                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return false
                })
        },
        // 
        async db_update(id, newItemsName) {
            store.loading.on();
            if (newItemsName != null) {
                if (newItemsName === '') {
                    return await this.db_delete(id)
                } else {
                    return await axios.put('/api/u/items', { name: newItemsName, id }, {
                        headers: {
                            "Authorization": store.user.idToken
                        }
                    })
                        .then((res) => {
                            store.loading.off();
                            if (res.data) {
                                const [[key, value]] = Object.entries(res.data);
                                this.items[key] = value
                            }
                            return true
                        })
                        .catch((error) => {
                            console.error(error)
                            store.loading.off();
                            return false
                        })
                }
            } else {

            }
        },
        // 
        async db_delete(id) {
            store.loading.on();
            return await axios.delete('/api/d/items', { data: { id }, headers: { "Authorization": store.user.idToken } })
                .then((res) => {
                    store.loading.off();
                    if (res.data.deleted) {
                        delete this.items[res.data.deleted]
                        return true
                    } else {
                        return false
                    }

                })
                .catch((error) => {
                    console.error(error)
                    store.loading.off();
                    return false
                })
        },

        loadImg() {
            store.loading.on();
            axios.post('/api/getImages', {}, {
                headers: {
                    "Authorization": store.user.idToken
                }
            }).then((res) => {
                store.loading.off();
                if (res.data.urls) {
                    this.images = res.data.urls
                } else {
                    console.error('Failed to load images:', res.data.message);
                }
            }).catch((error) => {
                store.loading.off();
                console.error('Load error:', error);
            })
        },

        async uploadImg(selectedFile) {

            store.loading.on();
            if (!selectedFile) {
                store.loading.off();
                console.error('No file selected!');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = async () => {
                const base64Image = reader.result.split(',')[1];
                const fileName = selectedFile.name;

                axios.post('/api/uploadImage', {
                    base64Image,
                    fileName
                }, {
                    headers: {
                        "Authorization": store.user.idToken
                    }
                }).then((res) => {
                    store.loading.off();
                    if (res.data) {
                        const [[key, value]] = Object.entries(res.data);
                        store.firebase.images[key] = value
                    } else {
                        console.error('Upload failed:', response.data);
                    }
                }).catch((error) => {
                    store.loading.off();
                    console.error('Upload error:', error);
                });

            };

        },

        async deleteImg(fileName) {
            store.loading.on();
            axios.post('/api/deleteImage', { fileName }, {
                headers: {
                    Authorization: store.user.idToken,
                },
            }).then((res) => {
                store.loading.off();
                if (res.data.deleted) {
                    delete this.images[res.data.deleted]
                } else {
                    console.error('Delete failed:', res.data);
                }
            }).catch((error) => {
                store.loading.off();
                console.error('Delete error:', error);
            })
        },



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