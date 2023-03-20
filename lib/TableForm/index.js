// 不想逐一引入和安装了，默认用户是在vue2+antv1.7.8的环境下使用
import TableFrom from "./src/index.vue";
TableFrom.install = (Vue) => {
  Vue.component(TableFrom.name, TableFrom);
};
export default TableFrom;
