import axios from 'axios'
import React, { useEffect ,useState} from 'react'

const FeedBack = () => {
    const adminToken = localStorage.getItem("authToken");
    const [feedbacks, setfeedbacks] = useState([])
    const fetchData = async () =>{
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllUserFeedbacks`,{
                headers:{
                    Authorization:`Baerer ${adminToken}`
                }
            })
            console.log(response.data.feedbacks);
            if(response && response.data){
                setfeedbacks(response.data.feedbacks)
            }  
        } catch (error) {
                console.log("Error in fetching feedbacks form",error);
                
        }
    }

    useEffect(()=>{
        fetchData();
    },[])
  return (
    <div className="flex flex-col gap-2">
        <h1 className='text-center text-2xl text-green-500 font-semibold'>Student FeedBack Form</h1>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>FeedBacks</th>
                </tr>
            </thead>
            <tbody>
                {
                    feedbacks.map((feedback,index)=>(
                        <tr key={index} className='text-center '>
                            <td>{feedback?._id}</td>
                            <td>{feedback?.name}</td>
                            <td>{feedback?.email}</td>
                            <td>{feedback?.feedback}</td>
                        </tr>
                    ))
                }
               
            </tbody>
        </table>
    </div>
  )
}

export default FeedBack