import React from "react";

import Button from "@/components/Button";

// 버튼 스토리 그룹 생성
export default {
  title: "Global/Button",
  component: Button
};

// 버튼 스토리 작성
const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onClick: () => console.log("Button clicked"),
  color: "primary",
  children: "Primary Button"
};

export const Secondary = Template.bind({});
Secondary.args = {
  onClick: () => console.log("Button clicked"),
  color: "secondary",
  children: "Secondary Button"
};

export const Danger = Template.bind({});
Danger.args = {
  onClick: () => console.log("Button clicked"),
  color: "danger",
  children: "Danger Button"
};
