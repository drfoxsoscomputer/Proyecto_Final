import * as Yup from "yup";
import YupPassword from "yup-password";
import { Formik, Field, FastField, Form, ErrorMessage } from "formik";
import { Button, Input, NavbarItem } from "@nextui-org/react";
import userLog from "../Auth0/Send";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
YupPassword(Yup);
import { login } from "../../redux/actions";
import LoginButton from "../Auth0/LoginButton";
import { useDispatch } from "react-redux";
import FormRegistrer from "./FormRegistrer";
import Modal from "../../Modal/Modal";
import logo from "../NavBar/logo.png";
import { CiMail } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormularioLogin = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let user = {
    email: "",
    password: "",
    sub: null,
    isLogin: true,
  };

  const [viewPassword, setViewPassword] = useState(false);

  const handlerPassword = () => {
    setViewPassword(!viewPassword);
  };
  const requiredField = () => Yup.string().required("Campo Requerido");

  const passwordField = () =>
    requiredField()
      .min(8, "La contraseña debe contener 8 o más caracteres con al menos: una mayúscula, una minúscula, un número y un símbolo")
      .minLowercase(1, "Debe contener al menos 1 letra minúscula")
      .minUppercase(1, "Debe contener al menos 1 letra mayúscula")
      .minNumbers(1, "Debe contener al menos 1 número")
      .minSymbols(1, "Debe contener al menos 1 carácter especial");

  const formSchema = Yup.object().shape({
    email: Yup.string().email("Email Inválido").required("Campo Requerido"),
    password: passwordField(),
  });

  const loginUser = async (values, setFieldValue) => {
    const response = await userLog(values);

    if (response) {
      dispatch(login(response));
      navigate("/home");
      onClose();
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <img
          src={logo}
          alt="logo"
          className="h-[60px] w-auto"
        />
      </div>
      <br />
      <div className="flex items-center justify-center">
        <NavbarItem>
          <LoginButton />
        </NavbarItem>
      </div>

      <Formik
        initialValues={user}
        validationSchema={formSchema}
        onSubmit={async (values, setFieldValue) => {
          await loginUser(values, setFieldValue);
        }}>
        {({ values, setFieldValue }) => (
          <Form>
            <FastField name="email">
              {({ field }) => (
                <Input
                  {...field}
                  type="email"
                  label="Email"
                  // variant="underlined"
                  size="sm"
                  className="my-2"
                  endContent={<CiMail className="text-2xl text-default-400" />}
                />
              )}
            </FastField>
            <ErrorMessage
              name="email"
              component="div"
              className="mt-1 text-sm text-red-600"
            />

            <div className="mb-4">
              <FastField name="password">
                {({ field }) => (
                  <Input
                    {...field}
                    label="Contraseña"
                    // placeholder="Ingrese su contraseña..."
                    size="sm"
                    className="my-2"
                    endContent={
                      <button
                        className="focus:outline-none"
                        // type="button"
                        onClick={handlerPassword}>
                        {viewPassword ? <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" /> : <FaEye className="text-2xl text-default-400 pointer-events-none" />}
                      </button>
                    }
                    type={!viewPassword ? "password" : "text"}
                  />
                )}
              </FastField>
              <ErrorMessage
                name="password"
                component="div"
                className="mt-2 text-sm text-red-600"
              />
            </div>
            <div className="flex items-center justify-center">
              <Button
                className="my-6"
                type="submit"
                color="primary">
                Ingresar
              </Button>
            </div>

            <div className="flex justify-center items-center">
              <h3 className="mr-5">¿No tiene una cuenta?</h3>
              <Modal
                textButton="Registrese"
                title="Cree su usuario"
                body={({ onClose }) => <FormRegistrer onClose={onClose} />}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormularioLogin;
