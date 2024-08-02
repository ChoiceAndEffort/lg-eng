<!--
 * @Author: lg
 * @Date: 2024-06-24 17:54:49
 * @LastEditors: lg
 * @LastEditTime: 2024-08-02 17:58:18
 * @Description:
 * @FilePath: \lg-ui-vue\components\name-avatar copy\src\main.vue
-->
<template>
  <div class="verification-code-plugin">
    <li v-for="(item, index) in verificationCodes" :key="index">
      <div v-if="index === 3" class="gap-area">-</div>
      <input
        v-else
        v-model="verificationCodes[index]"
        maxlength="1"
        class="verification-input"
        @input="handleInput(index, $event)"
        @paste="handlePaste"
        ref="inputFieldRef"
      />
    </li>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue';
const verificationCodes = ref(['', '', '', '', '', '', '']);
const handleInput = (index: number, event: any) => {
  const value = event.target.value;
  verificationCodes.value[index] = value;

  // 自动跳到下一个输入框
  if (value && index < verificationCodes.value.length - 1) {
    const allChildren = event.target?.parentNode?.parentNode?.children;
    if (!allChildren) return false;
    if (index === 2) {
      allChildren[index + 2].children[0].focus();
      return false;
    }
    allChildren[index + 1].children[0].focus();
  }

  // 自动删除前面的内容
  if (!value && index > 0) {
    const allChildren = event.target?.parentNode?.parentNode?.children;
    if (!allChildren) return false;
    if (index === 4) {
      allChildren[index - 2].children[0].focus();
      return false;
    }
    allChildren[index - 1].children[0].focus();
  }
};

const inputFieldRef = ref<any>(null);
/**
 * @description: 粘贴
 * @param {*} event
 * @return {*}
 */
const handlePaste = (event: any) => {
  const clipboardData = event.clipboardData || (window as any).clipboardData;
  const pastedText = clipboardData.getData('text');

  const codes = pastedText.trim().substring(0, 6).split('');
  const codesAddGap = [codes.slice(0, 3), '', codes.slice(3, 6)].flat(Infinity);

  verificationCodes.value = codesAddGap;

  // nextTick 方法来确保在更新 DOM 之后设置焦点。我们通过 $refs.inputField 引用最后一个输入框，并使用 focus 方法将焦点设置在最后一个输入框中
  nextTick(() => {
    const lastInput = inputFieldRef.value[verificationCodes.value.length - 2];
    lastInput && lastInput.focus();
  });
};
const code = computed(() => {
  return verificationCodes.value.join('');
});

defineExpose({
  inputCode: code
  // inputCode: verificationCodes.value.join(''),
});
</script>
<style scoped lang="scss">
.verification-code-plugin {
  display: flex;

  li {
    .verification-input,
    .gap-area {
      width: 40px;
      height: 40px;
      margin-right: 16px;
      text-align: center;
      line-height: 40px;

      background: #ffffff;
    }
    .verification-input {
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #dfe1e6;
    }
  }
}
</style>
