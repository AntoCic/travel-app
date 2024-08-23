// import FIREBASE from "../personal_modules/firebase";

// export default class Public extends FIREBASE {
//     static mainPaths = "public"; // Definisci qui il mainPaths per firebase

//     constructor(item = {}) {
//         super()
//         const required = {
//             description_EN: "",
//             description_IT: "",
//             title_EN: "",
//             title_IT: "",
//             url_img: "",

//         };

//         const optional = {
//         };

//         // Costruisci l'oggetto usando il metodo build
//         FIREBASE.build.call(this, item, required, optional);
//     }

//     static async parse(res) {
//         for (const key in res) {
//             res[key] = new Public(res[key])
//             // await res[key].getFiles()
//         }
//         return res;
//     }
// }