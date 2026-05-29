export default function DashboardHome({

user,

}){

return(

<div className="cards">

<div className="dash-card">

<h2>
Resident
</h2>

<p>

{
user?.fullName
}

</p>

</div>

<div className="dash-card">

<h2>
Application
</h2>

<p>

{
user?.applicationStatus
||

"Pending"

}

</p>

</div>

<div className="dash-card">

<h2>
Billing
</h2>

<p>

{
user?.billingStatus
||

"Unpaid"

}

</p>

</div>

</div>

);

}
