// 不想逐一引入和安装了，默认用户是在vue2+antv1.7.8的环境下使用
import Vue from "vue";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Radio,
//   Checkbox,
// } from "ant-design-vue";
// import "ant-design-vue/dist/antd.css";

Vue.use(antv);

import TableFrom from "./src/index.vue";
TableFrom.install = (Vue) => {
  // Vue.use(Form);
  // Vue.use(Form.Item);
  // Vue.use(Input);
  // Vue.use(Input.Password);
  // Vue.use(Input.TextArea);

  // Vue.use(Select);

  // Vue.use(Select.Option);
  // Vue.use(Radio);

  // Vue.use(Radio);
  // Vue.use(InputNumber);
  // Vue.use(Checkbox)

  // Vue.use(Checkbox.Group)
  Vue.component(TableFrom.name, TableFrom);
};
export default TableFrom;
