import {
  Button,
  makeStyles,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { useAuth } from "../core/contexts/AuthContext";
import useForms from "../core/hooks/useForms";
import { Role } from "../core/models/enums/role";
import { auxUser } from "../core/utils/constants";
import ImageUploader from "./ImageUploader";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    border: 0,
  },
  content: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(3,1fr)",
    gridAutoRows: "1fr",
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "1fr",
    },
  },
  col1: {
    gridColumn: "span 1 / auto",
    [theme.breakpoints.down("xs")]: {
      gridColumn: "initial",
    },
  },
  col2: {
    gridColumn: "span 2 / auto",
    [theme.breakpoints.down("xs")]: {
      gridColumn: "initial",
    },
  },
  col3: {
    gridColumn: "span 3 / auto",
    [theme.breakpoints.down("xs")]: {
      gridColumn: "initial",
    },
  },
  title: {
    margin: "1rem 0rem",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  imageContent: {
    gridRow: "span 4 / auto",
  },
  paper: {
    padding: "2rem",
  },
  buttoms: {
    alignSelf: "flex-end",
  },
  items: {
    margin: "1rem 0rem 0rem 1rem",
  },
  configContent: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    [theme.breakpoints.down("xs")]: {
      margin: "0rem",
      padding: "0rem",
    },
  },
}));

function validateNaturalPersonForm(
  name: any,
  value: any,
  currentValues: any
): any {
  const nanRegex: RegExp = /\D+/gm;
  const emailRegex: RegExp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  let temp: any = {};

  switch (name) {
    case "name":
      if (!value) {
        temp.required = "Datos requeridos";
      }
      break;
    case "lastName":
      if (!value) {
        temp.required = "Datos requeridos";
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
        temp.required = "Datos requeridos";
      } else {
        if (!emailRegex.test(value)) {
          temp.format = "Correo invalido";
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

function validateLegalPersonForm(
  name: any,
  value: any,
  currentValues: any
): any {
  const emailRegex: RegExp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  let temp: any = {};

  switch (name) {
    case "bussinessName":
      if (!value) {
        temp.required = "Datos requeridos";
      }
      break;
    case "email":
      if (!value) {
        temp.required = "Datos requeridos";
      } else {
        if (!emailRegex.test(value)) {
          temp.format = "Correo invalido";
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

function NaturalPersonConfig(props: any) {
  const classes = useStyles();
  const [disable, setDisable] = useState(true);

  const { values, errors, handleChange, showErrors } = useForms({
    initialValues: {
      name: "",
      lastName: "",
      dni: "",
      email: "",
    },
    validationFunction: validateNaturalPersonForm,
  });

  const saveChanges = (event: any) => {
    setDisable(true);
  };

  return (
    <div className={classes.configContent}>
      <div className={classes.content}>
        <ImageUploader
          className={classes.imageContent}
          radious="50%"
          width="13rem"
          height="13rem"
          defaultImage="/images/profile.svg"
        />
        <TextField
          disabled={disable}
          id="name"
          name="name"
          label="Nombres"
          value={values.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={showErrors("name")}
          autoComplete="off"
        />
        <TextField
          disabled={disable}
          id="lastName"
          name="lastName"
          label="Apellidos"
          value={values.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={showErrors("lastName")}
          autoComplete="off"
        />
        <TextField
          disabled={disable}
          className={classes.col2}
          id="dni"
          name="dni"
          label="DNI"
          value={values.dni}
          onChange={handleChange}
          error={!!errors.dni}
          helperText={showErrors("dni")}
          autoComplete="off"
        />
        <TextField
          disabled={disable}
          className={classes.col2}
          id="email"
          name="email"
          label="Correo"
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={showErrors("email")}
          autoComplete="off"
        />
      </div>

      <div className={classes.buttoms}>
        <Button
          className={classes.items}
          variant="contained"
          color="primary"
          onClick={saveChanges}
        >
          Guardar
        </Button>
        <Button
          className={classes.items}
          variant="contained"
          color="primary"
          onClick={() => setDisable(false)}
        >
          Editar
        </Button>
      </div>
    </div>
  );
}

function LegalPersonConfig(props: any) {
  const classes = useStyles();
  const [disable, setDisable] = useState(true);

  const { values, errors, handleChange, showErrors } = useForms({
    initialValues: {
      bussinessName: "",
      email: "",
    },
    validationFunction: validateLegalPersonForm,
  });

  const saveChanges = (event: any) => {
    setDisable(true);
  };

  return (
    <div className={classes.configContent}>
      <div className={classes.content}>
        <ImageUploader
          className={classes.imageContent}
          radius="50%"
          width="13rem"
          height="13rem"
          defaultImage="/images/profile.svg"
        />
        <TextField
          disabled={disable}
          className={classes.col2}
          id="bussinessName"
          name="bussinessName"
          label="Razon social"
          value={values.bussinessName}
          onChange={handleChange}
          error={!!errors.bussinessName}
          helperText={showErrors("bussinessName")}
          autoComplete="off"
        />
        <TextField
          disabled={disable}
          className={classes.col2}
          id="email"
          name="email"
          label="Correo"
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={showErrors("email")}
          autoComplete="off"
        />
      </div>

      <div className={classes.buttoms}>
        <Button
          className={classes.items}
          variant="contained"
          color="primary"
          onClick={saveChanges}
        >
          Guardar
        </Button>
        <Button
          className={classes.items}
          variant="contained"
          color="primary"
          onClick={() => setDisable(false)}
        >
          Editar
        </Button>
      </div>
    </div>
  );
}

function Configuration(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  const { authState } = useAuth();

  let content = null;
  if (auxUser.role === Role.Bussinness || auxUser.role === Role.Institution) {
    content = <LegalPersonConfig />;
  } else {
    content = <NaturalPersonConfig />;
  }

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Typography className={classes.title} variant={!matches ? "h4" : "h5"}>
          Configuracion del Perfil
        </Typography>
        {content}
      </Paper>
    </Fragment>
  );
}

export default Configuration;
