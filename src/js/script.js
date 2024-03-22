// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBX20gFnznMh4rs_CDZ2tXxQFuEqKLFMTw",
    authDomain: "web2566-fd568.firebaseapp.com",
    projectId: "web2566-fd568",
    storageBucket: "web2566-fd568.appspot.com",
    messagingSenderId: "8685304559",
    appId: "1:8685304559:web:68515452e2b932eef4791a",
    measurementId: "G-GZJF8WTT7W"
};
  
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  const vuetify = Vuetify.createVuetify();
  
  const vueApp = Vue.createApp({
    data() {
      return {
        title: "Web Application : สำหรับการเช็คชื่อนักศึกษา และ ถาม/ตอบ ในห้องเรียน",
        footer: " ",
        students: [],
        editstd: {},
        quiz: [],
        editquiz: {},
        checkin: [],
        editcheckin: {},
        mode: 0,
        teacher: [],
        user: null,
        ustudent: null,
        search: ''
      };
    },
    mounted() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user.toJSON();
        } else {
          this.user = null;
        }
      });
  
      db.collection("teacher").get().then((querySnapshot) => {
        const teacherlist = [];
        querySnapshot.forEach((doc) => {
          teacherlist.push({ email: doc.email, ...doc.data() });
        });
        this.teacher = teacherlist;
      });
  
      db.collection("student").get().then((querySnapshot) => {
        const stdlist = [];
        querySnapshot.forEach((doc) => {
          stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.students = stdlist;
      });
  
      db.collection("quiz").get().then((querySnapshot) => {
        var quizlist = [];
        querySnapshot.forEach((doc) => {
          quizlist.push({ id: doc.id, ...doc.data() });
        });
        this.quiz = quizlist;
      });
  
      db.collection("checkin").get().then((querySnapshot) => {
        var checkinlist = [];
        querySnapshot.forEach((doc) => {
          checkinlist.push({ id: doc.id, ...doc.data() });
        });
        this.checkin = checkinlist;
      });
    },
    methods: {
      google_login() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
      },
      google_logout() {
        if (confirm("Are you sure?")) {
          firebase.auth().signOut();
          location.reload();
        }
      },
      getstudent(email) {
        db.collection("students")
          .where("email", "==", email)
          .limit(1)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.ustudent = { id: doc.id, ...doc.data() };
            });
          });
      },
      autoRead() {
        db.collection("student").onSnapshot((querySnapshot) => {
          var stdlist = [];
          querySnapshot.forEach((doc) => {
            stdlist.push({ id: doc.id, ...doc.data() });
          });
          this.students = stdlist;
        });
      },
      addData() {
        this.mode = "เพิ่มนักเรียน";
        this.editstd = {};
      },
      addDataqiz() {
        this.mode = "เพิ่มคำถาม";
        this.editquiz = {};
      },
      editqiz(std) {
        this.editstd = std;
        this.mode = "edit";
      },
      edit(std) {
        this.editstd = std;
        this.mode = "เพิ่มนักเรียน";
      },
      editqz(quiz) {
        this.editquiz = quiz;
        this.mode = "เพิ่มคำถาม";
      },
      sendob() {
        this.mode = "แบบฟอร์ม";
        this.editcheckin = {};
      },
      savedata() {
        db.collection("students")
          .doc(this.editstd.id)
          .set(this.editstd)
          .then(() => {
            alert('Data saved successfully!');
            location.reload();
          })
          .catch((error) => {
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
          });
      },
      saveqiz() {
        db.collection("quiz")
          .doc(this.editquiz.id)
          .set(this.editquiz)
          .then(() => {
            alert('Data saved successfully!');
            location.reload();
          })
          .catch((error) => {
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
          });
      },
      generateId(index) {
        return index + 1;
      },
      saveqiz_back() {
        db.collection("checkin")
          .doc(this.editcheckin.id)
          .set(this.editcheckin)
          .then(() => {
            alert('Data saved successfully!');
            location.reload();
          })
          .catch((error) => {
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
          });
      },
      deleteData(std) {
        if (confirm("ต้องการลบข้อมูล")) {
          db.collection("student")
            .doc(std.id)
            .delete()
            .then(() => {
              alert('Data Deleted successfully!');
              location.reload();
            })
            .catch((error) => {
              console.error('Error delete data:', error);
              alert('Error delete data. Please try again.');
            });
        }
      },
      deleteqiz(qiz) {
        if (confirm("ต้องการลบข้อมูล")) {
          db.collection("quiz")
            .doc(qiz.id)
            .delete()
            .then(() => {
              alert('Data Deleted successfully!');
              location.reload();
            })
            .catch((error) => {
              console.error('Error delete data:', error);
              alert('Error delete data. Please try again.');
            });
        }
      },
    },
    computed: {
      filteredList() {
        if (this.search.trim() === '') {
          return this.quiz;
        } else {
          const searchTerm = this.search.toLowerCase().trim();
          return this.quiz.filter(post => {
            return post.title.toLowerCase().includes(searchTerm);
          });
        }
      }
    },
  });
  
  vueApp.use(vuetify).mount("#app");
  