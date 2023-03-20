<template>
  <a-spin :spinning="loading">
    <a-form :form="form" layout="vertical" class="form">
      <div
        class="row"
        :style="{
          gridTemplateColumns: genGridTemplateColumns(),
          ...rowStyle,
        }"
        v-for="(row, i) in form.getFieldValue('keys')"
        :key="row"
      >
        <div class="col" v-for="(col, j) in columns" :key="j">
          <a-form-item v-if="!col.customRender" :label="i === 0 && col.label">
            <component
              :is="col.componentName"
              v-bind="col"
              v-decorator="genVDecorator(row, col)"
            ></component>
          </a-form-item>
          <div v-else :class="[i !== 0 && 'wrap']">
            <slot
              :name="col.customRender"
              v-bind="genRenderScope(col, i, j, row)"
            >
            </slot>
          </div>
        </div>
        <div v-if="showRemoveTrigger" :class="[i !== 0 && 'wrap']">
          <slot name="removeTrigger" v-bind="genRemoveSlotScope(row, i)">
            <a @click="remove(row)" href="javascript:;">删除</a>
          </slot>
        </div>
      </div>
    </a-form>
    <slot name="addTrigger" v-bind="genAddSlotScope()">
      <a-button block class="button-add" type="dashed" @click="add">
        <a-icon type="plus" /> {{ addButtonText }}
      </a-button>
    </slot>
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
    showRemoveTrigger: {
      type: Boolean,
      default: true,
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
    update(params = {}) {
      const { list } = params;
      if (!Array.isArray(list)) return;
      const data = {};
      list.forEach((item, i) => {
        [...Object.entries(item)].forEach(([key, value]) => {
          data[key] = data[key] || [];
          data[key][i] = value;
        });
      });
      this.form.setFieldsValue({
        keys: this.form.getFieldValue("keys"),
        ...data,
      });
    },
    init(params = {}) {
      const { list } = params;
      if (Array.isArray(list) && list.length) {
        list.forEach((_, i) => {
          this.add();
          if (i === list.length - 1) {
            this.$nextTick(() => {
              const values = list.reduce((values, record, i) => {
                for (let [key, value] of Object.entries(record)) {
                  values[key] = values[key] || [];
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
    genRenderScope(col, rowIndex, colIndex, row) {
      return {
        ...col,
        rowIndex,
        colIndex,
        getCurrentRecord: this.genRecord.bind(this, row),
        getRecords: this.genRecords.bind(this),
      };
    },
    genAddSlotScope() {
      return {
        addCallback: this.add.bind(this),
      };
    },
    genRemoveSlotScope(row, index) {
      return {
        index,
        removeCallback: this.remove.bind(this, row),
        getCurrentRecord: this.genRecord.bind(this, row),
      };
    },
    genVDecorator(row, col) {
      const path = `${col.dataIndex}[${row}]`;
      const options = {
        ...col,
      };
      return [path, options];
    },
    genGridTemplateColumns() {
      return new Array(this.columns.length)
        .fill(0)
        .map(() => "1fr")
        .concat(this.showRemoveTrigger ? "auto" : "")
        .join(" ");
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
        records: this.genRecords(),
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
        records: this.genRecords(),
      });
    },
    validateFieldsAndScroll(cb) {
      this.form.validateFieldsAndScroll((err, values) => {
        const records = [];
        const { keys, ...vals } = values;
        for (let [field, vs = []] of Object.entries(vals)) {
          vs.forEach((value, i) => {
            records[i] = records[i] || {};
            records[i][field] = value;
          });
        }
        cb(err, this.genRecords());
      });
    },
    validateFields(cb) {
      this.form.validateFields((err, values) => {
        const records = [];
        const { keys, ...vals } = values;
        for (let [field, vs = []] of Object.entries(vals)) {
          vs.forEach((value, i) => {
            records[i] = records[i] || {};
            records[i][field] = value;
          });
        }
        cb(err, this.genRecords());
      });
    },
    genRecords() {
      const { keys, ...values } = this.form.getFieldsValue();
      return keys.reduce((records, _, i) => {
        return records.concat(
          [...Object.entries(values)].reduce((record, [field, vs]) => {
            return {
              ...record,
              [field]: vs[i],
            };
          }, {})
        );
      }, []);
    },
    genRecord(key) {
      const { keys, ...vals } = this.form.getFieldsValue();
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
  .wrap {
    position: relative;
    top: 6px;
  }
}
</style>
