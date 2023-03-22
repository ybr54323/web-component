import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import antv, {
  Form,
  Input,
  Select,
  Checkbox,
  TreeSelect,
  DatePicker,
} from "ant-design-vue";
// import sinon from "sinon";

import { TableForm } from "lib";
const localVue = createLocalVue();
localVue.use(antv);

const genColumns = (len) => {
  return new Array(len).fill(0).map(() => {
    return {
      label: "name",
      dataIndex: "name",
      componentName: "a-input",
      rules: [{ required: true }],
    };
  });
};
describe("TableForm.vue", () => {
  it("无传入list, .row长度为0", () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
    });
    expect(wrapper.find(".row").exists()).toBeFalsy();
  });
  it(".row的长度等于初始化时所传入的list长度", async () => {
    const columns = genColumns(10);
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: {
        columns,
      },
    });
    await wrapper.vm.$nextTick();
    const list = [{ name: "a" }, { name: "b" }];
    wrapper.vm.init({ list });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(2);
  });
  it("a-form-item的个数等于prop.columns.length * init时传入的list.length", async () => {
    const columns = genColumns(10);
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: {
        columns,
      },
    });
    await wrapper.vm.$nextTick();
    const list = [{ name: "a" }, { name: "b" }];
    wrapper.vm.init({ list });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents(Form.Item).length).toBe(10 * 2);
  });
  it("触发了add事件，不影响初始化时传入的list", () => {
    const outsideList = [{ name: "a" }];
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { list: genColumns(1) },
    });
    wrapper.vm.init({ list: outsideList });
    const addButton = wrapper.find(".button-add");
    addButton.trigger("click");
    expect(outsideList.length).toBe(1);
    expect(wrapper.emitted().add.length).toBe(1);
  });
  it("点击了新增按钮，会触发add事件，事件会抛出对应的值，并且.row的长度等于点击的次数", async () => {
    const wrapper = mount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
    });
    const btn = wrapper.find(".button-add");
    expect(btn.exists()).toBeTruthy();
    btn.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(1);
  });
  it("触发了remove事件，但不影响初始化时传入的list", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
    });
    const list = [{ name: "a" }];
    wrapper.vm.init({ list });
    wrapper.vm.remove(0);
    await wrapper.vm.$nextTick();
    expect(list.length).toBe(1);
    expect(wrapper.findAll(".row").length).toBe(0);
  });
  it("当prop.maxLength=0,触发了add事件,不会自增", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1), maxLength: 0 },
    });
    wrapper.vm.add();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(0);
  });
  it("当prop.minLength=1,触发了remove事件,不会自减", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1), minLength: 1 },
    });

    wrapper.vm.init({ list: [{ name: "a" }] });
    wrapper.vm.remove(0);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(1);
  });

  it(".row数最低是1", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
    });

    wrapper.vm.init({ list: [{ name: "a" }] });
    wrapper.vm.remove(0);
    wrapper.vm.remove(0);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(0);
  });
  it("验证传入和传出值是相等的", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
    });

    wrapper.vm.init({ list: [{ name: "a" }] });
    await wrapper.vm.$nextTick();
    wrapper.vm.validateFields((e, values) => {
      expect(values).toEqual([{ name: "a" }]);
    });
  });
  it("验证校验正常", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
    });

    wrapper.vm.init({ list: [{ name: "" }] });
    await wrapper.vm.$nextTick();
    wrapper.vm.validateFields((e) => {
      expect(e).not.toBe(null);
    });
  });
  it("校验删除一行记录后，抛出的列表的值是正确的", async () => {
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
    });

    wrapper.vm.init({ list: [{ name: "a" }, { name: "b" }] });
    await wrapper.vm.remove(1);
    await wrapper.vm.$nextTick();
    wrapper.vm.validateFields((e, values) => {
      expect(e).toBe(null);
      expect(values).toEqual([{ name: "a" }]);
    });
  });

  it("能正常渲染各类表单项", async () => {
    const genColumnsWithComponentName = (name) => {
      return {
        dataIndex: name,
        label: name,
        componentName: name,
      };
    };
    const columns = [
      "a-input",
      "a-select",
      "a-checkbox",
      "a-tree-select",
      "a-date-picker",
    ].map(genColumnsWithComponentName);
    const wrapper = shallowMount(TableForm, {
      localVue,
      propsData: { columns },
    });
    wrapper.vm.init({ list: [{}] });
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(Input).exists()).toBeTruthy();
    expect(wrapper.findComponent(Select).exists()).toBeTruthy();
    expect(wrapper.findComponent(Checkbox).exists()).toBeTruthy();
    expect(wrapper.findComponent(TreeSelect).exists()).toBeTruthy();
    expect(wrapper.findComponent(DatePicker).exists()).toBeTruthy();
  });

  it("验证removeSlot有效", async () => {
    const wrapper = mount(TableForm, {
      localVue,
      propsData: { columns: genColumns(1) },
      scopedSlots: {
        removeSlot: `
        
        <template slot-scope="{ removeCallback }">
          <span class="remove-slot" @click="removeCallback">test-remove-slot</span>
        </template>
        `,
      },
    });
    wrapper.vm.init({ list: [{ name: "a" }] });
    await wrapper.vm.$nextTick();
    const removeSlot = wrapper.find(".remove-slot");
    removeSlot.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(0);
  });

  it("验证removeRender有效", async () => {
    const wrapper = mount(TableForm, {
      localVue,
      propsData: {
        columns: genColumns(1),
        removeRender: (h, params) => {
          return h(
            "span",
            {
              class: "test-remove-render",
              attrs: {},
              on: {
                click: () => {
                  expect(params.rowIndex).toBe(0);
                  expect(params.removeCallback).toBeDefined();
                  expect(params.getCurrentRecord).toBeDefined();
                  return params.removeCallback();
                },
              },
            },
            "test-remove-render"
          );
        },
      },
    });
    wrapper.vm.init({ list: [{ name: "a" }] });
    await wrapper.vm.$nextTick();
    let removeRenderOutcome;
    expect(
      (removeRenderOutcome = wrapper.find(".test-remove-render")).exists()
    ).toBeTruthy();
    removeRenderOutcome.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".row").length).toBe(0);
  });
  it("验证column.slot", async () => {
    const wrapper = mount(TableForm, {
      localVue,
      propsData: {
        columns: [
          {
            label: "name",
            dataIndex: "name",
            componentName: "a-input",
            slot: "name",
          },
        ],
      },
      scopedSlots: {
        name: `
      
      <template slot-scope="{ getCurrentRecord }">
      <span class="test-column-slot">getCurrentRecord().name </span>
      </template>
      `,
      },
    });
    wrapper.vm.init({ list: [{ name: "test-column-slot" }] });
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('test-column-slot');
    expect(wrapper.findAll(".test-column-slot").length).toBe(1);
  });

  it("验证column.render", async () => {
    const wrapper = mount(TableForm, {
      localVue,
      propsData: {
        columns: [
          {
            label: "name",
            dataIndex: "name",
            componentName: "a-input",
            render(h, props) {
              expect(props.rowIndex).toBeDefined();
              expect(props.colIndex).toBeDefined();
              expect(props.getRecords).toBeDefined();
              expect(props.getCurrentRecord).toBeDefined();

              return h("span", {}, [props.rowIndex + "-" + props.colIndex]);
            },
          },
        ],
      },
    });
    wrapper.vm.init({ list: [{ name: "test-column-render" }] });
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain("0-0");
  });
});
