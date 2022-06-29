import {
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { RowMouseEventHandlerParams } from "react-virtualized";
import { useAuth } from "../core/contexts/AuthContext";
import { BondSummary } from "../core/models/dtos/bondSummary";
import { Role } from "../core/models/enums/role";
import { ColumnData } from "../core/models/virtualizeTableModel";
import { auxUser } from "../core/utils/constants";
import BondPublicationPage from "./BondPublication";
import VirtualizedTable from "./VirtualizeTable";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: "2rem 0rem",
  },
  table: {
    height: "20rem",
    width: "100%",
  },

  tableWrapper: {
    margin: "2rem 0rem",
  },

  tableLabel: {
    backgroundColor: theme.palette.primary.main,
    padding: "0.5rem 0.8rem",
    borderRadius: "10px 10px 0px 0px",
    width: "max-content",
  },
}));

const boughtBondsHeader: ColumnData[] = [
  {
    width: 200,
    label: "Nombre",
    dataKey: "name",
  },
  {
    width: 200,
    label: "Emisor",
    dataKey: "issuer",
  },
  {
    width: 200,
    label: "Valor nominal",
    dataKey: "nominalValue",
  },
  {
    width: 200,
    label: "TIR",
    dataKey: "tir",
  },
  {
    width: 200,
    label: "Duracion modificada",
    dataKey: "modifiedDuration",
  },
  {
    width: 200,
    label: "Ultimo pago",
    dataKey: "lastPaymentDate",
  },
  {
    width: 200,
    label: "Siguiente pago",
    dataKey: "nextPaymentDate",
  },
];

const selledBondsHeader: ColumnData[] = [
  {
    width: 300,
    label: "Nombre",
    dataKey: "name",
  },
  {
    width: 300,
    label: "Valor nominal",
    dataKey: "nominalValue",
  },
  {
    width: 200,
    label: "TIR",
    dataKey: "tir",
  },
  {
    width: 200,
    label: "Duracion modificada",
    dataKey: "modifiedDuration",
  },
  {
    width: 200,
    label: "Fecha de emision",
    dataKey: "emmitionDate",
  },
  {
    width: 200,
    label: "Fecha de venta",
    dataKey: "saleDate",
  },
];

interface TablesData {
  buyTableData: BondSummary[];
  sellTableData: BondSummary[];
}

function DataTable({ title, data, headers, ...rest }: any) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();

  const history = useHistory();
  const { url } = useRouteMatch();

  const toBondPublication = (info: RowMouseEventHandlerParams) => {
    history.push(`${url}/publication/${info.rowData.id}`);
  };

  if (!matches) {
    return (
      <div className={classes.tableWrapper}>
        <Typography className={classes.tableLabel} variant="h6">
          {title}
        </Typography>

        <Paper className={classes.table}>
          <VirtualizedTable
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}
            columns={headers}
            headerHeight={50}
            onRowClick={toBondPublication}
          />
        </Paper>
      </div>
    );
  }

  return null;
}

function HomePage() {
  const classes = useStyles();

  const [tablesData, setTablesData] = useState({
    buyTableData: [],
    sellTableData: [],
  } as TablesData);

  useEffect(() => {
    setTablesData((data: TablesData) => ({
      sellTableData: [],
      buyTableData: [],
    }));
  }, []);

  const { authState } = useAuth();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  //const { spinnerDispatcher } = useSpinner();
  return (
    <Fragment>
      <div className={classes.title}>
        <Typography variant={matches ? "h5" : "h3"}>
          Bienvenido a Bono App
        </Typography>
      </div>

      <DataTable
        title="Bonos Adquiridos"
        data={tablesData.buyTableData}
        headers={boughtBondsHeader}
      />

      {auxUser.role === Role.Bussinness || auxUser.role === Role.Institution ? (
        <DataTable
          title="Bonos Emitidos"
          data={tablesData.buyTableData}
          headers={selledBondsHeader}
        />
      ) : null}
    </Fragment>
  );
}

function Home() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <HomePage />
      </Route>
      <Route path={`${path}/publication/:bondPublicationId`}>
        <BondPublicationPage action="info" />
      </Route>
    </Switch>
  );
}

export default Home;
