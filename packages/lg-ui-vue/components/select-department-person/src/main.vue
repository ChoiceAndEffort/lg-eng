<!--
 * @Author: lg
 * @Date: 2024-07-01 12:00:28
 * @LastEditors: lg
 * @LastEditTime: 2024-08-02 14:14:13
 * @Description:
 * @FilePath: \lg-ui-vue\components\select-department-person\src\main.vue
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="options?.title"
    width="740px"
    align-center
    :close-on-click-modal="false"
  >
    <slot name="header"></slot>
    <div class="select-dialog__content" v-if="isShow">
      <div class="select-dialog__content-left">
        <div class="top-area">
          <el-input
            v-model="userSearch"
            class="user-search"
            clearable
            placeholder="请输入姓名、手机号"
            :prefix-icon="Search"
            @keyup.enter="onSearch"
            @clear="onSearch"
          />
          <div class="title">
            <el-scrollbar>
              <el-button
                link
                @click="handlePathClick({ label: '', id: '' }, -1)"
              >
                组织架构</el-button
              >
              <el-button
                link
                class="path-item"
                v-for="(item, index) in levelPath"
                :key="item.id"
                @click="handlePathClick(item, index)"
                :disabled="index === levelPath.length - 1"
              >
                <el-icon><ArrowRight /></el-icon>
                {{ item.label }}
              </el-button>
            </el-scrollbar>
          </div>
          <el-checkbox
            v-model="selectObj[currentSelectBo]"
            label="全选"
            @change="handleSelectAll"
            v-if="showTreeList?.length"
          />
        </div>

        <el-scrollbar height="330">
          <el-tree
            class="tree-area"
            :node-key="options.configKey.departmentKey['departmentIdKey']"
            show-checkbox
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-expand-all="true"
            :data="showTreeList"
            :props="defaultProps"
            ref="treeRef"
            @check="handleCheckChange"
            @node-click="handleNodeClick"
          >
            <!--  vue/no-unused-vars -->
            <template #default="{ node, data }">
              <!-- {{ data }} -->
              <!--    :class="{
                  'node-active': checkedIds.includes(
                    data[options.configKey.departmentKey['departmentIdKey']]
                  )
                }" -->
              <div
                class="custom-tree-node"
                :class="{
                  'node-active': checkedIds.includes(
                    data[options.configKey.departmentKey['departmentIdKey']]
                  )
                }"
              >
                <div class="node-label">{{ node.label }}</div>
                <span>
                  <el-icon><ArrowRightBold /></el-icon>
                </span>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="select-dialog__content-right">
        <div class="show-info">
          <div class="top">
            <span>已选:{{ checkedTotalTitle }}</span>
            <el-button link @click="handleClear" type="primary">清空</el-button>
          </div>

          <div class="bottom">
            <span class="limit-notice">
              {{
                options.limitSelectNoticeTitle ||
                (options.limitSelectNum === ''
                  ? ''
                  : `(最多选择${options.limitSelectNum}个)`)
              }}
            </span>
          </div>
        </div>
        <el-scrollbar height="370">
          <li
            v-for="item in checkedList"
            :key="item[props.options.configKey.departmentKey.departmentIdKey]"
            class="item-li"
          >
            <div class="logo-area">
              <span v-if="item[props.options.configKey.userIdKey]">
                {{ getShowName(item[props.options.configKey.nameKey]) }}
              </span>
              <i class="iconfont icon-a-lianhe10" v-else></i>
            </div>
            <div class="name-area">
              {{ item[props.options.configKey.departmentKey.label] }}
              <span v-if="!item[props.options.configKey.userIdKey]">
                ({{ item[props.options.configKey.departmentKey.userTotalKey] }})
              </span>
            </div>
            <el-button
              :icon="CloseBold"
              link
              @click="handleDeleteItem(item)"
            ></el-button>
          </li>
        </el-scrollbar>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </div>
    </template>
    <!-- {{ disabledSuperiorIds }} -->
    <!-- {{ selectObj }}
    {{ currentSelectBo }} -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, inject, watch, computed } from 'vue';
import {
  Search,
  ArrowRightBold,
  CloseBold,
  ArrowRight
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

let loading = ref<boolean>(false);
//选择的列表
const checkedList = ref<any[]>([]);
//标题
const keywordsSearch: any = inject('keywords-search');
const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {
      return {
        title: '选择人员',
        initDepartmentList: [], //部门列表
        initUserList: [] //人员列表
      };
    }
  },
  isShow: {
    type: Boolean,
    required: false,
    default: true
  }
});
/**
 * @description: 所有用户列表
 * @param {*} computed
 * @return {*}
 */
const getAllUserList = computed(() => {
  return props.options.initUserList;
});

const defaultProps = {
  children: props.options.configKey.departmentKey.children,
  label: props.options.configKey.departmentKey.label,
  disabled: 'disabled'
};

const getShowName = (v) => {
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
const dialogVisible = ref(false);
watch(
  () => dialogVisible.value,
  (nv) => {
    if (!nv) {
      props.options.onOutCancel();
      checkedList.value = [];
      treeRef.value?.setCheckedKeys([]);
    }
  }
);
/**
 * @description: 打开弹窗
 * @return {*}
 */
const OpenDialog = () => {
  loading.value = false;
  dialogVisible.value = true;
};

/**
 * @description: 关闭弹框
 * @return {*}
 */
const handleSubmit = async () => {
  if (
    props.options.limitSelectNum &&
    checkedList.value?.length > props.options.limitSelectNum
  ) {
    ElMessage.warning('最多选择' + props.options.limitSelectNum + '个');
    return false;
  }
  loading.value = true;
  await props.options.onOutSubmit(checkedList.value);
  loading.value = false;
  dialogVisible.value = false;
};
/**
 * @description: 取消
 * @return {*}
 */
const handleCancel = () => {
  dialogVisible.value = false;
  props.options.onOutCancel();
};

// 搜索
const userSearch = ref('');
/**
 * @description: 搜索
 * @return {*}
 */
const onSearch = () => {
  // isUserSearch.value = Boolean(userSearch.value);
  keywordsSearch(userSearch.value, 'keywords');
};

// const dealCheckList = computed(() => {
//   return checkedList.value;
// });

const treeRef = ref();

const selectObj = ref<any>({
  selectAll: false
});

//当前层级下选择的布尔值
const currentSelectBo = ref('selectAll');

/**
 * @description: 全选和全不选
 * @return {*}
 */
const handleSelectAll = () => {
  if (selectObj.value[currentSelectBo.value]) {
    treeRef.value.setCheckedKeys(
      showTreeList.value
        .filter((el) => el.disabled !== true)
        .map(
          (item) =>
            item[props.options.configKey.departmentKey['departmentIdKey']]
        )
        .filter((item) => !item.disabled)
    );
    onUpdateHaveCheckedTreeList(
      showTreeList.value.filter((el) => el.disabled !== true)
    );
    // checkedList.value = showTreeList.value;
    return false;
  } else {
    treeRef.value?.setCheckedKeys([]);
    const currentPathNotChecked = showTreeList.value.map(
      (item) => item[props.options.configKey.departmentKey['departmentIdKey']]
    );
    onUpdateHaveCheckedTreeList([], currentPathNotChecked);
    // checkedList.value = [];
  }
};

/**
 * @description: 更新已选择的部门数据,
 * @param {*} checked -是此次表格选中的数据
 * @param {*} notChecked -是此次表格未选中的数据id
 * @return {*}
 */
const onUpdateHaveCheckedTreeList: any = (
  checked: any[],
  notChecked: any[]
) => {
  //合并
  const concatArr = [...checkedList.value, ...checked].flat(Infinity);
  // console.log('-----concatArr', concatArr);

  //去重
  const deduplicationData = [
    ...new Map(
      concatArr.map((item) => [
        item[props.options.configKey.departmentKey['departmentIdKey']],
        item
      ])
    ).values()
  ];
  // console.log('---------deduplicationData', deduplicationData);

  //过滤掉取消选择的数据
  checkedList.value = deduplicationData.filter((item) => {
    // console.log(
    //   !notChecked?.includes(item[props.options.configKey['departmentIdKey']]),
    //   notChecked,
    //   '----dddd',
    //   item[props.options.configKey.departmentKey['departmentIdKey']]
    // );
    return !notChecked?.includes(
      item[props.options.configKey.departmentKey['departmentIdKey']]
    );
  });
  // console.log(checkedList.value, '整合后的数据', concatArr, checked);
};

/**
 * @description: 树节点选择改变
 * @param {*} data
 * @param {*} checkedData
 * @return {*}
 */
const handleCheckChange = (data: any, checkedData: any) => {
  // console.log(data, checkedData, '选择数据');
  //未被勾选的数据id集合
  const notCheckedList = showTreeList.value
    .filter(
      (item) =>
        !checkedData.checkedKeys.includes(
          item[props.options.configKey.departmentKey['departmentIdKey']]
        )
    )
    .map((el) => el[props.options.configKey.departmentKey['departmentIdKey']]);
  // console.log(
  //   '已选的数据和未选择的数据',
  //   checkedData.checkedNodes,
  //   notCheckedList
  // );
  //当为选择的数据为0的时候,全选状态置为true
  if (notCheckedList.length === 0) {
    selectObj.value[currentSelectBo.value] = true;
  } else {
    selectObj.value[currentSelectBo.value] = false;
  }
  // console.log('---------checkedData.checkedNodes--', checkedData.checkedNodes);
  onUpdateHaveCheckedTreeList(checkedData.checkedNodes, notCheckedList);
};

//层级path
const levelPath = ref<any[]>([]);

//将数据转化为非树形结构-用于下钻到子级
const initPealPropsList = (nv) => {
  const dealPropsList = nv?.map((item) => {
    let copyItem = JSON.parse(JSON.stringify(item));
    delete copyItem[defaultProps.children];
    return {
      ...copyItem,
      copyChildren: item[defaultProps.children]
      // disabled: !item[defaultProps.children]?.length
    };
  });
  // console.log('initPealPropsList--------------', dealPropsList);
  // dealPropsList.forEach((item) => {
  //   item.disabled = disabledSuperiorIds.value.includes(
  //     item[props.options.configKey.departmentKey['departmentIdKey']]
  //   );
  // });
  return dealPropsList;
};
/**
 * @description: 树节点点击
 * @return {*}
 */
const handleNodeClick = (value: any, node: any, TreeNode: any, event: any) => {
  //如果当前层级已被选择,就不能进入到子级了
  if (
    checkedIds.value.includes(
      value[props.options.configKey.departmentKey['departmentIdKey']]
    )
  ) {
    return false;
  }

  console.log('点击节点--------', value.departmentId);

  if (!value[props.options.configKey.userIdKey]) {
    currentSelectBo.value = `key${
      value[props.options.configKey.departmentKey['departmentIdKey']]
    }`;
    //先判断当前对象下有没有对应节点的选中状态,如果没有就进行添加,
    if (!Object.keys(selectObj.value).includes(currentSelectBo.value)) {
      // debugger
      selectObj.value[currentSelectBo.value] = false;
    }

    levelPath.value.push({
      label: value[props.options.configKey.departmentKey['label']],
      id: value[props.options.configKey.departmentKey['departmentIdKey']],
      ...value
    });

    //获取部门下包含的人员,在部门下展示
    const includesCurrentDepartmentIdListPerson = getAllUserList.value.filter(
      (item) => {
        // console.log(
        //   item[
        //     props.options.configKey.departmentKey['departmentIdListKey']
        //   ].includes(value.departmentId),
        //   'item.departmentIdList.includes[value.departmentId]-------'
        // );
        return item.departmentIdList.includes(
          value[props.options.configKey.departmentKey['departmentIdKey']]
        );
      }
    );

    showTreeList.value = [
      ...((value?.copyChildren?.length &&
        initPealPropsList(value?.copyChildren)) ||
        []),
      ...includesCurrentDepartmentIdListPerson
    ];
  }
};
/**
 * @description: 删除单个
 * @param {*} item
 * @return {*}
 */
const handleDeleteItem = (item) => {
  //右侧已选的剔除掉当前删除的
  checkedList.value = checkedList.value.filter(
    (el) =>
      el[props.options.configKey.departmentKey['departmentIdKey']] !==
      item[props.options.configKey.departmentKey['departmentIdKey']]
  );

  //当前树节点中剔除掉当前删除的
  const treeHasChecked = treeRef.value
    .getCheckedKeys()
    .filter(
      (el) =>
        el !== item[props.options.configKey.departmentKey['departmentIdKey']]
    );
  // console.log(treeHasChecked);
  selectObj.value[currentSelectBo.value] = false;
  treeRef.value.setCheckedKeys(treeHasChecked);
};
/**
 * @description: 部门层级点击
 * @param {*} item
 * @param {*} index
 * @return {*}
 */
const handlePathClick = (item: any, index: number) => {
  console.log(item, '回退点击', levelPath.value, index);
  if (!item.id) {
    levelPath.value = [];
    //获取展示的数据
    showTreeList.value = initPealPropsList(props.options.treeList);
    currentSelectBo.value = 'selectAll';
    return false;
  }
  currentSelectBo.value = `key${
    item[props.options.configKey.departmentKey['departmentIdKey']]
  }`;
  levelPath.value = levelPath.value.slice(0, index + 1);

  //获取部门下包含的人员,在部门下展示
  const includesCurrentDepartmentIdListPerson = getAllUserList.value.filter(
    (el) => {
      return el.departmentIdList.includes(
        item[props.options.configKey.departmentKey['departmentIdKey']]
      );
    }
  );

  showTreeList.value = [
    ...((item?.copyChildren.length && initPealPropsList(item.copyChildren)) ||
      []),
    ...includesCurrentDepartmentIdListPerson
  ];
};

/**
 * @description: 处理显示树列表
 * @param {*} computed
 * @return {*}
 */
const showTreeList = ref<any[]>([]);
watch(
  () => props.options.treeList,
  (nv) => {
    showTreeList.value = initPealPropsList(nv);
    //回显上次勾选的数据
    checkedList.value = [...props.options.initLastCheckedList];
    // console.log('showTreeList-----------', showTreeList.value);
  },
  {
    deep: true
  }
);

const checkedIds = computed(() => {
  const ids = checkedList.value.map((item) => {
    return item[props.options.configKey.departmentKey['departmentIdKey']];
  });
  return ids;
});
watch(
  () => showTreeList.value,
  (nv) => {
    // console.log('showTreeList.value---------', nv);
    treeRef.value?.setCheckedKeys(checkedIds.value);
  },
  {
    deep: true
  }
);

const disabledSuperiorIds = ref<any[]>([]); //选择子级后要禁用的上级部门id
watch(
  () => checkedList.value,
  (nv) => {
    if (!nv.length) {
      selectObj.value.selectAll = false;
    }

    // //选择的人员或者部门关联的上级部门
    // let personSuperior = []; //人员的上级部门
    // let departmentSuperior = []; //部门的上级部门
    // personSuperior = nv
    //   .filter((item) => item[props.options.configKey['userIdKey']])
    //   .map(
    //     (el) => el[props.options.configKey.departmentKey['departmentIdListKey']]
    //   );
    // departmentSuperior = nv
    //   .filter((item) => !item[props.options.configKey['userIdKey']])
    //   .map((item) => item.pid);
    // disabledSuperiorIds.value = [...personSuperior, departmentSuperior]
    //   .flat(Infinity)
    //   .filter((item) => item !== '0');
    // // let checkedPersonWithDepartmentIdList = nv.map(item=>item.)

    // console.log('监听checkedList.value-------', nv);
  },
  {
    deep: true
  }
);
/**
 * @description: 清空
 * @return {*}
 */
const handleClear = () => {
  // selectObj.value.selectAll = false;
  //全部节点下的选择状态置为false
  Object.keys(selectObj.value).forEach((key) => {
    selectObj.value[key] = false;
  });

  // selectObj.value = {};
  checkedList.value = [];
  treeRef.value.setCheckedKeys([]);
};
/**
 * @description: 选中数据标题提示
 * @param {*} computed
 * @return {*}
 */
const checkedTotalTitle = computed(() => {
  const useListTotal = checkedList.value
    .map((item) => {
      return item[props.options.configKey['userIdKey']];
    })
    .filter((el) => el).length;
  // console.log(checkedList.value, '-----------', useListTotal);
  return `${checkedList.value.length - useListTotal}个部门,${useListTotal}人`;
});
defineExpose({
  OpenDialog
});
</script>
<style scoped lang="scss">
.tree-area {
  width: 100%;
}
.select-dialog__content {
  color: #172b4d;
  display: flex;
  justify-content: space-between;
  padding: 24px;
  .select-dialog__content-left {
    border-radius: 6px 0px 0px 6px;
    border: 1px solid #dfe1e6;
    width: 332px;
    height: 481px;
    .top-area {
      padding: 16px 24px;
      .user-search {
        margin-bottom: 16px;
      }
      .title {
        font-size: 14px;
        margin-bottom: 16px;
        :deep(.el-scrollbar__view) {
          display: flex;
          height: auto;
        }
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      overflow: hidden;
      height: 100%;
      .node-label {
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    :deep(.el-tree-node__content) {
      height: 48px;
    }
  }
  .select-dialog__content-right {
    width: 345px;
    height: 481px;
    border-radius: 0px 6px 6px 0px;
    border: 1px solid #dfe1e6;
    padding: 16px 24px;
    :deep(.el-scrollbar) {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          flex-direction: column;
        }
      }
    }
    .show-info {
      // display: flex;
      // justify-content: space-between;
      margin-bottom: 24px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .item-li {
      display: flex;
      align-items: center;
      height: 30px;
      margin-bottom: 16px;
      .logo-area {
        width: 30px;
        height: 30px;
        font-size: 12px;
        background: #1678ff;
        border-radius: 50%;
        margin-right: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
      .name-area {
        flex: 1;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
:deep(.path-item) {
  // color: red;
  span {
    display: inline-block !important;
    max-width: 80px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
.limit-notice {
  font-size: 12px;
  color: #a5adba;
}
// :deep(.is-checked) {
//   // background: red;
//   .el-tree-node:focus,.el-tree-node__content {
//     // background: red;
//     // pointer-events: none;
//     cursor: not-allowed;
//     // opacity: 0.5;
//   }
// }
.node-active {
  cursor: not-allowed;
}
</style>
