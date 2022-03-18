import * as React from "react"

import { mount, unmount } from "@cypress/react"
import "@testing-library/cypress"
import { ReactNode } from "react"
import { TabPane, Tabs } from "@illa-design/tabs"

const tabArr: {
  key: string
  title: string | ReactNode
  content: string
  disabled?: boolean
}[] = [
  {
    key: "1",
    title: "tab 01",
    content: "tab content 01",
  },
  { key: "2", title: "tab 02", content: "tab content 02", disabled: true },
  { key: "3", title: "tab 03", content: "tab content 03" },
  {
    key: "4",
    title: "tab 04",
    content: "tab content 04",
  },
  { key: "5", title: "tab 05", content: "tab content 05" },
  { key: "6", title: "tab 06", content: "tab content 06" },
]

it("Tabs renders correctly", () => {
  mount(
    <Tabs placeholder={"tabs"} defaultActiveKey={"3"}>
      {tabArr?.map((item) => {
        return (
          <TabPane title={item.title} key={item.key}>
            {item.content}
          </TabPane>
        )
      })}
    </Tabs>,
  )
  expect(cy.findByPlaceholderText("tabs")).exist
  unmount()
})

it("Tabs renders with next and pre", () => {
  mount(
    <Tabs style={{ width: 200, height: 300 }} placeholder={"tabs"}>
      {tabArr?.map((item) => {
        return (
          <TabPane title={item.title} key={item.key}>
            {item.content}
          </TabPane>
        )
      })}
    </Tabs>,
  )
  expect(cy.findByTitle("PreIcon")).exist
  cy.findByTitle("PreIcon")
    .parent()
    .parent()
    .should("have.css", "color", "rgb(194, 194, 194)")
  expect(cy.findByTitle("NextIcon")).exist
  cy.findByTitle("NextIcon").parent().trigger("click")
  cy.wait(2000)
  cy.findByTitle("NextIcon")
    .parent()
    .parent()
    .parent()
    .children()
    .first()
    .next()
    .invoke("scrollLeft")
    .should("gte", 0)

  cy.findByTitle("PreIcon").parent().trigger("click")
  cy.wait(2000)
  cy.findByTitle("NextIcon")
    .parent()
    .parent()
    .parent()
    .children()
    .first()
    .next()
    .invoke("scrollLeft")
    .should("equal", 0)
  cy.findByTitle("NextIcon")
    .parent()
    .parent()
    .parent()
    .children()
    .first()
    .next()
    .scrollTo("right")
  cy.findByTitle("NextIcon")
    .parent()
    .parent()
    .should("have.css", "color", "rgb(194, 194, 194)")
  unmount()
})

it("Tabs renders with scroll", () => {
  mount(
    <Tabs style={{ width: 200, height: 300 }} placeholder={"tabs"}>
      {tabArr?.map((item) => {
        return (
          <TabPane title={item.title} key={item.key}>
            {item.content}
          </TabPane>
        )
      })}
    </Tabs>,
  )
  cy.findByTitle("NextIcon")
    .parent()
    .parent()
    .parent()
    .children()
    .first()
    .next()
    .scrollTo("right")
  cy.findByTitle("NextIcon")
    .parent()
    .parent()
    .should("have.css", "color", "rgb(194, 194, 194)")
  unmount()
})
