import { useState, useRef } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import axiosClient from "../api/axios";
import { Alert } from "react-bootstrap";
import { fetchUser } from "../api/user";
import Loading from "../components/Loading";
import Icon from "../components/Icon";

type Msg = {
  text?: string;
  variant?: string;
};

type SubmitEmailProps = {
  email: string;
};

type SubmitCodeProps = {
  code: string;
};

export default function Login() {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const formRef = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [msg, setMsg] = useState<Msg>({});
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [showCode, setCodeShow] = useState<boolean>(false);

  const {
    formState: { isDirty, errors },
    reset,
    register,
    handleSubmit,
  } = useForm<SubmitEmailProps>({ defaultValues: { email: "" } });

  const onSubmit: SubmitHandler<SubmitEmailProps> = (data) => {
    submit(data);
  };

  const {
    formState: { isDirty: isCodeDirty, errors: codeErrors },
    reset: codeReset,
    register: codeRegister,
    handleSubmit: codeHandleSubmit,
  } = useForm<SubmitCodeProps>({ defaultValues: { code: "" } });

  const onCodeSubmit: SubmitHandler<SubmitCodeProps> = (data) => {
    handleSignIn(data);
  };

  const handleStartOver = () => {
    reset();
    codeReset();
    setMsg({});
    setCodeShow(false);
  };

  async function submit({ email }: SubmitEmailProps) {
    setisLoading(true);
    axiosClient()
      .post("users/request_single_use_code/", { email })
      .then((response) => {
        setMsg({ text: response.data.message, variant: "success" });
      })
      .catch((error) => {
        console.log(error);
        setMsg({
          text: error.response.data.error,
          variant: "danger",
        });
      })
      .finally(() => {
        setCodeShow(true);
        setisLoading(false);
      });
  }

  async function handleSignIn({ code }: SubmitCodeProps) {
    setisLoading(true);
    axiosClient()
      .post("users/verify_single_use_code/", { code })
      .then((response: any) => {
        const decodedToken = JSON.parse(
          atob(response.data.access.split(".")[1])
        );
        fetchUser(`Bearer ${response.data.access}`, decodedToken.user_id)
          .then((currentUser) => {
            const result = signIn({
              auth: {
                token: response.data.access,

                type: "Bearer",
              },
              // refresh: res.refresh,
              userState: {
                id: decodedToken.user_id,
                email: currentUser.email,
                first_name: currentUser.first_name,
                last_name: currentUser.first_name,
                initial: currentUser.initial,
              },
            });
            if (result) {
              setMsg({ text: response.data.success, variant: "success" });
              // Redirect or do something else upon successful login
              navigate(from, { replace: true });
            } else {
              setMsg({ text: "Authentication failed.", variant: "danger" });
            }
          })
          .catch((error) => setMsg({ text: error.message, variant: "danger" }));
      })
      .catch((error) => {
        setMsg({
          text: error.response.data.error || error.message,
          variant: "danger",
        });
        formRef.current?.reset();
      });

    setisLoading(false);
  }

  return (
    <>
      {isAuthenticated && <Navigate to="/" replace={true} />}
      {Object.keys(msg).length !== 0 && (
        <Alert variant={msg.variant} onClose={() => setMsg({})} dismissible>
          {msg.text}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          {...register("email", { required: "* Email is required." })}
          type="email"
          id="email"
          className="form-control"
          autoFocus={true}
          disabled={showCode}
        />
        {errors.email && (
          <p className="alert alert-danger mb-0 p-2">{errors.email?.message}</p>
        )}
        {!showCode && (
          <div className="d-grid mt-3">
            <button
              type="submit"
              className="btn btn-outline-dark"
              disabled={!isDirty || isLoading}
            >
              {isLoading ? <Loading size={"sm"} margin={0} /> : "submit"}
            </button>
          </div>
        )}
      </form>

      {showCode && (
        <form onSubmit={codeHandleSubmit(onCodeSubmit)}>
          <label className="form-label" htmlFor="code">
            Single-Use Code
          </label>
          <input
            {...codeRegister("code", {
              required: "* Code is required.",
              minLength: {
                value: 36,
                message: "The provided code is not valid.",
              },
              maxLength: {
                value: 36,
                message: "The provided code is not valid.",
              },
            })}
            type="password"
            id="code"
            className="form-control"
            autoComplete="off"
          />
          {codeErrors.code && (
            <p className="alert alert-danger mb-0 p-2">
              {codeErrors.code?.message}
            </p>
          )}
          <div className="d-grid mt-3">
            <button
              type="submit"
              className="btn btn-outline-dark"
              disabled={!isCodeDirty || isLoading}
            >
              {isLoading ? <Loading size={"sm"} margin={0} /> : "submit"}
            </button>
          </div>
        </form>
      )}
      <div className="text-center mt-4">
        <Link className="btn btn-link" to="/login">
          sign in with username and password
        </Link>
        {showCode && (
          <div>
            <button className="btn btn-link" onClick={handleStartOver}>
              <Icon icon="arrow-clockwise" />
              start over
            </button>
          </div>
        )}
      </div>
    </>
  );
}
