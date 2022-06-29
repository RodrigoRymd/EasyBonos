import {
  createStyles,
  TableCell,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import {
  AutoSizer,
  Column,
  TableCellRenderer,
  TableHeaderProps,
  Table,
  RowMouseEventHandlerParams,
} from "react-virtualized";
import { ColumnData, Row } from "../core/models/virtualizeTableModel";

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      height: "20rem",
      width: "100%",
      "& .ReactVirtualized__Table__headerRow": {
        flip: false,
        paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
      },
    },
    tableRow: {
      cursor: "pointer",
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: "rgba(122, 13, 13, 1)",
      },
    },
    tableCell: {
      flex: 1,
    },
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
    },
    noClick: {
      cursor: "initial",
    },
  });

export interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: (info: RowMouseEventHandlerParams) => void;
  rowCount: number;
  rowGetter: (row: Row) => any;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick,
          classes.tableHeader
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } =
      this.props;

    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight!}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

export default VirtualizedTable;
