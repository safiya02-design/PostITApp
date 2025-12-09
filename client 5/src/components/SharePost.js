import {Col, Container, Row, Input, Button} from 'reactstrap';
import banner from '../assets/banner.jpg'
import { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { savePost } from '../features/PostSlice';

const SharePost=()=>{
    let [msg,setMsg]=useState("");
    let [lat,setLat]=useState();
    let [lng,setLng]=useState();
    const email=useSelector((state)=>state.users.user.email);
    const dispatch=useDispatch();

   if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
      })
    }
    const sharePost=()=>{
        if(msg=="")
            alert("Please enter the message to post...")
        else
        {
            const data={
                postMsg:msg,
                email:email,
                lat:null,
                lng:null
            }
            dispatch(savePost(data));
        }
    }
    const shareLocation=()=>{
        const loc_msg=msg==""?"My Live Location...":msg;
            const data={
                postMsg:loc_msg,
                email:email,
                lat:lat,
                lng:lng
            }
            dispatch(savePost(data));
    }
    return(
        <Container fluid>
            <Row>
                <img src={banner} className='bannerpic'/>
            </Row>
            <Row>
                <h3>Share.Connect</h3>
            </Row>
            <Row>
                <Col md='9'>
                    <Input type="textarea" placeholder='Share your thoughts !...' onChange={(e)=>setMsg(e.target.value)}/>
                </Col>
                <Col>
                    <Row>
                        <Button color='success' className='pushbutton' onClick={sharePost}>POST</Button>
                    </Row>
                    <Row>
                        <Button color='danger' className='pushbutton' onClick={shareLocation}>SHARE LOCATION</Button>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
export default SharePost;