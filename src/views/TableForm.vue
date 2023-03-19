<template>
  <div class="about">
    <table-form ref="form" :columns="columns">
      <template
        slot="removeTrigger"
        slot-scope="{ currentKey, deleteCallback, getCurrentRecord }"
      >
        <button @click="getCurrentRecord">
          {{ currentKey }}
        </button>
      </template>
    </table-form>
  </div>
</template>
<script>
import { TableForm } from "lib";
export default {
  name: "TableFormPage",
  components: {
    TableForm,
  },
  data() {
    return {
      columns: [
        {
          label: "name",
          dataIndex: "name",
          componentName: "a-input",
          rules: [{ required: true }],
        },
        {
          label: "age",
          dataIndex: "age",
          componentName: "a-input",
        },
      ],
      list: [
        {
          name: "ybr",
          age: 1,
        },
        {
          age: 2,
        },
        {
          name: "test",
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.form.init({
      //   list: this.list,
      // });
    });
  },
};
</script>
