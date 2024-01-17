import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';


const PrivateRoute = () => {
    const token = Cookies.get("token");
    let auth = {"token":false};

    if (token){
        auth = {'token':true};
    }

    return (
        auth.token ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default PrivateRoute;