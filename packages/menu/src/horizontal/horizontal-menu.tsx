import {
  forwardRef,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { MenuProps, SubMenuProps } from "../interface"
import {
  applyActionContainerStyle,
  applyHorizontalSubMenuItemContainer,
  horizontalMenuContainerStyle,
  horizontalMenuListContainerStyle,
  horizontalSubMenuIcon,
  horizontalSubMenuLabel,
} from "./style"
import { applyBoxStyle, deleteCssProps } from "@illa-design/theme"
import { MenuContext } from "../menu-context"
import { HorizontalSubMenu } from "./horizontal-sub-menu"
import { HorizontalMenuItem } from "./horizontal-menu-item"
import { DropList, DropListItem } from "@illa-design/dropdown"
import { mergeRefs, useMergeValue } from "@illa-design/system"
import { NextIcon, PreviousIcon } from "@illa-design/icon"
import useMeasure from "react-use-measure"
import { AnimatePresence, motion } from "framer-motion"

export const HorizontalMenu = forwardRef<HTMLDivElement, MenuProps>(
  (props, ref) => {
    const {
      defaultOpenedSubMenuValues,
      defaultSelectedValues,
      openedSubMenuValues,
      selectedValues,
      colorScheme = "blue",
      onClickSubMenu,
      onClickMenuItem,
      items,
      ...otherProps
    } = props

    const [finalOpenedSubMenuValues, setFinalOpenedSubMenuValues] =
      useMergeValue<string[]>([], {
        defaultValue: defaultOpenedSubMenuValues,
        value: openedSubMenuValues,
      })

    const [finalSelectedValues, setFinalSelectedValues] = useMergeValue<
      string[]
    >([], {
      defaultValue: defaultSelectedValues,
      value: selectedValues,
    })

    const defaultSelectedSubMenu: string[] = []
    const selectedSubMenu: string[] = []

    items?.forEach((item) => {
      if ("children" in item || "subItems" in item || "opened" in item) {
        const subMenu = item as SubMenuProps
        subMenu.subItems?.forEach((subItem) => {
          if (defaultSelectedValues?.includes(subItem.value)) {
            defaultSelectedSubMenu.push(subMenu.value)
          }
          if (selectedValues?.includes(subItem.value)) {
            selectedSubMenu.push(subMenu.value)
          }
        })
      }
    })

    const [finalSelectedSubMenu, setFinalSelectedSubMenu] = useMergeValue<
      string[]
    >([], {
      defaultValue: defaultSelectedValues ? defaultSelectedSubMenu : undefined,
      value: selectedValues ? selectedSubMenu : undefined,
    })

    const [leftScroll, setLeftScroll] = useState<boolean>(false)
    const [rightScroll, setRightScroll] = useState<boolean>(false)

    const [containerBoundRef, containerBound] = useMeasure()
    const containerRef = useRef<HTMLDivElement>()

    useEffect(() => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = containerRef.current
        if (
          clientWidth < scrollWidth &&
          scrollLeft + clientWidth < scrollWidth
        ) {
          if (!rightScroll) {
            setRightScroll(true)
          }
        }
      }
    }, [containerBound.width, rightScroll])

    const c: ReactNode[] | undefined = items?.map((item, index, array) => {
      if ("children" in item || "subItems" in item || "opened" in item) {
        const subMenu = item as SubMenuProps

        const subItems = subMenu.subItems?.map((subItem, index, array) => {
          return (
            <DropListItem
              value={subItem.value}
              key={subItem.value}
              disabled={subItem.disabled}
              title={
                <div
                  css={applyHorizontalSubMenuItemContainer(
                    colorScheme,
                    subItem.selected ??
                      finalSelectedValues.some((v) => v === subItem.value),
                    subItem.disabled,
                  )}
                >
                  {subItem.icon && (
                    <span css={horizontalSubMenuIcon}>{subItem.icon}</span>
                  )}
                  {subItem.label && (
                    <span css={horizontalSubMenuLabel}>{subItem.label}</span>
                  )}
                </div>
              }
            />
          )
        })

        return (
          <HorizontalSubMenu
            key={subMenu.value}
            value={subMenu.value}
            icon={subMenu.icon}
            label={subMenu.label}
            disabled={subMenu.disabled}
            selected={
              subMenu.selected ??
              finalSelectedSubMenu.some((v) => v === subMenu.value)
            }
            opened={
              subMenu.opened ??
              finalOpenedSubMenuValues.some((v) => v === subMenu.value)
            }
            onVisibleChange={(opened) => {
              if (openedSubMenuValues === undefined) {
                if (opened) {
                  if (!finalOpenedSubMenuValues.includes(subMenu.value)) {
                    setFinalOpenedSubMenuValues([
                      ...finalOpenedSubMenuValues,
                      subMenu.value,
                    ])
                  }
                } else {
                  setFinalOpenedSubMenuValues(
                    finalOpenedSubMenuValues.filter((v) => v !== subMenu.value),
                  )
                }
              }
            }}
            onClick={() => {
              if (subMenu.disabled) return
              const openedSet = new Set([
                ...items
                  ?.filter((i) => "opened" in i && i.opened === true)
                  .map((i) => i.value),
                ...finalOpenedSubMenuValues,
              ])
              onClickSubMenu?.(subMenu.value, [...openedSet], [item.value])
            }}
          >
            <DropList
              w="100%"
              onClickItem={(
                value: string,
                clickedNode: ReactNode,
                event: MouseEvent,
              ) => {
                onClickMenuItem?.(value, [item.value, value], event)
                if (selectedValues === undefined) {
                  if (!finalSelectedValues.includes(value)) {
                    setFinalSelectedValues([value])
                  }
                  if (!finalSelectedSubMenu.includes(item.value)) {
                    setFinalSelectedSubMenu([item.value])
                  }
                }
              }}
            >
              {subItems}
            </DropList>
          </HorizontalSubMenu>
        )
      } else {
        return (
          <HorizontalMenuItem
            key={item.value}
            value={item.value}
            icon={item.icon}
            label={item.label}
            disabled={item.disabled}
            selected={
              item.selected ?? finalSelectedValues.some((v) => v === item.value)
            }
            onClick={(e) => {
              if (item.disabled) return
              onClickMenuItem?.(item.value, [item.value], e)
              if (selectedValues === undefined) {
                if (!finalSelectedValues.includes(item.value)) {
                  setFinalSelectedValues([item.value])
                  setFinalSelectedSubMenu([])
                }
              }
            }}
          />
        )
      }
    })

    return (
      <MenuContext.Provider
        value={{
          colorScheme,
        }}
      >
        <div
          css={[horizontalMenuContainerStyle, applyBoxStyle(otherProps)]}
          ref={ref}
          {...deleteCssProps(otherProps)}
        >
          <div
            ref={mergeRefs(containerBoundRef, containerRef)}
            css={horizontalMenuListContainerStyle}
            onScroll={(event) => {
              if (event.currentTarget.scrollLeft > 0) {
                if (!leftScroll) {
                  setLeftScroll(true)
                }
              } else {
                if (leftScroll) {
                  setLeftScroll(false)
                }
              }
              if (
                event.currentTarget.scrollLeft +
                  event.currentTarget.clientWidth >=
                event.currentTarget.scrollWidth
              ) {
                if (rightScroll) {
                  setRightScroll(false)
                }
              }
              if (
                event.currentTarget.clientWidth <
                event.currentTarget.scrollWidth
              ) {
                if (!rightScroll) {
                  setRightScroll(true)
                }
              }
            }}
          >
            {c}
          </div>
          <AnimatePresence initial={false}>
            {leftScroll && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0 }}
                css={applyActionContainerStyle("left")}
                onClick={() => {
                  if (containerRef.current) {
                    containerRef.current?.scrollBy({
                      left: -containerRef.current.clientWidth,
                      behavior: "smooth",
                    })
                  }
                }}
              >
                <PreviousIcon />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {rightScroll && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0 }}
                css={applyActionContainerStyle("right")}
                onClick={() => {
                  if (containerRef.current) {
                    containerRef.current?.scrollBy({
                      left: containerRef.current.clientWidth,
                      behavior: "smooth",
                    })
                  }
                }}
              >
                <NextIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MenuContext.Provider>
    )
  },
)

HorizontalMenu.displayName = "HorizontalMenu"
