import React, { useEffect,useState } from "react";
import { GetCurrentuser } from "../api/users";
// import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { Hideloading, ShowLoading } from "../redux/loadersSlice";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import Switch from '@mui/material/Switch';
import ReactDOM from 'react-dom';


function ProtecdRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { loading } = useSelector((state) => state.loaders);
  const [checked, setChecked] = React.useState(false);

  const { user } = useSelector((state) => state.users);

  const handleChange1 = (event) => {
    setChecked(event.target.checked);
    
  };

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoading());

      const response = await GetCurrentuser();

      dispatch(Hideloading());

      if (response.success) {
        //setUser(response.data);
        dispatch(SetUser(response.data));

        // message.success("Login succesful");
      } else {
        //setUser(null);
        dispatch(SetUser(null));
        // message.error(response.message);
      }
    } catch (error) {
      //setUser(null);
      dispatch(SetUser(null));
      dispatch(Hideloading);
      return error.message;
    }
  };


 
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    user && (
      <div>
          <div className="p-2 container-fluid bg-dark text-white d-flex justify-content-between">
          <div className="display-1 cursor-pointer"
          onClick={()=>{
            navigate("/");
          }}
          
          >TODO...   Welcome</div>
          <div className="d-inline-flex h-50 bg-white text-dark justify-content-between mt-4 p-1">
            <div
              className="display-6 mb-2 ">
              {user.name}
            </div>
            <LogoutIcon fontSize="large" className="mt-2 ml-4 cursor-pointer"
            onClick={()=>{
              localStorage.removeItem("token");
              navigate("/login")
            }}
            />
          </div>
        </div>
        <div className={checked ?"contentbg bg-dark text-white" :"content m-1 p-1"}>
          {children}
        <div className="d-flex justify-content-end">
        <p className="mt-1">{checked ?"Light" :"HighLight"}</p><Switch
      checked={checked}
      onChange={handleChange1}
      inputProps={{ 'aria-label': 'controlled' }}
    />
        </div>
        </div>
      </div>
    )
  );
}

export default ProtecdRoute;
