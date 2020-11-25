import React from "react";
import reactDom from "react-dom"
import '../scss/login.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormCheck from 'react-bootstrap/FormCheck'
import FormGroup from 'react-bootstrap/FormGroup'
import { Form } from "react-bootstrap";

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = { isRegisterOpen: false, isLoginOpen:true}
    }

    showActiveLoginBox(){
        this.setState({isRegisterOpen: false, isLoginOpen: true});
    }

    showActiveRegisterBox(){
        this.setState({isRegisterOpen: true, isLoginOpen: false});
    }

    render(){
        return(
            <div className='root-container'>
              <div className="box-controller">
                <div className="controller" onClick={this.showActiveLoginBox.bind(this)}>
                    Login
                </div>
                <div className="controller" onClick={this.showActiveRegisterBox.bind(this)}>
                    Register
                </div>
               </div>
                <div className="box-container">
                    {this.state.isLoginOpen && <LoginBox /> }
                    {this.state.isRegisterOpen && <RegisterBox />}
                </div>
            </div>) 
    }
}

class LoginBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    
    submitLogin(e) {
        
    }

    render(){
        return(
        <div className="inner-container">
            <div className="header">
                Login
            </div>
            <div className="box">
               <div className="input-group"> 
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" className="login-input" placeholder="Email-Adress" />
               </div>

               <div className="input-group"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="login-input" placeholder="Password" />
               </div>
               <FormGroup controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recruiter?" />
                </FormGroup>
            <button type="button" className="login-btn" onClick={this.submitLogin.bind(this)}>Submit</button>

            </div>
        </div>)

    }

}



class RegisterBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    
    submitRegister(e) {
    
    }

    render(){
        return(
        <div className="inner-container">
            <div className="header">
                Register
            </div>
            <div className="box">
               <div className="input-group"> 
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" className="login-input" placeholder="Name" />
               </div>
               <div className="input-group"> 
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" className="login-input" placeholder="Email-Adress" />
               </div>

               <div className="input-group"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="login-input" placeholder="Password" />
               </div>
               <FormGroup controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recruiter?" />
                </FormGroup>            
            <button type="button" className="login-btn" onClick={this.submitRegister.bind(this)}>Submit</button>

            </div>
        </div>)

    }

}




// reactDom.render(<App />, document.getElementById("root") );

// const LoginPage = () => {
//     return(
//         <div>
//             <h1>This is a router test</h1>
//             <h3>Login Page</h3>
//         </div>
//     )
// };

export default LoginPage;