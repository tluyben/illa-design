import { Meta, Story } from "@storybook/react"
import { RateProps, Rate } from "../src"
import { Space } from "@illa-design/react"

export default {
  title: "DATA INPUT/Rate",
  component: Rate,
  argTypes: {
    character: {
      control: false,
    },
  },
} as Meta

const Template: StoryFn<RateProps> = (args) => {
  return (
    <Space size={"large"} direction={"vertical"} style={{ marginTop: 50 }}>
      <Rate {...args} />
      <Rate {...args} tooltips={[]} />
    </Space>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tooltips: ["👌", "❤️", "🤔", "😊", "😄"],
}
