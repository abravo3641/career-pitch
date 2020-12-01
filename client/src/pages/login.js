import React from "react";
import '../scss/login.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    Form,
    FormCheck,
    FormGroup 
} from "react-bootstrap";

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
        this.state = {isRecruiter:false, isApplicant:true}
    }
    
    submitRegister(e) {
    
    }

    onChangetest(){
        if(!this.state.isRecruiter){
        this.setState({isRecruiter:true, isApplicant:false})
    }else{
        this.setState({isRecruiter:false, isApplicant:true})
    }
        console.log("On change from checkbox recieved")
    }
    render(){
        return(
        <div className="inner-container">
            <div className="header">
                Register
            </div>
            <div className="box">
                <FormGroup controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recruiter?" onChange={this.onChangetest.bind(this)} />
                </FormGroup> 
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
                
                <div>  
                {this.state.isRecruiter && <RegisterRecruiter /> }
                {this.state.isApplicant && <RegisterApplicant />}
                </div>
            <button type="button" className="login-btn" onClick={this.submitRegister.bind(this)}>Submit</button>

            </div>
        </div>)

    }

}

class RegisterRecruiter extends React.Component {
    
   
    
    render(){
        return(
            <div>
            <div className="input-group"> 
                    <label htmlFor="name">Company Name</label>
                    <input type="text" name="Company" className="login-input" placeholder="Company Name" />
               </div>
               <div className="input-group"> 
                    <label htmlFor="email">Role</label>
                    <input type="text" name="Role" className="login-input" placeholder="Role" />
               </div>
                 <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                     <Form.Label>Company Info</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                </Form.Group>
                    <Form.Group>
                         <Form.File id="CompanyLogo" label="Company Logo" />
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

class RegisterApplicant extends React.Component {
     
    render(){
        return(
            <div>
            <div className="input-group"> 
                    <label htmlFor="name">School Name</label>
                    <input type="text" name="School" className="login-input" placeholder="School Name" />
               </div>
               <div className="input-group"> 
                    <label htmlFor="name">Role</label>
                    <input type="text" name="Role" className="login-input" placeholder="Role" />
               </div>
               <div className="input-group"> 
                    <label htmlFor="year">Year</label>
                    <input type="text" name="Year" className="login-input" placeholder="Year" />
               </div>
               <div className="input-group"> 
                    <label htmlFor="Location">Location</label>
                    <input type="text" name="Location" className="login-input" placeholder="Location" />
               </div>
               <div className="input-group"> 
                    <label htmlFor="name">GPA</label>
                    <input type="text" name="GPA" className="login-input" placeholder="GPA" />
               </div>
               
                 <Form>
                    <Form.Group>
                         <Form.File id="ProfilePicture" label="Profile Picture" />
                    </Form.Group>
                </Form>

            </div>
        )
    }
}





export default LoginPage;