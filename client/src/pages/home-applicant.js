import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../public/pixel.png" 
import * as firebase from 'firebase/app';
import 'firebase/auth';

import {
    Nav,
    Navbar,
    Form,
    FormControl,
    Button,
    Card,
    Modal,
    Col
} from 'react-bootstrap'



class HomeFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.activeTab || "1",
            applicantEmail:"",
            jobs: [],
            count: 0
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.props.history.push('/login');
        }
        else{
          this.setState({applicantEmail: user.email})
          
          fetch('/api/job/all').then(res => res.json()).then(res => {
            let allJobs = res.jobs;
            fetch(`/api/applicant/jobs?email=${this.state.applicantEmail}`).then(res => res.json()).then(res => {
              //Only show jobs that applicatn has not applied to
              const appliedJobs = res.jobs;
              const avaliableJobs = allJobs.filter(job => {
                const {recruiter, role} = job;
                for(let i=0; i<appliedJobs.length; i++){
                  const appliedJob = appliedJobs[i];
                  if (appliedJob.recruiter === recruiter && appliedJob.role === role){
                    return false;
                  }
                }
                return true;
              })
              this.setState({jobs: avaliableJobs});
            })
          })
        }
      })

      
    }
    
  
    handleSelect(selectedTab){
        this.setState({
            activeTab: selectedTab
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

    render() {
        const {applicantEmail} = this.state;
        return (
          <div>
          {
            applicantEmail ? 
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
                        <Nav.Link eventKey="1" >Available Jobs</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">Applied Jobs</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="disabled">Wishlist</Nav.Link>
                    </Nav.Item>
                </Nav>
                {
                  (this.state.activeTab==="1") 
                  && 
                  this.state.jobs.map(job => <ApplicantCards key={++this.state.count} job={job} applicantEmail={applicantEmail} history={this.props.history}/>)
                }

              </div>
            : 
            <h1>Loading!</h1>
          }
          </div>
        );
    }
}



 class ApplicantCards extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          show:false, 
          fileResume:false, 
          fileCover:false, 
          fileVid:false, 
          formDataResume:null, 
          formDataCover:null, 
          formDataVid:null,
          recruiter: null,
          formdata: new FormData()
        }

    }

    handleClose(){
        this.setState({show: false});
    }

    handleShow(){
        this.setState({show: true});
    }
  
    componentDidMount(){
      fetch(`/api/recruiter/?email=${this.props.job.recruiter_email}`).then(res => res.json()).then(res => {
        this.setState({recruiter: res.recruiter})
      })
    }

  handleSubmit(e){
    const {formDataResume, formDataCover, formDataVid} = this.state;
    const recruiter = this.state.recruiter.email;
    const applicant = this.props.applicantEmail;
    const video_name = "";
    const resume_name = "";
    const cover_letter_name = "";
    const {role} = this.props.job;
    const status = 'applied';

    if (recruiter && applicant && formDataVid && formDataResume && formDataCover && role) {
      //Send post with all of the json data to apply for a job
      fetch('/api/application/', {
          method: 'POST',
          body: JSON.stringify({applicant, recruiter, role, status, video_name, resume_name, cover_letter_name}),
          headers: {
            'Content-Type': 'application/json'
          }
      }).then(res => {
        if (res.ok){
          this.props.history.push('/feed')
          //Send post with all of files to apply for a job
          fetch(`/api/application/files?recruiter=${recruiter}&role=${role}&applicant=${applicant}`, {
            method: 'POST',
            body: this.state.formdata
          }).then(res => {
            if (!res.ok){
              //delete application entry due to error in uploading files
              alert('Error uploading documents for last job')
              fetch(`/api/application/?applicant=${applicant}&recruiter=${recruiter}&role=${role}`, {
                method: 'DELETE'
              });
            }
          })
        }
        else{
          alert('Error creating application in db')
        }
      })
    }
    else{
      alert('Submission failed, please choose all files!')
    }
   }

   handleResume(e){
     const files = e.target.files;
     const formdata = new FormData();
     this.state.formdata.append('myResume', files[0])
     formdata.append('myResume', files[0])
     this.setState({formDataResume:formdata})
     if(files){ 
       this.setState({fileResume:true})
     }
   }
   handleCover(e){
    const files = e.target.files;
    const formdata = new FormData();
    this.state.formdata.append('myCover', files[0])
    formdata.append('myCover', files[0])
    this.setState({formDataCover:formdata})
    if(files){
      this.setState({fileCover:true})
    }
  }
  handleVideo(e){
    const files = e.target.files;
    const formdata = new FormData();
    this.state.formdata.append('myVideo', files[0])
    formdata.append('myVideo', files[0]);
    this.setState({formDataVid:formdata})
    if(files){
      this.setState({fileVid:true})
    }
  }

    render(){
      const {experience_level, location, recruiter_email, role, salary} = this.props.job;
      const {recruiter} = this.state;
       return (
         <div>
           {
             recruiter ?
             <div>
              <Card>
                <div className="card flex-row flex-wrap">
                  <div className="card-header border-0">
                    <Card.Img src={recruiter.company_logo_name} alt="Card image" style={{maxWidth:250, maxHeight:250}}/>
                  </div>
                  <div className="card-block">
                    <Card.Body>
                      <Card.Title>{role}</Card.Title>
                      <Card.Text>
                        {recruiter.company}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={this.handleShow.bind(this)}
                      >
                        More info & apply
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
                      <Card.Img src={recruiter.company_logo_name} alt="Card image" style={{maxWidth:150, maxHeight:150}}/>
                    </div>
                  </div>
                  <Modal.Title style={{marginLeft: 15}}>
                    {role},&nbsp; {location}
                    <p> {recruiter.company}</p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {experience_level}
                </Modal.Body>
                <Modal.Footer>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                      <Col>
                      <div className="mb-3">
                          <Form.File id="resume" lang="en"  custom>
                          <Form.File.Input isValid={(this.state.fileResume)} onChange={this.handleResume.bind(this)}/>
                            <Form.File.Label data-browse="Browse" >
                              Upload Resume
                            </Form.File.Label>
                            <Form.Control.Feedback type="valid">
                              Checked!
                            </Form.Control.Feedback>
                          </Form.File>
                        </div>
                      </Col>
                      <Col>
                      <div className="mb-3">
                          <Form.File id="coverLetter" lang="en"  custom>
                          <Form.File.Input isValid={(this.state.fileCover)} onChange={this.handleCover.bind(this)}/>
                            <Form.File.Label data-browse="Browse" >
                              Upload Cover Letter
                            </Form.File.Label>
                            <Form.Control.Feedback type="valid">
                              Checked!
                            </Form.Control.Feedback>
                          </Form.File>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Form.File id="video" lang="en" custom>
                          <Form.File.Input isValid={(this.state.fileVid)} onChange={this.handleVideo.bind(this)}/>
                            <Form.File.Label data-browse="Browse" >
                              Upload Video
                            </Form.File.Label>
                            <Form.Control.Feedback type="valid">
                              Checked!
                            </Form.Control.Feedback>
                          </Form.File>
                        </div>
                      </Col>
                    </Form.Row>
                  <Button
                    variant="secondary"
                    onClick={this.handleClose.bind(this)}
                  >
                    Close
                  </Button>
                  <Button variant="primary" onClick={this.handleSubmit.bind(this)}>Submit</Button>
                  </Form>
                </Modal.Footer>
              </Modal>
           </div>
           :
            <h6>No valid recruiter found</h6>
           }
         </div>
       );
    }
}




export default HomeFeed;