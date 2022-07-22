<template>
  <div class="users-component">
    <div
      class="friend"
      v-for="user in users"
      :key="user.id"
      @click="test(user.username, user.img)"
    >
      <!-- online container -->
      <div
        class="img-container"
        v-if="user.username !== username && user.status === 'online'"
      >
        <img :src="user.img" alt="" class="online" />
        <span class="green-icon"></span>
        <span class="text-white">{{ user.username }}</span>
      </div>
      <!-- end online container -->

      <!-- offline container -->
      <div
        class="img-container2"
        v-else-if="user.status === 'offline' && user.username !== username"
      >
        <img :src="user.img" alt="" class="offline" />
        <span class="red-icon"></span>
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
    test(username, img) {
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
      height: 80px;
      width: 80px;
      margin-right: 10px;
    }

    .online,
    .offline {
      background-color: #f1f1f1;
    }

    .green-icon,
    .red-icon {
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
      position: relative;
      margin-bottom: 10px;
      cursor: pointer;
      width: fit-content;
    }

    .img-container {
      .green-icon {
        background-color: green;
      }
    }

    .img-container2 {
      .red-icon {
        background-color: gray;
      }
    }
  }
}
</style>
