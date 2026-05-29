import { useState } from "react";

export default function Profile({

user,

}){

const[
picture,
setPicture
]=useState("");

return(

<div>

<h1>
Profile
</h1>

<input
type="file"

onChange={(e)=>

setPicture(

URL.createObjectURL(
e.target.files[0]
)

)

}
/>

<br/>

{
picture && (

<img
src={picture}

style={{
width:"150px",
height:"150px",
borderRadius:"50%",
}}

alt=""
/>

)

}

<p>

{
user?.fullName
}

</p>

<p>

{
user?.email
}

</p>

</div>

);

}
