import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../public/pixel.png" 


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
            activeTab: props.activeTab || "1"
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
  
    handleSelect(selectedTab){
        this.setState({
            activeTab: selectedTab
        })
        console.log(selectedTab)
    }

    render() {
        return (
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
              <Button variant="outline-primary">Search</Button>
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
         {(this.state.activeTab==="1") && <ApplicantCards /> }
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
    }
    handleClose(){
        this.setState({show: false});
    }
    handleShow(){
        this.setState({show: true});
    }
    checkFile(){
   
    }

  handleSubmit(e){
     console.log("Submit request recieved")
     console.dir(this.state)
   }

   handleResume(e){
     console.log("Resume is in place")
     const files = e.target.files
     const formdata = new FormData()
     formdata.append('myFile', files[0])
     this.setState({formDataResume:formdata})
     if(files){
       this.setState({fileResume:true})
     }
   }
   handleCover(e){
    console.log("Cover Letter is in place")
    const files = e.target.files
    const formdata = new FormData()
    formdata.append('myFile', files[0])
    this.setState({formDataCover:formdata})
    if(files){
      this.setState({fileCover:true})
    }
  }
  handleVideo(e){
    console.log("Video is in place")
    const files = e.target.files
    const formdata = new FormData()
    formdata.append('myFile', files[0])
    this.setState({formDataVid:formdata})
    if(files){
      this.setState({fileVid:true})
    }
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
                   <Card.Title>Job Title</Card.Title>
                   <Card.Text>
                     Company name and Company info goes into this section
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
                 <p> Company Name/ Location</p>
               </Modal.Title>
             </Modal.Header>
             <Modal.Body>
               I will not close if you click outside me. Don't even try to press
               escape key. Company Info goes here
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
               <Button variant="primary" type="submit" onClick={this.handleSubmit.bind(this)}>Submit</Button>
               </Form>
             </Modal.Footer>
           </Modal>
         </div>
       );
    }
}




export default HomeFeed;