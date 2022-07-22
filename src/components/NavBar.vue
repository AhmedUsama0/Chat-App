<template>
  <nav>
    <div class="user" @click="showMenu">
      <img :src="userImage" alt="" width="50px" height="50px" id="userImage" />
      <span>{{ username }}</span>
    </div>
    <ul id="menu">
      <li>
        <label for="pfp">
          Change Profile Picture
          <input
            type="file"
            style="display: none"
            id="pfp"
            @change="changeProfilePicture"
            accept="image/jpg, image/png, image/jpeg"
          />
        </label>
      </li>
      <li @click="logOut">LogOut</li>
    </ul>
  </nav>
</template>

<script>
import { db, storage } from "@/firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import $ from "jquery";
export default {
  name: "NavBar",

  data() {
    return {
      userImage: this.$store.state.userImage,
    };
  },
  computed: {
    username() {
      return this.$store.state.userName;
    },
  },
  methods: {
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
      getDownloadURL(img).then((url) => {
        // save the user img in the store
        this.$store.commit("setUserImage", url);
        // change picture once the user change it(it doesn't save the changes)
        const img = document.getElementById("userImage");
        img.setAttribute("src", url);

        // save the img url in the database
        const userDoc = doc(db, "users", this.$store.state.id);
        updateDoc(userDoc, {
          img: url,
        });
      });
    },
    showMenu() {
      $("#menu").slideToggle();
    },
    logOut() {
      // get the user document
      const document = doc(db, "users", this.$store.state.id);
      // update the user's status to offline
      updateDoc(document, {
        status: "offline",
      });
      // set auth to false
      this.$store.commit("setAuthentication", false);
      // redirect to login
      this.$router.replace({ name: "LogInView" });
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
  // border: 1px solid;

  img {
    border-radius: 50%;
  }

  .user {
    // border: 1px solid;
    cursor: pointer;
    width: fit-content;
    span {
      margin-left: 5px;
    }
  }
  ul {
    list-style-type: none;
    padding: 0px;
    background-color: #f9f9f9;
    max-width: 200px;
    position: absolute;
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
