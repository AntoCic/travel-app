// Script per la gestione dell'utente e l'interazione con Firebase.
// Tramite vari metodi, permette di eseguire le classiche funzioni 
// di autenticazione e registrazione (anche tramite Google Provider),
//  reset della password e logout finale.

// Da modificare nel caso sia necessario gestire altre informazioni utente
//  tramite i metodi: getUserData e addUserData.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { reactive } from 'vue'
import axios from 'axios'

// Segui il README nella sezione START WITH FIREBASE prima di continuare
// Sistema la tua public apiKey e authDomain qui sotto
const firebaseConfig = {
    apiKey: "AIzaSyCOjgmGVlPgtqsZnoVP5GlmzGotZQ-i2yY",
    authDomain: "cic-travel-app.firebaseapp.com",
};

if (firebaseConfig.apiKey === "") {
    console.log("Non hai settato il firebaseConfig in src/firebase.js");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const user = reactive({
    accessToken: null,
    uid: null,
    email: null,
    userName: null,

    checkLogged() {
        // Metodo che si avvia ad ogni login
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                this.accessToken = currentUser.accessToken
                this.uid = currentUser.uid
                this.email = currentUser.email

                if (this.userName) {
                    await this.addUserData(this.userName)
                } else {
                    this.userName = await this.getUserData()
                }
            } else {
                this.reset();
            }
        });
    },

    // Metodo per eseguire il login tramite email e password
    async login(email, password) {
        try {
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
            await signInWithPopup(auth, provider);
            return true
        } catch (error) {
            this.reset();
            console.error('Login failed', error);
            return false
        }
    },
    // Metodo per eseguire il register tramite email e password
    async register(userName, email, password) {
        try {
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
    // Metodo per eseguire il ripristino della password tramite email
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
                console.error("Errore di reset della password:", error);
            });
    },
    // Metodo per ottenere i dati dell'utente 
    // in questo caso userName
    async getUserData() {
        return await axios.post('/api/g/userdata/userName', {}, {
            headers: {
                "Authorization": this.accessToken
            }
        })
            .then(async (res) => {
                if (res.data && res.data.constructor !== Object) {
                    return res.data
                } else {
                    const userName = prompt("Inserisci il Nome utenete").trim();
                    if (userName != null && userName != '') {
                        return await this.addUserData(userName)
                    } else {
                        alert("Nome non settato correttamente");
                        return null
                    }
                }
            })
            .catch((error) => {
                console.error(error)
                return null
            })


    },
    // Metodo per aggiungere i dati dell'utente 
    // in questo caso userName
    async addUserData(userName) {

        const id = 'userName'
        const data = userName

        return await axios.post('/api/a/userdata', { id, data }, {
            headers: {
                "Authorization": this.accessToken
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
    // Metodo per reset dei dati dell'utente
    reset() {
        this.accessToken = false
        this.uid = null
        this.email = null
        this.userName = null
    },


})