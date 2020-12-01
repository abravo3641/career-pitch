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
    Media,
    Modal,
    Image
} from 'react-bootstrap'



class HomeFeed extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {tab1: this.handleSelect}
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
    }
    handleClose(){
        this.setState({show: false});
    }
    handleShow(){
        this.setState({show: true});
    }

    render(){
       return (
       <div>
         <Card>
           <div className="card flex-row flex-wrap">
               <div className="card-header border-0" >
                   <Card.Img top width="100%" src={Logo} alt="Card image"/>
               </div>
           <div className="card-block">           
           {/* <Card.Header as="h5">Featured</Card.Header> */}
           <Card.Body>
             <Card.Title>Job Title</Card.Title>
             <Card.Text>
               Company name and Company info goes into this section
             </Card.Text>
             <Button variant="primary" onClick={this.handleShow.bind(this)}>Show Static Backdrop</Button>
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
               <div className="card-header border-0" >
                   <Card.Img src={Logo} alt="Card image" fluid/>
               </div>
               </div>
            <Modal.Title>
                Job title
                <p> Company Name/ Location</p>
            </Modal.Title>
            {/* <Image src={Logo} style={{alignSelf:'flex-n'}} fluid /> */}
            
          </Modal.Header>
          <Modal.Body>
            I will not close if you click outside me. Don't even try to press
            escape key. keyyyyyyy, GrI will not close if you click outside me. Don't even try to press
            escape key. keyyyyyyy, GrI will not close if you click outside me. Don't even try to press
            escape key. keyyyyyyy, GrI will not close if you click outside me. Don't even try to press
            escape key. keyyyyyyy, GrI will not close if you click outside me. Don't even try to press
            escape key. keyyyyyyy, Gr
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>
       </div>
         
       );
    }
}

class PopModal extends React.Component{
    constructor(props){
        super(props)
        this.state = {show:false, setShow: false}
    }

    handleClose(){
        this.setState({setShow: false});
    }
    handleShow(){
        this.setState({setShow: true});
    }

    render(){
        return (

    <div>
        <Button variant="primary" onClick={this.handleShow}>
          Launch static backdrop modal
        </Button>
  
        <Modal
          show={this.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            I will not close if you click outside me. Don't even try to press
            escape key.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>
        </div>
    )}
  }


export default HomeFeed;