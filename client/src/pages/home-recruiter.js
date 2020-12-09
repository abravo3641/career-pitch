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
            recruiterEmail: ""
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
        console.log(selectedTab)
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
                  {(this.state.activeTab==="1") && <ApplicantCards /> }
                  {(this.state.activeTab==="2") && <PostJob /> }
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
          
    }

    openVid(){
        this.setState({isOpen:true})
    }
    closeVid(){
        this.setState({isOpen:false})
    }
    openPdfCover(){
        this.setState({showPdfCover:true});
        // window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
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
       return (
         <div>
           <Card>
             <div className="card flex-row flex-wrap">
               <div className="card-header border-0">
                 <Card.Img top width="100%" src={Logo} alt="Card image" />
               </div>
               <div className="card-block">
                 <Card.Body>
                   <Card.Title>Candidate Name</Card.Title>
                   <Card.Text>
                     Job name and maybe description goes into this section
                   </Card.Text>
                   <Button
                     variant="primary"
                     onClick={this.handleShow.bind(this)}
                   >
                     Show Static Backdrop
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
                   <Card.Img src={Logo} alt="Card image" fluid />
                 </div>
               </div>
               <Modal.Title>
                 Job title
                 <p> Applicant Name </p>
               </Modal.Title>
             </Modal.Header>
             <Modal.Body>
               Applicant Info goes in here, possible location school, gpa such things.
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
                poster={Logo}
                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
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
               {<ViewPdfCoverLetter />}
           </Modal>
           <Modal
             show={this.state.showPdfResume}
             onHide={this.closePdf.bind(this)}
             keyboard={false}
             size="lg"
             aria-labelledby="contained-modal-title-vcenter"
             centered
           >
               {<ViewPdfResume />}
           </Modal>
         </div>
       );
    }
}


class PostJob extends React.Component {
    constructor(props){
        super(props);

    }

    render(){
        return (
          <div className="root-container">
            <div className="box-container">
              <Form>
                <Form.Group controlId="JobTitle">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control placeholder="Role" />
                  {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else. Muted text goes here
              </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="Location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control placeholder="ex. New York" />
                </Form.Group>
                <Form.Group controlId="SalaryRange">
                  <Form.Label>SalaryRange</Form.Label>
                  <Form.Control placeholder="in US dollars per year" />
                </Form.Group>
                <Form.Group controlId="ExperienceLevel">
                  <Form.Label>Experience Level Info</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
                <Button variant="primary" type="submit">
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
              file={"https://cors-anywhere.herokuapp.com/"+"http://career-pitch.s3.amazonaws.com/quiz6_sol.pdf"}
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
              file={"https://cors-anywhere.herokuapp.com/"+"http://career-pitch.s3.amazonaws.com/quiz6_sol.pdf"}
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