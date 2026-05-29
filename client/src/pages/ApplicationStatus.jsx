export default function ApplicationStatus({

status,

}){

return(

<div className="status-card">

<h1>
Application Status
</h1>

<h2>

Status:

{

status ||

"Pending"

}

</h2>

</div>

);

}
