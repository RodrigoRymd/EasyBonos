import {
  Paper,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../core/contexts/AuthContext";
import { useSpinner } from "../core/contexts/SpinnerContext";
import { BondPublication } from "../core/models/dtos/bondPublication";
import { LegalPerson } from "../core/models/dtos/legalPerson";
import { NaturalPerson } from "../core/models/dtos/naturalPerson";
import { User } from "../core/models/dtos/user";
import { BondState } from "../core/models/enums/bondState";
import { Frequency } from "../core/models/enums/frequency";
import { Rate } from "../core/models/enums/rate";
import { Role } from "../core/models/enums/role";
import { ColumnData } from "../core/models/virtualizeTableModel";
import { getPublication } from "../core/services/bondService";
import { auxUser } from "../core/utils/constants";
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
    height: "20rem",
  },
  button: {
    margin: "1rem 0rem",
  },
}));

type Data = {
  bondPublication?: BondPublication;
  issuer?: LegalPerson;
  holder?: NaturalPerson;
};

const columnNames: ColumnData[] = [
  {
    width: 200,
    label: "Indice",
    dataKey: "index",
  },
  {
    width: 200,
    label: "Fecha",
    dataKey: "date",
  },
  {
    width: 200,
    label: "Plazo de gracia",
    dataKey: "gracePeriod",
  },
  {
    width: 200,
    label: "Bono",
    dataKey: "bond",
  },
  {
    width: 200,
    label: "Cupon",
    dataKey: "coupon",
  },
  {
    width: 200,
    label: "Cuota",
    dataKey: "fee",
  },
  {
    width: 200,
    label: "Amortizacion",
    dataKey: "amortization",
  },
  {
    width: 200,
    label: "Prima",
    dataKey: "prima",
  },
  {
    width: 200,
    label: "Escudo",
    dataKey: "shield",
  },
  {
    width: 200,
    label: "Flujo emisor",
    dataKey: "emmiterFlow",
  },
  {
    width: 200,
    label: "Flujo emisor con escudo",
    dataKey: "emmiterShieldFlow",
  },
  {
    width: 200,
    label: "Flujo bonista",
    dataKey: "holderFlow",
  },
];

function BondPublicationPage(props: any) {
  const [data, setData] = useState<Data>({});
  const { spinnerDispatcher } = useSpinner();

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  const { authState } = useAuth();
  const { bondPublicationId }: any = useParams();

  const toRate = (rate: Rate | undefined) => (rate ? Rate[rate] : "");
  const toFrequency = (frequency: Frequency | undefined) =>
    frequency ? Frequency[frequency] : "";
  const toState = (state: BondState | undefined) =>
    state ? BondState[state] : "";

  const handleSubmit = async () => {};

  let userData: any = null;

  if (auxUser.role === Role.NaturalPerson) {
    userData = (
      <Fragment>
        <Typography className={classes.title} variant="h5">
          Datos del Comprador
        </Typography>
        <Grid container justify="flex-start" spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="name"
              name="name"
              label="Nombres"
              value={data.holder?.name}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="lastName"
              name="lastName"
              label="Apellidos"
              value={data.holder?.lastName}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="dni"
              name="dni"
              label="DNI"
              value={data.holder?.dni}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="email"
              name="email"
              label="Email"
              value={data.holder?.email}
            />
          </Grid>
          <Grid item xs={12} md={4} className={classes.center}>
            <Button variant="contained" color="primary">
              Ver Perfil
            </Button>
          </Grid>
        </Grid>
      </Fragment>
    );
  } else {
    userData = (
      <Fragment>
        <Typography className={classes.title} variant="h5">
          Datos del Emisor
        </Typography>
        <Grid container justify="flex-start" spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="name"
              name="nmame"
              label="Razon Social"
              value={data.issuer?.bussinessName}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="registerYear"
              name="registerYear"
              label="Año de registro"
              value={data.issuer?.registerYear}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="email"
              name="email"
              label="Email"
              value={data.issuer?.email}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="entityType"
              name="entityType"
              label="Tipo de Entidad"
              value={data.issuer?.entityType.toString()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              disabled
              id="ruc"
              name="ruc"
              label="RUC"
              value={data.issuer?.ruc}
            />
          </Grid>
          <Grid item xs={12} md={4} className={classes.center}>
            <Button variant="contained" color="primary">
              Ver Perfil
            </Button>
          </Grid>
        </Grid>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Typography className={classes.title} variant={!matches ? "h4" : "h5"}>
          {" "}
          Bono: {data.bondPublication?.name}
        </Typography>
        <Divider />
        <div className={classes.subContent}>{userData}</div>

        <Divider />

        <div className={classes.subContent}>
          <Typography className={classes.title} variant="h5">
            Informacion del Bono
          </Typography>

          <Grid container justify="flex-start" spacing={3}>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                multiline
                rowsMax={4}
                variant="outlined"
                id="description"
                name="description"
                label="Descripcion"
                value={data.bondPublication?.description}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="state"
                name="state"
                label="Estado"
                value={toState(data.bondPublication?.state)}
              />
            </Grid>

            {data.bondPublication?.state === BondState.Vendido ? (
              <Fragment>
                <Grid item xs={12} md={4}>
                  <TextField
                    disabled
                    fullWidth
                    id="lastPaymentDate"
                    name="lastPaymentDate"
                    label="Ultima Fecha de Pago"
                    value={data.bondPublication?.nextPaymentDate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    disabled
                    fullWidth
                    id="nextPaymentDate"
                    name="nextPaymentDate"
                    label="Proxima Fecha de Pago"
                    value={data.bondPublication?.nextPaymentDate}
                  />
                </Grid>
              </Fragment>
            ) : null}
          </Grid>
        </div>

        <Divider />
        <div className={classes.subContent}>
          <Typography className={classes.title} variant="h5">
            Valores del Bono
          </Typography>
          <Grid container justify="flex-start" spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="nominalValue"
                name="nominalValue"
                label="Valor nominal"
                value={data.bondPublication?.bond?.bondInput?.nominalValue}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="commercialValue"
                name="commercialValue"
                label="Valor comercial"
                value={data.bondPublication?.bond?.bondInput?.commercialValue}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="couponFrequency"
                name="couponFrequency"
                label="Frequencia del cupon"
                value={data.bondPublication?.bond?.bondInput?.couponFrequency}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="daysPerYear"
                name="daysPerYear"
                label="Dias por año"
                value={data.bondPublication?.bond?.bondInput?.daysPerYear}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="insterestRateType"
                name="insterestRateType"
                label="Tipo de tasa de interes"
                value={toRate(
                  data.bondPublication?.bond?.bondInput?.interestRateType
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="capitalization"
                name="capitalization"
                label="Capitalizacion"
                value={toFrequency(
                  data.bondPublication?.bond?.bondInput?.capitalization
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="interestRate"
                name="interestRate"
                label="Tasa de interes %"
                value={data.bondPublication?.bond?.bondInput?.interestRate}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="annualDiscountRate"
                name="annualDiscountRate"
                label="Tasa anual de descuento %"
                value={
                  data.bondPublication?.bond?.bondInput?.annualDiscountRate
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="incomeTax"
                name="incomeTax"
                label="Impuesto a la renta %"
                value={data.bondPublication?.bond?.bondInput?.incomeTax}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="emmitionDate"
                name="emmitionDate"
                label="Fecha de emision"
                value={data.bondPublication?.bond?.bondInput?.emmitionDate}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="prima"
                name="prima"
                label="Prima %"
                value={data.bondPublication?.bond?.bondInput?.prima}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="flotacion"
                name="flotacion"
                label="Flotacion %"
                value={data.bondPublication?.bond?.bondInput?.flotacion}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="cavali"
                name="cavali"
                label="Cavali %"
                value={data.bondPublication?.bond?.bondInput?.cavali}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="years"
                name="years"
                label="Numero de años"
                value={data.bondPublication?.bond?.bondInput?.daysPerYear}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="colocacion"
                name="colocacion"
                label="Colocacion %"
                value={data.bondPublication?.bond?.bondInput?.colocacion}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="estructuracion"
                name="estructuracion"
                label="Estructuracion %"
                value={data.bondPublication?.bond?.bondInput?.estructuracion}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                disabled
                fullWidth
                id="gracePeriod"
                name="gracePeriod"
                label="Plazo de Gracia"
                value={data.bondPublication?.bond?.bondInput?.gracePeriod}
              />
            </Grid>
          </Grid>
        </div>

        <Divider />

        <div className={classes.subContent}>
          <Typography className={classes.title} variant="h5">
            Resultados del Bono
          </Typography>

          <Grid container justify="flex-start" spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="couponFrequencyOutput"
                name="couponFrequencyOuput"
                label="Frecuencia del cupon"
                value={toFrequency(
                  data.bondPublication?.bond?.bondOutput?.couponFrequency
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="capitalizationDaysOuput"
                name="capitalizationDaysOuput"
                label="Dias de capitalizacion"
                value={data.bondPublication?.bond?.bondOutput?.capitalization}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="periodsPerYearOutput"
                name="periodsPerYearOuput"
                label="Periodos por año"
                value={data.bondPublication?.bond?.bondOutput?.periodsPerYear}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="annualEffectiveRateOutput"
                name="annualEffectiveRateOuput"
                label="Tasa efectiva anual %"
                value={
                  data.bondPublication?.bond?.bondOutput?.annualEfectiveRate
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="cokOutput"
                name="cokOuput"
                label="COK %"
                value={data.bondPublication?.bond?.bondOutput?.couponCok}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="initialEmmiterCostsOutput"
                name="initialEmmiterCostsOuput"
                label="Costos iniciales del emisor"
                value={
                  data.bondPublication?.bond?.bondOutput?.initialEmmiterCosts
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="initialHolderCostsOutput"
                name="initialHolderCostsOuput"
                label="Costos iniciales del bonista %"
                value={
                  data.bondPublication?.bond?.bondOutput?.initialHolderCosts
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="currentPriceOutput"
                name="currentPriceOuput"
                label="Precio actual"
                value={data.bondPublication?.bond?.bondOutput?.currentPrice}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="couponEffectiveRateOutput"
                name="couponEffectiveRateOuput"
                label="Tasa del cupon %"
                value={
                  data.bondPublication?.bond?.bondOutput?.couponEfectiveRate
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="irr"
                name="irr"
                label="TIR"
                value={data.bondPublication?.bond?.bondOutput?.irr}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                id="modifiedDuration"
                name="modifiedDuration"
                label="Duracion modificada"
                value={data.bondPublication?.bond?.bondOutput?.modifiedDuration}
              />
            </Grid>
          </Grid>
        </div>

        {data.bondPublication?.bond?.bondOutput?.bondInfo &&
        data.bondPublication.bond.bondOutput.bondInfo.length > 0 ? (
          <div className={classes.tableFill}>
            <VirtualizedTable
              rowCount={
                data.bondPublication?.bond.bondOutput.bondInfo.length || 0
              }
              rowGetter={({ index }) =>
                data.bondPublication?.bond?.bondOutput?.bondInfo[index]
              }
              columns={columnNames}
            />
          </div>
        ) : null}

        {props.action && props.action === "buy" ? (
          <Fragment>
            <Divider />
            <div className={classes.subContent}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Comprar
              </Button>
            </div>
          </Fragment>
        ) : null}
      </Paper>
    </Fragment>
  );
}

export default BondPublicationPage;
