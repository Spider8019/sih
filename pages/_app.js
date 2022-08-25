import "../styles/globals.css";
import Layout from "../components/layouts";
//import { SessionProvider } from "next-auth/react"
import Router from "next/router";
import Head from "next/head";
import NProgress from "nprogress";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const NestedLayout = Component.Layout || EmptyLayout;
  const router = useRouter();
  NProgress.configure({ showSpinner: false });

  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <Layout>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
            integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0"
          />
          <title>tinkerchild - IITJAMMU</title>
          <meta type="keyword" content="SIH HACKATHON" />
        </Head>
        <ToastContainer />
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </ThemeProvider>
  );
}

// MONGOOSE_MONGODB_URI=mongodb+srv://ikshvaku:bpE4EhY63d2UlyC7@cluster0.pjhsa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// "mongodb://localhost:27017/ikshvakuDB"
const EmptyLayout = ({ children }) => {
  return <>{children}</>;
};

export default MyApp;
