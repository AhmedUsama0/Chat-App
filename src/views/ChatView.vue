<template>
  <div class="chat">
    <LoadingSpinner />
    <NavBar @change="showLoadingSpinner" />
    <div class="chat-container">
      <div class="grid">
        <!-- people start -->
        <div class="people">
          <div class="people-content">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="text-white">Chat Room Members</h3>
              <button @click="togglePeople" class="close-people-btn">X</button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              class="form-control shadow-none border-0"
            />
            <!-- friends start -->
            <div class="friends-content">
              <UsersComponent
                @showUserInfo="showUserInfo"
                :users="users"
                :username="username"
              />
            </div>
            <!-- friends end -->
          </div>
        </div>
        <!-- people end -->
        <div class="head">
          <div
            class="head-content d-flex justify-content-between align-items-center p-3"
          >
            <h2 class="text-white" style="letter-spacing: 0px">Chat Room</h2>
            <div class="d-sm-none bars" @click="togglePeople">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
          </div>
        </div>
        <div class="messages">
          <div class="message" v-for="message in messages" :key="message.id">
            <div
              v-if="username === message.sender"
              class="my-message col-12 col-md-8 col-lg-7 col-xl-6 col-xxl-4"
              :id="message.id"
            >
              {{ message.sender }} <br />{{ message.message }}
            </div>
            <div
              v-else
              class="user-message col-12 col-md-8 col-lg-7 col-xl-6 col-xxl-4"
              :id="message.id"
            >
              {{ message.sender }} <br />{{ message.message }}
            </div>
          </div>
        </div>
        <div class="developer">
          <div class="developer-content">
            <img id="user-image" />
            <h2 id="user-name-info" class="text-center mt-5 text-white"></h2>
          </div>
        </div>
        <div class="send-message">
          <div class="send-message-content col-11 col-xl-4">
            <textarea
              type="text"
              class="shadow-none"
              placeholder="Your Messages..."
              v-model="message"
              @keyup.enter="sendMessage"
              id="sendMessage"
            ></textarea>
            <i class="fa fa-paper-plane" @click="sendMessage"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import UsersComponent from "@/components/UsersComponent.vue";
import { usersColl, messagesColl, db } from "@/firebase/firebase";
import {
  query,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import $ from "jquery";
export default {
  name: "ChatView",
  components: {
    NavBar,
    UsersComponent,
    LoadingSpinner,
  },
  data() {
    return {
      to: String(),
      users: Array(),
      messages: Array(),
      message: String(),
      username: this.$store.state.userName,
    };
  },

  methods: {
    togglePeople() {
      $(".people").toggleClass("toggle-people");
    },
    showUserInfo(userObject) {
      if ($(".developer").css("display") === "none") {
        $("#user-image").attr("src", userObject.img);
        $("#user-name-info").text(userObject.username);
        $(".developer").css("display", "unset");
        $(".messages").css("grid-column-end", 5);
        $(".head").css("grid-column-end", 5);
        $(".send-message").css("grid-column-end", 5);
      } else {
        $(".developer").css("display", "none");
        $(".messages").css("grid-column-end", 6);
        $(".head").css("grid-column-end", 6);
        $(".send-message").css("grid-column-end", 6);
      }
    },
    showLoadingSpinner(value) {
      if (value === true) {
        $("#spinner").css("display", "flex");
      } else {
        $("#spinner").hide();
      }
    },
    sendMessage() {
      // save the message,sender and the time
      if (this.message) {
        addDoc(messagesColl, {
          message: this.message,
          sender: this.username,
          createdAt: serverTimestamp(),
        });
        this.message = "";
      }
    },
    showMessages() {
      // sort the messages collection be time creation in descending order
      const sortedmessagesColl = query(
        messagesColl,
        orderBy("createdAt", "desc")
      );
      // track the changes of the sorted messages collection (real time update)
      onSnapshot(sortedmessagesColl, (snapShot) => {
        this.messages = [];
        snapShot.docs.forEach((doc) => {
          this.messages.push({ ...doc.data(), id: doc.id });
        });
      });
    },
  },
  mounted() {
    // once the user logged in, update the status to online
    const documentOfLoggedInUser = doc(db, "users", this.$store.state.id);
    updateDoc(documentOfLoggedInUser, {
      status: "online",
    });
    // once the user logged in show the messages
    this.showMessages();
    // sort the user collection by status in descending order
    const sortedUsersColl = query(usersColl, orderBy("status", "desc"));
    // track the changes of the sorted users collection (real time update)
    onSnapshot(sortedUsersColl, (snapShot) => {
      this.users = [];
      snapShot.docs.forEach((doc) => {
        this.users.push({ ...doc.data(), id: doc.id });
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.toggle-people {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0 !important;
  z-index: 3;
}
.chat {
  position: relative;
  .chat-container {
    .grid {
      display: grid;
      min-height: 94vh;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 70px repeat(3, 1fr) 70px;
      box-shadow: 0 15px 30px 0px rgb(0 0 0 / 20%);
      background: #fff;

      .people {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 6;
        background-color: #aeafe8;
        padding: 40px;
        transition: all 0.3s ease-in-out;
        .people-content {
          .close-people-btn {
            border: none;
            background: unset;
            color: #fff;
            font-size: 25px;
            display: none;
          }
          input {
            margin: 30px 0px;
          }

          .friends-content {
            overflow-y: scroll;
            height: 600px;
          }
        }
      }

      .head {
        display: flex;
        align-items: center;
        grid-column-start: 2;
        grid-column-end: 6;
        grid-row-start: 1;
        grid-row-end: 2;
        background-color: #43318d8c;
        .head-content {
          flex: 1;

          .bars {
            cursor: pointer;
            .bar {
              display: block;
              height: 3px;
              background-color: #fff;
              width: 35px;
              margin: 6px 0;
            }
          }
        }
      }

      .messages {
        display: flex;
        flex-direction: column-reverse;
        background-color: #efeef8;
        grid-column-start: 2;
        grid-column-end: 6;
        grid-row-start: 2;
        grid-row-end: 5;
        min-height: 690px;
        max-height: 765px;
        overflow-y: scroll;
        transition: all 1.5s ease-in-out;
        .message {
          padding: 10px;

          .my-message,
          .user-message {
            color: #fff;
            padding: 10px;
            border-radius: 5px 15px 15px 15px;

            &:last-child {
              animation: popup 0.5s ease-out;
            }
          }

          @keyframes popup {
            0% {
              transform: scale(0);
            }

            50% {
              transform: scale(1.1);
            }

            100% {
              transform: scale(1);
            }
          }

          .my-message {
            background-color: #4c2fc9;
          }

          .user-message {
            background-color: #b3b2c0;
            float: right;
          }
        }
      }

      .developer {
        display: none;
        grid-column-start: 5;
        grid-column-end: 6;
        grid-row-start: 1;
        grid-row-end: 6;
        background-color: #aeafe8;
        transition: all 0.5s ease-in-out;

        .developer-content {
          #user-image {
            display: block;
            margin: 50px auto 0 auto;
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
      }

      .send-message {
        display: flex;
        align-items: center;
        grid-column-start: 2;
        grid-column-end: 6;
        grid-row-start: 5;
        grid-row-end: 6;
        background-color: #b3b2c0;

        .send-message-content {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin: 0 auto;
          // width: 50%;
          height: 50px;
          i {
            position: absolute;
            right: 15px;
            top: 25%;
            font-size: 20px;
            color: #43318d8c;
            cursor: pointer;
          }
          textarea {
            position: absolute;
            display: block;
            width: 100%;
            background-color: #f5f5f5;
            padding: 8px;
            height: 40px;
            border-radius: 20px;
            border: 0;
            margin: 0 auto;
            outline: none;

            &::placeholder {
              color: #000;
            }
          }
        }
      }
    }
  }
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  box-shadow: 0 10px 20px 0 rgb(0 0 0 / 20%);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media screen and (max-width: 575px) {
  .grid {
    overflow-x: hidden;
    .head,
    .messages,
    .send-message {
      grid-column-start: 1 !important;
    }

    .people {
      position: absolute;
      left: -1000px;

      .people-content {
        .close-people-btn {
          display: block !important;
        }
      }
    }
  }
}
</style>
