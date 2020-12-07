const { Client } = require('pg');
const e = require('express');

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
            //console.log(err, res)
            response.status(200).json(res.rows)
        })
    },
    addbusiness:(response,b) => {
        client.query("INSERT INTO nearbyplaces.business (name, address, city, state, zip, phone)\
        VALUES($1,$2,$3,$4,$5,$6);",[b.name,b.address,b.city,b.state,b.zip,b.phone], (err, res) => {
            //console.log(err, res)
            response.status(200).json("ok")
        })
    },
    updatebusiness:(response,b) => {
        console.log("updatebussiness",b)
        client.query("UPDATE nearbyplaces.business SET name=$1, address=$2, city=$3, state=$4, zip=$5, phone=$6 WHERE id=$7;",
            [b.name,b.address,b.city,b.state,b.zip,b.phone,b.id],(err, res) => {
            console.log(err, res)
            response.status(200).json("ok")
        })
        
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
        client.query('SELECT * from nearbyplaces.business; SELECT text , br.busid FROM nearbyplaces.review r, nearbyplaces.bus_review br where r.id = br.reviewid',
         (err, res) => {
            /*[[{"id":"2","name":"Chipotle Mexican Grill","address":"905 E University Blvd Ste 149",
            "city":"Tucson","state":"AZ","zip":"85719","phone":"(520)628-7967"},
            {"id":"3","name":"Burger King","address":"454 W Grant Rd","city":"Tucson",
            "state":"AZ","zip":"85705","phone":"(520)622-2752"},{"id":"4","name":"x",
            "address":"y","city":"z","state":"1","zip":"2","phone":"3"},{"id":"1",
            "name":"Panda ExpressXYZ","address":"1303 E University Blvd","city":"Tucson",
            "state":"AZ","zip":"85719","phone":"(520)626-3750"}],
            [{"text":"This good chicken","busid":1},{"text":"like the fried rice"
            */
           for (let bi = 0 ; bi < res[0].rows.length; bi++) {
                let b = res[0].rows[bi]
                b.reviews = []
                for (ri = 0; ri <res[1].rows.length; ri++){
                    let r = res[1].rows[ri]
                    if (b.id == r.busid){
                       b.reviews.push(r.text) 
                    }
                }

           }
            console.log(err,"bussiness/reviews:", res)
            response.status(200).json(res[0].rows)
        })
    },
    businessbyid:(id) => {
        //return businesses.filter((b) => b.id == id)[0]
        return businesses[id]
    },
    addreview:(response,bid,review) => {
        console.log("addreview",bid,review)
        client.query("INSERT INTO nearbyplaces.review (text) VALUES($1) returning id",[review],
         (err, res) => {
            console.log("id", res.rows[0].id)
            client.query("INSERT INTO nearbyplaces.bus_review (busid,reviewid) VALUES($1,$2)",[bid,res.rows[0].id],
         (err, res) => {
             console.log("bus_review inset done", res,err)
            response.status(200).json("review add")

         })})  

    }
    

}
module.exports.services = services