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
		checkin:[],
		editcheckin:{},
        editmode: 0,
        teachers: [],
        user: null,
        ustudent: null,
		
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
      db.collection("teachers").get().then((querySnapshot) => {
        const teacherslist = [];
        querySnapshot.forEach((doc) => {
          teacherslist.push({ email: doc.email, ...doc.data() });
        });
        this.teachers = teacherslist;
      });
      db.collection("student").get().then((querySnapshot) => {
        const stdlist = [];
        querySnapshot.forEach((doc) => {
          stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.student = stdlist;
      });
	  db.collection("quiz")
	    .get()
	    .then((querySnapshot) => {
		    var quizlist = [];
		    querySnapshot.forEach((doc) => {
			  quizlist.push({ id: doc.id, ...doc.data() });
		    });
		    this.quiz = quizlist;
	  });
	  db.collection("checkin") .get()
	    .then((querySnapshot) => {
		    var checkinlist = [];
		    querySnapshot.forEach((doc) => {
			  checkinlist.push({ id: doc.id, ...doc.data() });
		    });
		    this.checkin = checkinlist;
	  });
    },
    methods: {
      google_login() {
        // Using a popup.
        const provider = new firebase.auth.GoogleAuthProvider();
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
      computed: {
        filteredList() {
          if (this.search.trim() === '') {
            return this.quiz; // Return the entire quiz list if search is empty
          } else {
            const searchTerm = this.search.toLowerCase().trim();
            return this.quiz.filter(post => {
              return post.title.toLowerCase().includes(searchTerm);
            });
          }
        }
      },
	  autoRead() {
		  db.collection("student").onSnapshot((querySnapshot) => {
		  var stdlist = [];
		  querySnapshot.forEach((doc) => {
			  stdlist.push({ id: doc.id, ...doc.data() });
		  });
		  this.student = stdlist;
		  });
	  },
	  addData(){
		  this.editmode = "เพิ่มนักเรียน";
		  this.editstd = {};
	  },

	  addDataqiz(){
		this.editmode = "เพิ่มคำถาม";
		this.editquiz = {};
		},
		editqiz(std){
			this.editstd = std;
			this.editmode = "edit";
		},
	  edit(std){
		  this.editstd = std;
		  this.editmode = "เพิ่มนักเรียน";
	  },
	  editqz(quiz){
		this.editquiz = quiz;
		this.editmode = "เพิ่มคำถาม";
	},
	  sendob(){
		this.editmode = "แบบฟอร์ม";
		this.editcheckin={};
	},
    savedata() {
        db.collection("students").doc(this.editstd.id).set(this.editstd)
          .then(() => {
            // Save successful
            alert('Data saved successfully!');
            location.reload(); // Refresh the page after saving
          })
          .catch((error) => {
            // Handle errors if the save operation fails
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
          });
    },
    saveqiz(){
        db.collection("quiz").doc(this.editquiz.id).set(this.editquiz)
          .then(() => {
            // Save successful
            alert('Data saved successfully!');
            location.reload(); // Refresh the page after saving
          })
          .catch((error) => {
            // Handle errors if the save operation fails
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
          });
    },
    saveqiz_back() {
        db.collection("checkin").doc(this.editcheckin.id).set(this.editcheckin)
          .then(() => {
            // Save successful
            alert('Data saved successfully!');
            location.reload(); // Refresh the page after saving
          })
          .catch((error) => {
            // Handle errors if the save operation fails
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
          });
      },
	  deleteData(std) {
		  if (confirm("ต้องการลบข้อมูล")) {
		  db.collection("student").doc(std.id).delete()
            .then(() => {
                // Delete successful
                alert('Data Deleted successfully!');
                location.reload(); // Refresh the page after saving
            })
            .catch((error) => {
                // Handle errors if the save operation fails
                console.error('Error delete data:', error);
                alert('Error delete data. Please try again.');
            });
		  }
	  },
	  deleteqiz(qiz) {
		if (confirm("ต้องการลบข้อมูล")) {
		db.collection("quiz").doc(qiz.id).delete()
          .then(() => {
              // Delete successful
              alert('Data Deleted successfully!');
              location.reload(); // Refresh the page after saving
          })
          .catch((error) => {
              // Handle errors if the save operation fails
              console.error('Error delete data:', error);
              alert('Error delete data. Please try again.');
          });
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
		  window.location.href = 'index.html';
	    }
	  },
	  getstudent(email){
	    db.collection("student")
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
  
  vueApp.use(vuetify).mount("#app");
  