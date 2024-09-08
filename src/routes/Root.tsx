import { Suspense } from "react";
import { useNavigation } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Footer from "../components/Footer";

export default function Root() {
  const navigation = useNavigation();
  return (
    <>
      <Header />
      <div
        className="container mb-5"
        id="main-content"
        style={{ minHeight: "calc(100vh - 236px)" }}
      >
        {navigation.state === "loading" && <Loading />}
        <Suspense fallback={<Loading />}>
          <AuthOutlet fallbackPath="/login" />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
