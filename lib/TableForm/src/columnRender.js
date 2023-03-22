export default {
  name: "ColumnRender",
  functional: true,
  props: {
    render: Function,
    column: Object,
    rowIndex: Number,
    colIndex: Number,
    getCurrentRecord: Function,
    getRecords: Function,

    removeCallback: Function,
  },
  render(h, ctx) {
    const params = {};
    for (let [key, value] of Object.entries(ctx.props)) {
      if (value !== void 0) {
        params[key] = value;
      }
    }

    return ctx.props.render(h, params);
  },
};
