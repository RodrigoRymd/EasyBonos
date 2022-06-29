import { Button, Card, CardContent, Divider, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { useSnackBar } from "../core/contexts/SnackBarContext";
import { useSpinner } from "../core/contexts/SpinnerContext";
import useForm from "../core/hooks/useForms";
import { Entity } from "../core/models/enums/entity";
import { registerLegalPerson, registerNaturalPerson } from "../core/services/authService";
import { EnumData, getEnumData } from "../core/utils/enumUtils";


const useStyles = makeStyles({
    content: {
        padding: "3rem",
    },

    buttom: {
        alignItems: "center",
        margin: "2rem 0rem",
    },

    registerContent: {
        alignItems: "center",
        justifyContent: "center",
    },

    registerForm: {
        margin: "1rem 0rem"
    },
    formControl: {
        minWidth: "100%",
    },

});


function registerNaturalPersonValidation(name: any, value: any, currentValues: any): any {
    let temp = {} as any;
    const nanRegex: RegExp = /\D+/gm;
    const emailRegex: RegExp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    switch (name) {
        case "name":
            if (!value) {
                temp.required = "Este campo es requerido";
            }
            break;
        case "lastName":
            if (!value) {
                temp.required = "Este campo es requerido";
            }
            break;
        case "dni":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value) || value.length > 8) {
                    temp.format = "DNI invalido";
                }
            }
            break;

        case "email":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (!emailRegex.test(value)) {
                    temp.format = "Correo no valido";
                }
            }
            break;
        case "password":
            if (!value) {
                temp.required = "Este campo es requerido";
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


function registerLegalPersonValidation(name: any, value: any, currentValues: any): any {
    let temp = {} as any;
    const emailRegex: RegExp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const nanRegex: RegExp = /\D+/gm;

    switch (name) {
        case "name":
            if (!value) {
                temp.required = "Este campo es requerido";
            }
            break;
        case "registerYear":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if ((nanRegex.test(value) || (value < 1800 || value >= 9999))) {
                    temp.date = "Fecha invalida";
                }
            }
            break;
        case "email":
            if (!value) {
                temp.required = "Este campo es requerido";
            } else {
                if (!emailRegex.test(value)) {
                    temp.format = "Correo no valido";
                }
            }
            break;
        case "password":
            if (!value) {
                temp.required = "Este campo es requerido";
            }
            break;
        case "ruc":
            if (!value && currentValues.entityType === Entity.Empresa) {
                temp.required = "Este campo es requerido";
            } else {
                if (nanRegex.test(value) || value.length > 11) {
                    temp.format = "RUC no valida";
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



function RegisterOptions({ setOption }: any) {
    const classes = useStyles();
    return (
        <div className={classes.content}>

            <div style={{ textAlign: "center" }}>

                <Typography variant="h4">
                    Registrarse
                </Typography>

            </div>

            <div className={classes.registerForm}>
                <Button className={classes.buttom} fullWidth variant="contained" color="primary" onClick={() => setOption(1)}>
                    Persona juridica
                </Button>
                <Divider />

                <Button className={classes.buttom} fullWidth variant="contained" color="primary" onClick={() => setOption(2)}>
                    Persona natural
                </Button>
            </div>

        </div>
    );
}


function RegisterNaturalPerson() {
    const { values, errors, handleChange, showErrors, valid } = useForm({
        initialValues: {
            name: "",
            lastName: "",
            dni: "",
            email: "",
            password: "",
        },
        validationFunction: registerNaturalPersonValidation
    });

    const classes = useStyles();

    const { spinnerDispatcher } = useSpinner();
    const { snackbarDispatcher } = useSnackBar();

    const handleSubmit = async () => {

        if (valid()) {
            spinnerDispatcher({ type: "loading" });
            const result = await registerNaturalPerson(values);
            spinnerDispatcher({ type: "done" });
            if (result.error) {
                snackbarDispatcher({ type: "error", payload: result.error });
            }
        }
    };


    return (
        <div className={classes.content}>


            <Grid container className={classes.registerContent} spacing={2}>

                <Grid item>
                    <Typography variant="h5">
                        Registrarse como persona natural
                    </Typography>
                </Grid>


                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Nombre"
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={showErrors("name")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label="Apellidos"
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={showErrors("lastName")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="dni"
                        name="dni"
                        label="DNI"
                        onChange={handleChange}
                        error={(!!errors.dni)}
                        helperText={showErrors("dni")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Correo"
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={showErrors("email")}
                        autoComplete="off"
                    />
                </Grid>


                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={showErrors("password")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                        Registrarse
                    </Button>
                </Grid>

            </Grid>

        </div>
    );
}



const entityTypes: EnumData[] = getEnumData(Entity);

function RegisterLegalPerson() {

    const { values, errors, handleChange, showErrors, valid } = useForm({
        initialValues: {
            name: "",
            registerYear: 0,
            entityType: 0,
            email: "",
            password: "",
            ruc: "",
        },
        validationFunction: registerLegalPersonValidation
    });
    const classes = useStyles();

    const { spinnerDispatcher } = useSpinner();
    const { snackbarDispatcher } = useSnackBar();

    const handleSubmit = async () => {
        if (valid()) {
            spinnerDispatcher({ type: "loading" });
            const result = await registerLegalPerson(values);
            spinnerDispatcher({ type: "done" });
            if (result.error) {
                snackbarDispatcher({ type: "error", payload: result.error });
            }
        }
    };


    return (
        <div className={classes.content}>


            <Grid container className={classes.registerContent} spacing={2}>

                <Grid item>
                    <Typography variant="h5">
                        Registrarse como persona juridica
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Razon social"
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={showErrors("name")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        className={classes.formControl}
                        id="registerYear"
                        name="registerYear"
                        label="Año de registro"
                        onChange={handleChange}
                        error={!!errors.registerYear}
                        helperText={showErrors("registerYear")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12} md={6} >
                    <FormControl
                        className={classes.formControl}
                    >
                        <InputLabel id="entityTypeLabel">Tipo de entidad</InputLabel>
                        <Select
                            labelId="entityTypeLabel"
                            id="Entity"
                            name="entityType"
                            value={values.entityType}
                            onChange={handleChange}
                        >
                            {entityTypes.map(e => {
                                return (
                                    <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>


                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="ruc"
                        name="ruc"
                        label="RUC"
                        onChange={handleChange}
                        error={!!errors.ruc}
                        helperText={showErrors("ruc")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Correo"
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={showErrors("email")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={showErrors("password")}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                        Registrarse
                    </Button>
                </Grid>



            </Grid>

        </div>
    );
}







function Register() {

    const [option, setOption] = useState(0);

    let content = null;
    if (option === 0) {
        content = <RegisterOptions setOption={setOption} style={{ width: "100%" }}></RegisterOptions>;
    } else if (option === 1) {
        content = <RegisterLegalPerson></RegisterLegalPerson>;
    } else if (option === 2) {
        content = <RegisterNaturalPerson></RegisterNaturalPerson>;
    }


    return (
        <Card>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    );
}

export default Register;
