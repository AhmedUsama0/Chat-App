<template>
  <div class="d-flex justify-content-center align-items-center Register">
    <div
      class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-5 col-xxl-4 mx-auto container"
    >
      <div class="alert alert-success" id="alert-success">
        Registered successfully
      </div>
      <div class="alert alert-danger" id="alert-error"></div>
      <div class="form-container">
        <h1 class="text-center">Sign Up</h1>
        <form @submit.prevent="Register">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              v-model="username"
              class="form-control shadow-none"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              v-model="email"
              class="form-control shadow-none"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              v-model="password"
              class="form-control shadow-none"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirm_password">Confirm Password:</label>
            <input
              type="password"
              v-model="confirm_password"
              class="form-control shadow-none"
              required
            />
          </div>
          <button class="register-btn text-white col-12 mx-auto mb-5">
            Register
          </button>
          <p class="text-center register">
            Already have an account
            <router-link to="/login">Sign In</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { usersColl } from "@/firebase/firebase";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import $ from "jquery";
export default {
  name: "RegisterView",
  data() {
    return {
      username: String(),
      email: String(),
      password: String(),
      confirm_password: String(),
      isAccountExist: Number(),
      isUserNameExist: Number(),
      isEmailExist: Number(),
    };
  },

  methods: {
    async checkForEmailExist(email) {
      const q = query(usersColl, where("email", "==", email));
      const querySnapShot = await getDocs(q);
      return querySnapShot.docs.length;
    },
    async checkForUserNameExist(username) {
      const q = query(usersColl, where("username", "==", username));
      const querySnapShot = await getDocs(q);
      return querySnapShot.docs.length;
    },
    async checkForAccountExist(username, email) {
      const q = query(
        usersColl,
        where("email", "==", email),
        where("username", "==", username)
      );
      const querySnapShot = await getDocs(q);
      return querySnapShot.docs.length;
    },
    async Register() {
      $("#alert-error").hide();
      $("#alert-success").hide();
      if (this.password === this.confirm_password) {
        const isAccountExist = await this.checkForAccountExist(
          this.username,
          this.email
        );
        const isUserNameExist = await this.checkForUserNameExist(this.username);
        const isEmailExist = await this.checkForEmailExist(this.email);
        if (
          isAccountExist === 0 &&
          isUserNameExist === 0 &&
          isEmailExist === 0
        ) {
          addDoc(usersColl, {
            username: this.username,
            email: this.email,
            password: this.password,
            status: "offline",
            img: "https://www.freeiconspng.com/uploads/male-icon-19.png",
          }).then(() => {
            $("#alert-success").show();
          });
        } else if (isAccountExist > 0) {
          $("#alert-error").text("Account is already exist");
          $("#alert-error").show();
        } else if (isEmailExist > 0) {
          $("#alert-error").text("Email is already exist");
          $("#alert-error").show();
        } else if (isUserNameExist > 0) {
          $("#alert-error").text("Username is already exist");
          $("#alert-error").show();
        }
      } else {
        $("#alert-error").text("Passwords Not Matched");
        $("#alert-error").show();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Register {
  min-height: 100vh;

  .container {
    #alert-success,
    #alert-error {
      box-shadow: 0 10px 20px 0 rgb(0 0 0 / 20%);
      background-color: #fff;
      border: 0;
      font-weight: bold;
      display: none;
    }

    #alert-success {
      color: green;
    }

    #alert-error {
      color: red;
    }

    .form-container {
      background-color: #fff;
      border-radius: 15px;
      padding: 15px;
      min-height: 500px;
      // rgb(0 0 0 / 20%) is equavliant to rgba(0,0,0,.2)
      box-shadow: 0 15px 50px 0px rgb(0 0 0 / 20%);

      form {
        max-width: 350px;
        margin: 60px auto 0 auto;

        input {
          margin-bottom: 20px;
          padding: 8px;
          border: 0;
          border-bottom: 1px solid gray;
          border-radius: 0;
        }
      }

      .register-btn {
        display: block;
        border: none;
        outline: none;
        padding: 5px;
        height: 54px;
        border-radius: 10px;
        background-color: #fb771a;
      }

      .register {
        a {
          color: #888;
        }
      }
    }
  }
}
</style>
