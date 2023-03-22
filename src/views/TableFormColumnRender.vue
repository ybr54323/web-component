<template>
  <div class="about">
    <table-form ref="form" :columns="columns"> </table-form>
    <a-button @click="submit">submit</a-button>
    <a-button @click="reset">test reset</a-button>
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
          render(h, props) {
            const column = JSON.stringify(props.column);
            const record = JSON.stringify(props.getCurrentRecord());
            const records = JSON.stringify(props.getRecords());
            return h("div", [
              h("details", [h("summary", "props.rowIndex"), props.rowIndex]),
              h("details", [h("summary", "props.colIndex"), props.colIndex]),

              h("details", [h("summary", "props.column"), column]),

              h("details", [h("summary", "props.getCurrentRecord()"), record]),

              h("details", [h("summary", "props.getRecords()"), records]),
            ]);
          },
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
        this.$refs.form.reset();
        this.$refs.form.init({ list: records });
      }
    },
    down(props) {
      const { getCurrentRecord, getRecords, rowIndex } = props;
      const records = getRecords();
      const record = getCurrentRecord();
      if (rowIndex < records.length - 1) {
        records[rowIndex] = records[rowIndex + 1];
        records[rowIndex + 1] = record;
        this.$refs.form.reset();
        this.$refs.form.init({ list: records });
      }
    },
    removeRender(h, params) {
      console.log(params);
      return h("div", [JSON.stringify(params)]);
    },
  },
};
</script>
