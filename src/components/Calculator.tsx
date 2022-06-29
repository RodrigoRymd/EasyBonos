import DateFnsUtils from "@date-io/date-fns";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { ExpandMoreRounded } from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
import clsx from "clsx";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import useForm from "../core/hooks/useForms";
import { BondCalculatorInput } from "../core/models/bondCalculatorInput";
import { BondCalculatorOutput } from "../core/models/bondCalculatorOutput";
import { Frequency } from "../core/models/enums/frequency";
import { GracePeriod } from "../core/models/enums/gracePeriod";
import { PaymentMethod } from "../core/models/enums/paymentMethod";
import { Rate } from "../core/models/enums/rate";
import { ColumnData } from "../core/models/virtualizeTableModel";
import { calculateData } from "../core/services/calculatorService";
import { EnumData, frequencyToDay, getEnumData } from "../core/utils/enumUtils";
import VirtualizedTable from "./VirtualizeTable";


const useStyles = makeStyles((theme) => ({
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "2rem 0rem",
        flexWrap: "wrap",
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column",
            justifyContent: "center",
        }
    },

    headerText: {
        
        textAlign: "center",
        [theme.breakpoints.down('xs')]: {
            margin: "1rem 0rem",
        }
    },
    formControl: {
        
        minWidth: "100%",
    },

    centerTitle: {
        lineHeight: "3rem",
    },

    table: {
        width: "100%",
        margin: "1rem 0rem"
    },
    tableFill: {
        backgroundColor: "#660000",
        height: "20rem",
    }
}));


const columnNames: ColumnData[] = [
    {
        width: 200,
        label: "Indice",
        dataKey: "index"
    },
    {
        width: 200,
        label: "Fecha",
        dataKey: "date"
    },
    {
        width: 200,
        label: "Plazo de gracia",
        dataKey: "gracePeriod"
    },
    {
        width: 200,
        label: "Bono",
        dataKey: "bond"
    },
    {
        width: 200,
        label: "Cupon",
        dataKey: "coupon"
    },
    {
        width: 200,
        label: "Cuota",
        dataKey: "fee"
    },
    {
        width: 200,
        label: "Amortizacion",
        dataKey: "amortization"
    },
    {
        width: 200,
        label: "Prima",
        dataKey: "prima"
    },
    {
        width: 200,
        label: "Escudo",
        dataKey: "shield"
    },
    {
        width: 200,
        label: "Flujo emisor",
        dataKey: "emmiterFlow"
    },
    {
        width: 200,
        label: "Flujo con escudo",
        dataKey: "emmiterShieldFlow"
    },
    {
        width: 200,
        label: "Flujo bonista",
        dataKey: "holderFlow"
    }
];


function calculatorInputValidation(name: any, value: any, currentValues: any): any {
    let temp = {} as any;
    const nanRegex: RegExp = /[^0-9.]/gm;
    switch (name) {
        case "nominalValue":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "commercialValue":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "daysPerYear":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "interestRate":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "annualDiscountRate":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "incomeTax":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "prima":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "flotacion":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "cavali":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "years":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "colocacion":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        case "estructuracion":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value)) {
                    temp.number = "Debe de ingresar un numero";
                }
            }
            break;
        default:
            break;
    }
    if (Object.keys(temp).length > 0) {
        return temp;
    }
    return null;
}



const paymentMethods: EnumData[] = getEnumData(PaymentMethod);
const insterestRateTypes: EnumData[] = getEnumData(Rate);
const capitalizations: EnumData[] = getEnumData(Frequency);
const couponFrequencies: EnumData[] = getEnumData(Frequency);
const gracePeriods: EnumData[] = getEnumData(GracePeriod);

const daysPerYear: EnumData[] = [
    {
        label: "360",
        value: 360
    },
    {
        label: "365",
        value: 365
    }
];


function Calculator() {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));

    const { values, errors, handleChange, showErrors, onBlurValidation, valid } = useForm<any>({
        initialValues: {
            emmitionDate: new Date(),
            paymentMethod: PaymentMethod.Ingles,
            capitalization: Frequency.Diaria,
            couponFrequency: Frequency.Anual,
            gracePeriod: GracePeriod.Sin,
            daysPerYear: 360,
            nominalValue: '',
            commercialValue: '',
            years: '',
            interestRate: '',
            annualDiscountRate: '',
            incomeTax: '',
            prima: '',
            flotacion: '',
            cavali: '',
            colocacion: '',
            estructuracion: '',
            interestRateType: Rate.Efectiva
        },
        validationFunction: calculatorInputValidation
    });

    const handleEmmitionDate = (newDate: any) => {
        const event = {
            target: {
                name: "emmitionDate",
                value: newDate
            }
        };
        handleChange(event);
    };

    const [inputExpanded, setInputExpanded] = useState(true);
    const [outputExpanded, setOutputExpanded] = useState(false);

    const [outputData, setOutputData] = useState({
        couponFrequency: frequencyToDay(Frequency.Anual),
        capitalization: 0,
        periodsPerYear: 0,
        totalPeriods: 0,
        annualEfectiveRate: 0,
        couponEfectiveRate: 0,
        couponCok: 0,
        initialEmmiterCosts: 0,
        initialHolderCosts: 0,
        currentPrice: 0,
        calculatorInfo: [],
    } as BondCalculatorOutput);
    const [tableClass, setTableClass] = useState("");


    const handleInputAccordion = () => setInputExpanded(!inputExpanded);
    const handleOuputAccordion = () => setOutputExpanded(!outputExpanded);

    const calculate = () => {
        if (valid()) {
            let output = calculateData({
                emmitionDate: values.emmitionDate,
                paymentMethod: values.paymentMethod,
                capitalization: values.capitalization,
                couponFrequency: values.couponFrequency,
                gracePeriod: values.gracePeriod,
                daysPerYear: values.daysPerYear,
                nominalValue: parseFloat(values.nominalValue),
                commercialValue: parseFloat(values.commercialValue),
                years: parseInt(values.years),
                interestRate: parseFloat(values.interestRate) / 100,
                annualDiscountRate: parseFloat(values.annualDiscountRate) / 100,
                incomeTax: parseFloat(values.incomeTax) / 100,
                prima: parseFloat(values.prima) / 100,
                flotacion: parseFloat(values.flotacion) / 100,
                cavali: parseFloat(values.cavali) / 100,
                colocacion: parseFloat(values.colocacion) / 100,
                estructuracion: parseFloat(values.estructuracion) / 100,
                interestRateType: values.interestRateType
            } as BondCalculatorInput);

            output.couponCok = output.couponCok * 100;
            output.annualEfectiveRate = output.annualEfectiveRate * 100;
            output.couponEfectiveRate = output.couponEfectiveRate * 100;

            setOutputData(output);
            setInputExpanded(!inputExpanded);
            setOutputExpanded(true);
        }
    }

    useLayoutEffect(() => {
        setTableClass(clsx(classes.table, outputExpanded && classes.tableFill));
    }, [outputExpanded]);


    console.log(errors);

    return (
        <Fragment>
            <div className={classes.header}>
                <Typography variant={matches ? "h5" : "h3"} className={classes.headerText}>
                    Calculo de un bono
                </Typography>
                <Button variant="contained" color="primary" onClick={calculate}>
                    Calcular
                </Button>
            </div>

            <Accordion expanded={inputExpanded} onChange={handleInputAccordion}>
                <AccordionSummary expandIcon={<ExpandMoreRounded />}
                    aria-controls="input-content"
                    id="input-panel">
                    <Typography variant="h5" className={classes.centerTitle}>
                        Datos iniciales
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid container justify="flex-start" spacing={3}>
                        <Grid item xs={12} md={4}>
                            <FormControl
                                className={classes.formControl}
                            >
                                <InputLabel id="paymentMethodLabel">Metodo de pago</InputLabel>
                                <Select
                                    labelId="paymentMethodLabel"
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={values.paymentMethod}
                                    onChange={handleChange}
                                >
                                    {paymentMethods.map(e => {
                                        return (
                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="nominalValue"
                                name="nominalValue"
                                label="Valor nominal"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.nominalValue}
                                error={!!errors.nominalValue}
                                helperText={showErrors("nominalValue")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="commercialValue"
                                name="commercialValue"
                                label="Valor comercial"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.commercialValue}
                                error={!!errors.commercialValue}
                                helperText={showErrors("commercialValue")}
                                autoComplete="off"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                className={classes.formControl}
                            >
                                <InputLabel id="couponFrequencyLabel">Frequencia del cupon</InputLabel>
                                <Select
                                    labelId="couponFrequencyLabel"
                                    id="couponFrequency"
                                    name="couponFrequency"
                                    onChange={handleChange}
                                    value={values.couponFrequency}
                                >
                                    {couponFrequencies.map(e => {
                                        return (
                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                className={classes.formControl}
                            >
                                <InputLabel id="daysPerYearLabel">Dias por año</InputLabel>
                                <Select
                                    id="daysPerYear"
                                    name="daysPerYear"
                                    onChange={handleChange}
                                    value={values.daysPerYear}
                                >
                                    {daysPerYear.map(e => {
                                        return (
                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                className={classes.formControl}
                            >
                                <InputLabel id="interestRateTypeLabel">Tipo de tasa de interes</InputLabel>
                                <Select
                                    labelId="interestRateTypeLabel"
                                    id="insterestRateType"
                                    name="insterestRateType"
                                    onChange={handleChange}
                                    value={values.interestRateType}
                                >
                                    {insterestRateTypes.map(e => {
                                        return (
                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                className={classes.formControl}
                            >
                                <InputLabel id="capitalizationLabel">Capitalizacion</InputLabel>
                                <Select
                                    labelId="capitalizationLabel"
                                    id="capitalization"
                                    name="capitalization"
                                    onChange={handleChange}
                                    value={values.capitalization}
                                >
                                    {capitalizations.map(e => {
                                        return (
                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="interestRate"
                                name="interestRate"
                                label="Tasa de interes %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.interestRate}
                                error={!!errors.interestRate}
                                helperText={showErrors("interestRate")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="annualDiscountRate"
                                name="annualDiscountRate"
                                label="Tasa anual de descuento %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.annualDiscountRate}
                                error={!!errors.annualDiscountRate}
                                helperText={showErrors("annualDiscountRate")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="incomeTax"
                                name="incomeTax"
                                label="Impuesto a la renta %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.incomeTax}
                                error={!!errors.incomeTax}
                                helperText={showErrors("incomeTax")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <KeyboardDatePicker
                                disableToolbar
                                fullWidth
                                variant="inline"
                                format="DD/MM/YYYY"
                                margin="normal"
                                id="emmitionDate"
                                name="emmitionDate"
                                label="Fecha de emision"
                                value={values.emmitionDate}
                                onChange={handleEmmitionDate}
                                maxDate={new Date()}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="prima"
                                name="prima"
                                label="Prima %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.prima}
                                error={!!errors.prima}
                                helperText={showErrors("prima")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="flotacion"
                                name="flotacion"
                                label="Flotacion %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.flotacion}
                                error={!!errors.flotacion}
                                helperText={showErrors("flotacion")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="cavali"
                                name="cavali"
                                label="Cavali %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.cavali}
                                error={!!errors.cavali}
                                helperText={showErrors("cavali")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="years"
                                name="years"
                                label="Numero de años"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.years}
                                error={!!errors.years}
                                helperText={showErrors("years")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="colocacion"
                                name="colocacion"
                                label="Colocacion %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.colocacion}
                                error={!!errors.colocacion}
                                helperText={showErrors("colocacion")}
                                autoComplete="off"

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="estructuracion"
                                name="estructuracion"
                                label="Estructuracion %"
                                onChange={handleChange}
                                onBlur={onBlurValidation}
                                value={values.estructuracion}
                                error={!!errors.estructuracion}
                                helperText={showErrors("Estructuracion")}
                                autoComplete="off"


                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl
                                className={classes.formControl}
                            >
                                <InputLabel id="gracePeriodLabel">Plazo de Gracia</InputLabel>
                                <Select
                                    labelId="gracePeriodLabel"
                                    id="gracePeriod"
                                    name="gracePeriod"
                                    value={values.gracePeriod}
                                    onChange={handleChange}
                                >
                                    {gracePeriods.map(e => {
                                        return (
                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={outputExpanded} onChange={handleOuputAccordion}>
                <AccordionSummary expandIcon={<ExpandMoreRounded />}
                    aria-controls="output-content"
                    id="output-panel">
                    <Typography variant="h5" className={classes.centerTitle}>
                        Datos de salida
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container justify="flex-start" spacing={3}>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="couponFrequencyOutput"
                                name="couponFrequencyOuput"
                                label="Frecuencia del cupon"
                                value={outputData.couponFrequency}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="capitalizationDaysOuput"
                                name="capitalizationDaysOuput"
                                label="Dias de capitalizacion"
                                value={outputData.capitalization}
                            />
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="periodsPerYearOutput"
                                name="periodsPerYearOuput"
                                label="Periodos por año"
                                value={outputData.periodsPerYear}
                            />
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="annualEffectiveRateOutput"
                                name="annualEffectiveRateOuput"
                                label="Tasa efectiva anual %"
                                value={outputData.annualEfectiveRate}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="cokOutput"
                                name="cokOuput"
                                label="COK %"
                                value={outputData.couponCok}

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="initialEmmiterCostsOutput"
                                name="initialEmmiterCostsOuput"
                                label="Costos iniciales del emisor"
                                value={outputData.initialEmmiterCosts}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="initialHolderCostsOutput"
                                name="initialHolderCostsOuput"
                                label="Costos iniciales del bonista %"
                                value={outputData.initialHolderCosts}
                            />
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="currentPriceOutput"
                                name="currentPriceOuput"
                                label="Precio actual"
                                value={outputData.currentPrice}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                disabled
                                id="couponEffectiveRateOutput"
                                name="couponEffectiveRateOuput"
                                label="Tasa del cupon %"
                                value={outputData.couponEfectiveRate}
                            />
                        </Grid>

                    </Grid>
                </AccordionDetails>
            </Accordion>


            <Paper className={tableClass}>
                <VirtualizedTable
                    rowCount={outputData.calculatorInfo.length}
                    rowGetter={({ index }) => outputData.calculatorInfo[index]}
                    columns={columnNames}
                    headerHeight={60}
                />
            </Paper>


        </Fragment>
    );
}


export default Calculator;