<template>
  <a-spin :spinning="loading">
    <a-form :form="form" layout="vertical" class="form">
      <div
        class="row"
        :style="{
          gridTemplateColumns: `repeat(${columns.length + 1}, auto)`,
          ...rowStyle,
        }"
        v-for="row in form.getFieldValue('keys')"
        :key="row"
      >
        <div class="col" v-for="(col, j) in columns" :key="j">
          <a-form-item :label="row === 0 && col.label">
            <component
              :is="col.componentName"
              v-bind="col"
              v-decorator="genVDecorator(row, col)"
            ></component>
          </a-form-item>
        </div>
        <slot name="removeTrigger" v-bind="genRemoveSlotScope(row)">
          <a @click="remove(row)" href="javascript:;">删除</a>
        </slot>
      </div>
    </a-form>
    <slot name="addTrigger" v-bind="genAddSlotScope()">
      <a-button class="button-add" type="dashed" @click="add">
        <a-icon type="plus" /> {{ addButtonText }}
      </a-button>
    </slot>
    <a-button @click="handleSubmit">submit</a-button>
  </a-spin>
</template>

<script>
export default {
  name: "TableForm",
  props: {
    rowStyle: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    addButtonText: {
      type: String,
      default: "新增",
    },
    maxLength: {
      type: Number,
      default: Infinity,
    },
    minLength: {
      type: Number,
      default: -Infinity,
    },
  },
  data() {
    const form = this.$form.createForm(this, { name: "dynamic_form_item" });
    form.getFieldDecorator("keys", { initialValue: [], preserve: true });
    return {
      loading: false,
      id: 0,
      form,
    };
  },

  methods: {
    init(params = {}) {
      const { list } = params;
      if (Array.isArray(list) && list.length) {
        list.forEach((_, i) => {
          this.add();
          if (i === list.length - 1) {
            this.$nextTick(() => {
              const values = list.reduce((values, record, i) => {
                for (let [key, value] of Object.entries(record)) {
                  values[key] = values[key] ?? [];
                  values[key][i] = value;
                }
                return values;
              }, {});
              this.form.setFieldsValue(values);
            });
          }
        });
      }
      return this.reset;
    },
    reset() {
      return this.form.resetFields();
    },
    genAddSlotScope() {
      return {
        addCallback: this.add.bind(this),
      };
    },
    genRemoveSlotScope(row) {
      return {
        currentKey: row,
        deleteCallback: this.remove.bind(this, row),
        getCurrentRecord: () => {
          return this.genRecord(row);
        },
      };
    },
    genVDecorator(row, col) {
      const path = `${col.dataIndex}[${row}]`;
      const options = {
        ...col,
      };
      return [path, options];
    },
    remove(k) {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      if (keys.length <= this.minLength) return;
      if (keys.length === 0) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
      this.$emit("del", {
        records: this.genRecords(this.form.getFieldsValue()),
      });
    },

    add() {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      if (keys.length >= this.maxLength) return;
      const nextKeys = keys.concat(this.id++);
      form.setFieldsValue({
        keys: nextKeys,
      });
      this.$emit("add", {
        records: this.genRecords(this.form.getFieldsValue()),
      });
    },
    validateFields(cb) {
      this.form.validateFields((err, values) => {
        const records = [];
        const { keys, ...vals } = values;
        for (let [field, vs = []] of Object.entries(vals)) {
          vs.forEach((value, i) => {
            records[i] = records[i] ?? {};
            records[i][field] = value;
          });
        }
        cb(err, this.genRecords(values));
      });
    },
    handleSubmit() {
      this.validateFields((err, records) => {
        console.warn(err, records);
      });
    },
    genRecords(values) {
      const { keys, ...vals } = values;
      return keys.reduce((records, _, i) => {
        return records.concat(
          [...Object.entries(vals)].reduce((record, [field, vs]) => {
            return {
              ...record,
              [field]: vs[i],
            };
          }, {})
        );
      }, []);
    },
    genRecord(key) {
      const { keys, ...vals } = this.form.getFieldsError();
      const i = keys.indexOf(key);
      return [...Object.entries(vals)].reduce((record, [field, vs]) => {
        return {
          ...record,
          [field]: vs[i],
        };
      }, {});
    },
  },
};
</script>
<style lang="less" scoped>
.form {
  .row {
    display: grid;
    gap: 16px;
    align-items: flex-start;
    &:first-child {
      align-items: center;
    }
  }
}
</style>
