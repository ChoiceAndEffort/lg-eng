<!--
 * @Author: lg
 * @Date: 2024-07-04 09:47:56
 * @LastEditors: lg
 * @LastEditTime: 2024-07-16 16:49:36
 * @Description: 
 * @FilePath: \ssii-ui-plus\components\name-avatar\src\main.vue
-->
<template>
  <div
    :style="{
      width: `${width || 32}px`,
      height: `${width || 32}px`,
      background: background,
      fontSize: `${fontSize || 12}px`,
      color: color || '#fff'
    }"
    class="ssii-ui-head-portrait"
  >
    <span>
      {{ getNameAvatar(name) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps({
  name: {
    type: String
  },
  width: {
    type: [String, Number]
  },
  color: {
    type: [String]
  },
  fontSize: {
    type: [Number]
  },
  background: {
    type: String,
    default: () => {
      return 'linear-gradient(#72afff 0%, #1d5ef0 100%)';
    }
  }
});

const getNameAvatar = (v: string | undefined) => {
  if (!v) return '-';
  if (v.length <= 2) {
    return v;
  } else if (v.length > 2 && v.length <= 3) {
    return v.slice(1);
  } else if (v.length > 3 && v.length <= 4) {
    return v.slice(2);
  } else {
    return v.slice(v.length - 2);
  }
};
</script>
<style scoped lang="scss">
.ssii-ui-head-portrait {
  // background: linear-gradient(#72afff 0%, #1d5ef0 100%);
  border-radius: 50%;

  // font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
