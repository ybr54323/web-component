<template>
  <div>
    <a-form :form="form" @submit="handleSubmit" layout="vertical" class="form">
      <div
        :style="{
          gridTemplateColumns: `repeat(${columns.length + 1}, auto)`,
        }"
        class="row"
        v-for="(row, i) in form.getFieldValue('keys')"
        :key="row"
      >
        <div class="col" v-for="(col, j) in columns" :key="j">
          <a-form-item label="test">
            <a-input
              v-decorator="[
                `list[${row}][${col.dataIndex}]`,

                {
                  validateTrigger: ['change', 'blur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message:
                        'Please input passenger\'s name or delete this field.',
                    },
                  ],
                },
              ]"
            ></a-input>
          </a-form-item>
        </div>
        <a @click="remove(i)" href="javascript:;">删除</a>
      </div>
    </a-form>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 60%" @click="add">
        <a-icon type="plus" /> Add field
      </a-button>
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="primary" html-type="submit" @click="handleSubmit">
        Submit
      </a-button>
    </a-form-item>
  </div>
</template>

<script>
let id = 0;
export default {
  name: "TableForm",
  props: {
    columns: {
      type: Array,
      default: () => [
        {
          dataIndex: "name",
        },
        {
          dataIndex: "age",
        },
      ],
    },
  },
  data() {
    return {
      //   formItemLayout: {
      //     labelCol: {
      //       xs: { span: 24 },
      //       sm: { span: 4 },
      //     },
      //     wrapperCol: {
      //       xs: { span: 24 },
      //       sm: { span: 20 },
      //     },
      //   },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      //   form: this.$form.createForm(this, { name: "dynamic_form_item" }),
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "dynamic_form_item" });
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  methods: {
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
    },

    add() {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names } = values;
          console.log("Received values of form: ", values);
          console.log(
            "Merged values:",
            keys.map((key) => names[key])
          );
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.form {
  .row {
    display: grid;
    align-items: center;
  }
}
</style>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
