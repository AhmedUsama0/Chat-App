<template>
  <div class="d-flex justify-content-center align-items-center LogIn">
    <div
      class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4 col-xxl-4 mx-auto container"
    >
      <div class="alert" id="alert-error">tt</div>
      <div class="form-container">
        <h1 class="text-center">Sign In</h1>
        <form @submit.prevent="LogIn">
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
          <button class="login-btn text-white col-12 mx-auto mb-5">
            Log In
          </button>
          <p class="text-center register">
            Don't have an account
            <router-link to="/register">Sign Up</router-link>
          </p>
          <p id="error"></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import $ from "jquery";
export default {
  name: "LogInView",
  data() {
    return {
      username: String(),
      email: String(),
      password: String(),
    };
  },
  methods: {
    LogIn() {
      $("alert-error").hide();
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          return signInWithEmailAndPassword(auth, this.email, this.password);
        })
        .then(({ user }) => {
          if (user) {
            this.$router.push({ name: "chat" });
          }
        })
        .catch(() => {
          $("#alert-error").text("Email or Password is Incorrect");
          $("#alert-error").show();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.LogIn {
  min-height: 100vh;

  .container {
    #alert-error {
      box-shadow: 0 10px 20px 0 rgb(0 0 0 / 20%);
      background-color: #fff;
      border: 0;
      font-weight: bold;
      display: none;
      color: red;
    }

    .form-container {
      background-color: #fff;
      border-radius: 15px;
      padding: 15px;
      min-height: 500px;
      // rgb(0 0 0 / 20%) is equavliant to rgba(0,0,0,.2)
      box-shadow: 0 15px 30px 0px rgb(0 0 0 / 20%);

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

      .login-btn {
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
