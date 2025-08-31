<template>
  <div class="chat">
    <LoadingSpinner />
    <NavBar @change="showLoadingSpinner" @openPeople="isPeopleOpened = true" />
    <div class="chat-container">
      <div class="grid">
        <!-- people start -->
        <div class="people" :class="isPeopleOpened ? 'toggle-people' : ''">
          <div class="people-content">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="text-white">Chat Room Members</h3>
              <button @click="isPeopleOpened = false" class="close-people-btn">
                X
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              class="form-control shadow-none border-0"
            />
            <!-- friends start -->
            <div class="friends-content overflow-y-auto">
              <UsersComponent
                @showUserInfo="showUserInfo"
                :users="users"
                :username="username"
              />
            </div>
            <!-- friends end -->
          </div>
        </div>
        <div
          class="messages p-3"
          :style="{ backgroundColor: $store.state.chatColor }"
        >
          <template v-for="message in messages">
            <div
              :key="message.id"
              class="message position-relative col-12 col-md-8 col-lg-7 col-xl-6 col-xxl-4 text-white p-3 rounded-3 mt-3"
              :class="username !== message.sender ? 'mr-0 ms-auto' : ''"
              :id="message.id"
              :style="{
                backgroundColor:
                  username === message.sender
                    ? $store.state.myMessageColor
                    : $store.state.userMessageColor,
              }"
            >
              <div class="d-flex align-items-center gap-2 mb-3">
                <img
                  :src="
                    username === message.sender
                      ? userImage
                      : findUserByName(message.sender)?.img
                  "
                  alt="userimage"
                  width="50"
                  height="50"
                  class="rounded-circle"
                />
                <span>{{ message.sender }} </span>
              </div>
              <p v-if="message.message" class="mb-3">{{ message.message }}</p>
              <div
                class="d-flex flex-wrap gap-1"
                v-if="message.attachments.length > 0"
              >
                <template v-for="attachment in message.attachments">
                  <img
                    :key="attachment"
                    :src="attachment"
                    alt="attachment"
                    width="150"
                    height="150"
                    class="py-3 h-full"
                    loading="lazy"
                  />
                </template>
              </div>
              <span class="time position-absolute"
                >{{
                  message.createdAt?.toDate().toLocaleString("en-Us", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                }}
              </span>
            </div>
          </template>
        </div>
        <div class="developer">
          <div class="developer-content">
            <img id="user-image" />
            <h2 id="user-name-info" class="text-center mt-5 text-white"></h2>
          </div>
        </div>
        <div class="send-message py-2 gap-1">
          <div class="send-message-content col-10 col-xl-4 rounded-2">
            <div ref="attachmentsPreview"></div>
            <textarea
              type="text"
              class="shadow-none w-full p-2 rounded-2 border-0"
              placeholder="Your Messages..."
              v-model="message"
              @keyup.enter="handleEnter"
              ref="messageArea"
            ></textarea>
            <label class="attachment" for="attachment">
              <i class="fa fa-paperclip" aria-hidden="true"></i>
              <input
                @change="addImage"
                type="file"
                accept=" image/*"
                multiple
                class="d-none"
                id="attachment"
              />
            </label>
          </div>
          <button
            class="btn-send h-100 border-0 rounded-2 text-white col-2"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import UsersComponent from "@/components/UsersComponent.vue";
import { usersColl, messagesColl, auth, storage } from "@/firebase/firebase";
import {
  query,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import $ from "jquery";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export default {
  name: "ChatView",
  components: {
    NavBar,
    LoadingSpinner,
    UsersComponent,
  },
  data() {
    return {
      to: "",
      users: [],
      messages: [],
      message: "",
      attachments: [],
      username: auth.currentUser.displayName,
      userImage: auth.currentUser.photoURL,
      isPeopleOpened: false,
    };
  },
  computed: {
    isMobile() {
      return (
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.matchMedia("(max-width: 1023px)").matches
      );
    },
  },
  methods: {
    findUserByName(name) {
      return this.users.find((user) => user.username === name);
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
        $("#spinner").css("display", "block");
      } else {
        $("#spinner").hide();
      }
    },
    handleEnter(event) {
      if (!this.isMobile) {
        if (event.shiftKey) {
          return;
        }
        event.preventDefault();
        this.sendMessage();
      }
    },
    async sendMessage() {
      try {
        if (this.attachments.length > 0) {
          this.attachments = await Promise.all(
            this.attachments.map(async (attachment) => {
              const imageRef = ref(storage, attachment.name);
              await uploadBytes(imageRef, attachment);
              return getDownloadURL(imageRef);
            })
          );
        }

        if (this.message.trim() || this.attachments.length > 0) {
          addDoc(messagesColl, {
            message: this.message,
            attachments: this.attachments,
            sender: this.username,
            createdAt: serverTimestamp(),
          });
          this.message = "";
          this.$refs.messageArea.focus();

          if (this.$refs.attachmentsPreview.children.length > 0) {
            this.$refs.attachmentsPreview.innerHTML = "";
            this.$refs.attachmentsPreview.classList.remove(
              "attachments-preview"
            );
          }
        }
      } catch (error) {
        console.log(error.message);
      }

      // save the message,sender and the time
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
    async addImage(e) {
      this.attachments = Array.from(e.target.files);

      this.attachments.forEach((attachment) => {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(attachment);
        image.alt = "attachment";
        image.classList.add("image-preview");
        image.setAttribute("style", "max-width:100%;border-radius:4px");
        this.$refs.attachmentsPreview.append(image);
        this.$refs.attachmentsPreview.classList.add("attachments-preview");
      });
    },
  },
  mounted() {
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
  left: 0 !important;
}

.chat {
  position: relative;

  .chat-container {
    .grid {
      display: grid;
      height: calc(100dvh - 60px);
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 70px 1fr 70px;
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
            max-height: 600px;
            scrollbar-width: none;
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
        grid-row-start: 1;
        grid-row-end: 5;
        overflow-y: auto;
        transition: all 0.5s ease-in-out;
        scrollbar-width: none;

        .message {
          overflow-wrap: break-word;
          white-space: pre-wrap;
          transition: all 0.5s ease-in-out;
          animation: popup 0.5s ease-out;

          .time {
            font-size: 12px;
            bottom: 8px;
            right: 8px;
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
        justify-content: center;
        grid-column-start: 2;
        grid-column-end: 6;
        grid-row-start: 5;
        grid-row-end: 6;
        background-color: #b3b2c0;
        padding-left: 30px;
        padding-right: 30px;

        .send-message-content {
          display: flex;
          flex-direction: column;
          padding: 5px 10px;
          row-gap: 5px;
          justify-content: center;
          position: relative;
          background-color: white;

          textarea {
            width: 100%;
            scrollbar-width: none;
            border-radius: 20px;
            border: 0;
            margin: 0 auto;
            outline: none;
            resize: none;
            height: 100%;

            &::placeholder {
              color: #000;
            }
          }

          .attachments-preview {
            display: flex;
            height: 50px;
            overflow-x: auto;
            column-gap: 10px;
            width: 100%;
            scrollbar-width: thin;
          }

          .attachment {
            cursor: pointer;
            width: fit-content;
          }
        }

        .btn-send {
          background-color: #4c2fc9;
          width: 100px;
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

@media screen and (max-width: 1023px) {
  .grid {
    overflow-x: hidden;

    .head,
    .messages,
    .send-message {
      grid-column-start: 1 !important;
      grid-column: span 1 / -1;
    }

    .people {
      position: fixed;
      left: -1000px;
      top: 60px;
      z-index: 10000;
      width: 100%;
      height: 100vh;

      .people-content {
        .close-people-btn {
          display: block !important;
        }
      }
    }
  }
}
</style>
