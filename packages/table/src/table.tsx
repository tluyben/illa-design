import { forwardRef } from "react"
import { TableContextProps, TableProps, ThContextProps } from "./interface"
import {
  applyContainerStyle,
  applyHeaderIconLeft,
  applyPreContainer,
  applyTableStyle,
} from "./style"
import { TableContext } from "./table-context"
import { useFilters, useSortBy, useTable } from "react-table"
import { Thead } from "./thead"
import { Tr } from "./tr"
import { Th } from "./th"
import { TBody } from "./tbody"
import { Td } from "./td"
import { TFoot } from "./tfoot"
import { ThContext } from "./th-context"
import {
  SorterDefaultIcon,
  SorterDownIcon,
  SorterUpIcon,
} from "@illa-design/icon"

export const Table = forwardRef<HTMLDivElement, TableProps<any>>(
  (props, ref) => {
    const {
      size = "medium",
      tableLayout = "auto",
      columns,
      data,
      bordered,
      borderedCell,
      striped,
      fixedHeader = true,
      children,
      disableSortBy,
      disableFilters,
      align = "left",
      showFooter,
      showHeader = true,
      _css,
      ...otherProps
    } = props
    const contextProps = {
      align,
      borderedCell,
      striped,
      size,
    } as TableContextProps

    const headerContextProps = {
      fixedHeader,
    } as ThContextProps

    if (columns == undefined || data == undefined) {
      return (
        <div css={applyContainerStyle(_css)} ref={ref}>
          <ThContext.Provider value={headerContextProps}>
            <TableContext.Provider value={contextProps}>
              <table
                css={applyTableStyle(tableLayout, bordered)}
                {...otherProps}
              >
                {children}
              </table>
            </TableContext.Provider>
          </ThContext.Provider>
        </div>
      )
    } else {
      const {
        headerGroups,
        rows,
        prepareRow,
        footerGroups,
        getTableProps,
        getTableBodyProps,
      } = useTable(
        {
          columns,
          data,
          disableSortBy,
          disableFilters,
        },
        useFilters,
        useSortBy,
      )

      return (
        <div css={applyContainerStyle(_css)} ref={ref}>
          <ThContext.Provider value={headerContextProps}>
            <TableContext.Provider value={contextProps}>
              <table
                css={applyTableStyle(tableLayout, bordered)}
                {...getTableProps()}
                {...otherProps}
              >
                {showHeader && (
                  <Thead>
                    {headerGroups.map((group) => (
                      <Tr {...group.getHeaderGroupProps()}>
                        {group.headers.map((column, index) => (
                          <Th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps(),
                            )}
                          >
                            <div css={applyPreContainer}>
                              {column.render("Header")}
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SorterDownIcon _css={applyHeaderIconLeft} />
                                ) : (
                                  <SorterUpIcon _css={applyHeaderIconLeft} />
                                )
                              ) : (
                                !disableSortBy && (
                                  <SorterDefaultIcon
                                    _css={applyHeaderIconLeft}
                                  />
                                )
                              )}
                            </div>
                            {column.canFilter &&
                              column.Filter != undefined &&
                              column.render("Filter")}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </Thead>
                )}
                <TBody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row)
                    return (
                      <Tr {...row.getRowProps()}>
                        {row.cells.map((cell, index) => {
                          return (
                            <Td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </Td>
                          )
                        })}
                      </Tr>
                    )
                  })}
                </TBody>
                {showFooter && (
                  <TFoot>
                    {footerGroups.map((group) => (
                      <Tr {...group.getFooterGroupProps()}>
                        {group.headers.map((column, index) => (
                          <Td {...column.getFooterProps()}>
                            {column.render("Footer")}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TFoot>
                )}
              </table>
            </TableContext.Provider>
          </ThContext.Provider>
        </div>
      )
    }
  },
)

Table.displayName = "Table"
