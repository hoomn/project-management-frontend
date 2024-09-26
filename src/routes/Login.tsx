import { useState } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { Alert } from "react-bootstrap";

import Loading from "../components/Loading";

import axiosClient from "../api/axios";
import { fetchUser } from "../api/user";

type MsgProps = {
  text?: string;
  variant?: string;
};

type LoginProps = {
  email: string;
  password: string;
};

export default function Login() {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [msg, setMsg] = useState<MsgProps>({});
  const [isLoading, setisLoading] = useState<boolean>(false);

  const {
    formState: { isDirty, errors },
    reset,
    register,
    handleSubmit,
  } = useForm<LoginProps>({ defaultValues: { email: "", password: "" } });

  const onSubmit: SubmitHandler<LoginProps> = (data) => {
    login(data);
  };
  // const onSubmit: SubmitHandler<LoginProps> = (data) => console.log(data);

  async function login({ email, password }: LoginProps) {
    setisLoading(true);

    try {
      const response = await axiosClient().post("token/", { email, password });
      const decodedToken = JSON.parse(atob(response.data.access.split(".")[1]));

      try {
        // Fetch user info using the JWT token
        const currentUser = await fetchUser(`Bearer ${response.data.access}`, decodedToken.user_id);
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
          reset();
        }
      } catch (error: any) {
        console.error("Error:", error);
        setMsg({
          text: error.response.data.detail || error.message,
          variant: "danger",
        });
        reset();
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMsg({
        text: error.response.data.detail || error.message,
        variant: "danger",
      });
      reset();
    }
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
        />
        {errors.email && <p className="alert alert-danger mb-0 p-2">{errors.email?.message}</p>}
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          {...register("password", { required: "* Password is required." })}
          type="password"
          id="password"
          className="form-control"
          autoComplete="password"
        />
        {errors.email && <p className="alert alert-danger mb-0 p-2">{errors.email?.message}</p>}
        <div className="d-grid mt-3">
          <button type="submit" className="btn btn-outline-dark" disabled={!isDirty || isLoading}>
            {isLoading ? <Loading size={"sm"} margin={0} /> : "sign in"}
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <Link className="btn btn-link" to="/login/code/">
          sign in with a single-use code
        </Link>
      </div>
    </>
  );
}
