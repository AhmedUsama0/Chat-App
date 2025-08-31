<template>
  <div class="spinner-container" id="spinner">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
};
</script>

<style lang="scss" scoped>
.spinner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
}

.spinner {
  display: block;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 250px;
  width: 250px;
  z-index: 3;
  left: 40%;
  top: 30%;
  border-radius: 50%;
  border-top: 5px solid lightgreen;
  border-right: 5px solid lightblue;
  border-left: 5px solid lightcoral;
  animation: rotate 1.5s ease-in-out infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
