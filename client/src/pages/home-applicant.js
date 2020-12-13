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

import "video-react/dist/video-react.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Player } from 'video-react';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



class HomeFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.activeTab || "1",
            applicantEmail:"",
            jobs: [],
            count: 0,
            myApplications: []
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.props.history.push('/');
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

          fetch(`/api/application/email?applicant=${this.state.applicantEmail}`).then(res => res.json()).then(res => {
            this.setState({myApplications: res.applications})
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
        this.props.history.push('/');
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
                {
                  (this.state.activeTab==="2")
                  &&
                  this.state.myApplications.map(application => <ApplicationCards key={++this.state.count} application={application} recruiterEmail={application.recruiter}/>)
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

// ------------------



class ApplicationCards extends React.Component {
  constructor(props){
      super(props);
      this.state = {show:false}
      this.state = {fileResume:false, fileCover:false, fileVid:false}
      this.state = { formDataResume:null, formDataCover:null, formDataVid:null }
      this.state = {isOpen: false}
      this.state = {showPdfCover: false, showPdfResume: false}
      this.applicant = null
      this.recruiter_obj = null
  }

  componentDidMount(){
    fetch(`/api/applicant/?email=${this.props.application.applicant}`).then(res => res.json()).then(res => this.setState({applicant: res.applicant}))
    fetch(`/api/recruiter/?email=${this.props.recruiterEmail}`).then(res => res.json()).then( res => this.setState({recruiter_obj: res.recruiter}))
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
    const {applicant, recruiter_obj} = this.state;
    const {recruiter, role, status, resume_name, conver_letter_name, video_name} = this.props.application;
     return (
       <div>
        {
          applicant && recruiter_obj ?
            <div> 
              <Card>
                  <div className="card flex-row flex-wrap">
                    <div className="card-header border-0">
                      <Card.Img width="100%" src={recruiter_obj.company_logo_name} alt="Card image" style={{maxWidth:250, maxHeight:250}}/>
                    </div>
                    <div className="card-block">
                      <Card.Body>
                        <Card.Title>{role}</Card.Title>
                        <Card.Text>
                          {recruiter_obj.company}
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


export default HomeFeed;