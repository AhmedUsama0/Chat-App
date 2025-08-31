<template>
  <nav>
    <div class="d-flex align-items-center justify-content-between">
      <div class="user d-flex align-items-center gap-2" @click="showMenu">
        <img
          :src="userImage"
          alt="userimage"
          width="50px"
          height="50px"
          id="userImage"
          class="rounded-circle"
        />
        <span>{{ username }}</span>
      </div>
      <i
        @click="$emit('openPeople', true)"
        class="d-lg-none fa fa-bars fs-4 p-2"
        aria-hidden="true"
      ></i>
    </div>
    <ul id="menu">
      <li>
        <label for="pfp">
          Change Profile Picture
          <input
            type="file"
            class="d-none"
            id="pfp"
            @change="changeProfilePicture"
            accept="image/jpg, image/png, image/jpeg"
          />
        </label>
      </li>
      <div class="p-2 d-flex align-items-center justify-content-between gap-2">
        <span>Chat</span>
        <input
          @change="changeChatColor"
          :value="$store.state.chatColor"
          type="color"
        />
      </div>
      <div class="p-2 d-flex align-items-center justify-content-between gap-2">
        <span>My Message</span>
        <input
          @change="changeMyMessageColor"
          :value="$store.state.myMessageColor"
          type="color"
        />
      </div>
      <div class="p-2 d-flex align-items-center justify-content-between gap-2">
        <span>User Message</span>
        <input
          @change="changeUserMessage"
          :value="$store.state.userMessageColor"
          type="color"
        />
      </div>
      <li @click="logOut">LogOut</li>
    </ul>
  </nav>
</template>

<script>
import { db, storage, auth } from "@/firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile, signOut } from "firebase/auth";
import $ from "jquery";
export default {
  name: "NavBar",

  data() {
    return {
      userImage: auth.currentUser.photoURL,
    };
  },
  computed: {
    username() {
      return auth.currentUser.displayName;
    },
  },
  methods: {
    changeChatColor(event) {
      this.$store.commit("setChatColor", event.target.value);
    },
    changeMyMessageColor(event) {
      this.$store.commit("setMyMessageColor", event.target.value);
    },
    changeUserMessage(event) {
      this.$store.commit("setUserMessageColor", event.target.value);
    },
    async changeProfilePicture(e) {
      // emit an event with value true to show the LoadingSpinner
      this.$emit("change", true);
      // upload the image
      const imgName = e.target.files[0].name;
      const img = ref(storage, imgName);
      await uploadBytes(img, e.target.files[0]).then(() => {
        // emit an event with value false to hide the LoadingSpinner
        this.$emit("change", false);
      });
      // download the image
      getDownloadURL(img).then(async (url) => {
        // save the user img in the store
        updateProfile(auth.currentUser, {
          photoURL: url,
        });
        // // change picture once the user change it(it doesn't save the changes)
        const img = document.getElementById("userImage");
        img.setAttribute("src", url);

        // save the img url in the database
        const user = doc(db, "users", auth.currentUser.uid);
        updateDoc(user, {
          img: url,
        });
      });
    },
    showMenu() {
      $("#menu").slideToggle();
    },
    logOut() {
      // get the user document
      const document = doc(db, "users", auth.currentUser.uid);
      // update the user's status to offline
      updateDoc(document, {
        status: "offline",
      });

      // redirect to login
      signOut(auth)
        .then(() => {
          this.$router.replace({ name: "LogInView" });
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  background: #fff;
  box-shadow: 0 15px 30px 0 rgb(0 0 0 / 20%);
  position: relative;
  width: 100%;

  .user {
    cursor: pointer;
    width: fit-content;
  }

  ul {
    list-style-type: none;
    padding: 0px;
    background-color: #f9f9f9;
    max-width: 200px;
    position: absolute;
    z-index: 20;
    border-radius: 5px;
    display: none;
    li {
      cursor: pointer;
      padding: 10px;
      &:hover {
        background-color: lightgray;
      }
      label {
        cursor: pointer;
      }
    }
  }
}
</style>
