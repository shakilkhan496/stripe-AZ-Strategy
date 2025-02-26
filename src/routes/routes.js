import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import Success from "../pages/Success";
import NotFound from "../404/NotFound";
import CheckoutSuccess from "../pages/CheckoutSuccess";

export const route = createBrowserRouter([{
    path: '/',
    element: <Main />,
    errorElement: <NotFound></NotFound>,
    children: [
        {
            path: '/',
            element: <Home></Home>,

        },
        {
            path: '/success',
            element: <Success></Success>
        },
        {
            path: '/checkout-success',
            element: <CheckoutSuccess></CheckoutSuccess>
        }
    ]
}])