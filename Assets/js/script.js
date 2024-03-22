const vuetify = Vuetify.createVuetify();
const firebaseConfig = {
    apiKey: "AIzaSyBX20gFnznMh4rs_CDZ2tXxQFuEqKLFMTw",
    authDomain: "web2566-fd568.firebaseapp.com",
    projectId: "web2566-fd568",
    storageBucket: "web2566-fd568.appspot.com",
    messagingSenderId: "8685304559",
    appId: "1:8685304559:web:68515452e2b932eef4791a",
    measurementId: "G-GZJF8WTT7W"
};
firebase.initializeApp(firebaseConfig);      
const db = firebase.firestore();

const app = Vue.createApp({
data() {
    return {
    title: "Web Application : สำหรับการเช็คชื่อนักศึกษา และ ถาม/ตอบ ในห้องเรียน",
    footer: " ",
    students: [],
    editstd: {},
    editmode: 0,
    teachers: [],
    user: null,
    ustudent: null,
    };
},


mounted() {
    firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
        this.user = user.toJSON();
        }else{
        this.user = null;
    }
    });
    db.collection("teachers") .get()
    .then((querySnapshot) => {
        var teacherslist = [];
        querySnapshot.forEach((doc) => {
            teacherslist.push({ email: doc.email, ...doc.data() });
        });
        this.teachers = teacherslist;
    });
    db.collection("students")
    .get()
    .then((querySnapshot) => {
        var stdlist = [];
        querySnapshot.forEach((doc) => {
        stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.students = stdlist;
    });
    
},

methods: {
    /* readData() {
        db.collection("students")
        .get()
        .then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
            stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.students = stdlist;
        });
    },*/

    /*//สำหรับอาจารย์
    readDatatc() {
        db.collection("teachers")
        .get()
        .then((querySnapshot) => {
            var teacherslist = [];
            querySnapshot.forEach((doc) => {
            teacherslist.push({ email: doc.email, ...doc.data() });
            });
            this.teachers = teacherslist;
        });
    },
    ///*/

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
        var stdlist = [];
        querySnapshot.forEach((doc) => {
            stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.students = stdlist;
        });
    },
    addData(){
        this.editmode = "เพิ่มนักเรียน";
        this.editstd = {};
    },
    edit(std){
        this.editstd = std;
        this.editmode = "edit";
    },
    savedata(){
            db.collection("students").doc(this.editstd.id).set(this.editstd);
            location.reload();
    },
    deleteData(std) {
        if (confirm("ต้องการลบข้อมูล")) {
        db.collection("students").doc(std.id).delete();
        }
    },
    google_login() {
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase.auth().signInWithPopup(provider);
    },
    google_logout(){
    if(confirm("Are you sure?")){
        firebase.auth().signOut();
        location.reload();
    }
    },
    getstudent(email){
    db.collection("students")
        .where("email","==",email)
        .limit(1)
        .get()
        .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
            this.ustudent = { id: doc.id, ...doc.data() };
        });
        }
    );
    },

},
});
app.use(vuetify).mount("#app");