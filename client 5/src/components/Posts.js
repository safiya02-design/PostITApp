import { useEffect,useState } from "react";
import { useSelector,useDispatch } from 'react-redux';
import { getPosts, updatePost,delPost} from "../features/PostSlice";
import { Card, CardBody, CardFooter, CardHeader, CardTitle, CardText, Button, Row, Col, Input } from "reactstrap";
import moment from 'moment';
import { BiLike,BiDislike  } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Posts=()=>{
    const posts=useSelector((state)=>state.posts.posts);
    const email=useSelector((state)=>state.users.user.email);
    const [modal, setModal] = useState(false);
    const [postMsg, setMsg] = useState("");
    const [postID, setID] = useState("");
    const dispatch=useDispatch();

    const toggle = (msg,id) => 
    {
        setModal(!modal);
        setMsg(msg);
        setID(id);
    }

    const handleUpdate=()=>{
        const data={
            postMsg:postMsg,
            _id:postID
        }
        dispatch(updatePost(data));
        dispatch(getPosts());
    }

    const handleDelete=(pid)=>{
        if(window.confirm("Are you sure to delete this message !!!")==true)
        {
            dispatch(delPost(pid));
            dispatch(getPosts());
        }
    }

    useEffect(()=>{
        dispatch(getPosts());
    },[posts]);
    
    return(
        <>
        {
            posts.map((post)=>{
                return(
                    <Row>
                        <Col md='2'></Col>
                        <Col md='6'>
                            <Card className="my-2"  style={{width: '40rem'}}>
                                <CardHeader>
                                    <img src={post.user[0].profilepic} className="postimg"/>&nbsp;
                                    <span><b>{post.user[0].uname}</b></span>
                                    <p>Posted at: {moment(post.createdAt).fromNow()}</p>
                                </CardHeader>
                                <CardBody>
                                    <CardText>
                                        
                                        {post.lat&post.lng?(
                                            <>
                                                {post.postMsg}<br/>
                                                <iframe width="100%" height="350px" src={`https://maps.google.com/maps?q=${post.lat},${post.lng}&output=embed`}></iframe>
                                            </>
                                        ):post.postMsg}
                                    </CardText>
                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col xs='1'>
                                            <BiLike />
                                        </Col>
                                        <Col xs='1'>
                                            <BiDislike />
                                        </Col>
                                        <Col>
                                        </Col>
                                        {
                                            email==post.email?
                                            <>
                                                    <Col xs='1'>
                                                        <FaRegEdit onClick={()=>toggle(post.postMsg,post._id)}/>
                                                    </Col>
                                                    <Col xs='1'>
                                                        <MdDeleteOutline onClick={()=>handleDelete(post._id)}/>
                                                    </Col>
                                            </>:null
                                        } 
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                    
                )
            })
            
        }
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Update Message</ModalHeader>
                <ModalBody>
                    <Input type="textarea" placeholder="Type new message" value={postMsg} onChange={(e)=>setMsg(e.target.value)}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>{
                        if(postMsg=="")
                            alert("Message must be entered..")
                        else{
                            toggle();
                            handleUpdate();
                        }
                        }}>
                        UPDATE
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        CANCLE
                    </Button>
                </ModalFooter>
            </Modal>  
        </>
    )
}
export default Posts;