<template>
  <div class="users-component">
    <div class="friend" v-for="user in users" :key="user.id">
      <!-- online container -->
      <div
        class="img-container"
        v-if="user.username !== username && user.status === 'online'"
        @click="showUserInfo(user.username, user.img)"
      >
        <div class="img-icon">
          <img :src="user.img" alt="" class="online" />
          <span class="green-icon"></span>
        </div>
        <span class="text-white username">{{ user.username }}</span>
      </div>
      <!-- end online container -->

      <!-- offline container -->
      <div
        class="img-container2"
        v-else-if="user.status === 'offline' && user.username !== username"
        @click="showUserInfo(user.username, user.img)"
      >
        <div class="img-icon">
          <img :src="user.img" alt="" class="offline" />
          <span class="gray-icon"></span>
        </div>
        <span class="text-white">{{ user.username }}</span>
      </div>
      <!-- end offline container -->
    </div>
  </div>
</template>

<script>
export default {
  name: "UsersComponent",
  props: ["users", "username"],
  methods: {
    showUserInfo(username, img) {
      this.$emit("showUserInfo", { username, img });
    },
  },
};
</script>

<style lang="scss" scoped>
.users-component {
  .friend {
    img {
      border-radius: 50%;
      height: 60px;
      width: 60px;
      margin-right: 10px;
    }

    .online,
    .offline {
      background-color: #f1f1f1;
    }

    .green-icon,
    .gray-icon {
      position: absolute;
      border-radius: 50%;
      bottom: 0;
      left: 0;
      border: 1px solid #fff;
      height: 20px;
      width: 20px;
    }

    .img-container,
    .img-container2 {
      width: fit-content;
      display: flex;
      align-items: center;
      gap: 1px;
      margin-bottom: 10px;
      cursor: pointer;
      .img-icon {
        position: relative;
        .green-icon {
          background-color: green;
        }
        .gray-icon {
          background-color: gray;
        }
      }
    }
  }
}
</style>
