import { shallowMount } from "@vue/test-utils";
import { TableForm } from "lib";

describe("TableForm.vue", () => {
  it("初始化时，长度为0", () => {
    const wrapper = shallowMount(TableForm, { propsData: { list: [] } });
    expect(wrapper.vm.$props.list.length).toBe(0);
  });
  it("accept 'columns' prop, and render a number of the a-form-item equals to the prop.columns.length", () => {
    const columns = [
      {
        label: "名称",
        type: "input",
        dataIndex: "name",
      },
    ];
    // const wrapper = shallowMount(TableForm, { propsData: { columns } });
    // expect(wrapper.findComponent("a-form-item"));
  });
  it("no side-effect, change of inner list do not effect outside's list", () => {
    const outsideList = [1, 2, 3];
    const wrapper = shallowMount(TableForm);
    wrapper.vm.init({ list: outsideList });
    wrapper.vm.list.push(4);
    expect(outsideList.length).toBe(3);
  });
  it("组件的prop.list长度等于传入时的长度");
  it("组件渲染出的a-form个数等于prop.list的长度");

  it(
    "未传入prop.maxLength时，点击增加按钮，触发add事件，并且组件内的prop.list长度自增"
  );

  it(
    "未传入prop.minLength时，点击删除按钮，触发remove事件，并且组件内的prop.list长度自减"
  );

  it("长度大于prop.maxLength时，不能再触发增加");
  it("长度小于prop.minLength时，不能再触发减少");

  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
  it("vm.list.length=0,after call vm.reset");
});
