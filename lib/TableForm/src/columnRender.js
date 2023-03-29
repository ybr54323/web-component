export default {
  name: "ColumnRender",
  props: {
    render: Function,
    column: Object,
    rowIndex: Number,
    colIndex: Number,
    getCurrentRecord: Function,
    getRecords: Function,
    removeCallback: Function,
    setFieldValue: Function,
  },
  render(h) {
    return this.$props.render(h, this.$props);
  },
};
