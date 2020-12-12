import React from "react";
import {
    Nav,
    Navbar,
    Form,
    FormControl,
    Button,
    Card,
    Modal
} from 'react-bootstrap';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../public/pixel.png"; 
import '../scss/login.scss';
import "video-react/dist/video-react.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Player } from 'video-react';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;




class HomeFeedRecruiter extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.activeTab || "1",
            recruiterEmail: "",
            applications: [],
            count:0
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.props.history.push('/login');
        }
        else{
          this.setState({recruiterEmail: user.email})
          fetch('/api/application/all').then(res => res.json()).then(res => {
            const validApplications = res.applications.filter(application => application.recruiter === this.state.recruiterEmail);
            this.setState({applications: validApplications});
          })
        }
      })
    }

    logoutClicked() {
      firebase.auth().signOut().then(() => {
        //Logged out sucessful
        console.log('Logged user out successfully');
        this.props.history.push('/login');
      }).catch((err) => {
        //Handle error
        console.log(`Error: ${err}`);
      })
    }
  
    handleSelect(selectedTab){
        this.setState({
            activeTab: selectedTab
        })
    }

    render() {
      const {recruiterEmail} = this.state;
        return (
            <div>
              {
                recruiterEmail ? 
                <div>
                  <Navbar bg="light" variant="light">
                    <Navbar.Brand href="#home">Career Pitch</Navbar.Brand>
                    <Nav className="mr-auto">
                      <Nav.Link href="#home">Profile</Nav.Link>
                    </Nav>
                    <Form inline>
                      <FormControl
                        type="text"
                        placeholder="Search"
                        className="mr-sm-2"
                      />
                      <Button variant="outline-primary" onClick={this.logoutClicked.bind(this)}>Logout</Button>
                    </Form>
                  </Navbar>

                  <Nav fill variant="tabs" defaultActiveKey="1" onSelect={this.handleSelect} activeKey={this.state.activeTab}>
                  <Nav.Item>
                      <Nav.Link eventKey="1" >Applicants</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="2">Post a Job</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="disabled">Candidates</Nav.Link>
                  </Nav.Item>
                  </Nav>
                  {(this.state.activeTab==="1") && this.state.applications.map(application => <ApplicantCards key={++this.state.count} application={application} recruiterEmail={recruiterEmail}/>)}
                  {(this.state.activeTab==="2") && <PostJob recruiterEmail = {recruiterEmail}/> }
                </div>
                :
                <h1>Please log in!</h1>
              }
              
                
          </div>
        );
    }
}



 class ApplicantCards extends React.Component {
    constructor(props){
        super(props);
        this.state = {show:false}
        this.state = {fileResume:false, fileCover:false, fileVid:false}
        this.state = { formDataResume:null, formDataCover:null, formDataVid:null }
        this.state = {isOpen: false}
        this.state = {showPdfCover: false, showPdfResume: false}
        this.applicant = null
    }

    componentDidMount(){
      fetch(`/api/applicant/?email=${this.props.application.applicant}`).then(res => res.json()).then(res => this.setState({applicant: res.applicant}))
    }

    openVid(){
        this.setState({isOpen:true})
    }
    closeVid(){
        this.setState({isOpen:false})
    }
    openPdfCover(){
        this.setState({showPdfCover:true});
    }
    
    openPdfResume(){
        this.setState({showPdfResume:true})
    }
    
    closePdf(){
        this.setState({showPdfCover:false, showPdfResume:false})
    }
    
    handleClose(){
        this.setState({show: false});
    }
    handleShow(){
        this.setState({show: true});
    }
   

  handleSubmit(e){
      
   }

   handleResume(e){

   }
   handleCover(e){
 
  }
  handleVideo(e){
   
  }

    render(){
      const {applicant} = this.state;
      const {recruiter, role, status, resume_name, conver_letter_name, video_name} = this.props.application;
       return (
         <div>
          {
            applicant ?
              <div> 
                <Card>
                    <div className="card flex-row flex-wrap">
                      <div className="card-header border-0">
                        <Card.Img width="100%" src={applicant.picture_name} alt="Card image" style={{maxWidth:250, maxHeight:250}}/>
                      </div>
                      <div className="card-block">
                        <Card.Body>
                          <Card.Title>{applicant.name}</Card.Title>
                          <Card.Text>
                            {role}
                          </Card.Text>
                          <Button
                            variant="primary"
                            onClick={this.handleShow.bind(this)}
                          >
                            View Application
                          </Button>
                        </Card.Body>
                      </div>
                    </div>
                  </Card>
                  <Modal
                    show={this.state.show}
                    onHide={this.handleClose.bind(this)}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <div className="card flex-row flex-wrap">
                        <div className="card-header border-0">
                          <Card.Img src={applicant.picture_name} alt="Card image" style={{maxWidth:150, maxHeight:150}}/>
                        </div>
                      </div>
                      <Modal.Title style={{marginLeft: 15}}>
                        {applicant.name}
                        <p> {role} </p>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span style={{fontWeight: 'bold', marginLeft: '10px'}}>School:</span> {applicant.school_name}
                        <div style={{float: 'right', marginRight:'20px'}}> <span style={{fontWeight: 'bold'}}>GPA:</span> {applicant.gpa} </div> <br/>
                        <span style={{fontWeight: 'bold', marginLeft: '10px'}}>School Year:</span> {applicant.school_year}
                        <div style={{float:'right', marginRight:'20px'}}> <span style={{fontWeight: 'bold'}}>Location:</span> {applicant.current_location} </div> <br/>
                    </Modal.Body>
                    <Modal.Footer>
                      <div className="mb-2">
                            <Button variant="secondary" size="lg" onClick={this.openPdfResume.bind(this)}> Show Resume </Button> {' '}
                            <Button variant="secondary" size="lg" onClick={this.openPdfCover.bind(this)} > Show Cover Letter</Button> {' '}
                            <Button variant="secondary" size="lg" onClick={this.openVid.bind(this)}>Play Video</Button> 
                        </div>
                      <Button
                        variant="secondary"
                        onClick={this.handleClose.bind(this)}
                      >
                        Close
                      </Button>
                      <Button variant="primary" type="submit" onClick={this.handleSubmit.bind(this)}>Respond</Button> 
                    </Modal.Footer>
                  </Modal>
                  <Modal
                    show={this.state.isOpen}
                    onHide={this.closeVid.bind(this)}
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                      <Player
                        playsInline
                        poster={applicant.picture_name}
                        src={video_name}
                        />
                  </Modal>
                  <Modal
                    show={this.state.showPdfCover}
                    onHide={this.closePdf.bind(this)}
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                      {<ViewPdfCoverLetter url={conver_letter_name}/>}
                  </Modal>
                  <Modal
                    show={this.state.showPdfResume}
                    onHide={this.closePdf.bind(this)}
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                      {<ViewPdfResume url={resume_name}/>}
                  </Modal>
              </div>
            :
              <h1>Loading</h1>
          }
         </div>
       );
    }
}


class PostJob extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          role: "",
          experience_level: "",
          location: "",
          salary: ""
        }

    }

    submitClicked(){
      const {recruiterEmail} = this.props;
      const {role, experience_level, location, salary} = this.state;
      if (role && experience_level && location && salary){
        this.state.salary = Number(this.state.salary.replace(',', '').replace('k', '000').replace('K', '000'));
        const job = {...this.state, recruiter_email:recruiterEmail};
        fetch('/api/job/', {
          method: 'POST',
          body: JSON.stringify(job),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (!res.ok) {
            alert('Error posting a job. Role mirght exist!')
          }
        })

        this.setState({role:"", experience_level:"", location:"", salary:""});
      }
      else{
        alert('Please fill all fields!');
      }
      
    }

    inputChanged(e){
      const {name, value} = e.target;
      this.setState({[name]: value});
    }

    render(){
        return (
          <div className="root-container">
            <div className="box-container">
              <Form>
                <Form.Group controlId="JobTitle">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control placeholder="Role" name="role" value={this.state.role} onChange={this.inputChanged.bind(this)}/>
                  {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else. Muted text goes here
              </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="Location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control placeholder="ex. New York" name="location" value={this.state.location} onChange={this.inputChanged.bind(this)} />
                </Form.Group>
                <Form.Group controlId="SalaryRange">
                  <Form.Label>SalaryRange</Form.Label>
                  <Form.Control placeholder="in US dollars per year" name="salary" value={this.state.salary} onChange={this.inputChanged.bind(this)} />
                </Form.Group>
                <Form.Group controlId="ExperienceLevel">
                  <Form.Label>Experience Level Info</Form.Label>
                  <Form.Control as="textarea" rows={3} name="experience_level" value={this.state.experience_level} onChange={this.inputChanged.bind(this)}/>
                </Form.Group>
                <Button variant="primary" onClick={this.submitClicked.bind(this)}>
                  Post Job
                </Button>
              </Form>
            </div>
          </div>
        );
    }
}

class ViewPdfCoverLetter extends React.Component {
   

    constructor(props){
        super(props);
        this.state = {numPages:null,pageNumber: 1}
        
    }
    

    onDocumentLoadSuccess({ numPages }) {
        this.setState({numPages: numPages})
      }
    
    render(){
        return (
            <div>
                {/* // "https://cors-anywhere.herokuapp.com/" is the cors header , add the s3 link afterwards */}
            <Document
              file={"https://cors-anywhere.herokuapp.com/"+ this.props.url}
              onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
              onLoadError={console.error}
            >
              <Page pageNumber={this.state.pageNumber} />
            </Document>
            <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
          </div>
        );
    }
}

class ViewPdfResume extends React.Component {
   

    constructor(props){
        super(props);
        this.state = {numPages:null,pageNumber: 1}
        
    }
    

    onDocumentLoadSuccess({ numPages }) {
        this.setState({numPages: numPages})
      }
    
    render(){
        return (
            <div>
                {/* // "https://cors-anywhere.herokuapp.com/" is the cors header , add the s3 link afterwards */}
            <Document
              file={"https://cors-anywhere.herokuapp.com/"+ this.props.url}
              onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
              onLoadError={console.error}
            >
              <Page pageNumber={this.state.pageNumber} />
            </Document>
            <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
          </div>
        );
    }
}

export default HomeFeedRecruiter;