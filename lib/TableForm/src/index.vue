<template>
  <a-spin :spinning="loading">
    {{ form.getFieldsValue() }}

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
          <div v-if="'render' in col" :class="[i == 0 && 'column-wrap']">
            <column-render
              :render="col.render"
              v-bind="genRenderScope(col, i, j)"
            ></column-render>
          </div>
          <div v-else-if="'slot' in col" :class="[i == 0 && 'column-wrap']">
            <slot :name="col.slot" v-bind="genRenderScope(col, i, j)"> </slot>
          </div>
          <a-form-item v-else :label="i === 0 && col.label">
            <component
              :is="col.componentName"
              v-bind="col"
              v-decorator="genVDecorator(i, col)"
            ></component>
          </a-form-item>
        </div>
        <div
          v-if="showRemoveTrigger"
          :class="[i === 0 && 'remove-trigger-wrap']"
        >
          <column-render
            v-if="removeRender"
            :render="removeRender"
            v-bind="genRemoveSlotScope(row, i)"
          ></column-render>
          <slot v-else name="removeSlot" v-bind="genRemoveSlotScope(row, i)">
            <a class=".remove-btn" @click="remove(row)" href="javascript:;"
              >删除</a
            >
          </slot>
        </div>
      </div>
    </a-form>
    <slot name="addSlot" v-bind="genAddSlotScope()">
      <a-button block class="button-add" type="dashed" @click="add">
        <a-icon type="plus" /> {{ addButtonText }}
      </a-button>
    </slot>
  </a-spin>
</template>

<script>
import ColumnRender from "./columnRender";
export default {
  name: "TableForm",
  components: { ColumnRender },
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
    removeRender: Function,
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
                  values[key] = values[key] || [];
                  values[key][i] = value;
                }
                return values;
              }, {});
              // 有报错，不影响使用，暂时无法修复
              this.form.setFieldsValue(values);
            });
          }
        });
      }
      return this.reset;
    },

    reset() {
      this.id = 0;
      return this.form.resetFields();
    },
    genRenderScope(column, rowIndex, colIndex) {
      return {
        column,
        rowIndex,
        colIndex,
        getCurrentRecord: this.genRecord.bind(this, rowIndex),
        getRecords: this.genRecords.bind(this),
        setFieldValue: (value) => {
          let values = this.form.getFieldsValue([column.dataIndex]);
          if (!values[column.dataIndex]) {
            this.form.getFieldDecorator(column.dataIndex, { initialValue: [] });
            values = this.form.getFieldsValue([column.dataIndex]);
          }
          values[column.dataIndex][rowIndex] = value;
          this.form.setFieldsValue({
            [column.dataIndex]: values[column.dataIndex],
          });
        },
      };
    },
    genAddSlotScope() {
      return {
        addCallback: this.add.bind(this),
      };
    },
    genRemoveSlotScope(row, rowIndex) {
      return {
        rowIndex,
        removeCallback: this.remove.bind(this, row),
        getCurrentRecord: this.genRecord.bind(this, rowIndex),
      };
    },
    genVDecorator(rowIndex, col) {
      const path = `${col.dataIndex}[${rowIndex}]`;
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
      const { keys } = form.getFieldsValue();
      if (keys.length <= this.minLength) return;
      const index = keys.indexOf(k);
      keys.splice(index, 1);
      form.setFieldsValue({ keys });
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
      return keys.reduce((records, key, i) => {
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
    genRecord(rowIndex) {
      const { keys, ...vals } = this.form.getFieldsValue();
      return [...Object.entries(vals)].reduce((record, [field, vs]) => {
        return {
          ...record,
          [field]: vs[rowIndex],
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
    .col {
      &:has(.column-wrap) {
        padding-top: 29px;
      }
    }
  }

  .remove-trigger-wrap {
    padding-top: 29px;
  }
}
</style>
