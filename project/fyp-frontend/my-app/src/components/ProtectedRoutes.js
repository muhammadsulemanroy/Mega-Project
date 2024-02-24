import { useSelector} from "react-redux";
import { Outlet ,Navigate} from "react-router-dom";
import Cookies from 'js-cookie';
const ProtectedRoutes = ()=>{

  const token = Cookies.get('token');
 const auth = token !== undefined && token !== null;
    return (
      auth ? <Outlet/> : <Navigate to="/login"/>
    );
}

export default ProtectedRoutes;