import React from "react";
import '../scss/login.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';

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
                    {this.state.isLoginOpen && <LoginBox history={this.props.history}/> }
                    {this.state.isRegisterOpen && <RegisterBox history={this.props.history}/>}
                </div>
            </div>) 
    }
}

class LoginBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            isRecruiter: false 
        };
    }

    submitLogin(e) {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(data => {
            //Verify that they are an applicant/recruiter by hitting db 
            if(this.state.isRecruiter){
                console.log('Recruiter logging');
                fetch(`/api/recruiter/?email=${this.state.email}`).then(res => {
                    if (res.ok){
                        this.props.history.push("/feedRecruiter");
                    }
                    else{
                        alert('you are not a recruiter!')
                    }
                })
            }
            else{
                console.log('Applicant logging');
                fetch(`/api/applicant/?email=${this.state.email}`).then(res => {
                    if (res.ok){
                        this.props.history.push("/feed");
                    }
                    else{
                        alert('you are not an applicant!')
                    }
                })
            }
        }).catch( error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            alert('invalid credentials')
            this.setState({email:"", password:""});
        });

    }

    checkboxChanged(e){
        this.state.isRecruiter = !this.state.isRecruiter;
    }

    inputChanged(e){
        const {name, value} = e.target;
        this.setState({[name]:value});
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
                    <input type="text" name="email" className="login-input" placeholder="Email-Adress" value={this.state.email} onChange={this.inputChanged.bind(this)}/>
               </div>

               <div className="input-group"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="login-input" placeholder="Password" value={this.state.password} onChange={this.inputChanged.bind(this)}/>
               </div>
                <FormGroup controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recruiter?" onChange={this.checkboxChanged.bind(this)}/>
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

    onChangetest(){
        if(!this.state.isRecruiter){
        this.setState({isRecruiter:true, isApplicant:false})
        }else{
        this.setState({isRecruiter:false, isApplicant:true})
        }
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
                
                <div>  
                    {this.state.isRecruiter && <RegisterRecruiter history={this.props.history}/> }
                    {this.state.isApplicant && <RegisterApplicant history={this.props.history}/>}
                </div>
                
            </div>
        </div>)

    }

}

class RegisterRecruiter extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            "email": "",
            "name":"",
            "company":"",
            "role":"",
            "company_logo_name": "",
            "company_info":"",
            "password":"",
            "logo_data": null
        }
    }

    handleChange(e){
        const {name, value} = e.target;
        this.setState({[name]: value});
    }
    
    submitRegister(e) {
        const {email, name, company, role, logo_data, company_info, password} = this.state;
        if (email && name && company && role && logo_data && company_info && password) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(data => {
                let usr = {...this.state};
                delete usr.password;
                delete usr.logo_data
                fetch('/api/recruiter/',{
                    method:'POST',
                    body: JSON.stringify(usr),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    if(res.ok) {
                        console.log('Created user successfully');
                        // upload company logo
                        fetch(`/api/recruiter/company_logo?email=${usr.email}`, {
                            method: 'POST',
                            body: this.state.logo_data
                        }).then(res => {
                            if (res.ok){
                                console.log('uploaded image successfully');
                                console.log('sucessfully created recruiter');
                                this.props.history.push("/feedRecruiter");
                            }
                            else{
                                alert('Error uploading pic')
                                firebase.auth().currentUser.delete()
                                fetch(`/api/recruiter/?email=${usr.email}`, {
                                    method: 'DELETE'
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            firebase.auth().currentUser.delete()
                            alert('Error uploading pic')
                        })
                    }
                    else {
                        firebase.auth().currentUser.delete()
                        alert('Error creating recruiter in db')
                    }
                })
            }).catch(err => {
                console.log(err);
                alert('Error creating recruiter in firebase');
            })
        }
        else{
            alert('Please fill all fields!')
        }
    }

    handle_company_pic(e){
        const files = e.target.files;
        const formdata = new FormData();
        formdata.append('myFile', files[0]);
        this.setState({logo_data:formdata});
    }
    
    render(){
        return(
            <div>
                <div className="input-group"> 
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={this.name} className="login-input" placeholder="Name" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={this.email} className="login-input" placeholder="Email-Adress" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={this.password} className="login-input" placeholder="Password" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="name">Company Name</label>
                    <input type="text" name="company" value={this.company} className="login-input" placeholder="Company Name" onChange={this.handleChange.bind(this)} />
               </div>

               <div className="input-group"> 
                    <label htmlFor="email">Role</label>
                    <input type="text" name="role" value={this.role} className="login-input" placeholder="Role" onChange={this.handleChange.bind(this)} />
               </div>

               <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1" >
                        <Form.Label>Company Info</Form.Label>
                        <Form.Control as="textarea" rows={3} name="company_info" value={this.state.company_info} onChange={this.handleChange.bind(this)} />
                    </Form.Group>
                    <Form.Row>
                        <Form.File id="company_logo" lang="en"  custom>
                        <Form.File.Input isValid={(Boolean(this.state.logo_data))} onChange={this.handle_company_pic.bind(this)}/>
                            <Form.File.Label data-browse="Browse" >
                            Company Logo
                            </Form.File.Label>
                            <Form.Control.Feedback type="valid">
                            Checked!
                            </Form.Control.Feedback>
                        </Form.File>
                    </Form.Row>
                </Form>
                <button type="button" className="login-btn" onClick={this.submitRegister.bind(this)}>Submit</button>
            </div>
        )
    }
}

class RegisterApplicant extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            "current_location": "",
            "email": "",
            "gpa": 0,
            "name": "",
            "picture_name": "",
            "school_name": "",
            "school_year": "",
            "password": "",
            "picture_data": null
        }
    }

    submitRegister(e) {
        this.state.gpa = Number(this.state.gpa);
        const {current_location, email, gpa, name, school_name, school_year, password, picture_data} = this.state;
        if (current_location && email && gpa && name && school_name && school_year && password && picture_data) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(data => {
                let usr = {...this.state};
                delete usr.password;
                delete usr.picture_data
                fetch('/api/applicant/',{
                    method:'POST',
                    body: JSON.stringify(usr),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    if(res.ok) {
                        console.log('Created user successfully');
                        // upload profile pic
                        fetch(`/api/applicant/profile_pic?email=${usr.email}`, {
                            method: 'POST',
                            body: this.state.picture_data
                        }).then(res => {
                            if (res.ok){
                                console.log('uploaded image successfully')
                                this.props.history.push("/feed");
                            }
                            else{
                                alert('Error uploading pic')
                                firebase.auth().currentUser.delete()
                                fetch(`/api/applicant/?email=${usr.email}`, {
                                    method: 'DELETE'
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            firebase.auth().currentUser.delete()
                            alert('Error uploading pic')
                        })
                    }
                    else {
                        firebase.auth().currentUser.delete()
                        alert('Error creating applicant in db')
                    }
                })

            }).catch(err => {
                console.log(err);
                alert('Error creating applicant in firebase');
            })
        }
        else {
            alert('Please fill all fields!')
        }
    }

    handle_profile_pic(e){
        const files = e.target.files;
        const formdata = new FormData();
        formdata.append('myFile', files[0]);
        this.setState({picture_data:formdata});
    }

    handleChange(e){
        const {name, value} = e.target;
        this.setState({[name]: value});
    }
     
    render(){
        return(
            <div>
                <div className="input-group"> 
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={this.name} className="login-input" placeholder="Name" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={this.email} className="login-input" placeholder="Email-Adress" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={this.password} className="login-input" placeholder="Password" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="name">School Name</label>
                    <input type="text" name="school_name" value={this.school_name} className="login-input" placeholder="School Name" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="year">School Year</label>
                    <input type="text" name="school_year" value={this.school_year} className="login-input" placeholder="Year" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="Location">Current Location</label>
                    <input type="text" name="current_location" value={this.current_location} className="login-input" placeholder="Location" onChange={this.handleChange.bind(this)} />
                </div>

                <div className="input-group"> 
                    <label htmlFor="name">GPA</label>
                    <input type="number" name="gpa" value={this.gpa} className="login-input" placeholder="GPA" onChange={this.handleChange.bind(this)} />
                </div>
               
                <Form>
                    <Form.Row>
                        <Form.File id="profile_pic" lang="en"  custom>
                        <Form.File.Input isValid={(Boolean(this.state.picture_data))} onChange={this.handle_profile_pic.bind(this)}/>
                            <Form.File.Label data-browse="Browse" >
                            Upload Profile Pic
                            </Form.File.Label>
                            <Form.Control.Feedback type="valid">
                            Checked!
                            </Form.Control.Feedback>
                        </Form.File>
                    </Form.Row>
                </Form>
                <button type="button" className="login-btn" onClick={this.submitRegister.bind(this)}>Submit</button>
            </div>
        )
    }
}





export default LoginPage;