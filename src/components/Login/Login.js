import React, { useState,useEffect,useReducer } from "react";
import Input from "../UI/Input/Input";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.payload, isValid: action.payload.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state,action)=>{
  if(action.type === "USER_INPUT"){
    return{ value:action.payload, isValid:action.payload.trim().length >6}
  }
  if(action.type === "USER_BLUR"){
    return{ value: state.value , isValid: state.value.trim().length>6}
  }
  return { value :"", isValid: false}
}


const Login = (props) => {
  
  const [formIsValid, setFormIsValid] = useState(false);
  
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });  

  const {isValid: emailIsValid}= emailState
  const {isValid: passwordIsValid}= passwordState
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    },500)
    
    return ()=>{
      clearTimeout(timer)
    }
  },[emailIsValid,passwordIsValid])
  
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", payload: event.target.value });

    setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", payload:event.target.value});
    
    setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: "INPUT_BLUR"});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
        type="email" 
        id="email" 
        label="E-Mail" 
        value={emailState.value} 
        onChange={emailChangeHandler} 
        onBlur={validateEmailHandler}
        isValid={emailIsValid}
        />
        <Input 
        type="password" 
        id="password" 
        label="Password" 
        value={passwordState.value} 
        onChange={passwordChangeHandler} 
        onBlur={validatePasswordHandler}
        isValid={passwordIsValid}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
