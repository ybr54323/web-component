<template>
  <div class="about">
    <table-form :showRemoveTrigger="false" ref="form" :columns="columns">
      <template slot="age" slot-scope="props">
        <a href="javascript:;" @click="up(props)">上移</a>
        <a href="javascript:;" @click="down(props)"> 下移</a>
      </template>
      <!-- <template
        slot="removeTrigger"
        slot-scope="{ currentKey, removeCallback }"
      >
        <button @click="removeCallback">
          test remove trigger {{ currentKey }}
        </button>
      </template> -->
      <!-- <a
        slot="addTrigger"
        href="javascript:;"
        slot-scope="{ addCallback }"
        @click="addCallback"
        >test add trigger</a
      > -->
    </table-form>
    <a-button @click="submit">submit</a-button>
    <a-button @click="reset">test reset</a-button>
  </div>
</template>
<script>
import { TableForm } from "lib";
// import { TableForm } from "../../dist/@ybr/web-component.umd";
// import "../../dist/@ybr/web-component.css";

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
          customRender: "age",
        },
        {
          label: "TestSelect",
          dataIndex: "sex",
          options: [
            { label: "male", value: 1 },
            { label: "female", value: 2 },
          ],
          componentName: "a-select",
        },
        {
          label: "TestTreeSelect",
          componentName: "a-tree-select",
          label: "tree select",
          dataIndex: "treeselect",
          treeData: [
            {
              label: "a",
              value: 1,
            },
            {
              label: "b",
              selectable: false,
              children: [{ label: "c", value: 2 }],
            },
          ],
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
      this.$refs.form.init({
        list: this.list,
      });
    });
  },
  methods: {
    submit() {
      this.$refs.form.validateFields((e, values) => {
        console.warn(e, values);
      });
    },

    reset() {
      this.$refs.form.reset();
    },
    up(props) {
      const { getCurrentRecord, getRecords, rowIndex } = props;
      const records = getRecords();
      const record = getCurrentRecord();
      if (rowIndex > 0) {
        records[rowIndex] = records[rowIndex - 1];
        records[rowIndex - 1] = record;
        this.$refs.form.update({ list: records });
      }
    },
    down(props) {
      const { getCurrentRecord, getRecords, rowIndex } = props;
      const records = getRecords();
      const record = getCurrentRecord();
      if (rowIndex < records.length - 1) {
        records[rowIndex] = records[rowIndex + 1];
        records[rowIndex + 1] = record;
        this.$refs.form.update({ list: records });
      }
    },
  },
};
</script>
