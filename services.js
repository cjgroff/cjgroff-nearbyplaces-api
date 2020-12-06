const { Client } = require('pg');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new Client({
    user: 'fiwtsdfozekhio',
    host: 'ec2-52-203-165-126.compute-1.amazonaws.com',
    database: 'dc543vpeoh8jak',
    password: 'b25a0396fd05f4ad481d76d510233eff495125c0350527620835582d4225b879',
    port: 5432,
    ssl: true 
  })
  console.log("Connecting")
    client.connect().then(x => console.log("Connect Complete DB",x)).catch(e => console.log("caught error", e))
  console.log("Connected")

//let businesses = [
    /*{id : 0 , active : true,name:"Panda Express",
    address:"1303 E University Blvd",city: "Tucson",state: "AZ", zip: "85719",
    phone:"(520)626-3750",reviews: []},
    {id : 1 ,active : true,name:"Chipotle Mexican Grill",
    address:"905 E University Blvd Ste 149", city: "Tucson", state: "AZ", zip: "85719",
    phone:"(520)628-7967",reviews: ["This was great"]},
    {id : 2,active : true,name:"Burger King",
    address:"454 W Grant Rd", city:"Tucson", state:"AZ", zip:"85705",
    phone:"(520) 622-2752",reviews: []}*/
//]


function strinc (str,inc){
    return (
    str.toLowerCase().includes(inc.toLowerCase())
    )
}
function wildcard (s) {
    return `%${s}%`
}
const services = {
    findbusinesses:(response,text,city,state) => {
        //select * from nearbyplaces.business where name like '%C%' and city ilike '%Tucson%'
        client.query("select * from nearbyplaces.business where name ilike $1 and city ilike $2 and state ilike $3", [wildcard(text),wildcard(city),wildcard(state)],(err, res) => {
            console.log(err, res)
            response.status(200).json(res.rows)
        })
    },
    addbusiness:(business) => {
        business.active = true
        business.id = businesses.length
        businesses.push(business)
    },
    updatebusiness:(business) => {
        //replace element of choice with business
        businesses[business.id] = business
        console.log("update:",business)
        console.log("update:",businesses)
        
    },
    addupdatebusiness:(business) => {
        console.log("addupdate:", business)
        services.addbusiness(business)
    },
    deletebusiness:(id) => {
        businesses[id].active = false
    }
    ,
    allbusinesses:(response) => {
        client.query('SELECT * from nearbyplaces.business', (err, res) => {
            console.log(err, res)
            response.status(200).json(res.rows)
        })
    },
    businessbyid:(id) => {
        //return businesses.filter((b) => b.id == id)[0]
        return businesses[id]
    },
    addreview:(id,review) => {
        console.log("addreview",id,review)
        const b = businesses[id]
        console.log("review:",b)
        b.reviews.push(review)

    }
    

}
module.exports.services = services