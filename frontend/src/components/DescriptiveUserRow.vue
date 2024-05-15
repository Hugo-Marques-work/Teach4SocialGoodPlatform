<template>
  <div class="descriptive-container">
    <div class="descriptive-row row">
      <img :class="{'order-2' : imageIsRight}" :src="img" :alt="name"/>
      <p class="col order-1">
        <span>{{ name }}</span> {{ description }}
      </p>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import DescriptiveUser from "@/models/DescriptiveUser";

export default defineComponent({
    props: {
      descriptiveUser: DescriptiveUser,
      left: Boolean
    },
    computed: {
      imageIsRight(): boolean {
        return !this.left;
      },
      imgPath(): string {
        if(this.descriptiveUser) return this.descriptiveUser.img;
        return "";
      },
      description(): string {
        if(this.descriptiveUser) return this.descriptiveUser.description;
        return "";
      },
      name(): string {
        if(this.descriptiveUser) return this.descriptiveUser.name;
        return "";
      },
      img(): string {
        return new URL(this.imgPath, import.meta.url).href;
      },
    },
});
</script>

<style scoped>
img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
span {
  font-style: italic;
  font-weight: 700;
}
p {
  text-align: left;
  margin-bottom: 5px;
  margin-top: 5px;
}
.descriptive-row {
  align-items: center;
}
.descriptive-user-row {
  padding: 10px 0px;
}
@media only screen and (min-width: 992px) {
  .descriptive-user-row.right {
    margin-top: -80px;
    margin-bottom: -80px;
  }
  .descriptive-user-row {
    padding: 20px 20px;
  }
}
</style>
  