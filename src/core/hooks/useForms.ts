import { useState } from "react";

interface FormData<T> {
  initialValues: T;
  validationFunction?: (name: any, value: any, currentValues: T) => any;
}

export default function useForm<G>({
  initialValues,
  validationFunction,
}: FormData<G>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({} as any);

  const handleChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;

    if (validationFunction) {
      const newErrors = validationFunction(name, value, values);
      setErrors({
        ...errors,
        [name]: newErrors,
      });
    }

    setValues({
      ...values,
      [name]: value,
    });
  };

  const onBlurValidation = (event: any) => {
    if (errors[event.target.name]) {
      setValues({
        ...values,
        [event.target.name]: "",
      });
      delete errors[event.target.name];
      setErrors(errors);
    }
  };

  const showErrors = (name: string) => {
    let temp = "";
    const error = errors[name];
    if (error) {
      for (const key in error) {
        temp += `${error[key]}\n`;
      }
    }
    return temp;
  };

  const valid = () => {
    let valid = true;
    let newErrors: any = {};

    if (validationFunction) {
      for (const key in values) {
        const aux = validationFunction(key, values[key], values);
        if (aux) {
          newErrors = {
            ...newErrors,
            [key]: aux,
          };
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  return {
    values,
    errors,
    handleChange,
    onBlurValidation,
    showErrors,
    setValues,
    valid,
  };
}
