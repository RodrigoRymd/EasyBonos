import {
  Button,
  Divider,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import { useEffect, useState } from "react";
import { Fragment } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { RowMouseEventHandlerParams } from "react-virtualized";
import { useAuth } from "../core/contexts/AuthContext";
import { useSnackBar } from "../core/contexts/SnackBarContext";
import { useSpinner } from "../core/contexts/SpinnerContext";
import { BondSummary } from "../core/models/dtos/bondSummary";
import { Role } from "../core/models/enums/role";
import { ColumnData } from "../core/models/virtualizeTableModel";
import { getPublicationSummaries } from "../core/services/bondService";
import { auxUser } from "../core/utils/constants";
import BondEmmision from "./BondEmission";
import BondPublicationPage from "./BondPublication";
import VirtualizedTable from "./VirtualizeTable";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: "1rem 0rem",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  paper: {
    padding: "1px 2rem",
  },
  subContent: {
    margin: "2rem 0rem",
  },
  center: {
    display: "grid",
    placeItems: "center",
  },
  table: {
    width: "100%",
    margin: "1rem 0rem",
  },
  tableFill: {
    height: "50vh",
  },
}));

const columnNames: ColumnData[] = [
  {
    width: 300,
    label: "Nombre",
    dataKey: "name",
  },
  {
    width: 300,
    label: "Emisor",
    dataKey: "issuer",
  },
  {
    width: 200,
    label: "Valor comercial",
    dataKey: "commercialValue",
  },
  {
    width: 200,
    label: "Tasa de interes",
    dataKey: "interestRate",
  },
  {
    width: 200,
    label: "TIR",
    dataKey: "irr",
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
];

function BuySellContent(props: any) {
  const history = useHistory();
  const { url } = useRouteMatch();

  const toBondPublication = (info: RowMouseEventHandlerParams) => {
    history.push(`${url}/publication/${info.rowData.id}`);
  };

  const toBondEmmision = (event: any) => {
    history.push(`${url}/emmision`);
  };

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));
  const { authState } = useAuth();
  const [data, setData] = useState<Array<BondSummary>>([]);

  const { spinnerDispatcher } = useSpinner();
  const { snackbarDispatcher } = useSnackBar();

  useEffect(() => {
    getPublicationSummaries().then((data) => {
      if (!data[0].error) {
        setData(data);
      } else {
        snackbarDispatcher({ type: "error", payload: data[0].error });
      }
    });
  }, []);

  return (
    <Fragment>
      <Typography className={classes.title} variant={matches ? "h5" : "h3"}>
        Bonos publicados
      </Typography>
      <Paper className={classes.paper}>
        <div className={classes.subContent}>
          <div className={classes.tableFill}>
            <VirtualizedTable
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
              columns={columnNames}
              onRowClick={toBondPublication}
            />
          </div>
        </div>
        <Divider style={{ width: "100%" }} />
        {auxUser.role === Role.Bussinness ||
        auxUser.role === Role.Institution ? (
          <div className={classes.subContent}>
            <Button
              onClick={toBondEmmision}
              variant="contained"
              color="primary"
            >
              Emitir un bono
            </Button>
          </div>
        ) : null}
      </Paper>
    </Fragment>
  );
}

function BuySell(props: any) {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <BuySellContent />
      </Route>
      <Route path={`${path}/emmision`}>
        <BondEmmision />
      </Route>

      <Route path={`${path}/publication/:bondPublicationId`}>
        <BondPublicationPage action="buy" />
      </Route>
    </Switch>
  );
}

export default BuySell;
